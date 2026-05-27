import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const BASE = 'inline-flex items-center justify-center font-body font-medium rounded-sm transition-all duration-300';

const variantStyles: Record<Variant, string> = {
  primary: 'bg-accent text-bg hover:brightness-95',
  secondary: 'bg-transparent text-primary border border-primary hover:bg-primary hover:text-bg',
  ghost: 'bg-transparent text-accent hover:underline',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-5 py-2 text-small',
  md: 'px-7 py-3.5 text-body',
  lg: 'px-9 py-4 text-body-lg',
};

type ButtonProps =
  | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size })
  | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: Size });

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const classes = cn(BASE, variantStyles[variant], sizeStyles[size], className);

    if ('href' in props && props.href !== undefined) {
      const { href, ...rest } = props as { href: string } & AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: Size };
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...rest}
        >
          {children}
        </a>
      );
    }

    const { ...rest } = props as ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
