import React from 'react';

export const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

export const Button = ({ children, onClick, variant = 'primary', className = '', ...props }: any) => {
  const variants: any = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
    outline: 'border-2 border-gray-100 hover:border-indigo-200 text-gray-900',
    ghost: 'hover:bg-gray-50 text-gray-500',
    danger: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white',
    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
  };

  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', padding = 'p-6' }: any) => (
  <div className={`bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden ${padding} ${className}`}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'indigo' }: any) => {
  const variants: any = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${variants[variant]}`}>
      {children}
    </span>
  );
};
