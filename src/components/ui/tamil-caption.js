const TONE_CLASS = {
  accent: "text-farm-accent-text",
  light: "text-[#f0d2a8]",
  ochre: "text-farm-ochre",
  muted: "text-farm-green-light/70",
};

export function TamilCaption({
  children,
  className = "",
  tone = "accent",
}) {
  return (
    <p
      className={`text-caption italic ${TONE_CLASS[tone] ?? TONE_CLASS.accent} ${className}`}
      lang="ta"
    >
      {children}
    </p>
  );
}
