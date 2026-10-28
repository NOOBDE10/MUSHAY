import React from 'react';
import { useShop } from '../context/ShopContext';
import { User, Package, MapPin, Heart, LogOut, ArrowRight, Truck } from 'lucide-react';

export const AccountView: React.FC = () => {
  const { currentUser, orders, wishlist, logout, navigateTo } = useShop();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-[#111111]/70">You are not logged in.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-2.5 bg-[#8B2E0B] text-white text-xs font-bold uppercase tracking-wider rounded-[20px]"
        >
          Return Home
        </button>
      </div>
    );
  }

  const userOrders = orders.filter(
    (o) =>
      o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      o.customerPhone === currentUser.phone
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8 text-[#111111]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#A0645A]/25 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#8B2E0B] font-bold">
            Customer Account Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#111111] tracking-wide">
            WELCOME, {currentUser.name.toUpperCase()}
          </h1>
          <p className="text-xs text-[#111111]/70 mt-1">
            Account Email: <strong className="text-[#111111]">{currentUser.email}</strong> • Member since{' '}
            {new Date(currentUser.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-white border border-[#A0645A]/30 hover:border-red-500 hover:text-red-600 text-[#111111] text-xs font-bold uppercase tracking-wider rounded-[14px] flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Account Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] p-6 space-y-2 shadow-sm">
          <Package className="w-5 h-5 text-[#8B2E0B]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]/70">Total Orders</h3>
          <p className="text-2xl font-mono font-bold text-[#111111]">{userOrders.length} Orders</p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] p-6 space-y-2 shadow-sm">
          <Heart className="w-5 h-5 text-[#8B2E0B]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]/70">Private Wishlist</h3>
          <p className="text-2xl font-mono font-bold text-[#111111]">{wishlist.length} Items</p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] p-6 space-y-2 shadow-sm">
          <MapPin className="w-5 h-5 text-[#8B2E0B]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]/70">Default City</h3>
          <p className="text-xl font-bold text-[#111111]">{currentUser.city || 'Pakistan'}</p>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[24px] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#A0645A]/20 pb-4">
          <h3 className="text-base font-serif-luxury font-bold text-[#111111] uppercase tracking-wider">
            Your Order History ({userOrders.length})
          </h3>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs text-[#8B2E0B] hover:underline font-bold"
          >
            Explore Catalog
          </button>
        </div>

        {userOrders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-sm text-[#111111]/70">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-2.5 bg-[#8B2E0B] text-white text-xs font-bold uppercase tracking-widest rounded-[22px] hover:bg-[#111111] transition-colors"
            >
              Shop Collection
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 bg-white border border-[#A0645A]/25 rounded-[20px] space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#A0645A]/20 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#8B2E0B]">{order.orderNumber}</span>
                    <span className="text-[#111111]/60 text-xs ml-3 font-medium">
                      {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase bg-[#8B2E0B]/10 text-[#8B2E0B] border border-[#8B2E0B]/30 rounded-full">
                      {order.status}
                    </span>
                    <span className="font-mono font-bold text-[#111111] text-xs">
                      PKR {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-[#A0645A]/15">
                  {order.items.map((it) => (
                    <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.product.images[0]}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-10 h-12 object-cover rounded-[10px] bg-[#ECE4D7] border border-[#A0645A]/20"
                        />
                        <span className="text-[#111111] font-bold">{it.product.name} ({it.size})</span>
                      </div>
                      <span className="text-[#111111]/70 font-medium">Qty: {it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => navigateTo('track-order')}
                    className="text-xs text-[#8B2E0B] hover:underline flex items-center gap-1 font-bold"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Live Delivery</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
