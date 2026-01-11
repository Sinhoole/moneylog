
import React from 'react';
import { LucideIcon } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`skeuo-card rounded-2xl p-4 ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ children, variant = 'primary', onClick, className = '', disabled, type = 'button' }) => {
  const baseStyle = "skeuo-btn w-full font-semibold rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-ios-blue text-white hover:bg-blue-600",
    secondary: "bg-white dark:bg-white/10 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/20",
    danger: "bg-ios-red text-white hover:bg-red-600",
    ghost: "bg-transparent text-ios-blue hover:bg-ios-blue/10 shadow-none"
  };

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>}
    <input
      className={`inner-shadow bg-white dark:bg-white/5 rounded-xl px-4 py-3 text-base outline-none transition-all focus:ring-2 focus:ring-ios-blue/50 placeholder:text-gray-400 dark:text-white ${className}`}
      {...props}
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, className = '', children, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>}
    <div className="relative">
      <select
        className={`w-full inner-shadow bg-white dark:bg-white/5 rounded-xl px-4 py-3 text-base appearance-none outline-none transition-all focus:ring-2 focus:ring-ios-blue/50 dark:text-white ${className}`}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>
);

export const NavItem: React.FC<{ icon: LucideIcon; label: string; active: boolean; onClick: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full gap-1 pt-2 pb-1 transition-all duration-300 relative ${active ? 'text-ios-blue scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
  >
    {active && <div className="absolute -top-1 w-1 h-1 bg-ios-blue rounded-full shadow-[0_0_8px_rgba(0,122,255,0.8)]"></div>}
    <Icon size={24} strokeWidth={active ? 2.5 : 2} className={`transition-all duration-300 ${active ? 'drop-shadow-md' : ''}`} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]" onClick={onClose} />
      <div className="relative skeuo-card w-full max-w-md rounded-3xl overflow-hidden flex flex-col max-h-[90vh] animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-white/5 backdrop-blur-md">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
