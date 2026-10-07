export type MenuCategory = "All" | "Coffee" | "Non-Coffee" | "Pastry" | "Food";

export interface MenuItem {
  id: string;
  name: string;
  category: "Coffee" | "Non-Coffee" | "Pastry" | "Food";
  price: number;
  description: string;
  available: boolean;
  isPopular?: boolean;
  image?: string;
}

export const CATEGORIES: MenuCategory[] = ["All", "Coffee", "Non-Coffee", "Pastry", "Food"];

export const MENU_ITEMS: MenuItem[] = [
  // Coffee
  {
    id: "kopi-susu-senopati",
    name: "Kopi Susu Senopati",
    category: "Coffee",
    price: 32000,
    description: "Espresso ganda house blend, gula aren organik, susu segar dengan hint aroma pandan lembut.",
    available: true,
    isPopular: true,
  },
  {
    id: "cappuccino-artisan",
    name: "Artisan Cappuccino",
    category: "Coffee",
    price: 35000,
    description: "Espresso seimbang dengan microfoam susu yang tebal, lembut, dan taburan cocoa powder halus.",
    available: true,
  },
  {
    id: "americano-long-black",
    name: "Long Black / Americano",
    category: "Coffee",
    price: 28000,
    description: "Ekstraksi ganda di atas air bersuhu optimal, menghasilkan crema bersih dan karakter rasa cerah.",
    available: true,
  },
  {
    id: "manual-brew-gayo",
    name: "Manual Brew Gayo Natural",
    category: "Coffee",
    price: 38000,
    description: "Filter V60 single origin Gayo dengan aroma buah ceri, cokelat manis, dan acidity lembut.",
    available: true,
    isPopular: true,
  },
  {
    id: "sea-salt-caramel-latte",
    name: "Sea Salt Caramel Latte",
    category: "Coffee",
    price: 38000,
    description: "Espresso berpadu saus karamel buatan sendiri dengan sentuhan sea salt yang gurih manis seimbang.",
    available: true,
  },

  // Pastry
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    category: "Pastry",
    price: 28000,
    description: "Croissant klasik dengan 100% mentega Prancis, tekstur luar garing berlapis dan bagian dalam lembut berongga.",
    available: true,
    isPopular: true,
  },
  {
    id: "pain-au-chocolat",
    name: "Pain au Chocolat",
    category: "Pastry",
    price: 32000,
    description: "Adonan pastry mentega berlapis diisi dua batang dark chocolate couverture Belgia 60%.",
    available: true,
  },
  {
    id: "kouign-amann",
    name: "Kouign-Amann",
    category: "Pastry",
    price: 34000,
    description: "Pastry khas Brittany berkaramel gula renyah di bagian bawah dengan inti mentega yang kaya dan harum.",
    available: false, // SOLD OUT BADGE
  },
  {
    id: "almond-croissant",
    name: "Almond Croissant",
    category: "Pastry",
    price: 36000,
    description: "Croissant isi frangipane almond manis lembut dengan taburan irisan kacang almond panggang garing.",
    available: true,
  },
  {
    id: "cinnamon-roll",
    name: "Caramelized Cinnamon Roll",
    category: "Pastry",
    price: 30000,
    description: "Roti gulung kayu manis empuk dengan lelehan cream cheese glaze hangat yang lumer di lidah.",
    available: true,
  },

  // Non-Coffee
  {
    id: "matcha-latte",
    name: "Ceremonial Uji Matcha Latte",
    category: "Non-Coffee",
    price: 38000,
    description: "Matcha kualitas ceremonial asal Uji, Kyoto yang dikocok tradisional dengan susu segar lembut.",
    available: true,
    isPopular: true,
  },
  {
    id: "earl-grey-milk-tea",
    name: "London Fog Earl Grey",
    category: "Non-Coffee",
    price: 32000,
    description: "Seduhan teh hitam bergamot dengan sirup vanila organik dan steamed milk berbusa halus.",
    available: true,
  },
  {
    id: "sparkling-yuzu",
    name: "Sparkling Yuzu Lemonade",
    category: "Non-Coffee",
    price: 34000,
    description: "Bulir buah yuzu segar berpadu soda dingin dan daun mint untuk kesegaran maksimal.",
    available: true,
  },

  // Food
  {
    id: "smoked-beef-sourdough",
    name: "Smoked Beef Sourdough",
    category: "Food",
    price: 48000,
    description: "Roti sourdough panggang isi irisan daging sapi asap, lelehan keju cheddar, dan saus mustard mayo.",
    available: true,
    isPopular: true,
  },
  {
    id: "truffle-fries",
    name: "Parmesan Truffle Fries",
    category: "Food",
    price: 36000,
    description: "Kentang goreng renyah disiram minyak truffle aromatik dan taburan parutan keju parmesan segar.",
    available: true,
  },
];

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
