export interface Product {
  id: string;
  name: string;
  category: string;
  seller: string;
  sellerId: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  text: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  emotions: string[];
  aspects: { name: string; sentiment: 'positive' | 'negative' | 'neutral' }[];
  isFake: boolean;
  fakeScore: number;
}

export interface Seller {
  id: string;
  name: string;
  productCount: number;
  avgRating: number;
  reputationScore: number;
  totalReviews: number;
  status: 'active' | 'warned' | 'suspended';
  warningCount: number;
  trend: 'improving' | 'declining' | 'stable';
  sentimentBreakdown: { positive: number; negative: number; neutral: number };
  topComplaints: string[];
  monthlyData: { month: string; rating: number; reviews: number; sentiment: number }[];
}

export interface Alert {
  id: string;
  sellerId: string;
  sellerName: string;
  type: 'negative_spike' | 'reputation_drop' | 'fake_reviews' | 'quality_issue';
  severity: 'high' | 'medium' | 'low';
  message: string;
  date: string;
  resolved: boolean;
}

export const products: Product[] = [
  { id: 'p1', name: 'ProMax Laptop 15"', category: 'Laptops', seller: 'TechVision Inc.', sellerId: 's1', price: 999.99, image: '💻', rating: 4.2, reviewCount: 234, description: 'High-performance laptop with latest processor and 16GB RAM.' },
  { id: 'p2', name: 'SoundWave Pro Headset', category: 'Headsets', seller: 'AudioMax Ltd.', sellerId: 's2', price: 149.99, image: '🎧', rating: 3.1, reviewCount: 189, description: 'Wireless noise-cancelling headphones with premium sound quality.' },
  { id: 'p3', name: 'SwiftPhone X12', category: 'Phones', seller: 'MobileFirst Corp.', sellerId: 's3', price: 799.99, image: '📱', rating: 4.6, reviewCount: 512, description: 'Flagship smartphone with triple camera and all-day battery.' },
  { id: 'p4', name: 'UltraTab 10" Tablet', category: 'Tablets', seller: 'TechVision Inc.', sellerId: 's1', price: 449.99, image: '📱', rating: 3.8, reviewCount: 145, description: 'Lightweight tablet perfect for entertainment and productivity.' },
  { id: 'p5', name: 'PowerBank 20000mAh', category: 'Accessories', seller: 'ChargeTech', sellerId: 's4', price: 39.99, image: '🔋', rating: 4.5, reviewCount: 678, description: 'Fast-charging portable battery with USB-C and USB-A ports.' },
  { id: 'p6', name: 'SmartWatch Elite', category: 'Wearables', seller: 'AudioMax Ltd.', sellerId: 's2', price: 299.99, image: '⌚', rating: 2.8, reviewCount: 312, description: 'Fitness-focused smartwatch with heart rate monitoring.' },
  { id: 'p7', name: 'MechKey Pro Keyboard', category: 'Accessories', seller: 'PeripheralPro', sellerId: 's5', price: 129.99, image: '⌨️', rating: 4.7, reviewCount: 423, description: 'Mechanical keyboard with RGB lighting and hot-swappable switches.' },
  { id: 'p8', name: 'ClearView Monitor 27"', category: 'Monitors', seller: 'PeripheralPro', sellerId: 's5', price: 379.99, image: '🖥️', rating: 4.4, reviewCount: 198, description: '4K IPS monitor with 144Hz refresh rate for gaming and design.' },
];

export const reviews: Review[] = [
  { id: 'r1', productId: 'p1', customerName: 'Alice M.', rating: 5, text: 'Excellent laptop! Fast performance and great battery life. The screen quality is amazing.', date: '2026-04-10', sentiment: 'positive', emotions: ['happy', 'satisfied'], aspects: [{ name: 'performance', sentiment: 'positive' }, { name: 'battery', sentiment: 'positive' }, { name: 'screen', sentiment: 'positive' }], isFake: false, fakeScore: 0.05 },
  { id: 'r2', productId: 'p1', customerName: 'Bob K.', rating: 2, text: 'Overheats badly after an hour. The fan noise is unbearable. Very disappointed.', date: '2026-04-08', sentiment: 'negative', emotions: ['frustrated', 'angry'], aspects: [{ name: 'temperature', sentiment: 'negative' }, { name: 'noise', sentiment: 'negative' }], isFake: false, fakeScore: 0.08 },
  { id: 'r3', productId: 'p2', customerName: 'Carol D.', rating: 1, text: 'Sound quality is terrible. Bass is nonexistent and they broke after 2 weeks.', date: '2026-04-09', sentiment: 'negative', emotions: ['angry', 'disappointed'], aspects: [{ name: 'sound quality', sentiment: 'negative' }, { name: 'durability', sentiment: 'negative' }], isFake: false, fakeScore: 0.12 },
  { id: 'r4', productId: 'p2', customerName: 'Dan W.', rating: 3, text: 'Decent comfort but mediocre sound. Noise cancellation works okay.', date: '2026-04-07', sentiment: 'neutral', emotions: ['indifferent'], aspects: [{ name: 'comfort', sentiment: 'positive' }, { name: 'sound quality', sentiment: 'negative' }, { name: 'noise cancellation', sentiment: 'neutral' }], isFake: false, fakeScore: 0.15 },
  { id: 'r5', productId: 'p3', customerName: 'Eva S.', rating: 5, text: 'Best phone I have ever owned! Camera is incredible and battery lasts forever.', date: '2026-04-11', sentiment: 'positive', emotions: ['happy', 'excited'], aspects: [{ name: 'camera', sentiment: 'positive' }, { name: 'battery', sentiment: 'positive' }], isFake: false, fakeScore: 0.03 },
  { id: 'r6', productId: 'p3', customerName: 'Frank L.', rating: 4, text: 'Great phone overall. Wish it had better speakers but everything else is top notch.', date: '2026-04-06', sentiment: 'positive', emotions: ['satisfied'], aspects: [{ name: 'speakers', sentiment: 'negative' }, { name: 'overall', sentiment: 'positive' }], isFake: false, fakeScore: 0.07 },
  { id: 'r7', productId: 'p6', customerName: 'Grace T.', rating: 1, text: 'This is fake garbage. Screen scratched on day 1 and heart rate sensor is wildly inaccurate.', date: '2026-04-10', sentiment: 'negative', emotions: ['angry', 'frustrated'], aspects: [{ name: 'screen', sentiment: 'negative' }, { name: 'sensor accuracy', sentiment: 'negative' }], isFake: false, fakeScore: 0.1 },
  { id: 'r8', productId: 'p6', customerName: 'Hank R.', rating: 5, text: 'Amazing product best ever must buy everyone should get this incredible wow!', date: '2026-04-09', sentiment: 'positive', emotions: ['happy'], aspects: [{ name: 'overall', sentiment: 'positive' }], isFake: true, fakeScore: 0.92 },
  { id: 'r9', productId: 'p5', customerName: 'Ivy N.', rating: 5, text: 'Charges my phone 4 times on a single charge. Very compact and well-built.', date: '2026-04-12', sentiment: 'positive', emotions: ['satisfied', 'happy'], aspects: [{ name: 'capacity', sentiment: 'positive' }, { name: 'build quality', sentiment: 'positive' }], isFake: false, fakeScore: 0.04 },
  { id: 'r10', productId: 'p7', customerName: 'Jake P.', rating: 5, text: 'Perfect mechanical keyboard. The switches feel great and RGB is customizable.', date: '2026-04-11', sentiment: 'positive', emotions: ['happy', 'excited'], aspects: [{ name: 'switches', sentiment: 'positive' }, { name: 'RGB', sentiment: 'positive' }], isFake: false, fakeScore: 0.02 },
  { id: 'r11', productId: 'p2', customerName: 'Karen B.', rating: 2, text: 'Bluetooth keeps disconnecting. Battery only lasts 3 hours not the advertised 20.', date: '2026-04-05', sentiment: 'negative', emotions: ['frustrated', 'disappointed'], aspects: [{ name: 'bluetooth', sentiment: 'negative' }, { name: 'battery', sentiment: 'negative' }], isFake: false, fakeScore: 0.09 },
  { id: 'r12', productId: 'p6', customerName: 'Leo M.', rating: 2, text: 'Step counter is way off. App crashes frequently. Not worth the price at all.', date: '2026-04-08', sentiment: 'negative', emotions: ['frustrated'], aspects: [{ name: 'step counter', sentiment: 'negative' }, { name: 'app', sentiment: 'negative' }, { name: 'value', sentiment: 'negative' }], isFake: false, fakeScore: 0.11 },
];

export const sellers: Seller[] = [
  {
    id: 's1', name: 'TechVision Inc.', productCount: 2, avgRating: 4.0, reputationScore: 78, totalReviews: 379, status: 'active', warningCount: 0, trend: 'stable',
    sentimentBreakdown: { positive: 55, negative: 25, neutral: 20 },
    topComplaints: ['Overheating issues', 'Fan noise', 'Software bugs'],
    monthlyData: [
      { month: 'Nov', rating: 3.8, reviews: 45, sentiment: 65 }, { month: 'Dec', rating: 3.9, reviews: 62, sentiment: 68 },
      { month: 'Jan', rating: 4.0, reviews: 58, sentiment: 70 }, { month: 'Feb', rating: 4.1, reviews: 70, sentiment: 72 },
      { month: 'Mar', rating: 4.0, reviews: 75, sentiment: 71 }, { month: 'Apr', rating: 4.0, reviews: 69, sentiment: 70 },
    ],
  },
  {
    id: 's2', name: 'AudioMax Ltd.', productCount: 2, avgRating: 2.9, reputationScore: 38, totalReviews: 501, status: 'warned', warningCount: 2, trend: 'declining',
    sentimentBreakdown: { positive: 20, negative: 60, neutral: 20 },
    topComplaints: ['Poor sound quality', 'Bluetooth connectivity', 'Battery life', 'Durability', 'Inaccurate sensors'],
    monthlyData: [
      { month: 'Nov', rating: 3.5, reviews: 80, sentiment: 50 }, { month: 'Dec', rating: 3.2, reviews: 90, sentiment: 42 },
      { month: 'Jan', rating: 3.0, reviews: 85, sentiment: 38 }, { month: 'Feb', rating: 2.8, reviews: 95, sentiment: 30 },
      { month: 'Mar', rating: 2.7, reviews: 78, sentiment: 25 }, { month: 'Apr', rating: 2.9, reviews: 73, sentiment: 28 },
    ],
  },
  {
    id: 's3', name: 'MobileFirst Corp.', productCount: 1, avgRating: 4.6, reputationScore: 92, totalReviews: 512, status: 'active', warningCount: 0, trend: 'improving',
    sentimentBreakdown: { positive: 80, negative: 8, neutral: 12 },
    topComplaints: ['Speaker quality'],
    monthlyData: [
      { month: 'Nov', rating: 4.3, reviews: 70, sentiment: 78 }, { month: 'Dec', rating: 4.4, reviews: 85, sentiment: 80 },
      { month: 'Jan', rating: 4.5, reviews: 90, sentiment: 82 }, { month: 'Feb', rating: 4.5, reviews: 88, sentiment: 84 },
      { month: 'Mar', rating: 4.6, reviews: 92, sentiment: 86 }, { month: 'Apr', rating: 4.6, reviews: 87, sentiment: 88 },
    ],
  },
  {
    id: 's4', name: 'ChargeTech', productCount: 1, avgRating: 4.5, reputationScore: 88, totalReviews: 678, status: 'active', warningCount: 0, trend: 'stable',
    sentimentBreakdown: { positive: 75, negative: 10, neutral: 15 },
    topComplaints: ['Charging speed inconsistency'],
    monthlyData: [
      { month: 'Nov', rating: 4.4, reviews: 100, sentiment: 76 }, { month: 'Dec', rating: 4.5, reviews: 120, sentiment: 78 },
      { month: 'Jan', rating: 4.5, reviews: 115, sentiment: 77 }, { month: 'Feb', rating: 4.5, reviews: 110, sentiment: 78 },
      { month: 'Mar', rating: 4.5, reviews: 118, sentiment: 79 }, { month: 'Apr', rating: 4.5, reviews: 115, sentiment: 78 },
    ],
  },
  {
    id: 's5', name: 'PeripheralPro', productCount: 2, avgRating: 4.55, reputationScore: 91, totalReviews: 621, status: 'active', warningCount: 0, trend: 'improving',
    sentimentBreakdown: { positive: 82, negative: 7, neutral: 11 },
    topComplaints: ['Keycap font fading'],
    monthlyData: [
      { month: 'Nov', rating: 4.3, reviews: 90, sentiment: 80 }, { month: 'Dec', rating: 4.4, reviews: 105, sentiment: 82 },
      { month: 'Jan', rating: 4.4, reviews: 100, sentiment: 83 }, { month: 'Feb', rating: 4.5, reviews: 108, sentiment: 85 },
      { month: 'Mar', rating: 4.5, reviews: 110, sentiment: 86 }, { month: 'Apr', rating: 4.55, reviews: 108, sentiment: 87 },
    ],
  },
];

export const alerts: Alert[] = [
  { id: 'a1', sellerId: 's2', sellerName: 'AudioMax Ltd.', type: 'negative_spike', severity: 'high', message: 'Negative review spike detected: 60% of reviews in last 7 days are negative for SoundWave Pro Headset.', date: '2026-04-10', resolved: false },
  { id: 'a2', sellerId: 's2', sellerName: 'AudioMax Ltd.', type: 'reputation_drop', severity: 'high', message: 'Seller reputation score dropped below 40. Current score: 38. Recommend seller review.', date: '2026-04-09', resolved: false },
  { id: 'a3', sellerId: 's2', sellerName: 'AudioMax Ltd.', type: 'fake_reviews', severity: 'medium', message: 'Potential fake review detected on SmartWatch Elite product (confidence: 92%).', date: '2026-04-09', resolved: false },
  { id: 'a4', sellerId: 's1', sellerName: 'TechVision Inc.', type: 'quality_issue', severity: 'low', message: 'Recurring "overheating" complaints on ProMax Laptop 15" (mentioned in 15% of reviews).', date: '2026-04-08', resolved: true },
];
