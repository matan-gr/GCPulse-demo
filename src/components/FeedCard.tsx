import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FeedItem } from '../types';
import { extractImage, extractGCPProducts } from '../utils';
import { Tag, ExternalLink, Sparkles, Bookmark, Loader2, Check, AlertOctagon, Activity, Box, Link as LinkIcon, ChevronDown, ChevronUp, Clock, ArrowRight, Play, Youtube } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

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
        <div className="w-full h-64 bg-white dark:bg-[#15171c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col space-y-4">
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
  const date = dateObj.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  // Calculate if item is "New" (within last 48 hours)
  const now = new Date();
  const hoursSince = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);
  const isNew = hoursSince < 48;

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
      case 'Cloud Blog': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'Product Updates': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
      case 'Release Notes': return 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800';
      case 'Security Bulletins': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800';
      case 'Architecture Center': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
      case 'Google AI Research': return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800';
      case 'Gemini Enterprise': return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 dark:border-fuchsia-800';
      case 'Product Deprecations': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
      case 'Google Cloud YouTube': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const getBorderColor = (source: string) => {
    switch (source) {
      case 'Cloud Blog': return 'border-t-blue-500';
      case 'Product Updates': return 'border-t-emerald-500';
      case 'Release Notes': return 'border-t-violet-500';
      case 'Security Bulletins': return 'border-t-rose-500';
      case 'Architecture Center': return 'border-t-orange-500';
      case 'Google AI Research': return 'border-t-indigo-500';
      case 'Gemini Enterprise': return 'border-t-fuchsia-500';
      case 'Product Deprecations': return 'border-t-amber-500';
      case 'Google Cloud YouTube': return 'border-t-red-500';
      default: return 'border-t-transparent';
    }
  };

  // Incident Card Design
  if (isIncident) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`rounded-xl shadow-sm border ${cardBorder} dark:border-opacity-20 flex flex-col relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-white dark:bg-[#15171c] ${isPresentationMode ? 'scale-105 shadow-lg' : ''}`}
      >
        {/* Status Header */}
        <div className={`px-4 py-2.5 border-b ${cardBorder} dark:border-opacity-20 ${status === 'Resolved' ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : status === 'Monitoring' ? 'bg-amber-50/50 dark:bg-amber-900/10' : 'bg-rose-50/50 dark:bg-rose-900/10'} flex justify-between items-center`}>
           <div className="flex items-center space-x-2">
              {status === 'Resolved' ? <Check size={14} className={iconColor} /> : <AlertOctagon size={14} className={iconColor} />}
              <span className={`text-[11px] font-bold uppercase tracking-wider ${iconColor}`}>
                {status}
              </span>
           </div>
           <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center">
              <Clock size={10} className="mr-1" />
              {new Date(item.isoDate).toLocaleString()}
           </span>
        </div>

        <div className={`${isCompact ? 'p-3' : 'p-5'} flex flex-col flex-1 relative`}>
          {item.serviceName && (
            <div className="mb-2">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Box size={10} className="mr-1" />
                {item.serviceName}
              </span>
            </div>
          )}

          <h3 className={`font-semibold text-slate-900 dark:text-white mb-2 z-10 relative ${isPresentationMode ? 'text-xl' : isCompact ? 'text-sm' : 'text-base'} leading-snug`}>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className={`hover:text-blue-600 transition-colors`}>
              {item.title}
            </a>
          </h3>

          <p className={`text-slate-600 dark:text-slate-300 text-sm mb-4 z-10 relative flex-1 leading-relaxed ${isPresentationMode ? 'line-clamp-4' : 'line-clamp-3'}`}>
            {item.contentSnippet}
          </p>

          <div className="mt-auto z-10 flex items-center justify-between relative pt-3 border-t border-slate-100 dark:border-slate-800/50">
            <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center text-xs font-semibold hover:underline transition-colors ${iconColor}`}
            >
                View Incident <ArrowRight size={12} className="ml-1" />
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
                  {isSummarizing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
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
      className={`card card-hover flex ${
        isListView ? 'flex-row min-h-[160px]' : 'flex-col h-full'
      } group relative ${isSaved ? 'ring-1 ring-blue-500 dark:ring-blue-400' : ''} ${getBorderColor(item.source)} border-t-4`}
    >
      {/* Deprecation Warning Banner */}
      {isDeprecation && daysUntilEOL > 0 && (
        <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide flex items-center justify-between border-b ${urgencyColor}`}>
          <span className="flex items-center">
            <AlertOctagon size={12} className="mr-2" />
            Deprecation Notice
          </span>
          <span>{daysUntilEOL} Days Left</span>
        </div>
      )}

      {/* Image Section */}
      {image && !isPresentationMode && showImages && (
        <div 
          className={`${isListView ? 'w-56 min-w-[224px]' : isCompact ? 'h-36' : 'h-48'} overflow-hidden relative cursor-pointer group/image bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/50`}
          onClick={(e) => {
            e.stopPropagation();
            onSummarize(item);
          }}
        >
            <img 
                src={image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/image:opacity-10 transition-opacity duration-300" />
            
            {item.videoId && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg group-hover/image:scale-110 transition-transform duration-300">
                  <Play size={20} className="text-white ml-1 fill-white" />
                </div>
              </div>
            )}

            {item.duration && (
              <div className="absolute bottom-2 right-2 z-20">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/70 text-white backdrop-blur-sm">
                  {item.duration}
                </span>
              </div>
            )}
            
            {/* New Badge - Floating on Image */}
            {isNew && !isCompact && (
              <div className="absolute top-2 left-2 z-20">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-sm border border-white/10 backdrop-blur-sm">
                  NEW
                </span>
              </div>
            )}
        </div>
      )}
      
        <div className={`${isCompact ? 'p-3' : 'p-5'} flex-1 flex flex-col ${isListView ? 'justify-between' : ''}`}>
        <div>
          <div className={`flex items-center justify-between ${isCompact ? 'mb-2' : 'mb-3'}`}>
             <div className="flex items-center space-x-2">
                {/* Fallback New Badge if no image */}
                {isNew && (!image || !showImages || isCompact) && !isPresentationMode && (
                   <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    NEW
                  </span>
                )}
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getSourceStyles(item.source)}`}>
                  {item.source}
                </span>
             </div>
             <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium tabular-nums">
                {date}
             </span>
          </div>
          
          <h3 className={`font-semibold text-slate-900 dark:text-white ${isCompact ? 'mb-1.5 text-sm' : 'mb-2 text-base'} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug tracking-tight`}>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                  {item.title}
              </a>
          </h3>

          {item.channelName && (
            <div className="mb-2 flex items-center text-xs text-slate-500 dark:text-slate-400">
              <Youtube size={14} className="mr-1.5 text-red-500" />
              <span className="font-medium">{item.channelName}</span>
            </div>
          )}

          {/* Product Labels for Release Notes */}
          {(item.source === 'Release Notes' || item.source === 'Gemini Enterprise') && displayLabels.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {displayLabels.slice(0, 3).map((label) => (
                <span key={label} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  <Tag size={10} className="mr-1 opacity-70" />
                  {label}
                </span>
              ))}
            </div>
          )}
          
          <div className={`relative ${isCompact ? 'mb-2' : 'mb-3'}`}>
            <div className={`text-slate-600 dark:text-slate-400 ${isCompact ? 'text-xs leading-relaxed line-clamp-2' : 'text-sm leading-relaxed'} ${!isExpanded && !isCompact && !isPresentationMode ? 'line-clamp-3' : ''} prose dark:prose-invert max-w-none prose-p:my-0`}>
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
                className="text-[10px] font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mt-1 flex items-center focus:outline-none uppercase tracking-wide transition-colors"
              >
                {isExpanded ? (
                  <>Show Less <ChevronUp size={10} className="ml-1" /></>
                ) : (
                  <>Show More <ChevronDown size={10} className="ml-1" /></>
                )}
              </button>
            )}
          </div>

          {/* Categories */}
          {!isPresentationMode && !isCompact && (
          <div className="mb-4 flex flex-wrap gap-2">
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
                    className={`badge transition-colors ${
                      isSubscribed 
                        ? 'badge-green'
                        : 'badge-gray hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                      <span className="truncate max-w-[100px]">{cat}</span>
                  </button>
                );
              })}
          </div>
          )}

          {/* AI Analysis Data */}
          {analysis && (
            <div className={`mb-3 bg-gradient-to-br from-violet-50 to-white dark:from-violet-900/10 dark:to-slate-800 rounded-lg border border-violet-100 dark:border-violet-800/30 ${isCompact ? 'p-2' : 'p-3'} shadow-sm`}>
              <div className="flex items-center text-[10px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wide mb-1">
                <Sparkles size={10} className="mr-1 fill-current" /> AI Insight
              </div>
              <p className={`text-slate-700 dark:text-slate-300 leading-relaxed ${isCompact ? 'text-[10px] line-clamp-2' : 'text-xs line-clamp-3'}`}>
                {analysis.impact}
              </p>
            </div>
          )}
        </div>
        
        <div className={`mt-auto ${!isListView ? `pt-3 border-t border-slate-100 dark:border-slate-800/50 ${isCompact ? 'pt-2' : 'pt-3'}` : ''}`}>
            <div className="flex items-center justify-between">
                <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group/link"
                >
                    Read More <ExternalLink size={12} className="ml-1 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                </a>

                {!isPresentationMode && (
                <div className="flex items-center space-x-1">
                  <Tooltip content="Copy Link" position="top">
                    <button
                      onClick={handleCopyLink}
                      className="btn-icon w-8 h-8 flex items-center justify-center"
                      aria-label="Copy Link"
                    >
                      <LinkIcon size={14} />
                    </button>
                  </Tooltip>

                  <Tooltip content={isSaved ? "Remove from Read Later" : "Read Later"} position="top">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSave(item);
                      }}
                      className={`btn-icon w-8 h-8 flex items-center justify-center ${isSaved ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      aria-label={isSaved ? "Remove from Read Later" : "Read Later"}
                    >
                      <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
                    </button>
                  </Tooltip>

                  <Tooltip content="Generate AI Summary" position="top">
                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSummarize(item);
                        }}
                        disabled={isSummarizing}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors text-[10px] font-bold disabled:opacity-50 border border-violet-100 dark:border-violet-800/30 ml-1"
                        aria-label="Generate AI Summary"
                    >
                        {isSummarizing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} className="mr-1" />}
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
