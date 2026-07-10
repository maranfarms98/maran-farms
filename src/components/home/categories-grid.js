"use client";

import { categories } from "@/data/categories";
import { CategoryCard } from "@/components/product/category-card";
import { SectionHeader } from "@/components/ui/section-header";
import { StaggerChildren, StaggerItem } from "@/components/motion/motion-reveal";

export function CategoriesGrid() {
  return (
    <section
      id="categories"
      className="section-pad container-farm scroll-mt-24"
    >
      <SectionHeader
        align="left"
        borderLeft
        accentRule={false}
        eyebrow="Browse Catalog"
        title="Our Categories"
        tamil="எங்கள் வகைகள்"
      />

      <StaggerChildren className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
        {categories.map((cat) => (
          <StaggerItem key={cat.id}>
            <CategoryCard category={cat} />
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}
