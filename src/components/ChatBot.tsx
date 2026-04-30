import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, Loader2, MessageSquare, Send, Sparkles, User, X } from 'lucide-react';
import { ChatMessage, Product, UserProfile, CartItem } from '../types';
import { simulateAIResponse } from '../utils/mockAi';
import {
  CartSummaryWidget,
  OrderTrackingWidget,
  ProductWidget,
  ReturnWidget,
} from './ChatWidgets';

interface ChatBotProps {
  products: Product[];
  cartItems: CartItem[];
  user: UserProfile | null;
  onAddToCart: (product: Product) => void;
}

export const ChatBot = ({ products, cartItems, user, onAddToCart }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      type: 'text',
      content:
        "Hi! I'm your AI shopping assistant. Ask me about products, order tracking, returns, shipping, discounts, payments, or what to buy.",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (event?: FormEvent) => {
    event?.preventDefault();
    const cleanInput = inputValue.trim();
    if (!cleanInput || isTyping) {
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      type: 'text',
      content: cleanInput,
      timestamp: new Date(),
    };

    setMessages((current) => [...current, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const aiResponse = await simulateAIResponse(cleanInput, products, cartItems);

    setIsTyping(false);
    setMessages((current) => [...current, aiResponse]);
  };

  const handleSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const renderMessageContent = (msg: ChatMessage) => {
    return (
      <div className="flex flex-col">
        <span className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.content}</span>

        {msg.type === 'order_tracking' && msg.widgetData && 'estimatedDelivery' in msg.widgetData && (
          <OrderTrackingWidget data={msg.widgetData} />
        )}
        {msg.type === 'product_recommendation' && msg.widgetData && 'product' in msg.widgetData && (
          <ProductWidget data={msg.widgetData} onAddToCart={onAddToCart} />
        )}
        {msg.type === 'return_initiation' && msg.widgetData && 'eligibleOrders' in msg.widgetData && (
          <ReturnWidget data={msg.widgetData} />
        )}
        {msg.type === 'cart_summary' && msg.widgetData && 'subtotal' in msg.widgetData && (
          <CartSummaryWidget data={msg.widgetData} />
        )}
      </div>
    );
  };

  const suggestions = [
    'Track my order',
    'Recommend a gift under $100',
    'What is the return policy?',
    'Show my cart total',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
      {isOpen && (
        <div className="mb-4 flex h-[620px] max-h-[82vh] w-[calc(100vw-2rem)] max-w-[400px] origin-bottom-right flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl transition">
          <div className="flex items-center justify-between bg-gray-950 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/15 backdrop-blur-sm">
                  <Sparkles size={20} />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-gray-950 bg-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">SimGym AI Support</h3>
                <p className="text-xs text-gray-300">
                  {user ? `Helping ${user.name}` : 'Answers instantly'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-2 transition hover:bg-white/15"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
            <div className="my-2 text-center text-xs text-gray-400">Today</div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex max-w-[88%] gap-3 ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {msg.role !== 'system' && (
                  <div
                    className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md ${
                      msg.role === 'user'
                        ? 'bg-teal-50 text-teal-700'
                        : 'bg-gray-950 text-white'
                    }`}
                  >
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                )}

                <div
                  className={`${
                    msg.role === 'user'
                      ? 'rounded-2xl rounded-tr-sm bg-teal-700 px-4 py-2.5 text-white shadow-sm'
                      : msg.role === 'system'
                        ? 'mx-auto w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800'
                        : 'rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 text-gray-800 shadow-sm'
                  }`}
                >
                  {renderMessageContent(msg)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="mr-auto flex max-w-[88%] gap-3">
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-gray-950 text-white">
                  <Bot size={16} />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300" />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-300"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-300"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-100 bg-white p-3">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  className="whitespace-nowrap rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <form onSubmit={handleSend} className="relative mt-1 flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Ask me anything..."
                className="w-full rounded-md border border-gray-200 bg-gray-50 py-3 pl-4 pr-12 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 rounded-md bg-teal-700 p-2 text-white transition hover:bg-teal-800 disabled:opacity-50"
                aria-label="Send message"
              >
                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-teal-700 text-white shadow-xl transition hover:scale-105 hover:bg-teal-800 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Open chat"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
};
