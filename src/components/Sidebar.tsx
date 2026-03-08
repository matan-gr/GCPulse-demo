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
    { id: 'weekly-brief', label: 'Weekly Brief', icon: Sparkles, badge: 'AI Generated' },
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
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <AnimatePresence>
        {((isDesktop && isDesktopOpen) || (!isDesktop && isOpen)) && (
          <motion.div 
            initial={isDesktop ? { x: -280, opacity: 0 } : { x: -280 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 h-full w-72 bg-[var(--color-bg-sidebar)] dark:bg-[var(--color-bg-sidebar-dark)] border-r border-slate-200 dark:border-slate-800 z-[50] flex flex-col`}
          >
            {/* Logo Area */}
            <div className="h-16 flex items-center px-8 border-b border-slate-100 dark:border-slate-900">
              <div className="flex items-center space-x-2 group cursor-pointer">
                <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                  <Zap size={18} className="text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">GCP Pulse</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2 space-y-8 overflow-y-auto custom-scrollbar">
              
              {/* Main Menu */}
              <div>
                <div className="flex items-center px-4 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Platform</span>
                </div>
                <div className="space-y-0.5">
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
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100'} />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ml-2 ${isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Section */}
              <div>
                <div className="flex items-center px-4 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Workspace</span>
                </div>
                <div className="space-y-0.5">
                  {personalItems.map((item) => {
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
                        <div className="flex items-center space-x-3">
                          <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100'} />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </nav>
            
            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-900">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-2 text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">v2.6.0</span>
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
