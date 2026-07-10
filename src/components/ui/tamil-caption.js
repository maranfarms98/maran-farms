export function TamilCaption({ children, className = "" }) {
  return (
    <p
      className={`text-caption italic text-farm-accent-text ${className}`}
      lang="ta"
    >
      {children}
    </p>
  );
}
