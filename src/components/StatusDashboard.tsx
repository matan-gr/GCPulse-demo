import React from 'react';
import { FeedItem } from '../types';
import { Activity, TrendingUp, ShieldCheck, Clock, CheckCircle, Minimize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ActivityChart } from './dashboard/ActivityChart';

interface StatusDashboardProps {
  items: FeedItem[];
  onViewCritical?: () => void;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
}

export const StatusDashboard: React.FC<StatusDashboardProps> = ({ 
  items, 
  onViewCritical,
  isPresentationMode = false,
  onTogglePresentationMode
}) => {
  // 1. System Health Logic (Robust)
  const serviceHealthItems = items.filter(i => i.source === 'Service Health');
  const activeIncidents = serviceHealthItems.filter(i => i.isActive);
  const hasActiveIncidents = activeIncidents.length > 0;

  // 2. Security Logic
  const securityBulletins = items.filter(i => i.source === 'Security Bulletins');
  const newSecurityCount = securityBulletins.filter(i => {
    const date = new Date(i.isoDate);
    const now = new Date();
    return (now.getTime() - date.getTime()) < (7 * 24 * 60 * 60 * 1000); // Last 7 days
  }).length;

  // 3. Velocity Logic
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyItems = items.filter(i => new Date(i.isoDate) > oneWeekAgo);

  // 4. Action Items Logic
  const criticalUpdates = items
    .filter(i => i.source === 'Product Deprecations')
    .slice(0, 5);

  return (
    <div className={`container mx-auto px-4 transition-all duration-500 ${isPresentationMode ? 'py-8' : 'mb-12'}`}>
      
      {/* Dashboard Header - Only visible in Presentation Mode */}
      {isPresentationMode && (
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Executive Briefing</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Real-time landscape analysis</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">Live Feed</p>
            </div>
            <button 
              onClick={onTogglePresentationMode}
              className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
              title="Exit Presentation Mode"
            >
              <Minimize2 size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className={`grid gap-6 ${isPresentationMode ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        
        {/* 1. System Health Card */}
        <motion.div 
          layout
          className={`p-5 flex flex-col justify-between relative overflow-hidden border-l-2 glass-card ${
            hasActiveIncidents ? 'border-l-red-500 bg-red-50/20 dark:bg-red-900/10' : 'border-l-green-500'
          } ${isPresentationMode ? 'h-60' : 'h-56'}`}
        >
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Health</p>
              <h3 className={`text-xl font-bold tracking-tight ${hasActiveIncidents ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                {hasActiveIncidents ? 'Disruption' : 'Operational'}
              </h3>
            </div>
            <div className={`p-1.5 rounded-lg ${hasActiveIncidents ? 'bg-red-100/50 text-red-600' : 'bg-green-100/50 text-green-600'}`}>
              <Activity size={18} />
            </div>
          </div>

          <div className="z-10 mt-3">
            {hasActiveIncidents ? (
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wide">
                  {activeIncidents.length} Active Incident{activeIncidents.length > 1 ? 's' : ''}
                </p>
                {activeIncidents.slice(0, 2).map((inc, idx) => (
                  <a key={idx} href={inc.link} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-rose-600 dark:text-rose-400 hover:underline truncate font-medium">
                    {inc.serviceName}: {inc.title}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                All services are running normally. No active incidents detected.
              </p>
            )}
          </div>

          <div className="mt-auto pt-3 z-10">
             <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${hasActiveIncidents ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: hasActiveIncidents ? '60%' : '100%' }}></div>
             </div>
          </div>
        </motion.div>

        {/* 2. Security Posture Card */}
        <motion.div 
          layout
          className={`p-5 flex flex-col justify-between relative overflow-hidden border-l-2 border-l-blue-600 dark:border-l-blue-400 glass-card ${isPresentationMode ? 'h-60' : 'h-56'}`}
        >
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Security</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {newSecurityCount} New Alerts
              </h3>
            </div>
            <div className="p-1.5 rounded-lg bg-blue-100/50 text-blue-600">
              <ShieldCheck size={18} />
            </div>
          </div>

          <div className="z-10 mt-3 flex-1">
             <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
               {securityBulletins.length} bulletins in 30d.
             </p>
             <div className="space-y-1.5">
               {securityBulletins.slice(0, 2).map((item, idx) => (
                 <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-[11px] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                   <div className="w-1 h-1 rounded-full bg-blue-500 mr-2 flex-shrink-0" />
                   <span className="truncate">{item.title}</span>
                 </a>
               ))}
             </div>
          </div>
        </motion.div>

        {/* 3. Velocity Card */}
        <motion.div 
          layout
          className={`p-5 flex flex-col justify-between relative overflow-hidden border-l-2 border-l-green-500 glass-card ${isPresentationMode ? 'h-60' : 'h-56'}`}
        >
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Velocity</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {weeklyItems.length} Updates
              </h3>
            </div>
            <div className="p-1.5 rounded-lg bg-green-100/50 text-green-600">
              <TrendingUp size={18} />
            </div>
          </div>

          <div className="z-10 mt-2 flex-1 flex flex-col justify-end">
             <div className="h-20 w-full -ml-2">
                <ActivityChart items={items} />
              </div>
             <p className="text-[9px] text-slate-400 dark:text-slate-500 text-center mt-1 font-bold uppercase tracking-widest">7-Day Trend</p>
          </div>
        </motion.div>

        {/* 4. Action Items Card */}
        <motion.div 
          layout
          className={`p-5 flex flex-col justify-between relative overflow-hidden border-l-2 border-l-blue-600 dark:border-l-blue-400 glass-card ${isPresentationMode ? 'h-60' : 'h-56'}`}
        >
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Actions</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {criticalUpdates.length} Pending
              </h3>
            </div>
            <div className="p-1.5 rounded-lg bg-blue-100/50 text-blue-600">
              <Clock size={18} />
            </div>
          </div>

          <div className="z-10 mt-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
             {criticalUpdates.length > 0 ? (
               <div className="space-y-2">
                 {criticalUpdates.map((item, idx) => (
                   <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                     <div className="flex justify-between items-center mb-0.5">
                       <span className="text-[8px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1 py-0.5 rounded uppercase tracking-widest">EOL</span>
                       <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">{new Date(item.isoDate).toLocaleDateString()}</span>
                     </div>
                     <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
                       {item.title}
                     </p>
                   </a>
                 ))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
                 <CheckCircle size={16} className="mb-1.5 opacity-30" />
                 <p className="text-[10px] font-bold uppercase tracking-widest">Clear</p>
               </div>
             )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};
