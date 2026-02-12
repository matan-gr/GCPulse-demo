
import { useQuery } from '@tanstack/react-query';
import { Feed, FeedItem } from '../types';
import { extractGCPProducts } from '../utils';
import { GoogleGenAI } from "@google/genai";

const fetchFeed = async (): Promise<Feed> => {
  try {
    const response = await fetch('/api/feed');
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Fetch Feed Error:", error);
    throw error;
  }
};

export const useFeed = () => {
  return useQuery({
    queryKey: ['feed'],
    queryFn: fetchFeed,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useEndOfSupport = () => {
  return useQuery({
    queryKey: ['end-of-support'],
    queryFn: async (): Promise<FeedItem[]> => {
      const apiKey = (window as any).ENV?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("No Gemini API key found for EOS search");
        return [];
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Find official Google Cloud Platform (GCP) products, features, and versions that are scheduled for End of Support (EOS), End of Life (EOL), or deprecation.
        Prioritize finding items with EOS dates in 2026.
        Also include items for 2025 and 2027.
        
        Search for "Google Cloud release notes deprecations 2026", "GCP end of support schedule 2026", "GKE version end of life 2026".
        
        Return a JSON array with the following fields for each item:
        - title: The name of the feature/product and version.
        - date: The EOS/EOL date in YYYY-MM-DD format.
        - description: A brief description of the impact and what to do (e.g. upgrade to version X).
        - link: A link to the official documentation or release note.
        - service: The GCP service name (e.g. GKE, Compute Engine).
        
        Sort by date ascending (soonest first).
        Limit to 20 items.
        
        IMPORTANT: Return ONLY the JSON array. Do not include any other text or markdown formatting.
      `;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            // responseMimeType: 'application/json' is not supported with tools
          }
        });
        
        let text = response.text;
        if (!text) return [];
        
        // Extract JSON array robustly
        const start = text.indexOf('[');
        const end = text.lastIndexOf(']');
        if (start !== -1 && end !== -1) {
            text = text.substring(start, end + 1);
        }
        
        const data = JSON.parse(text);
        
        // Map to FeedItem format
        return data.map((item: any, index: number) => ({
            id: `eos-${index}-${Date.now()}`,
            title: item.title,
            link: item.link || 'https://cloud.google.com/terms/deprecations',
            isoDate: item.date, // This might be a future date
            contentSnippet: item.description,
            content: item.description,
            source: 'End of Support',
            categories: ['End of Support', item.service],
            serviceName: item.service,
            isActive: new Date(item.date).getTime() > Date.now() // Active if date is in future
        }));

      } catch (e) {
        console.error("Gemini EOS Search Error:", e);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  });
};

export const useSecurityBulletins = () => {
  return useQuery({
    queryKey: ['feed'], // Share cache with useFeed
    queryFn: fetchFeed,
    staleTime: 1000 * 60 * 5,
    select: (data: Feed) => {
      return data.items.filter(item => item.source === 'Security Bulletins').map(item => {
        // Robust Severity Extraction
        let severity = 'Unknown';
        const textToSearch = (item.title + " " + (item.content || item.contentSnippet)).toLowerCase();
        
        // Check for explicit "Severity: X" patterns first
        const severityMatch = textToSearch.match(/severity:\s*(critical|high|medium|low)/i);
        if (severityMatch) {
          severity = severityMatch[1].charAt(0).toUpperCase() + severityMatch[1].slice(1);
        } else {
          // Fallback to keyword search with word boundaries
          if (/\bcritical\b/.test(textToSearch)) severity = 'Critical';
          else if (/\bhigh\b/.test(textToSearch)) severity = 'High';
          else if (/\bmedium\b/.test(textToSearch)) severity = 'Medium';
          else if (/\blow\b/.test(textToSearch)) severity = 'Low';
        }

        const categories = ['Security', 'Bulletin'];
        if (severity !== 'Unknown') categories.push(severity);
        if (item.categories) categories.push(...item.categories);

        return {
          ...item,
          categories: Array.from(new Set(categories))
        };
      });
    }
  });
};

export const useArchitectureUpdates = () => {
  return useQuery({
    queryKey: ['feed'], // Share cache with useFeed
    queryFn: fetchFeed,
    staleTime: 1000 * 60 * 5,
    select: (data: Feed) => {
      return data.items.filter(item => item.source === 'Architecture Center').map(item => {
        let title = item.title;
        let link = item.link || '';
        let description = item.contentSnippet || item.content || '';
        let category = 'Architecture';

        // Attempt to parse HTML content for better title/link/description
        if (item.content) {
          // Extract category from h3 if present (e.g. <h3>Feature</h3>)
          const h3Match = item.content.match(/<h3>(.*?)<\/h3>/i);
          if (h3Match) {
             category = h3Match[1].trim();
          }

          // Simple regex to find the first link in the content which usually contains the real title
          const linkMatch = item.content.match(/<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/i);
          if (linkMatch) {
            const extractedLink = linkMatch[1];
            const extractedTitle = linkMatch[2].replace(/<[^>]+>/g, '').trim(); // Remove any inner tags
            
            if (extractedTitle && extractedLink) {
                title = extractedTitle;
                link = extractedLink;
                
                // Try to get description (text after the link)
                // The format is often: <p>... <a ...>Title</a>: Description ... </p>
                const afterLink = item.content.split('</a>')[1];
                if (afterLink) {
                   // Remove leading colons, hyphens, spaces, and HTML tags
                   description = afterLink.replace(/^[:\s-]+/, '').replace(/<[^>]+>/g, '').trim();
                }
            }
          }
        }

        const products = extractGCPProducts(title + " " + description);
        
        // Fix relative or missing links
        if (link.startsWith('#')) {
          // Handle anchor links common in release notes
          link = `https://docs.cloud.google.com/architecture/release-notes${link}`;
        } else if (link.startsWith('/')) {
          // Handle absolute paths relative to domain
          link = `https://cloud.google.com${link}`;
        } else if (!link.startsWith('http')) {
          // Fallback or relative path without slash
          if (link) {
             link = `https://cloud.google.com/${link}`;
          } else {
             link = 'https://docs.cloud.google.com/architecture/release-notes';
          }
        }

        return {
          ...item,
          title,
          link,
          contentSnippet: description,
          categories: Array.from(new Set([category, ...products, ...(item.categories || [])]))
        };
      });
    }
  });
};

export const useIncidents = () => {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: async (): Promise<FeedItem[]> => {
      const response = await fetch('/api/incidents');
      if (!response.ok) throw new Error('Failed to fetch incidents');
      const data = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
