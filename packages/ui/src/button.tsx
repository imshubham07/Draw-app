import { ReactNode } from "react";

interface ButtonProps {
  variant?: "primary" | "outline" | "secondary";
  className?: string;
  onClick?: () => void;
  size?: "lg" | "sm";
  children: ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const Button = ({ 
  className = "", 
  size = "lg", 
  variant = "primary", 
  onClick,
  children,
  disabled = false,
  style
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95",
    secondary: "bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-gray-200",
    outline: "border-2 border-gray-300 bg-transparent hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500 hover:shadow-lg hover:scale-105 active:scale-95"
  };
  
  const sizeStyles = {
    lg: "px-8 py-4 text-base h-14",
    sm: "px-5 py-2.5 text-sm h-10"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};