import React, { useState, useMemo, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  Filter,
  SlidersHorizontal,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  X,
  Palette,
  Tag,
  Sparkles,
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const {
    products,
    navigateTo,
    categories,
    addCategory,
    deleteCategory,
    colors,
    addColor,
    deleteColor,
    resetColorsToDefault,
    selectedShopDepartment,
    setSelectedShopDepartment,
    selectedShopCategory,
    setSelectedShopCategory,
  } = useShop();

  // Filter States initialized from Context
  const [selectedGender, setSelectedGender] = useState<'all' | 'women' | 'men' | 'child'>(selectedShopDepartment || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedShopCategory || 'all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(75000);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'bestseller' | 'rating'>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter Manager Modal State (Add / Remove categories & colors)
  const [isFilterManagerOpen, setIsFilterManagerOpen] = useState(false);
  const [filterManagerTab, setFilterManagerTab] = useState<'colors' | 'categories'>('colors');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#8B2E0B');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryGender, setNewCategoryGender] = useState<'all' | 'women' | 'men' | 'child'>('all');
  const [managerToast, setManagerToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync when context changes
  useEffect(() => {
    if (selectedShopDepartment) {
      setSelectedGender(selectedShopDepartment);
    }
  }, [selectedShopDepartment]);

  useEffect(() => {
    if (selectedShopCategory) {
      setSelectedCategory(selectedShopCategory);
    }
  }, [selectedShopCategory]);

  // Available Filter Options
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3-4Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y', '30', '32', '34', '36', '38', '38R', '40R', '42R', '44R'];

  // Dynamic categories strictly reflecting active categories in system
  const allCategories = useMemo(() => {
    const list: string[] = ['all'];
    categories
      .filter((c) => c.isActive)
      .forEach((c) => {
        const name = c.name.trim();
        if (name.toLowerCase() !== 'all collections' && !list.includes(name)) {
          list.push(name);
        }
      });
    return list;
  }, [categories]);

  // Handlers for dynamic color management
  const handleAddNewColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorName.trim()) {
      setManagerToast({ type: 'error', message: 'Please enter a color name.' });
      return;
    }
    const res = addColor({ name: newColorName, hex: newColorHex });
    setManagerToast({ type: res.success ? 'success' : 'error', message: res.message });
    if (res.success) {
      setNewColorName('');
    }
    setTimeout(() => setManagerToast(null), 3000);
  };

  const handleDeleteColor = (name: string) => {
    deleteColor(name);
    setManagerToast({ type: 'success', message: `Color "${name}" removed.` });
    setSelectedColors((prev) => prev.filter((c) => c.toLowerCase() !== name.toLowerCase()));
    setTimeout(() => setManagerToast(null), 3000);
  };

  // Handlers for dynamic category management
  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setManagerToast({ type: 'error', message: 'Please enter a category name.' });
      return;
    }
    const id = `cat-${Date.now()}`;
    addCategory({
      id,
      name: trimmed,
      gender: newCategoryGender,
      imageUrl: '/src/assets/images/fashion_gold_blazer_1790533633560.jpg',
      itemCount: 0,
      description: `${trimmed} haute collection`,
      isActive: true,
    });
    setNewCategoryName('');
    setManagerToast({ type: 'success', message: `Category "${trimmed}" created.` });
    setTimeout(() => setManagerToast(null), 3000);
  };

  const handleDeleteCategory = (catName: string) => {
    const found = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
    if (found) {
      deleteCategory(found.id);
    }
    if (selectedCategory.toLowerCase() === catName.toLowerCase()) {
      setSelectedCategory('all');
    }
    setManagerToast({ type: 'success', message: `Category "${catName}" removed.` });
    setTimeout(() => setManagerToast(null), 3000);
  };

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Gender filter
      if (selectedGender !== 'all' && p.gender !== selectedGender && p.gender !== 'unisex') {
        return false;
      }
      // Category filter matching subcategory, category or name
      if (selectedCategory !== 'all') {
        const target = selectedCategory.toLowerCase();
        const productSub = (p.subcategory || '').toLowerCase();
        const productCat = (p.category || '').toLowerCase();
        const productName = (p.name || '').toLowerCase();
        
        const matches =
          productSub.includes(target) ||
          productCat.includes(target) ||
          productName.includes(target) ||
          (target.includes('jacket') && (productSub.includes('jacket') || productSub.includes('blazer') || productName.includes('jacket') || productName.includes('blazer'))) ||
          (target.includes('brazilian') && (productSub.includes('jacket') || productSub.includes('blazer') || productName.includes('blazer'))) ||
          (target.includes('dress') && (productSub.includes('dress') || productCat.includes('dress') || productName.includes('dress'))) ||
          (target.includes('top') && (productSub.includes('top') || productSub.includes('shirt') || productName.includes('shirt') || productName.includes('top')));

        if (!matches) return false;
      }
      // Price filter
      if (p.price > maxPrice) {
        return false;
      }
      // Size filter
      if (selectedSizes.length > 0) {
        const hasSize = p.sizes.some((s) => selectedSizes.includes(s));
        if (!hasSize) return false;
      }
      // Color filter
      if (selectedColors.length > 0) {
        const hasColor = p.colors.some((c) =>
          selectedColors.some((sc) => c.name.toLowerCase().includes(sc.toLowerCase()))
        );
        if (!hasColor) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      if (sortBy === 'rating') return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, selectedGender, selectedCategory, selectedSizes, selectedColors, maxPrice, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const resetFilters = () => {
    setSelectedGender('all');
    setSelectedCategory('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(75000);
    setSortBy('newest');
  };

  const activeFilterCount =
    (selectedGender !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (maxPrice < 75000 ? 1 : 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-[#F5EFE6] text-[#111111]">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#A0645A]/25 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#111111]/70 mb-1">
            <button onClick={() => navigateTo('home')} className="hover:text-[#8B2E0B]">
              Home
            </button>
            <span>/</span>
            <span className="text-[#8B2E0B] uppercase tracking-wider font-semibold">Shop All</span>
            {selectedGender !== 'all' && (
              <>
                <span>/</span>
                <span className="capitalize">{selectedGender}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#111111] tracking-wide">
            HAUTE COUTURE CATALOG
          </h1>
        </div>

        {/* Sorting & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] border border-[#A0645A]/35 text-xs font-bold uppercase tracking-wider text-[#111111] rounded-[20px] shadow-xs"
          >
            <Filter className="w-4 h-4 text-[#8B2E0B]" />
            <span>Filters ({activeFilterCount})</span>
          </button>

          <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#A0645A]/30 px-3.5 py-2 rounded-[20px] shadow-xs">
            <span className="text-xs text-[#111111]/70 uppercase tracking-wider hidden sm:inline font-semibold">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-[#8B2E0B] focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Additions</option>
              <option value="bestseller">Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Spacious, Editorial Typography, Refined luxury sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mt-8">
        {/* Left Filter Sidebar */}
        <div
          className={`${
            mobileFilterOpen ? 'block' : 'hidden'
          } lg:block lg:col-span-4 xl:col-span-3.5 space-y-7 bg-[#FAF7F2] p-6 sm:p-7 rounded-[22px] border border-[#A0645A]/30 shadow-sm`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#A0645A]/25">
            <h3 className="text-sm uppercase tracking-widest font-serif-luxury font-bold text-[#111111] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#8B2E0B]" />
              FILTERS
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFilterManagerOpen(true)}
                className="px-2.5 py-1 text-[11px] font-bold text-[#8B2E0B] hover:text-white bg-[#8B2E0B]/10 hover:bg-[#8B2E0B] border border-[#8B2E0B]/30 rounded-[12px] transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                title="Add or remove categories and colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add / Remove</span>
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#8B2E0B] hover:text-[#111111] underline flex items-center gap-1 font-bold cursor-pointer uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Gender / Department Filter */}
          <div className="space-y-3.5">
            <span className="text-xs uppercase tracking-widest text-[#111111] font-black block">
              Department
            </span>
            <div className="grid grid-cols-2 gap-2 p-2 bg-[#FAF7F2] border border-[#9A6652]/30 rounded-[18px]">
              {(['all', 'women', 'men', 'child'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`py-2.5 px-3 text-xs uppercase tracking-wider font-extrabold rounded-[14px] transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                    selectedGender === g
                      ? 'bg-[#8B2E0B] text-white shadow-md'
                      : 'bg-white text-[#111111] border border-[#9A6652]/20 hover:bg-[#8B2E0B] hover:text-white hover:border-[#8B2E0B]'
                  }`}
                >
                  {g === 'child' ? 'Child' : g}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter as Slideable / Tactile Buttons */}
          <div className="space-y-3.5">
            <span className="text-xs uppercase tracking-widest text-[#111111] font-black block">
              Sizes
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
              {allSizes.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`py-2.5 px-2 text-xs font-black uppercase rounded-[14px] border transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-[#8B2E0B] text-white border-[#8B2E0B] shadow-md'
                        : 'bg-[#FAF7F2] text-[#111111] border-[#9A6652]/30 hover:bg-[#8B2E0B] hover:text-white hover:border-[#8B2E0B]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Colors Filter */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#111111] font-black block">
                Colors ({colors.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  setFilterManagerTab('colors');
                  setIsFilterManagerOpen(true);
                }}
                className="text-[11px] font-bold text-[#8B2E0B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add / Manage</span>
              </button>
            </div>
            <div className="space-y-2">
              {colors.map((color) => {
                const isSelected = selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    onClick={() => toggleColor(color.name)}
                    className={`w-full flex items-center justify-between text-xs py-2.5 px-3.5 rounded-[14px] border font-bold transition-all duration-200 transform hover:translate-x-1.5 cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-[#8B2E0B] text-white border-[#8B2E0B] shadow-md'
                        : 'bg-[#FAF7F2] text-[#111111] border-[#9A6652]/25 hover:bg-[#8B2E0B] hover:text-white hover:border-[#8B2E0B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full border border-stone-400 shadow-xs shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-extrabold">{color.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-widest text-[#111111] font-black">Price Range</span>
              <span className="text-[#8B2E0B] font-mono tabular-nums font-black text-sm">
                PKR {maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={75000}
              step={2000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#8B2E0B] bg-stone-300 h-2.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#111111] font-mono font-bold">
              <span>PKR 5,000</span>
              <span>PKR 75,000+</span>
            </div>
          </div>

          {/* Dynamic Category Filter */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#111111] font-black block">
                Categories ({allCategories.length - 1})
              </span>
              <button
                type="button"
                onClick={() => {
                  setFilterManagerTab('categories');
                  setIsFilterManagerOpen(true);
                }}
                className="text-[11px] font-bold text-[#8B2E0B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add / Manage</span>
              </button>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {allCategories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left text-xs py-3 px-3.5 rounded-[14px] capitalize font-bold transition-all duration-200 transform hover:translate-x-2 cursor-pointer border flex items-center justify-between shadow-xs ${
                      isSelected
                        ? 'bg-[#8B2E0B] text-white border-[#8B2E0B] font-black shadow-md translate-x-1.5'
                        : 'bg-[#FAF7F2] text-[#111111] border-[#9A6652]/25 hover:bg-[#8B2E0B] hover:text-white hover:border-[#8B2E0B]'
                    }`}
                  >
                    <span className="font-extrabold">{cat === 'all' ? 'All Collections' : cat}</span>
                    <span className="text-xs font-mono font-black">→</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Grid Area: Larger Cards */}
        <div className="lg:col-span-8 xl:col-span-8.5">
          <div className="flex items-center justify-between text-xs text-[#111111] mb-6">
            <span>
              Showing <strong className="text-[#111111] font-black">{filteredProducts.length}</strong> haute couture items
            </span>
            {activeFilterCount > 0 && (
              <span className="text-[#8B2E0B] font-black">{activeFilterCount} active filters</span>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-[#FAF7F2] border border-[#9A6652]/30 rounded-[24px] p-8 shadow-sm">
              <p className="text-base text-[#111111] uppercase tracking-widest font-black">
                No couture items match your selected filters
              </p>
              <p className="text-xs text-[#111111]/80 max-w-sm mx-auto font-medium">
                Try widening your price range or clearing size and color criteria.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#8B2E0B] hover:bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-[22px] transition-colors shadow-sm cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Filter Customizer Modal (Add / Remove Categories & Colors) */}
      {isFilterManagerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            onClick={() => setIsFilterManagerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#FAF7F2] border border-[#A0645A]/30 rounded-[22px] shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200 text-[#111111]">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#A0645A]/20">
                <div>
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#8B2E0B]" />
                    <span>Manage Categories & Colors</span>
                  </h3>
                  <p className="text-xs text-[#55504A] mt-0.5">
                    Add new boutique lines and color swatches or remove existing ones.
                  </p>
                </div>
                <button
                  onClick={() => setIsFilterManagerOpen(false)}
                  className="p-1.5 text-stone-500 hover:text-black hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Toast Feedback */}
              {managerToast && (
                <div
                  className={`p-3 rounded-[12px] text-xs font-semibold flex items-center justify-between animate-in fade-in duration-150 ${
                    managerToast.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-red-50 text-red-800 border border-red-300'
                  }`}
                >
                  <span>{managerToast.message}</span>
                  <button onClick={() => setManagerToast(null)} className="text-stone-400 hover:text-black">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Tabs: Colors vs Categories */}
              <div className="grid grid-cols-2 p-1.5 bg-[#ECE4D7] rounded-[16px] border border-[#A0645A]/25">
                <button
                  type="button"
                  onClick={() => setFilterManagerTab('colors')}
                  className={`py-2 text-xs font-bold uppercase tracking-wider rounded-[12px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    filterManagerTab === 'colors'
                      ? 'bg-[#8B2E0B] text-white shadow-xs'
                      : 'text-[#55504A] hover:text-[#111111]'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Colors ({colors.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterManagerTab('categories')}
                  className={`py-2 text-xs font-bold uppercase tracking-wider rounded-[12px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    filterManagerTab === 'categories'
                      ? 'bg-[#8B2E0B] text-white shadow-xs'
                      : 'text-[#55504A] hover:text-[#111111]'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Categories ({allCategories.length - 1})</span>
                </button>
              </div>

              {/* TAB 1: COLORS MANAGER */}
              {filterManagerTab === 'colors' && (
                <div className="space-y-4">
                  {/* Quick Add Color Form */}
                  <form onSubmit={handleAddNewColor} className="p-3.5 bg-white border border-[#A0645A]/30 rounded-[16px] space-y-3 shadow-xs">
                    <span className="text-xs uppercase font-extrabold text-[#8B2E0B] tracking-wider block">
                      + Add New Color Swatch
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">Color Name *</label>
                        <input
                          type="text"
                          required
                          value={newColorName}
                          onChange={(e) => setNewColorName(e.target.value)}
                          placeholder="e.g. Royal Navy, Olive Green"
                          className="w-full bg-[#FAF7F2] border border-[#A0645A]/30 focus:border-[#8B2E0B] text-xs px-3 py-2 text-[#111111] rounded-[10px] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">Pick Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={newColorHex}
                            onChange={(e) => setNewColorHex(e.target.value)}
                            className="w-9 h-8 p-0 border border-stone-300 rounded-[8px] cursor-pointer bg-transparent"
                          />
                          <span className="text-[11px] font-mono text-stone-600 font-bold uppercase">{newColorHex}</span>
                        </div>
                      </div>
                      <div className="sm:col-span-3 flex items-end">
                        <button
                          type="submit"
                          className="w-full py-2 bg-[#8B2E0B] hover:bg-[#702407] text-white text-xs font-bold uppercase tracking-wider rounded-[10px] shadow-xs transition-transform active:scale-95 cursor-pointer"
                        >
                          + Add Color
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Current Colors List with Delete */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">Current Store Colors</span>
                      <button
                        type="button"
                        onClick={resetColorsToDefault}
                        className="text-[11px] text-stone-500 hover:text-[#8B2E0B] underline font-semibold cursor-pointer"
                      >
                        Reset Defaults
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {colors.map((c) => (
                        <div
                          key={c.name}
                          className="flex items-center justify-between p-2.5 bg-white border border-[#A0645A]/25 rounded-[12px] shadow-xs hover:border-[#8B2E0B]/40 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-4 h-4 rounded-full border border-stone-300 shadow-xs shrink-0"
                              style={{ backgroundColor: c.hex }}
                            />
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-[#111111] truncate block">{c.name}</span>
                              <span className="text-[10px] text-stone-500 font-mono block">{c.hex}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteColor(c.name)}
                            className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-[8px] transition-colors cursor-pointer shrink-0 ml-1"
                            title={`Delete ${c.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CATEGORIES MANAGER */}
              {filterManagerTab === 'categories' && (
                <div className="space-y-4">
                  {/* Quick Add Category Form */}
                  <form onSubmit={handleAddNewCategory} className="p-3.5 bg-white border border-[#A0645A]/30 rounded-[16px] space-y-3 shadow-xs">
                    <span className="text-xs uppercase font-extrabold text-[#8B2E0B] tracking-wider block">
                      + Add New Category Line
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">Category Name *</label>
                        <input
                          type="text"
                          required
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="e.g. Velvet Shawls, Festive Kurtis"
                          className="w-full bg-[#FAF7F2] border border-[#A0645A]/30 focus:border-[#8B2E0B] text-xs px-3 py-2 text-[#111111] rounded-[10px] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">Department</label>
                        <select
                          value={newCategoryGender}
                          onChange={(e) => setNewCategoryGender(e.target.value as any)}
                          className="w-full bg-[#FAF7F2] border border-[#A0645A]/30 focus:border-[#8B2E0B] text-xs px-2.5 py-2 text-[#111111] rounded-[10px] focus:outline-none cursor-pointer"
                        >
                          <option value="all">All</option>
                          <option value="women">Women</option>
                          <option value="men">Men</option>
                          <option value="child">Children</option>
                        </select>
                      </div>
                      <div className="sm:col-span-3 flex items-end">
                        <button
                          type="submit"
                          className="w-full py-2 bg-[#8B2E0B] hover:bg-[#702407] text-white text-xs font-bold uppercase tracking-wider rounded-[10px] shadow-xs transition-transform active:scale-95 cursor-pointer"
                        >
                          + Add Line
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Current Categories List with Delete */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">
                      Active Boutique Categories
                    </span>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {allCategories.filter((cat) => cat !== 'all').map((catName) => {
                        const catObj = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
                        return (
                          <div
                            key={catName}
                            className="flex items-center justify-between p-2.5 bg-white border border-[#A0645A]/25 rounded-[12px] shadow-xs hover:border-[#8B2E0B]/40 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#111111]">{catName}</span>
                              {catObj && (
                                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-[#ECE4D7] text-[#8B2E0B]">
                                  {catObj.gender}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(catName)}
                              className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-[8px] transition-colors cursor-pointer"
                              title={`Delete ${catName}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-[#A0645A]/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsFilterManagerOpen(false)}
                  className="px-5 py-2 bg-[#8B2E0B] hover:bg-[#702407] text-white font-bold text-xs uppercase tracking-wider rounded-[14px] shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
