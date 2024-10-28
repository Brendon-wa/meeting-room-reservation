import { FC, ReactNode } from "react";

interface ButtonProps {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "ghost"
    | "icon";
  type?: "button" | "submit" | "reset" | undefined;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const buttonVariants = {
  default:
    "bg-blue-500 text-background disabled:bg-gray-400 disabled:cursor-not-allowed",
  secondary: "bg-gray-700 text-background",
  outline:
    "border-2 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500/10 duration-300",
  destructive: "text-red-500 hover:bg-red-100",
  ghost: "text-gray-800 hover:bg-blue-100",
  icon: "hover:bg-white/90 duration-300",
};

const Button: FC<ButtonProps> = ({
  variant = "default",
  children,
  onClick,
  className = "",
  type = undefined,
  disabled = false,
}) => {
  return (
    <button
      className={`px-4 py-2 self-start font-bold rounded-lg hover:opacity-85 duration-300 ${buttonVariants[variant]} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;