import { FormEvent, useMemo, useState } from 'react';
import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  UserRound,
  X,
} from 'lucide-react';
import { categories } from '../data/products';
import { Product, UserProfile } from '../types';

interface StorefrontProps {
  products: Product[];
  user: UserProfile | null;
  cartCount: number;
  wishlist: string[];
  onLogin: (profile: UserProfile) => void;
  onLogout: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const AuthModal = ({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: (profile: UserProfile) => void;
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanEmail = email.trim();
    const cleanName = name.trim() || cleanEmail.split('@')[0] || 'Shopper';

    if (!cleanEmail.includes('@') || password.trim().length < 6) {
      setError('Use a valid email and a password with at least 6 characters.');
      return;
    }

    onLogin({ name: cleanName, email: cleanEmail });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-gray-500">Save your cart and get faster support.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close login"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {mode === 'signup' && (
            <label className="block text-sm font-medium text-gray-700">
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2.5 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                placeholder="Your name"
              />
            </label>
          )}

          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2.5 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2.5 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="At least 6 characters"
            />
          </label>

          {error && <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800"
          >
            <LogIn size={18} />
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
            className="w-full text-sm font-medium text-teal-700 hover:text-teal-900"
          >
            {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const Storefront = ({
  products,
  user,
  cartCount,
  wishlist,
  onLogin,
  onLogout,
  onAddToCart,
  onToggleWishlist,
}: StorefrontProps) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAuth, setShowAuth] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const filteredProducts = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesQuery =
        !cleanQuery ||
        [product.name, product.category, product.description, ...product.tags]
          .join(' ')
          .toLowerCase()
          .includes(cleanQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, products, query]);

  const heroProduct = products[1];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-950">
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowMobileMenu((value) => !value)}
              className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-950 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="text-xl font-bold tracking-tight">
              SimGym<span className="text-teal-700">.</span>
            </div>
          </div>

          <div className="hidden items-center gap-7 text-sm font-medium text-gray-600 lg:flex">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`transition hover:text-teal-700 ${
                  activeCategory === category ? 'text-teal-700' : ''
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 sm:flex">
                <UserRound size={16} />
                {user.name}
              </div>
            ) : null}
            <button
              type="button"
              onClick={user ? onLogout : () => setShowAuth(true)}
              className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:flex"
            >
              {user ? <LogOut size={16} /> : <LogIn size={16} />}
              {user ? 'Logout' : 'Sign in'}
            </button>
            <button
              type="button"
              className="relative rounded-md p-2 text-gray-700 transition hover:bg-gray-100"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-700 px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setShowMobileMenu(false);
                  }}
                  className="rounded-md border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700"
                >
                  {category}
                </button>
              ))}
              <button
                type="button"
                onClick={user ? onLogout : () => setShowAuth(true)}
                className="rounded-md border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700"
              >
                {user ? 'Logout' : 'Sign in'}
              </button>
            </div>
          </div>
        )}
      </nav>

      <header className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-md bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
              <SlidersHorizontal size={16} />
              AI assisted shopping
            </div>
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Shop smarter with a store that helps back.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Browse curated essentials, save your favorites, ask the assistant for product advice,
              and test a complete login-to-cart shopping flow.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#products"
                className="inline-flex items-center justify-center rounded-md bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800"
              >
                Shop collection
              </a>
              <button
                type="button"
                onClick={() => setShowAuth(true)}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-5 py-3 font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                {user ? 'Switch account' : 'Login to save cart'}
              </button>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-lg bg-gray-100">
            <img
              className="h-full min-h-[360px] w-full object-cover"
              src={heroProduct.image}
              alt={heroProduct.name}
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-white/92 p-4 shadow-lg backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Featured</p>
                  <h2 className="mt-1 text-lg font-bold text-gray-950">{heroProduct.name}</h2>
                  <p className="mt-1 text-sm text-gray-600">{heroProduct.description}</p>
                </div>
                <p className="shrink-0 text-lg font-bold text-gray-950">
                  {formatCurrency(heroProduct.price)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="products" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Trending products</h2>
            <p className="mt-1 text-gray-600">Filter, search, favorite, and add products to cart.</p>
          </div>

          <label className="relative block w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white py-3 pl-10 pr-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="Search bags, gifts, home..."
            />
          </label>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap rounded-md border px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category
                  ? 'border-teal-700 bg-teal-700 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);

            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                  {product.badge && (
                    <span className="absolute left-3 top-3 rounded-md bg-white px-2 py-1 text-xs font-bold text-teal-700 shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product.id)}
                    className="absolute right-3 top-3 rounded-md bg-white p-2 text-gray-700 shadow-sm transition hover:text-rose-600"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={18} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-teal-700">{product.category}</p>
                      <h3 className="mt-1 text-lg font-bold text-gray-950">{product.name}</h3>
                    </div>
                    <p className="font-bold text-gray-950">{formatCurrency(product.price)}</p>
                  </div>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">{product.description}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 font-semibold text-gray-800">
                      <Star size={16} className="fill-amber-400 text-amber-400" />
                      {product.rating}
                      <span className="font-normal text-gray-500">({product.reviews})</span>
                    </span>
                    <span className="text-gray-500">{product.stock} in stock</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gray-950 px-4 py-3 font-semibold text-white transition hover:bg-teal-800"
                  >
                    <ShoppingBag size={18} />
                    Add to cart
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
            No products match your search yet.
          </div>
        )}
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={onLogin} />}
    </div>
  );
};
