export function ErrorNote({ children, className = "" }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className={`rounded-xl bg-farm-accent/10 px-3 py-2 text-sm text-farm-accent-dark ${className}`}
    >
      {children}
    </p>
  );
}
