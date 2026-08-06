const GRADIENTS = {
  checkout: {
    opacity: "opacity-[0.07]",
    image:
      "radial-gradient(ellipse 80% 50% at 10% 20%, #15321f 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 90% 80%, #8b5e3c 0%, transparent 50%)",
  },
  orders: {
    opacity: "opacity-[0.06]",
    image:
      "radial-gradient(ellipse 70% 40% at 15% 10%, #15321f 0%, transparent 55%)",
  },
  login: {
    opacity: "opacity-[0.08]",
    image:
      "radial-gradient(ellipse 70% 45% at 20% 15%, #15321f 0%, transparent 55%), radial-gradient(ellipse 50% 35% at 85% 75%, #b88e52 0%, transparent 50%)",
  },
};

/**
 * The full-height warm page wrapper with its radial-gradient wash, shared by
 * checkout, account orders, and login. Pass `variant: null` for no wash.
 */
export function FarmPageShell({ variant, centered = false, children, className = "" }) {
  const gradient = variant ? GRADIENTS[variant] : null;
  const layout = centered
    ? "flex items-center justify-center px-4 py-28"
    : "px-4 pt-28 pb-16 md:px-8";

  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-farm-warm ${layout} ${className}`}
    >
      {gradient && (
        <div
          className={`pointer-events-none absolute inset-0 ${gradient.opacity}`}
          style={{ backgroundImage: gradient.image }}
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}
