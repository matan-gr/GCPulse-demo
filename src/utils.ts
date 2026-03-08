import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractImage(content: string): string | null {
  if (!content) return null;
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

const GCP_PRODUCTS = [
  "Compute Engine", "App Engine", "Kubernetes Engine", "GKE", "Cloud Functions", "Cloud Run",
  "Cloud Storage", "Persistent Disk", "Filestore",
  "BigQuery", "Cloud SQL", "Cloud Spanner", "Bigtable", "Firestore", "Memorystore",
  "VPC", "Cloud Load Balancing", "Cloud CDN", "Cloud DNS",
  "Anthos", "Apigee",
  "Vertex AI", "AutoML", "Dialogflow", "Vision API", "Translation API", "Natural Language API",
  "Gemini", "Duet AI", "GenAI", "Generative AI", "PaLM", "Bard", "Imagen", "Codey",
  "Pub/Sub", "Dataflow", "Dataproc", "Looker",
  "Cloud Build", "Artifact Registry", "Container Registry",
  "IAM", "Cloud Armor", "Secret Manager", "KMS",
  "Operations Suite", "Cloud Logging", "Cloud Monitoring"
];

export function cleanText(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp;
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

export function extractGCPProducts(text: string): string[] {
  if (!text) return [];
  const found = new Set<string>();
  const lowerText = text.toLowerCase();
  
  GCP_PRODUCTS.forEach(product => {
    if (lowerText.includes(product.toLowerCase())) {
      found.add(product);
    }
  });
  
  return Array.from(found);
}
