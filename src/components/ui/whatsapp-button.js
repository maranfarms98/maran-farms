import { MessageCircle } from "lucide-react";

const SIZES = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 flex-1 justify-center text-button",
};

const VARIANTS = {
  outline: "border border-farm-green bg-transparent text-farm-green",
  solid: "bg-farm-green text-farm-green-light",
};

/** The WhatsApp link with its icon, repeated across the storefront. */
export function WhatsAppButton({
  href,
  children = "WhatsApp",
  size = "md",
  variant = "outline",
  className = "",
  onClick,
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`focus-ring inline-flex items-center gap-2 rounded-full font-semibold ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    >
      <MessageCircle className="size-4" />
      {children}
    </a>
  );
}
