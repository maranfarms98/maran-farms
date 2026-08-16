export const markdownComponents = {
  h2: ({ children }) => (
    <h2 className="font-heading mt-10 text-2xl text-farm-green-dark md:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-heading mt-8 text-xl text-farm-green-dark">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-base leading-relaxed break-words text-farm-sage">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-farm-sage">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-farm-sage">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-farm-green underline-offset-2 hover:text-farm-accent hover:underline"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-farm-green-dark">{children}</strong>
  ),
};
