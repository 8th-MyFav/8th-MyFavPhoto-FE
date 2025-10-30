"use client";
import React from "react";

const Text = ({ 
  children, 
  size = 'base', 
  weight = 'normal', 
  color = 'text-gray-900',
  className = '',
  as = 'p'
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const Component = as;

  return (
    <Text
      className={`${sizeClasses[size]} ${weightClasses[weight]} ${color} ${className}`}
    >
      {children}
    </Text>
  );
};

export default Text;