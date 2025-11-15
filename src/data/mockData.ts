export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryId: string;
  category: string;
  rating: number;
  reviews: number;
  tag?: string;
  isHighlight?: boolean;
}

export interface CategoryBanner {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryId: string;
  link: string;
}

export const categories: Category[] = [
  { id: "all", name: "All Product", slug: "all" },
  { id: "home", name: "For Home", slug: "home" },
  { id: "music", name: "For Music", slug: "music" },
  { id: "phone", name: "For Phone", slug: "phone" },
  { id: "storage", name: "For Storage", slug: "storage" },
];

export const products: Product[] = [
  // Phone Category - Highlight Products
  { 
    id: "1", 
    name: "Phone Holder Soks", 
    price: 29.90, 
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", 
    categoryId: "phone",
    category: "Phone",
    rating: 5.0,
    reviews: 1200,
    tag: "Phone",
    isHighlight: true
  },
  { 
    id: "6", 
    name: "Stuffus R175", 
    price: 25.00, 
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", 
    categoryId: "phone",
    category: "Phone",
    rating: 4.7,
    reviews: 780,
    tag: "Phone",
    isHighlight: true
  },
  // Phone Category - Additional Products
  { 
    id: "10", 
    name: "Wireless Charger Pro", 
    price: 35.00, 
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400", 
    categoryId: "phone",
    category: "Phone",
    rating: 4.6,
    reviews: 450,
    tag: "Phone"
  },
  { 
    id: "11", 
    name: "Phone Case Premium", 
    price: 19.90, 
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400", 
    categoryId: "phone",
    category: "Phone",
    rating: 4.8,
    reviews: 920,
    tag: "Phone"
  },
  { 
    id: "12", 
    name: "Screen Protector Glass", 
    price: 12.00, 
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400", 
    categoryId: "phone",
    category: "Phone",
    rating: 4.5,
    reviews: 680,
    tag: "Phone"
  },
  { 
    id: "13", 
    name: "Phone Stand Adjustable", 
    price: 15.50, 
    image: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400", 
    categoryId: "phone",
    category: "Phone",
    rating: 4.7,
    reviews: 340,
    tag: "Phone"
  },
  { 
    id: "14", 
    name: "USB-C Cable Fast Charge", 
    price: 8.90, 
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400", 
    categoryId: "phone",
    category: "Phone",
    rating: 4.4,
    reviews: 560,
    tag: "Phone"
  },
  { 
    id: "15", 
    name: "Phone Grip Ring", 
    price: 6.50, 
    image: "https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=400", 
    categoryId: "phone",
    category: "Phone",
    rating: 4.3,
    reviews: 280,
    tag: "Phone"
  },
  { 
    id: "16", 
    name: "Phone Lens Kit", 
    price: 22.00, 
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400", 
    categoryId: "phone",
    category: "Phone",
    rating: 4.6,
    reviews: 190,
    tag: "Phone"
  },
  { 
    id: "17", 
    name: "Phone Mount Car", 
    price: 18.00, 
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400", 
    categoryId: "phone",
    category: "Phone",
    rating: 4.8,
    reviews: 410,
    tag: "Phone"
  },
  { 
    id: "18", 
    name: "Phone Power Bank 10000mAh", 
    price: 28.00, 
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c8?w=400", 
    categoryId: "phone",
    category: "Phone",
    rating: 4.7,
    reviews: 750,
    tag: "Phone"
  },
  { 
    id: "19", 
    name: "Phone Pop Socket", 
    price: 9.90, 
    image: "https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=400", 
    categoryId: "phone",
    category: "Phone",
    rating: 4.5,
    reviews: 320,
    tag: "Phone"
  },
  { 
    id: "20", 
    name: "Phone Selfie Stick", 
    price: 14.50, 
    image: "https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=400", 
    categoryId: "phone",
    category: "Phone",
    rating: 4.4,
    reviews: 240,
    tag: "Phone"
  },

  // Music Category - Highlight Products
  { 
    id: "2", 
    name: "Headsound", 
    price: 12.00, 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", 
    categoryId: "music",
    category: "Music",
    rating: 5.0,
    reviews: 850,
    tag: "Music",
    isHighlight: true
  },
  { 
    id: "7", 
    name: "TWS Bujug", 
    price: 20.00, 
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400", 
    categoryId: "music",
    category: "Music",
    rating: 5.0,
    reviews: 950,
    tag: "Music",
    isHighlight: true
  },
  { 
    id: "8", 
    name: "Headsound Baptis", 
    price: 12.00, 
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400", 
    categoryId: "music",
    category: "Music",
    rating: 4.8,
    reviews: 620,
    tag: "Music",
    isHighlight: true
  },
  // Music Category - Additional Products
  { 
    id: "21", 
    name: "Bluetooth Speaker Mini", 
    price: 25.00, 
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", 
    categoryId: "music",
    category: "Music",
    rating: 4.6,
    reviews: 380,
    tag: "Music"
  },
  { 
    id: "22", 
    name: "Wireless Earbuds Pro", 
    price: 45.00, 
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400", 
    categoryId: "music",
    category: "Music",
    rating: 4.9,
    reviews: 1120,
    tag: "Music"
  },
  { 
    id: "23", 
    name: "Headphones Over-Ear", 
    price: 55.00, 
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400", 
    categoryId: "music",
    category: "Music",
    rating: 4.7,
    reviews: 670,
    tag: "Music"
  },
  { 
    id: "24", 
    name: "Guitar Cable 10ft", 
    price: 18.00, 
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400", 
    categoryId: "music",
    category: "Music",
    rating: 4.5,
    reviews: 290,
    tag: "Music"
  },
  { 
    id: "25", 
    name: "Microphone USB", 
    price: 35.00, 
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400", 
    categoryId: "music",
    category: "Music",
    rating: 4.6,
    reviews: 420,
    tag: "Music"
  },
  { 
    id: "26", 
    name: "Drum Sticks Pro", 
    price: 15.00, 
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400", 
    categoryId: "music",
    category: "Music",
    rating: 4.4,
    reviews: 180,
    tag: "Music"
  },
  { 
    id: "27", 
    name: "Audio Interface 2x2", 
    price: 85.00, 
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400", 
    categoryId: "music",
    category: "Music",
    rating: 4.8,
    reviews: 340,
    tag: "Music"
  },
  { 
    id: "28", 
    name: "Studio Monitor Stands", 
    price: 42.00, 
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", 
    categoryId: "music",
    category: "Music",
    rating: 4.5,
    reviews: 210,
    tag: "Music"
  },
  { 
    id: "29", 
    name: "Piano Keyboard 61 Keys", 
    price: 120.00, 
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400", 
    categoryId: "music",
    category: "Music",
    rating: 4.7,
    reviews: 150,
    tag: "Music"
  },
  { 
    id: "30", 
    name: "DJ Controller Basic", 
    price: 95.00, 
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400", 
    categoryId: "music",
    category: "Music",
    rating: 4.6,
    reviews: 230,
    tag: "Music"
  },

  // Home Category - Highlight Products
  { 
    id: "3", 
    name: "Adudu Cleaner", 
    price: 50.00, 
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.8,
    reviews: 650,
    tag: "Home",
    isHighlight: true
  },
  { 
    id: "4", 
    name: "CCTV Meling", 
    price: 9.90, 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.5,
    reviews: 320,
    tag: "Home",
    isHighlight: true
  },
  { 
    id: "9", 
    name: "Adudu Cleaner", 
    price: 29.90, 
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.6,
    reviews: 540,
    tag: "Home",
    isHighlight: true
  },
  // Home Category - Additional Products
  { 
    id: "31", 
    name: "Smart Light Bulb", 
    price: 22.00, 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.6,
    reviews: 480,
    tag: "Home"
  },
  { 
    id: "32", 
    name: "Air Purifier Mini", 
    price: 65.00, 
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.7,
    reviews: 590,
    tag: "Home"
  },
  { 
    id: "33", 
    name: "Robot Vacuum Cleaner", 
    price: 180.00, 
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.8,
    reviews: 720,
    tag: "Home"
  },
  { 
    id: "34", 
    name: "Smart Door Lock", 
    price: 95.00, 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.5,
    reviews: 360,
    tag: "Home"
  },
  { 
    id: "35", 
    name: "Security Camera WiFi", 
    price: 45.00, 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.6,
    reviews: 510,
    tag: "Home"
  },
  { 
    id: "36", 
    name: "Smart Thermostat", 
    price: 75.00, 
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.7,
    reviews: 430,
    tag: "Home"
  },
  { 
    id: "37", 
    name: "Water Leak Detector", 
    price: 18.00, 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.4,
    reviews: 270,
    tag: "Home"
  },
  { 
    id: "38", 
    name: "Smart Plug WiFi", 
    price: 15.00, 
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.5,
    reviews: 390,
    tag: "Home"
  },
  { 
    id: "39", 
    name: "Motion Sensor Light", 
    price: 28.00, 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.6,
    reviews: 340,
    tag: "Home"
  },
  { 
    id: "40", 
    name: "Smart Doorbell Camera", 
    price: 88.00, 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.7,
    reviews: 520,
    tag: "Home"
  },
  { 
    id: "41", 
    name: "Humidifier Ultrasonic", 
    price: 32.00, 
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.5,
    reviews: 410,
    tag: "Home"
  },
  { 
    id: "42", 
    name: "Smart Smoke Detector", 
    price: 55.00, 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", 
    categoryId: "home",
    category: "Home",
    rating: 4.6,
    reviews: 290,
    tag: "Home"
  },

  // Storage Category - Highlight Products
  { 
    id: "5", 
    name: "Stuffus Peker 32", 
    price: 34.10, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 
    categoryId: "storage",
    category: "Storage",
    rating: 4.9,
    reviews: 1100,
    tag: "Storage",
    isHighlight: true
  },
  // Storage Category - Additional Products
  { 
    id: "43", 
    name: "USB Flash Drive 64GB", 
    price: 12.00, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 
    categoryId: "storage",
    category: "Storage",
    rating: 4.6,
    reviews: 680,
    tag: "Storage"
  },
  { 
    id: "44", 
    name: "External HDD 1TB", 
    price: 55.00, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 
    categoryId: "storage",
    category: "Storage",
    rating: 4.7,
    reviews: 920,
    tag: "Storage"
  },
  { 
    id: "45", 
    name: "SSD External 512GB", 
    price: 75.00, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 
    categoryId: "storage",
    category: "Storage",
    rating: 4.8,
    reviews: 750,
    tag: "Storage"
  },
  { 
    id: "46", 
    name: "Memory Card 128GB", 
    price: 18.00, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 
    categoryId: "storage",
    category: "Storage",
    rating: 4.5,
    reviews: 540,
    tag: "Storage"
  },
  { 
    id: "47", 
    name: "USB-C Hub 7-in-1", 
    price: 35.00, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 
    categoryId: "storage",
    category: "Storage",
    rating: 4.6,
    reviews: 420,
    tag: "Storage"
  },
  { 
    id: "48", 
    name: "Cloud Storage Box", 
    price: 120.00, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 
    categoryId: "storage",
    category: "Storage",
    rating: 4.7,
    reviews: 310,
    tag: "Storage"
  },
  { 
    id: "49", 
    name: "NAS Drive 2TB", 
    price: 180.00, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 
    categoryId: "storage",
    category: "Storage",
    rating: 4.8,
    reviews: 280,
    tag: "Storage"
  },
  { 
    id: "50", 
    name: "USB OTG Adapter", 
    price: 6.50, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 
    categoryId: "storage",
    category: "Storage",
    rating: 4.4,
    reviews: 360,
    tag: "Storage"
  },
  { 
    id: "51", 
    name: "SD Card Reader", 
    price: 8.00, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 
    categoryId: "storage",
    category: "Storage",
    rating: 4.5,
    reviews: 290,
    tag: "Storage"
  },
  { 
    id: "52", 
    name: "Thunderbolt Cable", 
    price: 42.00, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 
    categoryId: "storage",
    category: "Storage",
    rating: 4.6,
    reviews: 210,
    tag: "Storage"
  },
  { 
    id: "53", 
    name: "M.2 SSD Enclosure", 
    price: 28.00, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 
    categoryId: "storage",
    category: "Storage",
    rating: 4.5,
    reviews: 180,
    tag: "Storage"
  },
  { 
    id: "54", 
    name: "USB Hub Powered", 
    price: 25.00, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 
    categoryId: "storage",
    category: "Storage",
    rating: 4.6,
    reviews: 330,
    tag: "Storage"
  },
];

export const categoryBanners: CategoryBanner[] = [
  {
    id: "1",
    title: "อิเล็กทรอนิกส์",
    description: "สินค้าเทคโนโลยีล่าสุด",
    image: "/api/placeholder/600/300",
    categoryId: "1",
    link: "/products/electronics",
  },
  {
    id: "2",
    title: "เสื้อผ้า",
    description: "แฟชั่นตามเทรนด์",
    image: "/api/placeholder/600/300",
    categoryId: "2",
    link: "/products/clothing",
  },
  {
    id: "3",
    title: "ของใช้ในบ้าน",
    description: "ตกแต่งบ้านให้สวยงาม",
    image: "/api/placeholder/600/300",
    categoryId: "3",
    link: "/products/home",
  },
  {
    id: "4",
    title: "กีฬา",
    description: "อุปกรณ์กีฬาคุณภาพ",
    image: "/api/placeholder/600/300",
    categoryId: "4",
    link: "/products/sports",
  },
];

export interface HighlightBanner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  buttonText?: string;
}

export const highlightBanners: HighlightBanner[] = [
  {
    id: "1",
    title: "โปรโมชั่นพิเศษ",
    description: "ลดราคาสูงสุด 50% สำหรับสินค้าใหม่ทั้งหมด",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200",
    link: "/promotion",
    buttonText: "ช้อปเลย",
  },
];

export interface ContactInfo {
  address: string;
  phone: string;
  fax?: string;
  email: string;
  website?: string;
  lineId?: string;
  businessHours: string[];
  additionalInfo?: string;
  latitude?: number;
  longitude?: number;
  mapEmbedUrl?: string;
  socialMedia?: {
    name: string;
    url: string;
    icon: string; // Icon name for rendering
  }[];
}

export const contactInfo: ContactInfo = {
  address: "164/1 หมู่ 5 ตำบลโคกคราม อำเภอบางปล้าม้า จังหวัดสุพรรณบุรี 72150",
  phone: "081 011 6699, 0899213355",
  fax: "035587147",
  email: "spprosupply@gmail.com, spsupply9@gmail.com",
  website: "https://www.spprosupply.com",
  lineId: "chana2710",
  businessHours: [
    "จันทร์ - ศุกร์: 09:00 - 18:00 น.",
    "เสาร์: 09:00 - 17:00 น.",
    "อาทิตย์: ปิดทำการ",
  ],
  latitude: 14.401372,
  longitude: 100.161237,
  mapEmbedUrl: "https://maps.google.com/maps?q=14.401372,100.161237&hl=th&z=15&output=embed",
  additionalInfo:
    "สำหรับคำถามหรือข้อเสนอแนะ กรุณาติดต่อเราผ่านช่องทางต่างๆ ที่ระบุไว้ด้านบน เรายินดีให้บริการและตอบคำถามของคุณทุกวันทำการ",
  socialMedia: [
    {
      name: "Facebook",
      url: "https://www.facebook.com/sppro99",
      icon: "facebook",
    },
    {
      name: "Line",
      url: "https://line.me/ti/p/~chana2710",
      icon: "line",
    },
  ],
};

export interface PaymentMethod {
  name: string;
  type: "credit" | "bank" | "wallet" | "qr" | "cash";
  description: string;
  details?: string[];
}

export const paymentMethods: PaymentMethod[] = [
  {
    name: "บัตรเครดิต/เดบิต",
    type: "credit",
    description: "ชำระเงินด้วยบัตรเครดิตหรือบัตรเดบิตทุกประเภท",
    details: [
      "รองรับ Visa, Mastercard, JCB",
      "ชำระเงินได้ทันที",
      "ปลอดภัยด้วยระบบ 3D Secure",
    ],
  },
  {
    name: "โอนเงินผ่านธนาคาร",
    type: "bank",
    description: "โอนเงินผ่านบัญชีธนาคารออนไลน์หรือตู้ ATM",
    details: [
      "รองรับทุกธนาคาร",
      "โอนเงินได้ 24 ชั่วโมง",
      "กรุณาแจ้งยืนยันการโอนเงิน",
    ],
  },
  {
    name: "พร้อมเพย์ (PromptPay)",
    type: "qr",
    description: "สแกน QR Code เพื่อชำระเงินผ่านแอปธนาคาร",
    details: [
      "ชำระเงินได้ทันที",
      "รองรับทุกธนาคารที่ใช้พร้อมเพย์",
      "ไม่ต้องกรอกเลขบัญชี",
    ],
  },
  {
    name: "TrueMoney Wallet",
    type: "wallet",
    description: "ชำระเงินผ่าน TrueMoney Wallet",
    details: [
      "สะดวก รวดเร็ว",
      "ชำระเงินได้ทันที",
      "มีโปรโมชั่นพิเศษ",
    ],
  },
  {
    name: "เงินสด (เก็บเงินปลายทาง)",
    type: "cash",
    description: "ชำระเงินสดเมื่อได้รับสินค้า",
    details: [
      "ชำระเงินเมื่อได้รับสินค้า",
      "มีค่าธรรมเนียมเพิ่มเติม",
      "ตรวจสอบสินค้าก่อนชำระเงิน",
    ],
  },
  {
    name: "ShopeePay",
    type: "wallet",
    description: "ชำระเงินผ่าน ShopeePay",
    details: [
      "สะดวก รวดเร็ว",
      "มีโปรโมชั่นและส่วนลด",
      "ชำระเงินได้ทันที",
    ],
  },
];

