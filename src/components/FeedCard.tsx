import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FeedItem } from '../types';
import { extractImage, extractGCPProducts, cn, getCategoryColor } from '../utils';
import { Tag, ExternalLink, Sparkles, Bookmark, Loader2, Check, AlertOctagon, Activity, Box, Link as LinkIcon, ChevronDown, ChevronUp, Clock, ArrowRight, Play, Youtube, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { format, differenceInDays } from 'date-fns';

import { AnalysisResult } from '../types';
import { Tooltip } from './ui/Tooltip';
import { ErrorBoundary } from './ErrorBoundary';

interface FeedCardProps {
  item: FeedItem;
  index: number;
  onSummarize: (item: FeedItem) => void;
  isSummarizing: boolean;
  onSave: (item: FeedItem) => void;
  isSaved: boolean;
  viewMode: 'grid' | 'list';
  subscribedCategories: string[];
  onToggleSubscription: (category: string) => void;
  onSelectCategory?: (category: string) => void;
  analysis?: AnalysisResult;
  isPresentationMode?: boolean;
  density?: 'comfortable' | 'compact';
  showImages?: boolean;
}

const markdownComponents = {
  a: ({node, ...props}: any) => <a {...props} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} />
};

export const FeedCard = React.memo<FeedCardProps>((props) => {
  const { item } = props;
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '400px 0px',
  });

  return (
    <div ref={ref} className="min-h-[100px]">
      {inView ? (
        <ErrorBoundary componentName={`FeedCard-${item.title}`}>
          <FeedCardContent {...props} />
        </ErrorBoundary>
      ) : (
        <div className="w-full h-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <div className="w-24 h-6 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
                <div className="w-16 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
            </div>
            <div className="w-3/4 h-6 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
            <div className="space-y-2">
                <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                <div className="w-2/3 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
            </div>
        </div>
      )}
    </div>
  );
});

const FeedCardContent: React.FC<FeedCardProps> = ({ 
  item, 
  index, 
  onSummarize, 
  isSummarizing, 
  onSave, 
  isSaved, 
  viewMode, 
  subscribedCategories, 
  onToggleSubscription, 
  onSelectCategory, 
  analysis, 
  isPresentationMode = false, 
  density = 'comfortable', 
  showImages = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const image = item.thumbnailUrl || item.enclosure?.url || extractImage(item.content);
  const dateObj = new Date(item.isoDate);
  const date = format(dateObj, 'MMM d');

  // Calculate reading time (approx 200 words per minute)
  const wordCount = (item.contentSnippet || '').split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Calculate if item is "New" (within last 48 hours)
  const now = new Date();
  const hoursSince = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);
  const isNew = hoursSince < 48;
  const isTrending = item.source === 'Cloud Blog' || item.source === 'Google Cloud YouTube' || (item as any).viewCount > 1000;

  const isListView = viewMode === 'list' && !isPresentationMode;
  const isIncident = item.source === 'Service Health';
  const isDeprecation = item.source === 'Deprecations';
  const isCompact = density === 'compact';

  // Calculate days until deprecation if applicable
  let daysUntilEOL = 0;
  let urgencyColor = 'bg-slate-100 text-slate-600';
  
  if (isDeprecation) {
    const futureDateMatch = item.contentSnippet?.match(/(\d{4}-\d{2}-\d{2})/);
    if (futureDateMatch) {
      const eolDate = new Date(futureDateMatch[0]);
      const diffTime = eolDate.getTime() - now.getTime();
      daysUntilEOL = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (daysUntilEOL < 30) {
        urgencyColor = 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
      } else if (daysUntilEOL < 90) {
        urgencyColor = 'bg-orange-50 text-orange-700 border-orange-200';
      } else {
        urgencyColor = 'bg-amber-50 text-amber-700 border-amber-200';
      }
    }
  }

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.link);
    toast.success("Link copied to clipboard");
  };

  const detectedProducts = analysis?.relatedProducts || extractGCPProducts(item.title + " " + item.contentSnippet);
  const displayLabels = Array.from(new Set([...detectedProducts, ...(item.categories || [])]));

  // Determine Incident Status
  let status: 'Resolved' | 'Monitoring' | 'Investigating' = 'Investigating';
  let statusColor = 'bg-rose-50 text-rose-700 border-rose-200';
  let cardBorder = 'border-rose-100';
  let iconColor = 'text-rose-600';

  if (isIncident) {
    const text = (item.title + item.contentSnippet).toLowerCase();
    if (text.includes('resolved')) {
      status = 'Resolved';
      statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      cardBorder = 'border-emerald-100';
      iconColor = 'text-emerald-600';
    } else if (text.includes('monitoring') || text.includes('identified')) {
      status = 'Monitoring';
      statusColor = 'bg-amber-50 text-amber-700 border-amber-200';
      cardBorder = 'border-amber-100';
      iconColor = 'text-amber-600';
    }
  }

  const getSourceStyles = (source: string) => {
    switch (source) {
      case 'Cloud Blog': return 'bg-blue-50/50 text-blue-600 border-blue-100/50 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-800/20';
      case 'Product Updates': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100/50 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-800/20';
      case 'Release Notes': return 'bg-blue-50/50 text-blue-600 border-blue-100/50 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-800/20';
      case 'Security Bulletins': return 'bg-rose-50/50 text-rose-600 border-rose-100/50 dark:bg-rose-900/10 dark:text-rose-400 dark:border-rose-800/20';
      case 'Architecture Center': return 'bg-amber-50/50 text-amber-600 border-amber-100/50 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-800/20';
      case 'Google AI Research': return 'bg-sky-50/50 text-sky-600 border-sky-100/50 dark:bg-sky-900/10 dark:text-sky-400 dark:border-sky-800/20';
      case 'Gemini Enterprise': return 'bg-fuchsia-50/50 text-fuchsia-600 border-fuchsia-100/50 dark:bg-fuchsia-900/10 dark:text-fuchsia-400 dark:border-fuchsia-800/20';
      case 'Product Deprecations': return 'bg-slate-100/50 text-slate-600 border-slate-200/50 dark:bg-slate-800/20 dark:text-slate-400 dark:border-slate-700/30';
      case 'Google Cloud YouTube': return 'bg-red-50/50 text-red-600 border-red-100/50 dark:bg-red-900/10 dark:text-red-400 dark:border-red-800/20';
      default: return 'bg-slate-100/50 text-slate-600 border-slate-200/50 dark:bg-slate-800/20 dark:text-slate-400 dark:border-slate-700/30';
    }
  };

  const getCategoryStyles = (cat: string) => {
    const color = getCategoryColor(cat);
    return `bg-${color}-50/50 text-${color}-600 border-${color}-100/50 dark:bg-${color}-900/10 dark:text-${color}-400 dark:border-${color}-800/30`;
  };

  const getBorderColor = (source: string) => {
    switch (source) {
      case 'Cloud Blog': return 'border-l-blue-500';
      case 'Product Updates': return 'border-l-emerald-500';
      case 'Release Notes': return 'border-l-blue-500';
      case 'Security Bulletins': return 'border-l-rose-500';
      case 'Architecture Center': return 'border-l-orange-500';
      case 'Google AI Research': return 'border-l-blue-500';
      case 'Gemini Enterprise': return 'border-l-fuchsia-500';
      case 'Product Deprecations': return 'border-l-amber-500';
      case 'Google Cloud YouTube': return 'border-l-red-500';
      default: return 'border-l-transparent';
    }
  };

  // Incident Card Design
  if (isIncident) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`rounded-2xl shadow-sm border ${cardBorder} dark:border-slate-800 flex flex-col relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-950 ${isPresentationMode ? 'scale-105 shadow-xl' : ''}`}
      >
        {/* Status Header */}
        <div className={`px-4 py-2 border-b ${cardBorder} dark:border-slate-800 ${status === 'Resolved' ? 'bg-emerald-50/20 dark:bg-emerald-950/20' : status === 'Monitoring' ? 'bg-amber-50/20 dark:bg-amber-950/20' : 'bg-rose-50/20 dark:bg-rose-950/20'} flex justify-between items-center`}>
           <div className="flex items-center space-x-2">
              {status === 'Resolved' ? <Check size={12} className={iconColor} /> : <AlertOctagon size={12} className={iconColor} />}
              <span className={`text-[10px] font-bold uppercase tracking-wider ${iconColor}`}>
                {status}
              </span>
           </div>
           <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium flex items-center">
              <Clock size={10} className="mr-1" />
              {new Date(item.isoDate).toLocaleString()}
           </span>
        </div>

        <div className={`${isCompact ? 'p-3' : 'p-4'} flex flex-col flex-1 relative`}>
          {item.serviceName && (
            <div className="mb-2">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <Box size={10} className="mr-1" />
                {item.serviceName}
              </span>
            </div>
          )}

          <h3 className={`font-semibold text-slate-900 dark:text-white mb-2 z-10 relative ${isPresentationMode ? 'text-lg' : isCompact ? 'text-sm' : 'text-base'} leading-snug`}>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}>
              {item.title}
            </a>
          </h3>

          <p className={`text-slate-600 dark:text-slate-400 text-sm mb-4 z-10 relative flex-1 leading-relaxed ${isPresentationMode ? 'line-clamp-4' : 'line-clamp-3'}`}>
            {item.contentSnippet}
          </p>

          <div className="mt-auto z-10 flex items-center justify-between relative pt-3 border-t border-slate-100 dark:border-slate-800">
            <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider hover:underline transition-colors ${iconColor}`}
            >
                View Incident <ArrowRight size={10} className="ml-1" />
            </a>
            
            {!isPresentationMode && (
              <div className="flex space-x-1">
                <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSummarize(item);
                    }}
                    disabled={isSummarizing}
                    className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${iconColor}`}
                    title="Summarize Incident"
                >
                  {isSummarizing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Standard Feed Card Design
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "flex group relative rounded-2xl overflow-hidden transition-all duration-300 glass-card",
        isListView ? "flex-row min-h-[140px]" : "flex-col h-full",
        isSaved && "ring-1 ring-blue-500 ring-offset-1 dark:ring-offset-slate-950",
        "border-l-2",
        getBorderColor(item.source),
        "hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {/* Deprecation Warning Banner */}
      {isDeprecation && daysUntilEOL > 0 && (
        <div className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider flex items-center justify-between border-b ${urgencyColor}`}>
          <span className="flex items-center">
            <AlertOctagon size={10} className="mr-2" />
            Deprecation Notice
          </span>
          <span>{daysUntilEOL} Days Left</span>
        </div>
      )}

      {/* Image Section */}
      {image && !isPresentationMode && showImages && (
        <div 
          className={`${isListView ? 'w-48 min-w-[192px]' : isCompact ? 'h-32' : 'h-40'} overflow-hidden relative cursor-pointer group/image bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800`}
          onClick={(e) => {
            e.stopPropagation();
            onSummarize(item);
          }}
        >
            <img 
                src={image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/5 transition-colors duration-300" />
            
            {item.videoId && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg group-hover/image:scale-110 transition-transform duration-300">
                  <Play size={16} className="text-white ml-0.5 fill-white" />
                </div>
              </div>
            )}

            {item.duration && (
              <div className="absolute bottom-2 right-2 z-20">
                <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-sm">
                  {item.duration}
                </span>
              </div>
            )}
        </div>
      )}
      
        <div className={`${isCompact ? 'p-3' : 'p-4'} flex-1 flex flex-col ${isListView ? 'justify-between' : ''}`}>
        <div>
          <div className={`flex items-center justify-between ${isCompact ? 'mb-2' : 'mb-2'}`}>
             <div className="flex items-center space-x-2">
                {isNew && !isPresentationMode && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100/50 dark:border-blue-800/20">
                    <Sparkles size={9} className="text-blue-500" />
                    NEW
                  </span>
                )}
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getSourceStyles(item.source)}`}>
                  {item.source}
                </span>
                {isTrending && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100/50 text-slate-600 dark:bg-slate-800/20 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/30">
                    <TrendingUp size={9} />
                    TRENDING
                  </span>
                )}
                <span className="flex items-center gap-1 text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                  <Clock size={9} />
                  {readingTime}m
                </span>
             </div>
             <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tabular-nums">
                {date}
             </span>
          </div>
          
          <h3 className={`font-semibold text-slate-900 dark:text-white ${isCompact ? 'mb-1 text-sm' : 'mb-1.5 text-base'} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug tracking-tight`}>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                  {item.title}
              </a>
          </h3>

          {item.channelName && (
            <div className="mb-2 flex items-center text-[11px] text-slate-500 dark:text-slate-400">
              <Youtube size={12} className="mr-1.5 text-red-500" />
              <span className="font-medium">{item.channelName}</span>
            </div>
          )}

          {/* Product Labels for Release Notes */}
          {(item.source === 'Release Notes' || item.source === 'Gemini Enterprise') && displayLabels.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {displayLabels.slice(0, 3).map((label) => (
                <span key={label} className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100/50 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/30">
                  <Tag size={9} className="mr-1 opacity-70" />
                  {label}
                </span>
              ))}
            </div>
          )}
          
          <div className={`relative ${isCompact ? 'mb-1' : 'mb-2'}`}>
            <div className={`text-slate-600 dark:text-slate-400 ${isCompact ? 'text-[11px] leading-relaxed line-clamp-2' : 'text-sm leading-relaxed'} ${!isExpanded && !isCompact && !isPresentationMode ? 'line-clamp-3' : ''} prose dark:prose-invert max-w-none prose-p:my-0`}>
                <ReactMarkdown 
                  components={markdownComponents}
                >
                  {item.contentSnippet || ''}
                </ReactMarkdown>
            </div>
            {item.contentSnippet && item.contentSnippet.length > 150 && !isPresentationMode && !isCompact && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsExpanded(!isExpanded);
                }}
                className="text-[9px] font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mt-1 flex items-center focus:outline-none uppercase tracking-widest transition-colors"
              >
                {isExpanded ? (
                  <>Less <ChevronUp size={10} className="ml-0.5" /></>
                ) : (
                  <>More <ChevronDown size={10} className="ml-0.5" /></>
                )}
              </button>
            )}
          </div>

          {/* Categories */}
          {!isPresentationMode && !isCompact && (
          <div className="mb-3 flex flex-wrap gap-1.5">
              {displayLabels.slice(0, 3).map((cat) => {
                const isSubscribed = subscribedCategories.includes(cat);
                return (
                  <button 
                    key={cat} 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectCategory) onSelectCategory(cat);
                      else onToggleSubscription(cat);
                    }}
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 border",
                      isSubscribed 
                        ? 'bg-blue-600 text-white border-blue-600'
                        : getCategoryStyles(cat)
                    )}
                  >
                      <span className="truncate max-w-[80px]">{cat}</span>
                  </button>
                );
              })}
          </div>
          )}

          {analysis && (
            <div className={`mb-3 bg-blue-50/30 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-800/20 ${isCompact ? 'p-2' : 'p-3'} relative overflow-hidden group/ai`}>
              <div className="flex items-center text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1.5">
                <Sparkles size={10} className="mr-1.5" />
                AI Insight
              </div>
              <p className={`text-slate-700 dark:text-slate-300 leading-relaxed relative z-10 ${isCompact ? 'text-[10px] line-clamp-2' : 'text-[11px] line-clamp-3'}`}>
                {analysis.impact}
              </p>
            </div>
          )}
        </div>
        
        <div className={`mt-auto ${!isListView ? `pt-2 border-t border-slate-100 dark:border-slate-800/50 ${isCompact ? 'pt-1.5' : 'pt-2'}` : ''}`}>
            <div className="flex items-center justify-between">
                <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group/link"
                >
                    Read <ArrowRight size={10} className="ml-1 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                </a>

                {!isPresentationMode && (
                <div className="flex items-center space-x-0.5">
                  <Tooltip content="Copy Link" position="top">
                    <button
                      onClick={handleCopyLink}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                      aria-label="Copy Link"
                    >
                      <LinkIcon size={12} />
                    </button>
                  </Tooltip>

                  <Tooltip content={isSaved ? "Remove" : "Save"} position="top">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSave(item);
                      }}
                      className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${isSaved ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                      aria-label={isSaved ? "Remove from Read Later" : "Read Later"}
                    >
                      <Bookmark size={12} className={isSaved ? "fill-current" : ""} />
                    </button>
                  </Tooltip>

                <Tooltip content="AI Summary" position="top">
                  <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSummarize(item);
                      }}
                      disabled={isSummarizing}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors text-[9px] font-bold disabled:opacity-50 border border-transparent ml-1 uppercase tracking-widest"
                      aria-label="Generate AI Summary"
                  >
                      {isSummarizing ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} className="mr-1" />}
                      {isSummarizing ? '' : 'Summarize'}
                  </button>
                </Tooltip>
                </div>
                )}
            </div>
        </div>
      </div>
    </motion.div>
  );
};
