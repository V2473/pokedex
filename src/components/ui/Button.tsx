'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

// Define button variants
const buttonVariants = {
  default: 'bg-blue-600 text-white hover:bg-blue-700',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  ghost: 'hover:bg-gray-100',
  link: 'text-blue-600 underline',
};

// Define button sizes
const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10',
};

// Define button props
export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'className'> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  asChild?: boolean;
  className?: string;
}

// Button component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className = '',
    variant = 'default',
    size = 'default',
    asChild = false,
    ...props
  }, ref) => {
    return (
      <motion.button
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };