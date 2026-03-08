import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Loader2, BrainCircuit, Cpu } from 'lucide-react';

interface AILoadingProps {
  title?: string;
  subtitle?: string;
  variant?: 'inline' | 'fullscreen' | 'card' | 'minimal';
  icon?: React.ElementType;
}

export const AILoading: React.FC<AILoadingProps> = ({ 
  title = "AI Analysis in Progress", 
  subtitle = "Gemini is analyzing content...", 
  variant = 'card',
  icon: Icon = Sparkles
}) => {
  
  if (variant === 'minimal') {
    return (
      <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800/30 shadow-sm">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={14} />
        </motion.div>
        <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="relative mb-6">
          <motion.div
            className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <div className="relative z-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900/30">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Icon size={32} className="text-blue-600 dark:text-blue-400" />
            </motion.div>
          </div>
          
          {/* Orbiting particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full"
              initial={{ x: 0, y: 0 }}
              animate={{ 
                x: Math.cos(i * (Math.PI * 2 / 3)) * 40,
                y: Math.sin(i * (Math.PI * 2 / 3)) * 40,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          {subtitle}
        </p>
        
        {/* Progress bar simulation */}
        <div className="w-48 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-6 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/90 z-20 backdrop-blur-md">
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 blur-3xl opacity-30 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          <div className="relative z-10 flex items-center justify-center w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <BrainCircuit size={48} className="text-blue-600 dark:text-blue-400" />
            </motion.div>
            
            <motion.div
              className="absolute inset-0 border-4 border-blue-500/20 rounded-3xl"
              animate={{ 
                borderColor: ["rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.6)", "rgba(59, 130, 246, 0.2)"] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
        
        <motion.h3 
          className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {title}
        </motion.h3>
        
        <p className="text-slate-500 dark:text-slate-400 max-w-md text-center text-lg">
          {subtitle}
        </p>
        
        <div className="flex space-x-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-blue-600 rounded-full"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default 'card' variant
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
      <div className="relative mb-6">
        <motion.div
          className="absolute inset-0 bg-blue-400 blur-xl opacity-20 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="relative z-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <Icon size={32} className="text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
        {subtitle}
      </p>
      
      <div className="mt-6 flex space-x-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-8 bg-blue-500/40 rounded-full"
            animate={{ 
              height: [16, 32, 16],
              backgroundColor: ["rgba(59, 130, 246, 0.4)", "rgba(59, 130, 246, 1)", "rgba(59, 130, 246, 0.4)"]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    </div>
  );
};
