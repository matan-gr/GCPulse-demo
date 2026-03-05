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
  setActiveTab: (tab: 'all' | 'saved' | 'incidents' | 'deprecations' | 'security' | 'architecture' | 'tools' | 'assistant' | 'youtube' | 'cloud-blog' | 'release-notes' | 'updates') => void;
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
    { id: 'all', label: 'Discover Feed', icon: Compass, highlighted: true },
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
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white dark:bg-slate-800 rounded-lg shadow-md text-slate-600 dark:text-slate-300"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <AnimatePresence mode="wait">
        {((isDesktop && isDesktopOpen) || (!isDesktop && isOpen)) && (
          <motion.div 
            initial={isDesktop ? { x: -280, opacity: 0 } : { x: -280 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#0f1115] border-r border-slate-200 dark:border-slate-800 z-[50] shadow-xl lg:shadow-none flex flex-col`}
          >
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/50 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/20">
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm text-white">
                  <Zap size={18} className="fill-current" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">GCP Pulse</h1>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Enterprise</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
              
              {/* Main Menu */}
              <div>
                <div className="flex items-center px-3 mb-3">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Platform Intelligence</span>
                </div>
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    const isHighlighted = item.highlighted;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          if (!isDesktop) setIsOpen(false);
                        }}
                        className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                          isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800' 
                            : isHighlighted
                              ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        <div className="relative flex items-center space-x-3 z-10">
                          <Icon 
                            size={isHighlighted ? 20 : 18} 
                            strokeWidth={isActive || isHighlighted ? 2.5 : 2} 
                            className={`transition-colors ${
                              isActive 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : isHighlighted
                                  ? 'text-slate-900 dark:text-white'
                                  : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                            }`} 
                          />
                          <span className={`text-sm ${isActive || isHighlighted ? 'font-semibold' : 'font-medium'}`}>
                            {item.label}
                          </span>
                        </div>
                        
                        {isActive && (
                          <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
                          />
                        )}
                        
                        {isHighlighted && !isActive && (
                           <ChevronRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                        className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                          isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        <div className="relative flex items-center space-x-3 z-10">
                          <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'} />
                          <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </nav>
            
            {/* Footer / User Info could go here */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20">
               <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs">
                    G
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs font-bold text-slate-900 dark:text-white">Google Cloud User</span>
                     <span className="text-[10px] text-slate-500 dark:text-slate-400">Enterprise Edition</span>
                  </div>
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
