import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Button = ({ className, variant = 'primary', ...props }) => {
    const variants = {
        primary: 'btn-saas-primary',
        secondary: 'btn-saas-secondary',
        outline: 'px-8 py-4 bg-transparent border border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]',
        ghost: 'px-6 py-3 text-slate-500 hover:text-slate-900 transition-colors font-bold',
        danger: 'px-8 py-4 bg-rose-50 border border-rose-100 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                className
            )}
            {...props}
        />
    );
};

export const Input = ({ className, error, ...props }) => {
    return (
        <div className="w-full">
            <input
                className={cn(
                    'input-saas',
                    error && 'border-rose-300 focus:ring-rose-500/5 focus:border-rose-400',
                    className
                )}
                {...props}
            />
            {error && <p className="mt-2 ml-4 text-xs font-bold text-rose-500 uppercase tracking-widest">{error}</p>}
        </div>
    );
};

export const Badge = ({ children, variant = 'info' }) => {
    const variants = {
        success: 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-[0_2px_10px_rgba(16,185,129,0.05)]',
        warning: 'bg-amber-50 text-amber-600 border border-amber-100 shadow-[0_2px_10px_rgba(245,158,11,0.05)]',
        error: 'bg-rose-50 text-rose-600 border border-rose-100 shadow-[0_2px_10px_rgba(225,29,72,0.05)]',
        info: 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-[0_2px_10px_rgba(79,70,229,0.05)]',
        neutral: 'bg-slate-50 text-slate-500 border border-slate-100',
    };

    return (
        <span className={cn('px-4 py-2 rounded-full text-[12px] font-black uppercase tracking-widest', variants[variant])}>
            {children}
        </span>
    );
};

export const Card = ({ children, className }) => {
    return <div className={cn('surface-card p-8', className)}>{children}</div>;
};
