import watch1 from "@/assets/watch-1.jpg";
import watch2 from "@/assets/watch-2.jpg";
import watch3 from "@/assets/watch-3.jpg";
import watch4 from "@/assets/watch-4.jpg";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  category: "Chronograph" | "Classic" | "Automatic" | "Ladies";
  description: string;
  specs: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    id: "tymlyn-noir-chrono",
    name: "Noir Chrono",
    tagline: "Gold-cased chronograph",
    price: 18500,
    image: watch1,
    category: "Chronograph",
    description:
      "A bold chronograph built for men who measure every moment. Gold-plated case, matte black dial and three precision sub-dials.",
    specs: [
      { label: "Case", value: "42mm gold plated steel" },
      { label: "Movement", value: "Japanese quartz chronograph" },
      { label: "Water resist", value: "5 ATM" },
      { label: "Warranty", value: "1 year" },
    ],
  },
  {
    id: "tymlyn-heritage",
    name: "Heritage Classic",
    tagline: "Minimal dress watch",
    price: 12500,
    image: watch2,
    category: "Classic",
    description:
      "Clean lines, gold indices and a genuine leather strap. The Heritage is the quiet statement piece of the Tymlyn line.",
    specs: [
      { label: "Case", value: "40mm gold plated steel" },
      { label: "Strap", value: "Genuine black leather" },
      { label: "Glass", value: "Sapphire coated" },
      { label: "Warranty", value: "1 year" },
    ],
  },
  {
    id: "tymlyn-skeleton",
    name: "Skeleton Automatic",
    tagline: "Exposed mechanical heart",
    price: 26900,
    image: watch3,
    category: "Automatic",
    description:
      "An open-worked automatic movement on full display. Self-winding, hand assembled and finished in warm gold.",
    specs: [
      { label: "Case", value: "43mm gold plated steel" },
      { label: "Movement", value: "Automatic self-winding" },
      { label: "Power reserve", value: "40 hours" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    id: "tymlyn-lumiere",
    name: "Lumière Mesh",
    tagline: "Ladies gold mesh",
    price: 9900,
    image: watch4,
    category: "Ladies",
    description:
      "A slim, feather-light ladies watch on a woven gold mesh bracelet. Refined enough for every occasion.",
    specs: [
      { label: "Case", value: "32mm gold plated" },
      { label: "Bracelet", value: "Milanese gold mesh" },
      { label: "Movement", value: "Swiss quartz" },
      { label: "Warranty", value: "1 year" },
    ],
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const formatPKR = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
