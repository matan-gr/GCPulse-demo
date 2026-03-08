import React from 'react';
import { FeedItem } from '../types';
import { Sparkles, RefreshCw, Calendar, FileText, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { useWeeklyBrief } from '../hooks/useWeeklyBrief';
import { toast } from 'sonner';
import { marked } from 'marked';
import { AILoading } from '../components/ui/AILoading';

interface WeeklyBriefViewProps {
  items: FeedItem[];
}

export const WeeklyBriefView: React.FC<WeeklyBriefViewProps> = ({ items }) => {
  const { brief, loading, lastUpdated, error, generateBrief } = useWeeklyBrief(items);

  const handleRefresh = () => {
    generateBrief(true);
  };

  const handleExport = async () => {
    if (!brief) return;
    
    const htmlContent = await marked.parse(brief);
    
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Cloud Brief - ${new Date().toLocaleDateString()}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    
    :root {
      --color-primary: #1a73e8;
      --color-primary-dark: #0d47a1;
      --color-bg: #ffffff;
      --color-text: #1e293b;
      --color-text-muted: #64748b;
      --color-border: #e2e8f0;
      --color-accent-bg: #eff6ff;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: var(--color-text);
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 800px;
      margin: 40px auto;
      background: var(--color-bg);
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border: 1px solid var(--color-border);
    }

    header {
      background: linear-gradient(135deg, #6366f1 0%, #9333ea 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      backdrop-filter: blur(4px);
    }

    .logo-text {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -1px;
    }

    h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .meta {
      font-size: 14px;
      opacity: 0.8;
      margin-top: 8px;
    }

    .content {
      padding: 40px;
    }

    /* Markdown Styles */
    .prose h1 { color: var(--color-text); font-size: 28px; border-bottom: 2px solid var(--color-border); padding-bottom: 12px; margin-top: 0; }
    .prose h2 { color: var(--color-text); font-size: 22px; margin-top: 32px; margin-bottom: 16px; }
    .prose h3 { color: var(--color-text); font-size: 18px; margin-top: 24px; margin-bottom: 12px; }
    .prose p { margin-bottom: 16px; }
    .prose ul, .prose ol { margin-bottom: 16px; padding-left: 24px; }
    .prose li { margin-bottom: 8px; }
    .prose blockquote {
      border-left: 4px solid var(--color-primary);
      background: var(--color-accent-bg);
      padding: 16px 24px;
      margin: 24px 0;
      border-radius: 0 8px 8px 0;
      font-style: italic;
    }
    .prose a { color: var(--color-primary); text-decoration: none; font-weight: 500; }
    .prose a:hover { text-decoration: underline; }
    .prose strong { font-weight: 600; color: #0f172a; }

    footer {
      padding: 24px 40px;
      background: #f1f5f9;
      border-top: 1px solid var(--color-border);
      text-align: center;
      font-size: 12px;
      color: var(--color-text-muted);
    }

    @media print {
      body { background-color: white; }
      .container { box-shadow: none; border: none; margin: 0; max-width: 100%; }
      header { background: white; color: black; border-bottom: 2px solid black; }
      .logo-icon { border: 1px solid black; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header style="background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);">
      <div class="logo">
        <div class="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: white;"><path d="m13 2-2 2.5h3L12 13h2l-4 9 1-9h-3z"/></svg>
        </div>
        <div class="logo-text">GCP Pulse</div>
      </div>
      <h1>Weekly Cloud Brief</h1>
      <div class="meta">Generated on ${new Date().toLocaleDateString()}</div>
    </header>
    <div class="content prose">
      ${htmlContent}
    </div>
    <footer>
      &copy; ${new Date().getFullYear()} GCP Pulse. All rights reserved. Generated by AI.
    </footer>
  </div>
</body>
</html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-cloud-brief-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Brief exported as rich HTML");
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
      <blockquote className="pl-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 py-3 pr-4 rounded-r my-6 text-slate-700 dark:text-slate-300 italic" {...props} />
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
            <Sparkles className="mr-3 text-blue-600 dark:text-blue-400" size={32} />
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 shadow-sm hover:shadow"
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
             <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-full mb-8 ring-1 ring-blue-100 dark:ring-blue-800">
               <Sparkles size={64} className="text-blue-600 dark:text-blue-400" />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
               Generate Your Weekly Brief
             </h2>
             <p className="text-slate-500 dark:text-slate-400 max-w-lg mb-10 text-lg leading-relaxed">
               Get a comprehensive AI-generated summary of the most important Google Cloud updates, security bulletins, and architectural changes from the last 7 days.
             </p>
             <button
               onClick={() => generateBrief(true)}
               className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-blue-500/25 transition-all transform hover:-translate-y-1 flex items-center"
             >
               <Sparkles size={24} className="mr-3" />
               Generate Brief
             </button>
          </div>
        ) : loading && !brief ? (
          <div className="absolute inset-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center">
            <AILoading 
              variant="card" 
              title="Generating Weekly Brief" 
              subtitle="Analyzing the latest updates, security bulletins, and architecture changes from the last 7 days..." 
              icon={Sparkles}
            />
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
