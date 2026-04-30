import { useMemo, useState } from 'react';
import { ChatBot } from './components/ChatBot';
import { Storefront } from './components/Storefront';
import { products } from './data/products';
import { CartItem, Product, UserProfile } from './types';

const storedUserKey = 'nexus-user';

const getStoredUser = (): UserProfile | null => {
  try {
    const value = localStorage.getItem(storedUserKey);
    return value ? (JSON.parse(value) as UserProfile) : null;
  } catch {
    return null;
  }
};

function App() {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const cartCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems],
  );

  const handleLogin = (profile: UserProfile) => {
    localStorage.setItem(storedUserKey, JSON.stringify(profile));
    setUser(profile);
  };

  const handleLogout = () => {
    localStorage.removeItem(storedUserKey);
    setUser(null);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((item) => item !== productId)
        : [...current, productId],
    );
  };

  return (
    <div className="relative min-h-screen bg-white">
      <Storefront
        products={products}
        user={user}
        cartCount={cartCount}
        wishlist={wishlist}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
      />

      <ChatBot products={products} cartItems={cartItems} user={user} onAddToCart={handleAddToCart} />
    </div>
  );
}

export default App;
