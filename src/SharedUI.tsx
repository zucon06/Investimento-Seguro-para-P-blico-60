import React from 'react';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Layouts ---
export function PageWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col min-h-screen w-full max-w-md mx-auto bg-background text-text-main relative shadow-xl overflow-x-hidden", className)}>
      {children}
    </div>
  );
}

export function ContentWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex-1 p-6 flex flex-col gap-6", className)}>
      {children}
    </div>
  );
}

// --- Header ---
interface HeaderProps {
  onBack?: () => void;
  onHelp?: () => void;
  title?: string;
  showHelp?: boolean;
}
export function Header({ onBack, onHelp, title, showHelp = true }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 h-16 border-b border-slate-200 bg-surface">
      <div className="w-10">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Voltar">
            <ChevronLeft className="w-6 h-6 text-primary-dark" />
          </button>
        )}
      </div>
      <h1 className="text-lg font-semibold text-primary-dark flex-1 text-center truncate px-2">{title}</h1>
      <div className="w-10 flex justify-end">
        {showHelp && onHelp && (
          <button onClick={onHelp} className="text-sm font-medium text-primary hover:underline" aria-label="Ajuda">
            Ajuda
          </button>
        )}
      </div>
    </header>
  );
}

// --- Typography ---
export function Title({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-2xl font-bold text-primary-dark leading-tight", className)}>{children}</h2>;
}

export function Subtitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-base text-text-muted mt-2", className)}>{children}</p>;
}

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  accessible?: boolean;
}
export function Button({ children, variant = 'primary', accessible, className, ...props }: ButtonProps) {
  const baseClass = "w-full rounded-xl font-semibold transition-all active:scale-[0.98] flex items-center justify-center text-center";
  const sizeClass = accessible ? "py-5 text-lg" : "py-4 text-base";
  
  const variants = {
    primary: "bg-primary text-white shadow-md hover:bg-blue-800 disabled:bg-slate-300",
    secondary: "bg-emerald-600 text-white shadow-md hover:bg-emerald-700 disabled:bg-slate-300", // For final calls to action
    outline: "border-2 border-primary text-primary hover:bg-blue-50",
    ghost: "text-primary hover:bg-blue-50 underline-offset-4 hover:underline",
  };

  return (
    <button className={cn(baseClass, sizeClass, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

// --- Cards ---
interface SelectableCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick: () => void;
  accessible?: boolean;
}
export function SelectableCard({ title, description, icon, selected, onClick, accessible }: SelectableCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left flex items-start p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-sm",
        selected ? "border-primary bg-blue-50" : "border-slate-200 bg-surface hover:border-blue-200",
        accessible ? "p-6" : ""
      )}
      aria-pressed={selected}
    >
      {icon && (
        <div className={cn("mr-4 shrink-0", selected ? "text-primary" : "text-slate-400")}>
          {icon}
        </div>
      )}
      <div className="flex-1">
        <h3 className={cn("font-semibold text-text-main", accessible ? "text-xl" : "text-lg")}>{title}</h3>
        {description && <p className={cn("text-text-muted mt-1", accessible ? "text-base" : "text-sm")}>{description}</p>}
      </div>
    </button>
  );
}

// --- Progress ---
export function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = Math.round((current / total) * 100);
  return (
    <div className="w-full mb-6">
      <div className="text-sm font-medium text-slate-500 mb-2">Etapa {current} de {total}</div>
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// --- Help Section / Button inline ---
export function HelpLink({ onClick, text = "Falar com atendente" }: { onClick: () => void; text?: string }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center gap-2 text-primary font-medium w-full py-4 hover:bg-slate-50 rounded-xl transition-colors">
      <HelpCircle className="w-5 h-5" />
      <span>{text}</span>
    </button>
  );
}
