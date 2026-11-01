import type { ReactNode } from "react";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  centered?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`section-heading${centered ? " section-heading--center" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
