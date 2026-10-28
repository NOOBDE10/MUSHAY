import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { products, navigateTo } = useShop();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory?.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query, products]);

  if (!isOpen) return null;

  const handleSelectProduct = (productId: string) => {
    onClose();
    navigateTo('product-detail', productId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative min-h-screen flex items-start justify-center p-4 pt-20">
        <div className="relative w-full max-w-2xl bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] shadow-2xl p-6 md:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#111111]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-500 hover:text-[#111111] p-1.5 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Search Input */}
          <div className="relative flex items-center border-b border-[#A0645A]/25 pb-4 mb-6">
            <Search className="w-5 h-5 text-[#8B2E0B] mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search silk dresses, blazers, tuxedos, Brazilian jackets, kurtas..."
              autoFocus
              className="w-full bg-transparent text-base md:text-lg text-[#111111] placeholder:text-stone-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-stone-400 hover:text-[#8B2E0B] text-xs uppercase tracking-wider font-mono mr-2 cursor-pointer font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Suggestions when empty */}
          {!query && (
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#8B2E0B] font-bold block">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {['Brazilian Jackets', 'Silk Dresses', 'Blazers', 'Tuxedos', 'Kurtas', 'Tops & T-Shirts'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-1.5 text-xs bg-white border border-[#A0645A]/30 hover:border-[#8B2E0B] hover:bg-[#8B2E0B] hover:text-white text-[#111111] rounded-[16px] transition-colors cursor-pointer font-medium shadow-xs"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Results */}
          {query && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <p className="text-xs uppercase tracking-widest text-[#111111]/70 font-semibold">
                Found {searchResults.length} matching pieces
              </p>

              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-stone-500 space-y-2">
                  <p className="text-sm font-semibold">No garments found for "{query}"</p>
                  <p className="text-xs">Try searching for "jacket", "blazer", "silk", or "dress"</p>
                </div>
              ) : (
                searchResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p.id)}
                    className="flex items-center gap-4 p-3 rounded-[16px] hover:bg-white border border-transparent hover:border-[#A0645A]/30 transition-all cursor-pointer group shadow-xs"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-14 object-cover object-center rounded-[10px] bg-[#ECE4D7] border border-[#A0645A]/20 shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider group-hover:text-[#8B2E0B] transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-[#111111]/70">
                        {p.category} • {p.colors[0]?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#8B2E0B] tabular-nums">
                        PKR {p.price.toLocaleString()}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#8B2E0B] group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
