export const categories = [
  {
    id: "napier",
    slug: "napier-plants",
    name: "Napier & Plants",
    tamilName: "நேப்பியர் & செடிகள்",
    description:
      "Premium Napier grass sticks and fodder plants cultivated for high yield, fast regrowth, and superior livestock nutrition across Tamil Nadu.",
    tamilDescription:
      "உயர் மகசூல், விரைவான மறுவளர்ச்சி மற்றும் சிறந்த கால்நடை ஊட்டச்சத்துக்காக வளர்க்கப்படும் பிரீமியம் நேப்பியர் புல் குச்சிகள் மற்றும் தீவனச் செடிகள்.",
    image: "/images/category-napier.png",
    heroImage: "/images/category-napier.png",
    minOrder: 500,
    minOrderUnit: "sticks",
    gradient: "from-[#15321f]/70 via-[#15321f]/40 to-[#8b5e3c]/50",
    accent: "#15321f",
  },
  {
    id: "chicks",
    slug: "chicks-birds",
    name: "Chicks & Birds",
    tamilName: "குஞ்சுகள் & பறவைகள்",
    description:
      "Farm-fresh day-old chicks and healthy ornamental birds raised with careful hatching practices and ready for backyard or commercial setups.",
    tamilDescription:
      "கவனமாக அடைகாக்கும் முறைகளுடன் வளர்க்கப்பட்ட பண்ணை புதிய ஒருநாள் குஞ்சுகள் மற்றும் ஆரோக்கியமான அலங்காரப் பறவைகள்.",
    image: "/images/category-chicks.png",
    heroImage: "/images/category-chicks.png",
    minOrder: 1,
    minOrderUnit: "each",
    gradient: "from-[#8b5e3c]/70 via-[#15321f]/35 to-[#0d1e13]/55",
    accent: "#8b5e3c",
  },
  {
    id: "pets",
    slug: "small-pets",
    name: "Small Pets",
    tamilName: "சிறிய செல்லப்பிராணிகள்",
    description:
      "Healthy small pets including rabbits and hamsters, raised in clean farm conditions and ideal for families seeking gentle companions.",
    tamilDescription:
      "சுத்தமான பண்ணை சூழலில் வளர்க்கப்பட்ட முயல்கள் மற்றும் ஹாம்ஸ்டர்கள் உள்ளிட்ட ஆரோக்கியமான சிறிய செல்லப்பிராணிகள்.",
    image: "/images/category-pets.png",
    heroImage: "/images/category-pets.png",
    minOrder: 1,
    minOrderUnit: "each",
    gradient: "from-[#0d1e13]/65 via-[#8b5e3c]/40 to-[#b88e52]/45",
    accent: "#b88e52",
  },
];

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id) {
  return categories.find((c) => c.id === id);
}
