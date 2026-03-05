import React from 'react';
import { FeedItem } from '../types';
import { Sparkles, RefreshCw, Calendar, FileText, Share2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { useWeeklyBrief } from '../hooks/useWeeklyBrief';
import { toast } from 'sonner';

interface WeeklyBriefViewProps {
  items: FeedItem[];
}

export const WeeklyBriefView: React.FC<WeeklyBriefViewProps> = ({ items }) => {
  const { brief, loading, lastUpdated, error, generateBrief } = useWeeklyBrief(items);

  const handleRefresh = () => {
    generateBrief(true);
  };

  const handleExport = () => {
    if (!brief) return;
    const blob = new Blob([brief], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-cloud-brief-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Brief exported successfully");
  };

  const MarkdownComponents = {
    h1: ({...props}: any) => (
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700" {...props} />
    ),
    h2: ({...props}: any) => (
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-8 mb-4 flex items-center" {...props} />
    ),
    h3: ({...props}: any) => (
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-6 mb-3" {...props} />
    ),
    strong: ({...props}: any) => (
      <strong className="font-semibold text-slate-900 dark:text-white" {...props} />
    ),
    ul: ({...props}: any) => (
      <ul className="space-y-2 my-4 list-disc list-outside ml-5 text-slate-700 dark:text-slate-300" {...props} />
    ),
    ol: ({...props}: any) => (
      <ol className="space-y-2 my-4 list-decimal list-outside ml-5 text-slate-700 dark:text-slate-300" {...props} />
    ),
    li: ({...props}: any) => (
      <li className="leading-relaxed pl-1">{props.children}</li>
    ),
    blockquote: ({...props}: any) => (
      <blockquote className="pl-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 py-3 pr-4 rounded-r my-6 text-slate-700 dark:text-slate-300 italic" {...props} />
    ),
    p: ({...props}: any) => (
      <p className="mb-4 leading-7 text-slate-700 dark:text-slate-300" {...props} />
    ),
    a: ({...props}: any) => (
      <a className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
    ),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <Sparkles className="mr-3 text-purple-600 dark:text-purple-400" size={32} />
            Weekly Brief
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center">
            <Calendar size={14} className="mr-2" />
            {lastUpdated 
              ? `Generated ${lastUpdated.toLocaleDateString()} at ${lastUpdated.toLocaleTimeString()}` 
              : loading 
                ? 'Generating...' 
                : 'Ready to generate'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {brief && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center disabled:opacity-50"
            >
              <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          )}
          <button
            onClick={handleExport}
            disabled={!brief || loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 shadow-sm hover:shadow"
          >
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden min-h-[600px] relative">
        {!loading && !brief && !error ? (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center min-h-[600px]">
             <div className="bg-purple-50 dark:bg-purple-900/20 p-8 rounded-full mb-8 ring-1 ring-purple-100 dark:ring-purple-800">
               <Sparkles size={64} className="text-purple-600 dark:text-purple-400" />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
               Generate Your Weekly Brief
             </h2>
             <p className="text-slate-500 dark:text-slate-400 max-w-lg mb-10 text-lg leading-relaxed">
               Get a comprehensive AI-generated summary of the most important Google Cloud updates, security bulletins, and architectural changes from the last 7 days.
             </p>
             <button
               onClick={() => generateBrief(true)}
               className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-purple-500/25 transition-all transform hover:-translate-y-1 flex items-center"
             >
               <Sparkles size={24} className="mr-3" />
               Generate Brief
             </button>
          </div>
        ) : loading && !brief ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 z-10 backdrop-blur-sm">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full animate-pulse"></div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg relative z-10">
                <Sparkles size={48} className="text-purple-600 dark:text-purple-400 animate-bounce" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6">Generating Weekly Brief</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md text-center">
              Analyzing the latest updates, security bulletins, and architecture changes from the last 7 days...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
              <FileText size={32} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Failed to Generate Brief</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-8 md:p-12 max-w-4xl mx-auto"
          >
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown components={MarkdownComponents}>
                {brief || ''}
              </ReactMarkdown>
            </article>
          </motion.div>
        )}
      </div>
    </div>
  );
};
