export type MessageType =
  | 'text'
  | 'order_tracking'
  | 'product_recommendation'
  | 'return_initiation'
  | 'cart_summary';

export type ChatRole = 'user' | 'ai' | 'system';

export interface OrderTrackingData {
  orderId: string;
  status: 'processing' | 'packed' | 'shipped' | 'delivered';
  items: string[];
  estimatedDelivery: string;
  carrier: string;
}

export interface ProductRecommendationData {
  product: Product;
  reason: string;
}

export interface ReturnData {
  eligibleOrders: string[];
}

export interface CartSummaryData {
  itemCount: number;
  subtotal: number;
  items: CartItem[];
}

export type ChatWidgetData =
  | OrderTrackingData
  | ProductRecommendationData
  | ReturnData
  | CartSummaryData;

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  type: MessageType;
  timestamp: Date;
  widgetData?: ChatWidgetData;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  tags: string[];
  stock: number;
  badge?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  name: string;
  email: string;
}
