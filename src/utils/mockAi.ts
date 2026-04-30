import { CartItem, ChatMessage, Product, ProductRecommendationData } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 9);

const includesAny = (text: string, terms: string[]) => terms.some((term) => text.includes(term));

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const pickProduct = (userText: string, products: Product[]) => {
  const lowerText = userText.toLowerCase();
  const exact = products.find((product) =>
    [product.name, product.category, ...product.tags].some((value) => lowerText.includes(value.toLowerCase())),
  );

  if (exact) {
    return exact;
  }

  if (includesAny(lowerText, ['cheap', 'budget', 'affordable', 'under 50'])) {
    return [...products].sort((a, b) => a.price - b.price)[0];
  }

  if (includesAny(lowerText, ['best', 'top', 'popular', 'rating'])) {
    return [...products].sort((a, b) => b.rating - a.rating)[0];
  }

  return products.find((product) => product.stock > 0) ?? products[0];
};

const createTextMessage = (content: string): ChatMessage => ({
  id: generateId(),
  role: 'ai',
  type: 'text',
  content,
  timestamp: new Date(),
});

export const simulateAIResponse = async (
  userText: string,
  products: Product[],
  cartItems: CartItem[] = [],
): Promise<ChatMessage> => {
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 600));

  const lowerText = userText.toLowerCase().trim();
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (includesAny(lowerText, ['hello', 'hi', 'hey', 'good morning', 'good evening'])) {
    return createTextMessage(
      'Hi! I can help with product picks, orders, returns, shipping, payments, sizing, discounts, and cart questions. Tell me what you are shopping for.',
    );
  }

  if (includesAny(lowerText, ['order', 'track', 'tracking', 'status', 'delivery update'])) {
    return {
      id: generateId(),
      role: 'ai',
      type: 'order_tracking',
      content: 'I found your latest order. It has left the fulfillment center and is moving on schedule.',
      timestamp: new Date(),
      widgetData: {
        orderId: 'ORD-84729',
        status: 'shipped',
        items: ['Minimalist Chronograph Watch', 'Everyday Canvas Backpack'],
        estimatedDelivery: 'Tomorrow by 8:00 PM',
        carrier: 'Nexus Express',
      },
    };
  }

  if (includesAny(lowerText, ['return', 'refund', 'exchange', 'policy', 'replace'])) {
    return {
      id: generateId(),
      role: 'ai',
      type: 'return_initiation',
      content:
        'You can return unused items within 30 days. Exchanges are free, and refunds go back to the original payment method after inspection.',
      timestamp: new Date(),
      widgetData: {
        eligibleOrders: ['ORD-84729', 'ORD-84318'],
      },
    };
  }

  if (includesAny(lowerText, ['cart', 'bag', 'checkout', 'total', 'basket'])) {
    if (cartItems.length === 0) {
      return createTextMessage(
        'Your cart is empty right now. I can recommend something based on budget, category, or style.',
      );
    }

    return {
      id: generateId(),
      role: 'ai',
      type: 'cart_summary',
      content: `You have ${cartItems.length} item${cartItems.length === 1 ? '' : 's'} in your cart. Your estimated subtotal is ${formatCurrency(cartTotal)} before taxes.`,
      timestamp: new Date(),
      widgetData: {
        itemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
        subtotal: cartTotal,
        items: cartItems,
      },
    };
  }

  if (includesAny(lowerText, ['recommend', 'suggest', 'looking for', 'find', 'want', 'need', 'gift', 'buy'])) {
    const product = pickProduct(lowerText, products);
    const data: ProductRecommendationData = {
      product,
      reason: `${product.rating}/5 rating, ${product.stock > 0 ? 'available now' : 'limited availability'}, and a strong match for ${product.tags.slice(0, 2).join(' + ')}.`,
    };

    return {
      id: generateId(),
      role: 'ai',
      type: 'product_recommendation',
      content: `A good match is the ${product.name}. ${product.description}`,
      timestamp: new Date(),
      widgetData: data,
    };
  }

  if (includesAny(lowerText, ['shipping', 'ship', 'arrive', 'fast', 'same day'])) {
    return createTextMessage(
      'Standard shipping is free above $75 and usually arrives in 3-5 business days. Express shipping is available at checkout and arrives in 1-2 business days.',
    );
  }

  if (includesAny(lowerText, ['payment', 'pay', 'card', 'upi', 'cash', 'cod'])) {
    return createTextMessage(
      'We support major cards, wallets, and pay-later options. Cash on delivery is not enabled in this demo, but the checkout flow is ready to connect to a payment gateway.',
    );
  }

  if (includesAny(lowerText, ['discount', 'coupon', 'offer', 'sale', 'promo'])) {
    return createTextMessage(
      'Try code WELCOME10 for 10% off your first order. The app also highlights sale badges on products when a promotion is active.',
    );
  }

  if (includesAny(lowerText, ['login', 'sign in', 'signup', 'account', 'profile'])) {
    return createTextMessage(
      'Use the Sign in button in the top-right corner. This demo saves the session locally, so you can test signup, login, logout, and account-aware shopping without a backend.',
    );
  }

  if (includesAny(lowerText, ['human', 'agent', 'manager', 'support person', 'angry'])) {
    return {
      id: generateId(),
      role: 'system',
      type: 'text',
      content: 'A human support agent has been requested. Current estimated wait time is 2 minutes.',
      timestamp: new Date(),
    };
  }

  const product = pickProduct(lowerText, products);
  return createTextMessage(
    `I can help with that. For this store, the closest useful match I see is ${product.name} at ${formatCurrency(product.price)}. You can also ask me about shipping, returns, payment, discounts, order tracking, or what to buy for a specific need.`,
  );
};
