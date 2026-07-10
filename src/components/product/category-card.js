"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { useMotionAllowed } from "@/components/motion/motion-provider";

export function CategoryCard({ category }) {
  const motionAllowed = useMotionAllowed();

  return (
    <Link href={`/category/${category.slug}`} className="group block">
      <motion.article
        whileHover={motionAllowed ? { y: -4 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative"
      >
        <div className="relative aspect-[3/4] overflow-hidden md:aspect-[4/5]">
          <Image
            src={category.image}
            alt={category.name}
            fill
            unoptimized
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-farm-green-dark/80 via-farm-green-dark/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col p-5 md:p-6">
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {category.name}
            </h3>
            <TamilCaption className="mt-1 text-farm-green-light/80">
              {category.tamilName}
            </TamilCaption>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
              Explore
              <ArrowRight className="size-4 transition duration-300 group-hover:translate-x-1.5" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
