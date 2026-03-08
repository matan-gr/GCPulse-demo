import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Rocket, 
  BookOpen, 
  FileText, 
  CalendarOff, 
  Youtube, 
  Activity, 
  ShieldAlert, 
  Layers, 
  Bookmark, 
  Wrench, 
  Menu, 
  X, 
  Zap,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isPresentationMode: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isDesktopOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isPresentationMode,
  isOpen,
  setIsOpen,
  isDesktopOpen
}) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setIsOpen(false); // Close mobile menu state when switching to desktop
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  const menuItems = [
    { id: 'all', label: 'Discover Feed', icon: Compass },
    { id: 'updates', label: 'Updates & Innovation', icon: Rocket },
    { id: 'cloud-blog', label: 'Cloud Blog', icon: BookOpen },
    { id: 'release-notes', label: 'Release Notes', icon: FileText },
    { id: 'deprecations', label: 'Product Deprecations', icon: CalendarOff },
    { id: 'youtube', label: 'GCP YouTube Channel', icon: Youtube },
    { id: 'incidents', label: 'Cloud Incidents', icon: Activity },
    { id: 'security', label: 'Security Bulletins', icon: ShieldAlert },
    { id: 'architecture', label: 'Architecture', icon: Layers },
  ];

  const personalItems = [
    { id: 'saved', label: 'Read Later', icon: Bookmark },
    { id: 'tools', label: 'Tools', icon: Wrench },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white dark:bg-[#121212] rounded-lg shadow-md text-slate-600 dark:text-slate-300"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <AnimatePresence>
        {((isDesktop && isDesktopOpen) || (!isDesktop && isOpen)) && (
          <motion.div 
            initial={isDesktop ? { x: -280, opacity: 0 } : { x: -280 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#121212] border-r border-slate-200 dark:border-white/5 z-[50] shadow-xl lg:shadow-none flex flex-col`}
          >
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="relative w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Zap size={20} className="text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">GCP Pulse</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
              
              {/* Main Menu */}
              <div>
                <div className="flex items-center px-3 mb-3">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Platform</span>
                </div>
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          if (!isDesktop) setIsOpen(false);
                        }}
                        className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''} group`}
                      >
                        <div className="relative flex items-center space-x-3 z-10">
                          <Icon 
                            size={18} 
                            className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}
                          />
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </div>
                        
                        {isActive && (
                          <motion.div
                            layoutId="activeTabIndicator"
                            className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.6)]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Section */}
              <div>
                <div className="flex items-center px-3 mb-3">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">My Workspace</span>
                </div>
                <div className="space-y-1">
                  {[
                    { id: 'weekly-brief', label: 'Weekly Brief', icon: Sparkles },
                    ...personalItems
                  ].map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          if (!isDesktop) setIsOpen(false);
                        }}
                        className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''} group`}
                      >
                        <div className="relative flex items-center space-x-3 z-10">
                          <Icon size={18} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        {isActive && (
                          <motion.div
                            layoutId="activeTabIndicatorPersonal"
                            className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.6)]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </nav>
            
            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#121212]">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Sync</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">v2.4.0</span>
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay for mobile */}
      {isOpen && !isDesktop && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[45]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
