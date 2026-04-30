import { ArrowRight, CheckCircle, Package, RotateCcw, ShoppingBag, Star, Truck } from 'lucide-react';
import {
  CartSummaryData,
  OrderTrackingData,
  Product,
  ProductRecommendationData,
  ReturnData,
} from '../types';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export const OrderTrackingWidget = ({ data }: { data: OrderTrackingData }) => {
  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-semibold text-gray-900">{data.orderId}</span>
        <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700">
          {data.status}
        </span>
      </div>

      <div className="relative mb-4 flex w-full items-center justify-between">
        <div className="absolute left-0 top-1/2 z-0 h-0.5 w-full -translate-y-1/2 bg-gray-200" />
        <div className="absolute left-0 top-1/2 z-0 h-0.5 w-2/3 -translate-y-1/2 bg-teal-700" />

        {[Package, Truck, CheckCircle].map((Icon, index) => (
          <div key={index} className="relative z-10 bg-white px-1">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full ${
                index < 2 ? 'bg-teal-700 text-white' : 'border-2 border-gray-300 text-gray-400'
              }`}
            >
              <Icon size={13} />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1 text-gray-600">
        <p>
          Carrier: <span className="font-medium text-gray-950">{data.carrier}</span>
        </p>
        <p>
          Estimated delivery:{' '}
          <span className="font-medium text-gray-950">{data.estimatedDelivery}</span>
        </p>
      </div>
    </div>
  );
};

export const ProductWidget = ({
  data,
  onAddToCart,
}: {
  data: ProductRecommendationData;
  onAddToCart: (product: Product) => void;
}) => {
  const { product } = data;

  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <img src={product.image} alt={product.name} className="h-32 w-full object-cover" />
      <div className="p-3">
        <h4 className="mb-1 text-sm font-semibold text-gray-950">{product.name}</h4>
        <p className="mb-2 text-xs leading-5 text-gray-600">{data.reason}</p>
        <div className="mb-3 flex items-center gap-1">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="text-xs text-gray-600">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-950">{formatCurrency(product.price)}</span>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="rounded-md bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-800"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export const ReturnWidget = ({ data }: { data: ReturnData }) => {
  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
        <RotateCcw size={16} className="text-teal-700" />
        Start a return
      </div>
      <p className="mb-3 text-xs text-gray-600">
        Select an eligible order to begin the automated return process.
      </p>

      <div className="space-y-2">
        {data.eligibleOrders.map((orderId) => (
          <button
            key={orderId}
            type="button"
            className="flex w-full items-center justify-between rounded-md border border-gray-200 p-2 text-left text-sm transition hover:border-teal-700 hover:bg-teal-50"
          >
            <div>
              <span className="block font-medium text-gray-950">{orderId}</span>
              <span className="block text-xs text-gray-500">Eligible for free return</span>
            </div>
            <ArrowRight size={14} className="text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
};

export const CartSummaryWidget = ({ data }: { data: CartSummaryData }) => {
  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
        <ShoppingBag size={16} className="text-teal-700" />
        Cart summary
      </div>
      <div className="space-y-2">
        {data.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              {item.name} x {item.quantity}
            </span>
            <span className="font-semibold text-gray-950">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
        <span className="font-semibold text-gray-700">{data.itemCount} items</span>
        <span className="text-base font-bold text-gray-950">{formatCurrency(data.subtotal)}</span>
      </div>
    </div>
  );
};
