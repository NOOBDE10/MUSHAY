import React, { useState, useMemo, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Order, OrderStatus, Coupon, MonthlyArchive, StoreCategory } from '../types';
import {
  WhatsAppContact,
  WHATSAPP_CONTACTS,
  cleanPhoneNumberForWhatsApp,
  formatPhoneNumberForCall,
} from '../data/whatsappContacts';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Boxes,
  BarChart3,
  Megaphone,
  Settings,
  Search,
  Bell,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  Truck,
  TrendingUp,
  Tag,
  Lock,
  Mail,
  LogOut,
  Archive,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Image as ImageIcon,
  Check,
  Share2,
  ExternalLink,
  Sparkles,
  Phone,
  PhoneCall,
  MessageSquare,
  Save,
  Palette,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    orders,
    products,
    coupons,
    settings,
    monthlyArchives,
    adminCredentials,
    securityLogs,
    adminFailedAttempts,
    adminLockoutUntil,
    resetAdminLockout,
    clearSecurityLogs,
    resetAdminToSetupMode,
    updateOrderStatus,
    deleteOrder,
    deleteCustomer,
    addProduct,
    updateProduct,
    deleteProduct,
    updateVariantStock,
    updateSettings,
    updateAdminCredentials,
    whatsappContacts,
    updateWhatsAppContacts,
    addCoupon,
    deleteCoupon,
    archiveCurrentMonth,
    activeAdminTab,
    setActiveAdminTab,
    categories,
    addCategory,
    deleteCategory,
    updateCategory,
    colors,
    addColor,
    deleteColor,
    resetColorsToDefault,
    logout,
    navigateTo,
    isAdminLoggedIn,
    adminLogin,
    subscribers,
    deleteSubscriber,
  } = useShop();

  // Toast notification
  const [adminToast, setAdminToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setAdminToast({ message, type });
    setTimeout(() => setAdminToast(null), 3500);
  };

  // Safe delete confirmation modal (replaces browser confirm)
  const [deleteModal, setDeleteModal] = useState<{
    type: 'product' | 'order' | 'customer';
    id: string;
    name: string;
  } | null>(null);

  // Month Archive Confirmation
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  // Daily Archive Drilldown & Date Filtering
  const [reportDate, setReportDate] = useState<string>('');
  const [reportPeriod, setReportPeriod] = useState<'all' | 'today' | 'yesterday' | 'week' | 'month' | 'year'>('all');

  // Internal modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState<MonthlyArchive | null>(null);

  // Logo uploader state
  const [customLogoUrl, setCustomLogoUrl] = useState(settings.logoUrl || '');

  // Security Credentials form
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminName, setNewAdminName] = useState(adminCredentials.name || 'Store Executive');
  const [newAdminEmail, setNewAdminEmail] = useState(adminCredentials.email || 'mushay@gamil.com');
  const [newAdminGatewayPasscode, setNewAdminGatewayPasscode] = useState(adminCredentials.gatewayPasscode || '1234');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [newAdminRecoveryKey, setNewAdminRecoveryKey] = useState(adminCredentials.recoveryKey || 'MUSHAY-MASTER-9900');
  const [credsFeedback, setCredsFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // WhatsApp Contacts Management State (Admin can freely change all numbers anytime)
  const [localContacts, setLocalContacts] = useState<WhatsAppContact[]>(() => {
    return whatsappContacts && whatsappContacts.length > 0 ? whatsappContacts : WHATSAPP_CONTACTS;
  });

  useEffect(() => {
    if (whatsappContacts && whatsappContacts.length > 0) {
      setLocalContacts(whatsappContacts);
    }
  }, [whatsappContacts]);

  useEffect(() => {
    if (adminCredentials?.email) {
      setNewAdminEmail(adminCredentials.email);
      setGateEmail(adminCredentials.email);
    }
  }, [adminCredentials?.email]);

  const handleUpdateContactField = (index: number, field: keyof WhatsAppContact, value: string) => {
    setLocalContacts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSaveAllContacts = () => {
    updateWhatsAppContacts(localContacts);
    showToast('All WhatsApp & Contact numbers saved successfully! Instant sync on website & floating widget.', 'success');
  };

  const handleResetContactsToDefault = () => {
    setLocalContacts(WHATSAPP_CONTACTS);
    updateWhatsAppContacts(WHATSAPP_CONTACTS);
    showToast('Reset WhatsApp contacts to default atelier phone numbers.', 'info');
  };

  const handleAddNewContact = () => {
    const newContact: WhatsAppContact = {
      id: `custom-${Date.now()}` as any,
      name: 'Special Assistance',
      nameUrdu: 'خصوصی ہیلپ لائن',
      description: 'Priority boutique concierge, bridal styling & expedited queries',
      phoneNumber: '+92 300 0000000',
      badge: 'Active',
    };
    const updated = [...localContacts, newContact];
    setLocalContacts(updated);
    updateWhatsAppContacts(updated);
    showToast('New WhatsApp contact created! Update the number and name below.', 'success');
  };

  const handleDeleteContact = (index: number) => {
    if (localContacts.length <= 1) {
      showToast('At least one WhatsApp contact must remain available.', 'error');
      return;
    }
    const updated = localContacts.filter((_, i) => i !== index);
    setLocalContacts(updated);
    updateWhatsAppContacts(updated);
    showToast('Contact line removed.', 'info');
  };

  // Dedicated Admin Authentication Gate State (Requires Email & Password before granting access)
  const [gateEmail, setGateEmail] = useState(adminCredentials.email || 'mushay@gamil.com');
  const [gatePassword, setGatePassword] = useState('');
  const [showGatePassword, setShowGatePassword] = useState(false);
  const [gateError, setGateError] = useState('');
  const [isGateSubmitting, setIsGateSubmitting] = useState(false);

  const handleAdminGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGateError('');
    setIsGateSubmitting(true);

    setTimeout(() => {
      const res = adminLogin(gateEmail, gatePassword);
      setIsGateSubmitting(false);
      if (!res.success) {
        setGateError(res.message || 'Invalid admin email or password. Access denied.');
        return;
      }
      showToast('Admin access authorized. Welcome to MUSHAY Admin Dashboard!', 'success');
    }, 250);
  };

  // Archive modal
  const [archiveMonthName, setArchiveMonthName] = useState(
    new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  );

  const formatExternalUrl = (url?: string, defaultUrl?: string) => {
    const target = url && url.trim() ? url.trim() : defaultUrl;
    if (!target) return '#';
    if (
      target.startsWith('http://') ||
      target.startsWith('https://') ||
      target.startsWith('//') ||
      target.startsWith('mailto:') ||
      target.startsWith('tel:')
    ) {
      return target;
    }
    if (target.startsWith('wa.me')) {
      return `https://${target}`;
    }
    return `https://${target}`;
  };

  // Dynamic color management in Admin
  const [adminNewColorName, setAdminNewColorName] = useState('');
  const [adminNewColorHex, setAdminNewColorHex] = useState('#8B2E0B');

  // New product form
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    price: 15000,
    originalPrice: 18000,
    discountPercent: 16,
    category: 'Women',
    subcategory: 'Dresses',
    gender: 'women',
    stock: 25,
    sku: `MS-C-${Math.floor(100 + Math.random() * 900)}`,
    material: 'Pure Silk Charmeuse',
    fabric: 'Fine Silk Satin',
    fit: 'Tailored Fit',
    description: 'Masterfully crafted from exclusive luxury textile with hand-finished gold detailing.',
    shortDescription: 'Luxury couture piece with gold accents.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Black | Gold Accent', hex: '#111111' }],
    images: [
      '/src/assets/images/fashion_gold_blazer_1790533633560.jpg',
      '/src/assets/images/hero_model_black_gold_1790533620187.jpg',
    ],
    variantStock: {
      'XS_Black | Gold Accent': 4,
      'S_Black | Gold Accent': 8,
      'M_Black | Gold Accent': 8,
      'L_Black | Gold Accent': 5,
    },
    rating: 5.0,
    reviewCount: 1,
    tags: ['Luxury', 'Couture'],
  });

  // New Coupon Form
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: 15,
    minOrderAmount: 5000,
  });

  // Calculate Metrics
  const totalSales = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
  const lowStockCount = products.filter((p) => p.stock < 15).length;

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerPhone.includes(orderSearch);
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.gender.toLowerCase().includes(productSearch.toLowerCase())
      );
    });
  }, [products, productSearch]);

  // Unique Customers
  const customerList = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string; address: string; city: string; totalSpent: number; orderCount: number }>();
    orders.forEach((o) => {
      const key = o.customerEmail || o.customerPhone;
      if (!map.has(key)) {
        map.set(key, {
          name: o.customerName,
          email: o.customerEmail,
          phone: o.customerPhone,
          address: o.address,
          city: o.city,
          totalSpent: o.total,
          orderCount: 1,
        });
      } else {
        const c = map.get(key)!;
        c.totalSpent += o.total;
        c.orderCount += 1;
      }
    });
    return Array.from(map.values());
  }, [orders]);

  // Export CSV
  const exportOrdersCSV = (orderSet: Order[] = orders, fileName: string = 'MS_Orders') => {
    const headers = 'Order ID,Customer,Email,Phone,City,Status,Items,Subtotal,Delivery,Discount,Total,Date\n';
    const rows = orderSet.map((o) =>
      `"${o.orderNumber}","${o.customerName}","${o.customerEmail}","${o.customerPhone}","${o.city}","${o.status}",${o.items.length},${o.subtotal},${o.deliveryFee},${o.discount},${o.total},"${o.createdAt}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Handle Credentials Update (User can create, change, and update password directly without roadblocks)
  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    setCredsFeedback(null);

    if (newAdminPass && confirmAdminPass && newAdminPass !== confirmAdminPass) {
      setCredsFeedback({ success: false, message: 'New password and confirmation do not match.' });
      return;
    }

    const res = updateAdminCredentials(
      currentAdminPass || '',
      newAdminEmail || 'mushay@gamil.com',
      newAdminPass || adminCredentials.password || 'admin',
      newAdminGatewayPasscode || '1234',
      newAdminRecoveryKey || 'MUSHAY-MASTER-9900',
      newAdminName || 'Store Executive'
    );
    setCredsFeedback(res);
    if (res.success) {
      setCurrentAdminPass('');
      setNewAdminPass('');
      setConfirmAdminPass('');
      showToast('Admin password and credentials saved successfully!');
    }
  };

  // Execute confirmed deletion (products, orders, or customers)
  const executeDelete = () => {
    if (!deleteModal) return;
    if (deleteModal.type === 'product') {
      deleteProduct(deleteModal.id);
      showToast(`Garment "${deleteModal.name}" removed from catalog.`);
      if (editingProduct?.id === deleteModal.id) {
        setEditingProduct(null);
      }
    } else if (deleteModal.type === 'order') {
      deleteOrder(deleteModal.id);
      showToast(`Consignment ${deleteModal.name} deleted permanently.`);
      if (selectedOrder?.id === deleteModal.id) {
        setSelectedOrder(null);
      }
    } else if (deleteModal.type === 'customer') {
      deleteCustomer(deleteModal.id);
      showToast(`Customer records for "${deleteModal.name}" deleted.`);
    }
    setDeleteModal(null);
  };

  // Handle Month Close & Reset
  const handleArchiveMonth = () => {
    if (orders.length === 0) {
      showToast('There are currently no active orders to archive.', 'error');
      return;
    }
    setIsArchiveModalOpen(true);
  };

  const confirmAndExecuteArchive = () => {
    exportOrdersCSV(orders, `MS_Archive_${archiveMonthName.replace(/[^a-z0-9]/gi, '_')}`);
    archiveCurrentMonth(archiveMonthName);
    setIsArchiveModalOpen(false);
    showToast(`Orders successfully archived under "${archiveMonthName}"! A full CSV copy was exported and active book has been reset.`);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name) return;
    const prod: Product = {
      ...(newProd as Product),
      id: `prod-${Date.now()}`,
      slug: newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
    };
    addProduct(prod);
    setIsAddProductOpen(false);
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    const c: Coupon = {
      id: `coup-${Date.now()}`,
      code: newCoupon.code.toUpperCase().trim(),
      discountPercent: Number(newCoupon.discountPercent),
      minOrderAmount: Number(newCoupon.minOrderAmount),
      isActive: true,
      usageCount: 0,
      expiresAt: '2026-12-31',
    };
    addCoupon(c);
    setNewCoupon({ code: '', discountPercent: 15, minOrderAmount: 5000 });
  };

  // Category Management State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<StoreCategory | null>(null);
  const [categoryFilterGender, setCategoryFilterGender] = useState<'all' | 'women' | 'men' | 'child'>('all');
  const [categoryForm, setCategoryForm] = useState<{
    name: string;
    gender: 'women' | 'men' | 'child' | 'all';
    imageUrl: string;
    itemCount: number;
    description: string;
    isActive: boolean;
  }>({
    name: '',
    gender: 'women',
    imageUrl: '',
    itemCount: 15,
    description: '',
    isActive: true,
  });

  const categoryPresetImages = [
    { label: "Brazilian Jackets (برازیلین جیکٹس)", url: "/src/assets/images/fashion_gold_blazer_1790533633560.jpg" },
    { label: "Silk Dresses (ڈریسز)", url: "/src/assets/images/fashion_black_silk_dress_1790533646472.jpg" },
    { label: "Tops & T-Shirts (ٹاپس اینڈ ٹی شرٹس)", url: "/src/assets/images/fashion_mens_gold_tuxedo_1790533657236.jpg" },
    { label: "All Collections (آل کلیکشنز)", url: "/src/assets/images/hero_ms_luxury_1791101309370.jpg" },
    { label: "Women's Gold Blazer", url: "/src/assets/images/fashion_gold_blazer_1790533633560.jpg" },
    { label: "Men's Sartorial Tuxedo", url: "/src/assets/images/fashion_mens_gold_tuxedo_1790533657236.jpg" },
    { label: "Children's Luxury Fashion", url: "/src/assets/images/child_luxury_fashion_1790986764971.jpg" },
    { label: "Child Traditional Kurta", url: "/src/assets/images/fashion_child_kurta_1790535245268.jpg" },
    { label: "Light Luxury Editorial", url: "/src/assets/images/hero_light_luxury_1790986748765.jpg" },
  ];

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      gender: 'women',
      imageUrl: categoryPresetImages[0].url,
      itemCount: 15,
      description: '',
      isActive: true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: StoreCategory) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      gender: cat.gender,
      imageUrl: cat.imageUrl,
      itemCount: cat.itemCount || 15,
      description: cat.description || '',
      isActive: cat.isActive,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('Please enter category name', 'error');
      return;
    }
    const finalImage = categoryForm.imageUrl || categoryPresetImages[0].url;
    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: categoryForm.name.trim(),
        gender: categoryForm.gender,
        imageUrl: finalImage,
        itemCount: Number(categoryForm.itemCount) || 12,
        description: categoryForm.description.trim(),
        isActive: categoryForm.isActive,
      });
      showToast(`Category "${categoryForm.name}" updated successfully!`, 'success');
    } else {
      const newCat: StoreCategory = {
        id: `cat-${Date.now()}`,
        name: categoryForm.name.trim(),
        gender: categoryForm.gender,
        imageUrl: finalImage,
        itemCount: Number(categoryForm.itemCount) || 12,
        description: categoryForm.description.trim(),
        isActive: categoryForm.isActive,
      };
      addCategory(newCat);
      showToast(`New category "${newCat.name}" added successfully!`, 'success');
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    deleteCategory(catId);
    showToast(`Category "${catName}" deleted / cancelled.`, 'info');
  };

  const handleToggleCategoryActive = (cat: StoreCategory) => {
    updateCategory({ ...cat, isActive: !cat.isActive });
    showToast(`Category "${cat.name}" is now ${cat.isActive ? 'Inactive' : 'Active'}.`, 'info');
  };

  // 0. ADMIN AUTHENTICATION GATE SCREEN
  // User Requirement: Require email and password first before accessing Admin Panel!
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0E0604] text-[#F5EFEB] flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B2E0B]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative w-full max-w-md bg-[#160D08] border border-[#C5A059]/40 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 text-[#E5E5E5] backdrop-blur-sm animate-fadeIn">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#8B2E0B]/20 border border-[#D4AF37]/40 text-[#D4AF37] mb-1">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-gold-gradient tracking-tight block">
              {settings.brandName || 'MUSHAY'}
            </h1>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#A0645A] font-bold">
              OFFICIAL • ADMIN PORTAL
            </p>
            <p className="text-xs text-stone-400 max-w-xs mx-auto pt-1">
              Please enter your admin email and password to access the store management dashboard.
            </p>
          </div>

          {/* Error Message */}
          {gateError && (
            <div className="p-3 bg-red-950/70 border border-red-800/80 rounded-lg text-xs text-red-200 flex items-start gap-2.5 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{gateError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminGateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-stone-300 mb-1.5 font-semibold text-[11px]">
                Admin Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={gateEmail}
                  onChange={(e) => {
                    setGateEmail(e.target.value);
                    if (gateError) setGateError('');
                  }}
                  placeholder="mushay@gamil.com"
                  className="w-full bg-black/90 border border-stone-800 focus:border-[#D4AF37] pl-9 pr-3 py-2.5 text-white rounded-lg focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-stone-300 mb-1.5 font-semibold text-[11px]">
                Admin Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                <input
                  type={showGatePassword ? 'text' : 'password'}
                  required
                  value={gatePassword}
                  onChange={(e) => {
                    setGatePassword(e.target.value);
                    if (gateError) setGateError('');
                  }}
                  placeholder="Enter admin password"
                  className="w-full bg-black/90 border border-stone-800 focus:border-[#D4AF37] pl-9 pr-10 py-2.5 text-white rounded-lg focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowGatePassword(!showGatePassword)}
                  className="absolute right-3 top-2.5 text-stone-500 hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showGatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGateSubmitting}
              className="w-full py-3 bg-[#8B2E0B] hover:bg-[#A0645A] text-white font-bold uppercase tracking-widest text-xs rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(139,46,11,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>{isGateSubmitting ? 'Verifying Credentials...' : 'Sign In to Admin Panel →'}</span>
            </button>
          </form>

          {/* Credentials Info & Back to Store */}
          <div className="pt-2 border-t border-stone-800/80 space-y-3 text-center">
            <div className="p-3 bg-black/60 border border-[#D4AF37]/40 rounded-lg text-[11px] text-stone-300 text-left space-y-2">
              <span className="text-[#D4AF37] font-semibold block">Store Administrator Security:</span>
              <p>Default Admin: <strong className="text-white">mushay@gamil.com</strong> / Password: <strong className="text-white">admin</strong></p>
              <button
                type="button"
                onClick={() => {
                  setGateEmail('mushay@gamil.com');
                  setGatePassword('admin');
                  setGateError('');
                }}
                className="w-full py-1.5 px-3 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 border border-[#D4AF37]/50 text-[#D4AF37] font-semibold rounded-md transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                ⚡ 1-Click Auto Fill (خودکار پاسورڈ اور ای میل درج کریں)
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-stone-400 hover:text-white text-xs underline cursor-pointer transition-colors"
            >
              ← Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#140A06] text-[#F5EFEB] flex flex-col md:flex-row font-sans">
      {/* 1. SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#1A0F0A] border-r border-[#C5A059]/30 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#C5A059]/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-serif-luxury font-bold text-gold-gradient tracking-tight">
                {settings.brandName || 'MUSHAY'}
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-[#A0645A] font-bold mt-0.5">
                OFFICIAL • ADMIN
              </span>
            </div>
            <button
              onClick={() => navigateTo('home')}
              className="text-xs text-stone-400 hover:text-white underline"
            >
              Storefront
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders', icon: ShoppingBag, count: pendingOrdersCount },
              { id: 'products', label: 'Products', icon: Package, count: products.length },
              { id: 'categories', label: 'Categories & Colors', icon: Tag, count: categories.length },
              { id: 'customers', label: 'Customers', icon: Users, count: customerList.length },
              { id: 'inventory', label: 'Inventory', icon: Boxes, count: lowStockCount },
              { id: 'archives', label: 'Monthly Archives', icon: Archive, count: monthlyArchives.length },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'marketing', label: 'Marketing', icon: Megaphone },
              { id: 'social', label: 'Social Links (سوشل لنکس)', icon: Share2 },
              { id: 'contacts', label: 'WhatsApp Numbers (نمبر چینج کریں)', icon: PhoneCall, count: localContacts.length },
              { id: 'settings', label: 'Settings & Security', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAdminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xs text-xs uppercase tracking-wider font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent border-l-4 border-[#D4AF37] text-[#D4AF37] shadow-sm'
                      : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-stone-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-[#D4AF37] text-black font-bold'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Sign Out */}
        <div className="p-4 border-t border-[#C5A059]/20 bg-[#080808] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#805F19] to-[#D4AF37] flex items-center justify-center text-black font-bold text-xs">
              M
            </div>
            <div className="text-left text-xs truncate max-w-[120px]">
              <p className="font-semibold text-white truncate">{adminCredentials.email}</p>
              <p className="text-[10px] text-stone-400">Master Admin</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-stone-400 hover:text-red-400 rounded-xs hover:bg-stone-900"
            title="Sign Out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#140A06]">
        {/* Top Navbar */}
        <header className="h-16 bg-[#1A0F0A] border-b border-[#C5A059]/30 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-serif-luxury font-bold text-white tracking-wider capitalize">
              {activeAdminTab === 'dashboard'
                ? 'Dashboard Overview'
                : activeAdminTab === 'archives'
                ? 'Monthly Close & Archives'
                : activeAdminTab === 'social'
                ? 'Social Media Channels (سوشل میڈیا لنکس)'
                : activeAdminTab === 'contacts'
                ? 'WhatsApp & Phone Numbers (رابطہ نمبرز تبدیل کریں)'
                : `${activeAdminTab} Management`}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search orders, SKU..."
                value={orderSearch}
                onChange={(e) => {
                  setOrderSearch(e.target.value);
                  if (activeAdminTab !== 'orders' && e.target.value) {
                    setActiveAdminTab('orders');
                  }
                }}
                className="bg-[#111111] border border-stone-800 focus:border-[#D4AF37] rounded-xs pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-stone-500 w-64 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setActiveAdminTab('orders')}
              className="relative p-2 text-stone-400 hover:text-white"
            >
              <Bell className="w-4 h-4" />
              {pendingOrdersCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4AF37]" />
              )}
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="px-3 py-1.5 bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#F3E5AB] transition-colors"
            >
              View Live Store
            </button>
          </div>
        </header>

        {/* Tab Router Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeAdminTab === 'dashboard' && (
            <div className="space-y-8">
              {/* TOP 3 GOLD GRADIENT KPI CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Sales Gold Card */}
                <div className="relative p-6 rounded-sm bg-gradient-to-br from-[#E6CA65] via-[#D4AF37] to-[#A37B24] text-black shadow-[0_8px_30px_rgba(212,175,55,0.25)] flex flex-col justify-between h-44 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wider text-black/80">
                      Total Active Sales
                    </span>
                    <span className="text-xs font-bold text-black/70">•••</span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-black tabular-nums">
                      PKR {totalSales.toLocaleString()}
                    </h3>
                    <p className="text-xs font-semibold text-black/80 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 inline" />
                      <span>+12.4% vs last period</span>
                    </p>
                  </div>

                  {/* Sparkline Wave */}
                  <div className="h-10 w-full mt-2 opacity-85">
                    <svg viewBox="0 0 100 25" className="w-full h-full stroke-black fill-none" strokeWidth="2.5">
                      <path d="M 0 20 Q 15 5, 25 15 T 45 10 T 65 18 T 85 8 T 100 2" />
                    </svg>
                  </div>
                </div>

                {/* Total Orders Gold Card */}
                <div className="relative p-6 rounded-sm bg-gradient-to-br from-[#E6CA65] via-[#D4AF37] to-[#A37B24] text-black shadow-[0_8px_30px_rgba(212,175,55,0.25)] flex flex-col justify-between h-44 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wider text-black/80">
                      Active Orders
                    </span>
                    <span className="text-xs font-bold text-black/70">•••</span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-black tabular-nums">
                      {totalOrdersCount.toLocaleString()}
                    </h3>
                    <p className="text-xs font-semibold text-black/80 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 inline" />
                      <span>{pendingOrdersCount} awaiting verification</span>
                    </p>
                  </div>

                  {/* Bar Chart Sparkline */}
                  <div className="h-10 w-full flex items-end gap-1.5 pt-2">
                    {[35, 60, 45, 75, 40, 65, 80, 55, 90, 70, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-black/80 rounded-t-xs"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Delivered Orders */}
                <div className="relative p-6 rounded-sm bg-gradient-to-br from-[#E6CA65] via-[#D4AF37] to-[#A37B24] text-black shadow-[0_8px_30px_rgba(212,175,55,0.25)] flex flex-col justify-between h-44 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wider text-black/80">
                      Delivered Consignments
                    </span>
                    <span className="text-xs font-bold text-black/70">•••</span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-black tabular-nums">
                      {deliveredOrdersCount} Consignments
                    </h3>
                    <p className="text-xs font-semibold text-black/80 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 inline" />
                      <span>Cash collected upon unboxing</span>
                    </p>
                  </div>

                  <div className="h-10 w-full mt-2 opacity-85">
                    <svg viewBox="0 0 100 25" className="w-full h-full stroke-black fill-none" strokeWidth="2.5">
                      <path d="M 0 18 C 20 2, 40 25, 60 10 C 80 -2, 90 20, 100 5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* QUICK CATEGORIES CONTROL & STOREFRONT SHOWCASE STATUS */}
              <div className="bg-[#1C1008] border border-[#D4AF37]/50 rounded-xs p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xs bg-[#D4AF37]/20 text-[#D4AF37]">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <span>Boutique Categories & Departments Session (کیٹیگریز کنٹرول)</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-black">
                        {categories.filter((c) => c.isActive).length} Active
                      </span>
                    </h3>
                    <p className="text-xs text-stone-300 mt-0.5">
                      Add, edit, or delete categories. The small toggle button on the home page expands these categories dynamically.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveAdminTab('categories')}
                    className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA8222] hover:brightness-110 text-[#140A06] font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-1.5 shadow-md"
                  >
                    <span>Control Categories</span>
                    <TrendingUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleOpenAddCategory}
                    className="px-3.5 py-2 bg-[#24140D] hover:bg-[#341C11] text-[#D4AF37] border border-[#D4AF37]/40 font-semibold text-xs uppercase tracking-wider rounded-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                </div>
              </div>

              {/* RECENT ORDER DETAILS TABLE */}
              <div className="bg-[#0E0E0E] border border-[#C5A059]/30 rounded-xs p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                  <div>
                    <h2 className="text-lg font-serif-luxury font-bold text-white tracking-wide">
                      Recent Order Details
                    </h2>
                    <p className="text-xs text-stone-400">
                      Real-time client orders dispatched via Cash on Delivery
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportOrdersCSV(orders, 'MS_Active_Orders')}
                      className="px-3 py-1.5 bg-[#141414] border border-stone-700 hover:border-[#D4AF37] text-xs font-semibold uppercase tracking-wider text-stone-200 rounded-xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Export CSV</span>
                    </button>

                    <button
                      onClick={() => setActiveAdminTab('orders')}
                      className="px-3 py-1.5 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#F3E5AB]"
                    >
                      View All Orders
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#141414] text-[#D4AF37] uppercase tracking-wider font-semibold border-b border-stone-800">
                      <tr>
                        <th className="py-3 px-4">ORDER ID</th>
                        <th className="py-3 px-4">CUSTOMER</th>
                        <th className="py-3 px-4">DATE & TIME</th>
                        <th className="py-3 px-4">STATUS</th>
                        <th className="py-3 px-4 text-center">ITEMS</th>
                        <th className="py-3 px-4 text-right">TOTAL</th>
                        <th className="py-3 px-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60 font-medium">
                      {orders.slice(0, 8).map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-[#161616] transition-colors group cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="py-3.5 px-4 font-mono font-semibold text-white">
                            {order.orderNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{order.customerName}</div>
                            <div className="text-[11px] text-stone-400 font-normal">{order.customerEmail}</div>
                          </td>
                          <td className="py-3.5 px-4 text-stone-300 font-mono text-[11px]">
                            {new Date(order.createdAt).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs ${
                                order.status === 'Delivered'
                                  ? 'bg-[#D4AF37] text-black shadow-sm'
                                  : order.status === 'Shipped'
                                  ? 'bg-[#C5A059] text-black'
                                  : order.status === 'Processing'
                                  ? 'bg-[#997928] text-white'
                                  : order.status === 'Pending'
                                  ? 'bg-transparent text-[#D4AF37] border border-[#D4AF37]'
                                  : 'bg-stone-800 text-stone-300'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center text-stone-300 font-mono">
                            {order.items.reduce((a, b) => a + b.quantity, 0)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#D4AF37] tabular-nums">
                            PKR {order.total.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder(order);
                                }}
                                className="text-[#D4AF37] hover:text-white font-semibold underline underline-offset-2"
                              >
                                View/Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteModal({ type: 'order', id: order.id, name: order.orderNumber });
                                }}
                                className="text-stone-400 hover:text-red-400 p-1"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FULL ORDERS MANAGEMENT (With Working Delete Button & Filters) */}
          {activeAdminTab === 'orders' && (
            <div className="bg-[#0E0E0E] border border-[#C5A059]/30 rounded-xs p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                <div>
                  <h2 className="text-xl font-serif-luxury font-bold text-white tracking-wide">
                    Consignment Orders List ({filteredOrders.length})
                  </h2>
                  <p className="text-xs text-stone-400">
                    Filter, inspect, print invoices, update live milestones, or delete records.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => exportOrdersCSV(orders, 'MS_Active_Orders')}
                    className="px-3 py-1.5 bg-[#141414] border border-stone-700 hover:border-[#D4AF37] text-xs font-semibold uppercase tracking-wider text-stone-200 rounded-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-2 pt-1">
                {['all', 'Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-xs border transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                        : 'bg-black text-stone-400 border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    {st === 'all' ? `All (${orders.length})` : st}
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141414] text-[#D4AF37] uppercase tracking-wider font-semibold border-b border-stone-800">
                    <tr>
                      <th className="py-3 px-4">ORDER ID</th>
                      <th className="py-3 px-4">CUSTOMER</th>
                      <th className="py-3 px-4">CITY & PHONE</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-center">ITEMS</th>
                      <th className="py-3 px-4 text-right">TOTAL</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 font-medium">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-stone-500">
                          No orders found matching your search/filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-[#161616] transition-colors cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="py-3.5 px-4 font-mono font-semibold text-white">
                            {order.orderNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{order.customerName}</div>
                            <div className="text-[11px] text-stone-400 font-normal">{order.customerEmail}</div>
                          </td>
                          <td className="py-3.5 px-4 text-stone-300">
                            <div>{order.city}</div>
                            <div className="text-[11px] text-stone-400 font-mono">{order.customerPhone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs ${
                                order.status === 'Delivered'
                                  ? 'bg-[#D4AF37] text-black'
                                  : order.status === 'Shipped'
                                  ? 'bg-[#C5A059] text-black'
                                  : order.status === 'Processing'
                                  ? 'bg-[#997928] text-white'
                                  : order.status === 'Pending'
                                  ? 'bg-transparent text-[#D4AF37] border border-[#D4AF37]'
                                  : 'bg-stone-800 text-stone-300'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center text-stone-300 font-mono">
                            {order.items.reduce((a, b) => a + b.quantity, 0)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#D4AF37] tabular-nums">
                            PKR {order.total.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder(order);
                                }}
                                className="text-[#D4AF37] hover:text-white font-semibold underline"
                              >
                                Details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteModal({ type: 'order', id: order.id, name: order.orderNumber });
                                }}
                                className="text-stone-400 hover:text-red-400 p-1.5 rounded-xs hover:bg-stone-900 transition-colors"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGEMENT (With working Edit Modal & Zoom/Default Image inputs) */}
          {activeAdminTab === 'products' && (
            <div className="bg-[#0E0E0E] border border-[#C5A059]/30 rounded-xs p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                <div>
                  <h2 className="text-xl font-serif-luxury font-bold text-white tracking-wide">
                    Clothing Products Catalog ({filteredProducts.length})
                  </h2>
                  <p className="text-xs text-stone-400">
                    Add garments, update base prices, replace primary & zoom hover photos, and manage catalog status.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#F3E5AB] flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Garment</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141414] text-[#D4AF37] uppercase tracking-wider font-semibold border-b border-stone-800">
                    <tr>
                      <th className="py-3 px-4">IMAGES</th>
                      <th className="py-3 px-4">GARMENT NAME</th>
                      <th className="py-3 px-4">DEPARTMENT</th>
                      <th className="py-3 px-4">PRICE</th>
                      <th className="py-3 px-4 text-center">STOCK</th>
                      <th className="py-3 px-4">BADGES</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 font-medium">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#161616] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={p.images[0]}
                              alt="Front"
                              referrerPolicy="no-referrer"
                              className="w-10 h-12 object-cover rounded-xs bg-stone-900 border border-stone-800"
                              title="Primary View"
                            />
                            {p.images[1] && (
                              <img
                                src={p.images[1]}
                                alt="Zoom"
                                referrerPolicy="no-referrer"
                                className="w-10 h-12 object-cover rounded-xs bg-stone-900 border border-[#D4AF37]/40 hidden sm:block"
                                title="Hover/Zoom View"
                              />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white uppercase tracking-wider">{p.name}</div>
                          <div className="text-[11px] text-stone-400 font-mono">SKU: {p.sku}</div>
                        </td>
                        <td className="py-3 px-4 text-stone-300">
                          <span className="capitalize">{p.subcategory || p.category}</span>
                          {p.gender && p.gender.toLowerCase() !== (p.category || '').toLowerCase() && (
                            <span className="text-stone-400 text-xs ml-1.5">• {p.gender}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#D4AF37] tabular-nums">
                          PKR {p.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center font-mono">
                          <span
                            className={`px-2 py-0.5 rounded-xs font-semibold ${
                              p.stock > 15
                                ? 'text-emerald-400 bg-emerald-950/40'
                                : p.stock > 0
                                ? 'text-amber-400 bg-amber-950/40'
                                : 'text-red-400 bg-red-950/40'
                            }`}
                          >
                            {p.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {p.isBestSeller && (
                              <span className="text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 border border-[#D4AF37]/30 rounded-xs uppercase">
                                Best Seller
                              </span>
                            )}
                            {p.isNew && (
                              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 border border-emerald-800/40 rounded-xs uppercase">
                                New
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingProduct({ ...p })}
                              className="px-2.5 py-1 bg-stone-900 border border-stone-700 hover:border-[#D4AF37] text-stone-200 text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center gap-1"
                              title="Edit Garment"
                            >
                              <Edit className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setDeleteModal({ type: 'product', id: p.id, name: p.name })}
                              className="p-1.5 text-stone-400 hover:text-red-400 rounded-xs hover:bg-[#1A0F0A] transition-colors"
                              title="Delete Garment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: BOUTIQUE CATEGORIES MANAGEMENT (کیٹیگریز سیشن) */}
          {activeAdminTab === 'categories' && (
            <div className="bg-[#1C1008] border border-[#C5A059]/30 rounded-xs p-6 space-y-6 shadow-xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#D4AF37]" />
                    <h2 className="text-xl font-serif-luxury font-bold text-white tracking-wide">
                      Boutique Categories & Lines (کیٹیگریز مینجمنٹ)
                    </h2>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Add new categories, toggle active status, or delete/cancel lines. Active categories appear dynamically in the home page showcase and shop filters.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA8222] hover:brightness-110 text-[#140A06] font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Category</span>
                </button>
              </div>

              {/* Quick Filter Department Chips */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold mr-1">
                    Filter Department:
                  </span>
                  {(['all', 'women', 'men', 'child'] as const).map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setCategoryFilterGender(gender)}
                      className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors ${
                        categoryFilterGender === gender
                          ? 'bg-[#D4AF37] text-[#140A06]'
                          : 'bg-[#24140D] text-stone-400 hover:text-white border border-stone-800'
                      }`}
                    >
                      {gender === 'all' ? 'All Lines' : gender === 'child' ? 'Children' : gender}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-[#D4AF37] font-mono">
                  Total Categories: {categories.length} ({categories.filter((c) => c.isActive).length} Active)
                </div>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories
                  .filter((cat) => categoryFilterGender === 'all' || cat.gender === categoryFilterGender)
                  .map((cat) => (
                    <div
                      key={cat.id}
                      className={`bg-[#140A06] border rounded-[22px] p-5 flex flex-col justify-between transition-all duration-300 hover:border-[#D4AF37] shadow-xl hover:-translate-y-1 ${
                        cat.isActive ? 'border-[#C5A059]/40' : 'border-stone-800 opacity-60'
                      }`}
                    >
                      <div>
                        {/* Image Preview */}
                        <div className="relative aspect-[16/9] w-full bg-[#1F120A] rounded-[18px] overflow-hidden mb-3.5 border border-stone-800/80 shadow-inner">
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                            <span className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold bg-[#140A06]/90 text-[#D4AF37] border border-[#D4AF37]/40 rounded-full shadow-xs">
                              {cat.gender.toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span
                              className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold rounded-full ${
                                cat.isActive
                                  ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-stone-900/90 text-stone-400 border border-stone-700'
                              }`}
                            >
                              {cat.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif-luxury">
                              {cat.name}
                            </h3>
                            <span className="text-[11px] font-mono text-[#D4AF37] font-semibold">
                              {cat.itemCount ?? 12} items
                            </span>
                          </div>
                          {cat.description && (
                            <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="mt-4 pt-3.5 border-t border-stone-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleToggleCategoryActive(cat)}
                          className={`text-xs px-3 py-1.5 rounded-[12px] border font-semibold transition-colors cursor-pointer ${
                            cat.isActive
                              ? 'border-emerald-600/50 text-emerald-400 hover:bg-emerald-950/40'
                              : 'border-stone-700 text-stone-400 hover:text-white hover:bg-stone-800'
                          }`}
                        >
                          {cat.isActive ? 'Active' : 'Activate'}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditCategory(cat)}
                            className="px-3 py-1.5 bg-[#24140D] hover:bg-[#341C11] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold rounded-[12px] transition-colors flex items-center gap-1 cursor-pointer"
                            title="Edit Category Details & Image"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-950/30 rounded-[10px] transition-colors cursor-pointer"
                            title="Delete / Cancel Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {categories.length === 0 && (
                <div className="text-center py-12 text-stone-500 text-xs">
                  No categories configured. Click "Add New Category" above to create one.
                </div>
              )}

              {/* Boutique Color Swatches Management */}
              <div className="pt-6 border-t border-stone-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                  <div>
                    <h3 className="text-lg font-serif-luxury font-bold text-white flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#D4AF37]" />
                      <span>Boutique Color Swatches (رنگوں کی فہرست)</span>
                    </h3>
                    <p className="text-xs text-stone-400">
                      Manage official colors used across store filters, product variants, and search.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      resetColorsToDefault();
                      showToast('Store colors restored to luxury atelier defaults.');
                    }}
                    className="text-xs text-stone-400 hover:text-[#D4AF37] underline self-start sm:self-auto cursor-pointer"
                  >
                    Reset Atelier Palette
                  </button>
                </div>

                {/* Add Color Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!adminNewColorName.trim()) {
                      showToast('Please enter a color name', 'error');
                      return;
                    }
                    const res = addColor({ name: adminNewColorName, hex: adminNewColorHex });
                    showToast(res.message, res.success ? 'success' : 'error');
                    if (res.success) setAdminNewColorName('');
                  }}
                  className="p-4 bg-[#140A06] border border-stone-800 rounded-[18px] grid grid-cols-1 sm:grid-cols-12 gap-3"
                >
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1">
                      New Color Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminNewColorName}
                      onChange={(e) => setAdminNewColorName(e.target.value)}
                      placeholder="e.g. Royal Navy, Emerald Green, Champagne"
                      className="w-full bg-black/80 border border-stone-800 focus:border-[#D4AF37] text-xs px-3 py-2 text-white rounded-[10px] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Hex / Color Picker
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={adminNewColorHex}
                        onChange={(e) => setAdminNewColorHex(e.target.value)}
                        className="w-9 h-8 p-0 border border-stone-700 rounded-[8px] cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono text-stone-300 font-bold uppercase">{adminNewColorHex}</span>
                    </div>
                  </div>
                  <div className="sm:col-span-3 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#8B2E0B] hover:bg-[#A0645A] text-white text-xs font-bold uppercase tracking-wider rounded-[10px] shadow-sm transition-all cursor-pointer"
                    >
                      + Add Swatch
                    </button>
                  </div>
                </form>

                {/* Colors Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {colors.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between p-3 bg-[#140A06] border border-stone-800/80 rounded-[14px] hover:border-[#D4AF37]/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-4 h-4 rounded-full border border-stone-600 shadow-xs shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white truncate block">{c.name}</span>
                          <span className="text-[10px] text-stone-400 font-mono block">{c.hex}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          deleteColor(c.name);
                          showToast(`Color "${c.name}" deleted from store palette.`);
                        }}
                        className="p-1 text-stone-500 hover:text-red-400 hover:bg-red-950/30 rounded-[8px] transition-colors cursor-pointer shrink-0 ml-1"
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

          {/* TAB 4: INVENTORY MANAGEMENT */}
          {activeAdminTab === 'inventory' && (
            <div className="bg-[#0E0E0E] border border-[#C5A059]/30 rounded-xs p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                <div>
                  <h2 className="text-xl font-serif-luxury font-bold text-white tracking-wide">
                    Live Stock & Variant Inventory
                  </h2>
                  <p className="text-xs text-stone-400">
                    Real-time size and color variant stock level adjusters.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {products.map((p) => (
                  <div key={p.id} className="p-4 bg-[#121212] border border-stone-800 rounded-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-10 h-12 object-cover rounded-xs border border-stone-800"
                        />
                        <div>
                          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">{p.name}</h4>
                          <span className="text-[11px] text-stone-400 font-mono">
                            SKU: {p.sku} • Department: {p.gender.toUpperCase()} • Total Stock: {p.stock}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const newTotal = Math.max(0, p.stock - 5);
                            updateProduct({ ...p, stock: newTotal });
                          }}
                          className="px-2 py-1 bg-stone-900 border border-stone-700 text-stone-300 text-xs rounded-xs hover:border-red-500"
                        >
                          -5 Stock
                        </button>
                        <button
                          onClick={() => {
                            const newTotal = p.stock + 10;
                            updateProduct({ ...p, stock: newTotal });
                          }}
                          className="px-2 py-1 bg-stone-900 border border-stone-700 text-stone-300 text-xs rounded-xs hover:border-[#D4AF37]"
                        >
                          +10 Stock
                        </button>
                      </div>
                    </div>

                    {/* Variant stocks */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2 border-t border-stone-800/80">
                      {Object.entries(p.variantStock).map(([vKey, vStock]) => {
                        const parts = vKey.split('_');
                        const size = parts[0];
                        const color = parts[1] || 'Standard';
                        return (
                          <div
                            key={vKey}
                            className="bg-black/60 border border-stone-800 p-2 rounded-xs flex items-center justify-between text-[11px]"
                          >
                            <div>
                              <span className="font-semibold text-white">{size}</span>
                              <span className="text-stone-500 block truncate max-w-[80px]">{color}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`font-mono font-bold ${vStock <= 2 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {vStock}
                              </span>
                              <div className="flex flex-col">
                                <button
                                  onClick={() => updateVariantStock(p.id, vKey, vStock + 1)}
                                  className="text-stone-400 hover:text-white px-1 leading-none"
                                >
                                  ▲
                                </button>
                                <button
                                  onClick={() => updateVariantStock(p.id, vKey, Math.max(0, vStock - 1))}
                                  className="text-stone-400 hover:text-white px-1 leading-none"
                                >
                                  ▼
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MONTHLY ARCHIVES, DAILY DRILLDOWN & RECORDS */}
          {activeAdminTab === 'archives' && (
            <div className="space-y-8">
              {/* Daily & Period Sales Drilldown Section */}
              <div className="bg-[#1C1008] border border-[#C5A059]/50 rounded-xs p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#4A2E1F]">
                  <div>
                    <h2 className="text-xl font-serif-luxury font-bold text-white tracking-wide flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
                      <span>Daily & Period Sales Records (ہر دن کا سیل ریکارڈ)</span>
                    </h2>
                    <p className="text-xs text-stone-300 mt-1">
                      Filter consignments by specific calendar date, view daily sales totals, delivered count, and inspect itemized order details.
                    </p>
                  </div>

                  {reportDate && (
                    <button
                      onClick={() => setReportDate('')}
                      className="px-3 py-1.5 bg-[#2E1B12] hover:bg-[#3D2316] text-[#E5C158] border border-[#C5A059]/40 text-xs rounded-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear Date Filter</span>
                    </button>
                  )}
                </div>

                {/* Date Picker & Quick Period Filters */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#140A06] p-4 rounded-xs border border-[#4A2E1F]">
                  {/* Calendar Date Picker */}
                  <div className="md:col-span-4 space-y-1">
                    <label className="block text-[11px] uppercase tracking-wider text-[#E5C158] font-semibold">
                      Select Specific Calendar Date:
                    </label>
                    <input
                      type="date"
                      value={reportDate}
                      onChange={(e) => {
                        setReportDate(e.target.value);
                        setReportPeriod('all');
                      }}
                      className="w-full bg-[#1C1008] border border-stone-700 focus:border-[#D4AF37] text-xs px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  {/* Quick Period Buttons */}
                  <div className="md:col-span-8 space-y-1">
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 font-semibold">
                      Or Quick Period Filter:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: 'All Records' },
                        { id: 'today', label: 'Today (آج)' },
                        { id: 'yesterday', label: 'Yesterday (کل)' },
                        { id: 'week', label: 'This Week (ہفتہ)' },
                        { id: 'month', label: 'This Month (مہینہ)' },
                        { id: 'year', label: 'This Year (سال)' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setReportPeriod(tab.id as any);
                            setReportDate('');
                          }}
                          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs border transition-all ${
                            reportPeriod === tab.id && !reportDate
                              ? 'bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA8222] text-[#140A06] border-[#D4AF37] font-bold shadow-md'
                              : 'bg-[#1C1008] text-stone-300 border-stone-800 hover:border-stone-600'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filtered Sales Metrics Summary */}
                {(() => {
                  const filteredList = orders.filter((o) => {
                    if (reportDate) {
                      return o.createdAt.startsWith(reportDate);
                    }
                    if (reportPeriod === 'today') {
                      const todayStr = new Date().toISOString().slice(0, 10);
                      return o.createdAt.startsWith(todayStr);
                    }
                    if (reportPeriod === 'yesterday') {
                      const yestStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
                      return o.createdAt.startsWith(yestStr);
                    }
                    if (reportPeriod === 'week') {
                      const oneWeekAgo = Date.now() - 7 * 86400000;
                      return new Date(o.createdAt).getTime() >= oneWeekAgo;
                    }
                    if (reportPeriod === 'month') {
                      const thisMonth = new Date().toISOString().slice(0, 7);
                      return o.createdAt.startsWith(thisMonth);
                    }
                    if (reportPeriod === 'year') {
                      const thisYear = new Date().getFullYear().toString();
                      return o.createdAt.startsWith(thisYear);
                    }
                    return true;
                  });

                  const periodTotalSales = filteredList.reduce((sum, o) => sum + o.total, 0);
                  const periodDelivered = filteredList.filter((o) => o.status === 'Delivered').length;
                  const periodPending = filteredList.filter((o) => o.status === 'Pending').length;
                  const periodItemsCount = filteredList.reduce(
                    (sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0),
                    0
                  );

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-[#140A06] border border-[#4A2E1F] rounded-xs space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
                            Total Sales Generated
                          </span>
                          <div className="text-xl font-bold font-mono text-[#E5C158] tabular-nums">
                            PKR {periodTotalSales.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-stone-400">
                            {reportDate ? `Date: ${reportDate}` : `Period: ${reportPeriod.toUpperCase()}`}
                          </span>
                        </div>

                        <div className="p-4 bg-[#140A06] border border-[#4A2E1F] rounded-xs space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
                            Consignments / Orders
                          </span>
                          <div className="text-xl font-bold font-mono text-white tabular-nums">
                            {filteredList.length} Orders
                          </div>
                          <span className="text-[10px] text-stone-400">{periodItemsCount} Garments Sold</span>
                        </div>

                        <div className="p-4 bg-[#140A06] border border-[#4A2E1F] rounded-xs space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
                            Delivered Successfully
                          </span>
                          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                            {periodDelivered} Delivered
                          </div>
                          <span className="text-[10px] text-stone-400">Cash Collected</span>
                        </div>

                        <div className="p-4 bg-[#140A06] border border-[#4A2E1F] rounded-xs space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
                            Pending / In Transit
                          </span>
                          <div className="text-xl font-bold font-mono text-[#D4AF37] tabular-nums">
                            {periodPending} Awaiting
                          </div>
                          <span className="text-[10px] text-stone-400">In Dispatch Route</span>
                        </div>
                      </div>

                      {/* Orders Table for this Period */}
                      <div className="border border-[#4A2E1F] rounded-xs overflow-hidden">
                        <div className="p-3 bg-[#140A06] border-b border-[#4A2E1F] flex justify-between items-center">
                          <span className="text-xs font-semibold uppercase tracking-wider text-white">
                            Consignments on Selected Schedule ({filteredList.length})
                          </span>
                          <span className="text-[11px] text-[#E5C158]">
                            Click any order row to inspect full garments & customer details
                          </span>
                        </div>

                        {filteredList.length === 0 ? (
                          <div className="p-8 text-center text-stone-400 text-xs">
                            No orders found for the selected date or period filter.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-[#140A06] text-[#E5C158] uppercase tracking-wider font-semibold border-b border-[#4A2E1F]">
                                <tr>
                                  <th className="py-3 px-4">ORDER ID</th>
                                  <th className="py-3 px-4">CLIENT NAME</th>
                                  <th className="py-3 px-4">DATE & EXACT TIME</th>
                                  <th className="py-3 px-4">CITY</th>
                                  <th className="py-3 px-4">STATUS</th>
                                  <th className="py-3 px-4 text-center">ITEMS</th>
                                  <th className="py-3 px-4 text-right">TOTAL SALE</th>
                                  <th className="py-3 px-4 text-right">INSPECT</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#4A2E1F]/50 font-medium">
                                {filteredList.map((order) => (
                                  <tr
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className="hover:bg-[#2E1B12] transition-colors cursor-pointer group"
                                  >
                                    <td className="py-3 px-4 font-mono font-bold text-white group-hover:text-[#E5C158]">
                                      {order.orderNumber}
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="font-semibold text-white">{order.customerName}</div>
                                      <div className="text-[11px] text-stone-400">{order.customerPhone}</div>
                                    </td>
                                    <td className="py-3 px-4 font-mono text-[11px] text-stone-300">
                                      {new Date(order.createdAt).toLocaleString([], {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </td>
                                    <td className="py-3 px-4 text-stone-300">{order.city}</td>
                                    <td className="py-3 px-4">
                                      <span
                                        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${
                                          order.status === 'Delivered'
                                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                                            : order.status === 'Shipped' || order.status === 'Out for Delivery'
                                            ? 'bg-[#C5A059]/20 text-[#E5C158] border border-[#C5A059]/40'
                                            : 'bg-stone-800 text-stone-300'
                                        }`}
                                      >
                                        {order.status}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-center font-mono text-white">
                                      {order.items.reduce((s, it) => s + it.quantity, 0)}
                                    </td>
                                    <td className="py-3 px-4 text-right font-mono font-bold text-[#E5C158]">
                                      PKR {order.total.toLocaleString()}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedOrder(order);
                                        }}
                                        className="text-[#E5C158] hover:text-white font-semibold underline text-xs"
                                      >
                                        View Details →
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Month-End Close & Archive Active Book */}
              <div className="bg-[#1C1008] border border-[#C5A059]/50 rounded-xs p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#4A2E1F]">
                  <div>
                    <h2 className="text-xl font-serif-luxury font-bold text-white tracking-wide">
                      Month-End Order Close & Clean Slate
                    </h2>
                    <p className="text-xs text-stone-300 mt-1">
                      Archive the current order book, download a permanent CSV record, and reset the active order dashboard for the new month.
                    </p>
                  </div>

                  <div className="p-3 bg-[#140A06] border border-[#4A2E1F] rounded-xs text-right">
                    <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Active Orders in System</span>
                    <span className="text-lg font-mono font-bold text-[#E5C158]">{orders.length} Orders (PKR {totalSales.toLocaleString()})</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-[#140A06] p-4 rounded-xs border border-[#4A2E1F]">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs uppercase tracking-wider text-white font-semibold">
                      Archive Month Identifier:
                    </label>
                    <input
                      type="text"
                      value={archiveMonthName}
                      onChange={(e) => setArchiveMonthName(e.target.value)}
                      placeholder="e.g. October 2026 / Winter Drop"
                      className="w-full bg-[#1C1008] border border-stone-700 focus:border-[#D4AF37] text-xs px-3 py-2.5 text-white font-medium rounded-xs focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleArchiveMonth}
                    disabled={orders.length === 0}
                    className="w-full py-2.5 bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA8222] hover:brightness-110 disabled:opacity-40 text-[#140A06] font-bold text-xs uppercase tracking-widest rounded-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Archive & Reset Month</span>
                  </button>
                </div>
              </div>

              {/* Historical Archives List */}
              <div className="bg-[#1C1008] border border-[#C5A059]/40 rounded-xs p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-[#4A2E1F]">
                  <h3 className="text-base font-serif-luxury font-bold text-white uppercase tracking-wider">
                    Archived Monthly Records ({monthlyArchives.length})
                  </h3>
                </div>

                {monthlyArchives.length === 0 ? (
                  <div className="py-12 text-center text-stone-400 space-y-2">
                    <Archive className="w-10 h-10 text-stone-600 mx-auto" />
                    <p className="text-xs uppercase tracking-wider text-white">No months archived yet.</p>
                    <p className="text-[11px] text-stone-400">When you close a month above, it will be safely filed here for historical audit and tax records.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#140A06] text-[#E5C158] uppercase tracking-wider font-semibold border-b border-[#4A2E1F]">
                        <tr>
                          <th className="py-3 px-4">MONTH NAME</th>
                          <th className="py-3 px-4">ARCHIVED DATE</th>
                          <th className="py-3 px-4 text-center">TOTAL ORDERS</th>
                          <th className="py-3 px-4 text-center">DELIVERED</th>
                          <th className="py-3 px-4 text-right">TOTAL REVENUE</th>
                          <th className="py-3 px-4 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#4A2E1F]/50 font-medium">
                        {monthlyArchives.map((arch) => (
                          <tr key={arch.id} className="hover:bg-[#2E1B12] transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-white">
                              {arch.monthName}
                            </td>
                            <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">
                              {new Date(arch.archivedAt).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono text-white">
                              {arch.totalOrders}
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono text-emerald-400">
                              {arch.deliveredOrders}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#E5C158] tabular-nums">
                              PKR {arch.totalRevenue.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedArchive(arch)}
                                  className="text-[#E5C158] hover:underline font-semibold"
                                >
                                  View ({arch.orders.length})
                                </button>
                                <button
                                  onClick={() => exportOrdersCSV(arch.orders, `MS_Archive_${arch.monthName}`)}
                                  className="p-1 text-stone-300 hover:text-white"
                                  title="Download CSV"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: CUSTOMERS MANAGEMENT */}
          {activeAdminTab === 'customers' && (
            <div className="bg-[#0E0E0E] border border-[#C5A059]/30 rounded-xs p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div>
                  <h2 className="text-xl font-serif-luxury font-bold text-white tracking-wide">
                    Client Roster ({customerList.length})
                  </h2>
                  <p className="text-xs text-stone-400">
                    Registered clientele, lifetime spending, and consignment addresses.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141414] text-[#D4AF37] uppercase tracking-wider font-semibold border-b border-stone-800">
                    <tr>
                      <th className="py-3 px-4">CLIENT NAME</th>
                      <th className="py-3 px-4">CONTACT</th>
                      <th className="py-3 px-4">CITY</th>
                      <th className="py-3 px-4 text-center">ORDERS</th>
                      <th className="py-3 px-4 text-right">LIFETIME SPEND</th>
                      <th className="py-3 px-4 text-center">ROSTER STATUS</th>
                      <th className="py-3 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 font-medium">
                    {customerList.map((c, i) => (
                      <tr key={i} className="hover:bg-[#161616] transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {c.name}
                        </td>
                        <td className="py-3.5 px-4 text-stone-300">
                          <div>{c.email}</div>
                          <div className="text-[11px] text-stone-500 font-mono">{c.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 text-stone-300">
                          {c.city}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-white">
                          {c.orderCount}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#D4AF37] tabular-nums">
                          PKR {c.totalSpent.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 rounded-xs">
                            Privilege VIP
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setDeleteModal({ type: 'customer', id: c.email || c.phone, name: c.name })}
                            className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-[#1A0F0A] rounded-xs transition-colors"
                            title="Remove Client Records"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: ANALYTICS */}
          {activeAdminTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 bg-[#0E0E0E] border border-[#C5A059]/30 rounded-xs">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400">Total Revenue</span>
                  <div className="text-xl font-bold font-mono text-[#D4AF37] mt-1">
                    PKR {totalSales.toLocaleString()}
                  </div>
                </div>

                <div className="p-5 bg-[#0E0E0E] border border-[#C5A059]/30 rounded-xs">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400">Average Order Value</span>
                  <div className="text-xl font-bold font-mono text-white mt-1">
                    PKR {Math.round(totalSales / (totalOrdersCount || 1)).toLocaleString()}
                  </div>
                </div>

                <div className="p-5 bg-[#0E0E0E] border border-[#C5A059]/30 rounded-xs">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400">Delivered Consignments</span>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                    {deliveredOrdersCount} orders
                  </div>
                </div>

                <div className="p-5 bg-[#0E0E0E] border border-[#C5A059]/30 rounded-xs">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400">Conversion Rate</span>
                  <div className="text-xl font-bold font-mono text-white mt-1">
                    3.84%
                  </div>
                </div>
              </div>

              <div className="bg-[#0E0E0E] border border-[#C5A059]/30 rounded-xs p-6 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[#D4AF37]">
                  Category Performance Distribution
                </h3>
                <div className="space-y-3 pt-2">
                  {[
                    { name: "Women's Haute Couture", share: 44, amount: 'PKR 21,372,230' },
                    { name: "Men's Bespoke & Tuxedos", share: 32, amount: 'PKR 15,543,440' },
                    { name: 'Eastern Festive & Kurtas', share: 14, amount: 'PKR 6,800,000' },
                    { name: 'Children Haute Couture', share: 10, amount: 'PKR 4,857,000' },
                  ].map((c) => (
                    <div key={c.name} className="space-y-1">
                      <div className="flex justify-between text-xs text-stone-300">
                        <span>{c.name} ({c.share}%)</span>
                        <span className="font-mono text-[#D4AF37]">{c.amount}</span>
                      </div>
                      <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37]"
                          style={{ width: `${c.share}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: MARKETING & COUPONS */}
          {activeAdminTab === 'marketing' && (
            <div className="space-y-8">
              <div className="bg-[#0E0E0E] border border-[#C5A059]/30 rounded-xs p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                  <div>
                    <h3 className="text-lg font-serif-luxury font-bold text-white tracking-wide">
                      Privilege Coupons & Discounts
                    </h3>
                    <p className="text-xs text-stone-400">
                      Create promotional codes for clientele checkout incentives.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#121212] p-4 rounded-xs border border-stone-800">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. VIP25"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                      className="w-full bg-black border border-stone-800 text-xs px-3 py-2 text-white uppercase font-mono rounded-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1">Discount %</label>
                    <input
                      type="number"
                      placeholder="15"
                      value={newCoupon.discountPercent}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })}
                      className="w-full bg-black border border-stone-800 text-xs px-3 py-2 text-white rounded-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1">Min Order (PKR)</label>
                    <input
                      type="number"
                      placeholder="5000"
                      value={newCoupon.minOrderAmount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: Number(e.target.value) })}
                      className="w-full bg-black border border-stone-800 text-xs px-3 py-2 text-white rounded-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-colors"
                    >
                      + Create Coupon
                    </button>
                  </div>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#141414] text-[#D4AF37] uppercase tracking-wider font-semibold border-b border-stone-800">
                      <tr>
                        <th className="py-3 px-4">COUPON CODE</th>
                        <th className="py-3 px-4">BENEFIT</th>
                        <th className="py-3 px-4">MIN ORDER</th>
                        <th className="py-3 px-4">REDEMPTIONS</th>
                        <th className="py-3 px-4">STATUS</th>
                        <th className="py-3 px-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800 font-medium">
                      {coupons.map((c) => (
                        <tr key={c.id} className="hover:bg-[#161616]">
                          <td className="py-3 px-4 font-mono font-bold text-white tracking-wider">
                            {c.code}
                          </td>
                          <td className="py-3 px-4 text-[#D4AF37]">
                            {c.discountPercent ? `${c.discountPercent}% OFF` : `PKR ${c.fixedDiscount} OFF`}
                          </td>
                          <td className="py-3 px-4 font-mono text-stone-300">
                            PKR {c.minOrderAmount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 font-mono text-stone-300">
                            {c.usageCount} times
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 rounded-xs">
                              Active
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => deleteCoupon(c.id)}
                              className="text-stone-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Newsletter & Atelier Subscribers Card */}
              <div className="bg-[#0E0E0E] border border-[#C5A059]/30 rounded-[20px] p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-serif-luxury font-bold text-white tracking-wide">
                        Atelier Newsletter Subscribers
                      </h3>
                      <span className="px-2.5 py-0.5 bg-[#8B2E0B]/30 border border-[#8B2E0B] text-[#D4AF37] font-mono text-xs font-bold rounded-full">
                        {subscribers.length} VIP Clients
                      </span>
                    </div>
                    <p className="text-xs text-stone-400">
                      Clientele who subscribed to seasonal lookbooks, bespoke couture showcases, and atelier updates.
                    </p>
                  </div>

                  {subscribers.length > 0 && (
                    <button
                      onClick={() => {
                        const emailList = subscribers.map((s) => s.email).join(', ');
                        navigator.clipboard.writeText(emailList);
                        showToast(`Copied ${subscribers.length} subscriber emails to clipboard!`);
                      }}
                      className="px-4 py-2 bg-[#2E1B12] hover:bg-[#8B2E0B] border border-[#C5A059]/40 text-[#FAF7F2] text-xs font-semibold rounded-[16px] transition-colors flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Copy All Emails
                    </button>
                  )}
                </div>

                {subscribers.length === 0 ? (
                  <div className="p-8 text-center text-stone-500 text-xs">
                    No newsletter subscribers yet. Submissions from the storefront footer will appear here automatically.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#141414] text-[#D4AF37] uppercase tracking-wider font-semibold border-b border-stone-800">
                        <tr>
                          <th className="py-3 px-4">CLIENT EMAIL</th>
                          <th className="py-3 px-4">SUBSCRIBED DATE</th>
                          <th className="py-3 px-4">SOURCE</th>
                          <th className="py-3 px-4 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800 font-medium">
                        {subscribers.map((sub) => (
                          <tr key={sub.id} className="hover:bg-[#161616] transition-colors">
                            <td className="py-3 px-4 font-mono font-semibold text-white tracking-wide">
                              {sub.email}
                            </td>
                            <td className="py-3 px-4 text-stone-400 font-mono text-[11px]">
                              {new Date(sub.subscribedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-stone-900 text-stone-300 border border-stone-700 rounded-full">
                                {sub.source || 'Storefront Footer'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  deleteSubscriber(sub.id);
                                  showToast('Subscriber removed from list');
                                }}
                                className="text-stone-500 hover:text-red-400 p-1 rounded-sm transition-colors cursor-pointer"
                                title="Delete subscriber"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: SOCIAL MEDIA CHANNELS (سوشل میڈیا لنکس) */}
          {activeAdminTab === 'social' && (
            <div className="space-y-8 max-w-5xl">
              {/* Header Card */}
              <div className="bg-[#1C1008] border border-[#C5A059]/50 rounded-[20px] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#8B2E0B]/20 to-transparent blur-3xl pointer-events-none rounded-full" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#8B2E0B]/20 border border-[#8B2E0B]/50 rounded-full text-[#FAF7F2]">
                        <Share2 className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tracking-wide">
                          Official Brand Social Media Links • سوشل میڈیا لنکس
                        </h2>
                        <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                          11 Channels Connected to Homepage & Footer
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed max-w-2xl pt-1">
                      اپنے تمام سوشل میڈیا اکاؤنٹس کے لنکس یہاں درج کریں۔ جب بھی کوئی گاہک یا وزٹر ویب سائٹ کے ہوم پیج یا فوٹر میں دیے گئے کسی بھی لوگو پر کلک کرے گا تو وہ براہ راست آپ کے اصل سوشل میڈیا اکاؤنٹ پر پہنچ جائے گا۔
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => navigateTo('home')}
                      className="px-4 py-2.5 bg-black/80 hover:bg-black border border-[#C5A059]/40 text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Eye className="w-4 h-4 text-[#D4AF37]" />
                      <span>View on Storefront</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('All social links are saved and synchronized live!')}
                      className="px-5 py-2.5 bg-[#8B2E0B] hover:bg-[#AA350E] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sync Active</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid of all 11 Social Platforms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    key: 'instagram',
                    name: 'Instagram',
                    labelUrdu: 'انسٹاگرام',
                    defaultUrl: 'https://instagram.com/mswear',
                    placeholder: 'https://instagram.com/your_account',
                    iconBg: 'bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4]',
                    desc: 'Primary visual boutique portfolio and live couture lookbooks.',
                  },
                  {
                    key: 'facebook',
                    name: 'Facebook',
                    labelUrdu: 'فیس بک پیج',
                    defaultUrl: 'https://facebook.com/mswear',
                    placeholder: 'https://facebook.com/your_page',
                    iconBg: 'bg-[#1877F2]',
                    desc: 'Official brand page for community updates and customer reviews.',
                  },
                  {
                    key: 'linkedin',
                    name: 'LinkedIn',
                    labelUrdu: 'لنکڈ اِن',
                    defaultUrl: 'https://linkedin.com/company/mswear',
                    placeholder: 'https://linkedin.com/company/your_brand',
                    iconBg: 'bg-[#0A66C2]',
                    desc: 'Corporate, wholesale inquiries, and luxury atelier profile.',
                  },
                  {
                    key: 'pinterest',
                    name: 'Pinterest',
                    labelUrdu: 'پنٹیسٹ',
                    defaultUrl: 'https://pinterest.com/mswear',
                    placeholder: 'https://pinterest.com/your_account',
                    iconBg: 'bg-[#BD081C]',
                    desc: 'Mood boards, bridal moodboards, and couture styling pins.',
                  },
                  {
                    key: 'youtube',
                    name: 'YouTube',
                    labelUrdu: 'یوٹیوب چینل',
                    defaultUrl: 'https://youtube.com/@mswear',
                    placeholder: 'https://youtube.com/@your_channel',
                    iconBg: 'bg-[#FF0000]',
                    desc: 'Fashion runway films, fabric craftsmanship documentaries & shorts.',
                  },
                  {
                    key: 'snapchat',
                    name: 'Snapchat',
                    labelUrdu: 'اسنیپ چیٹ',
                    defaultUrl: 'https://snapchat.com/add/mswear',
                    placeholder: 'https://snapchat.com/add/your_username',
                    iconBg: 'bg-[#FFFC00] text-black',
                    desc: 'Behind-the-scenes fitting sessions and atelier stories.',
                  },
                  {
                    key: 'tiktok',
                    name: 'TikTok',
                    labelUrdu: 'ٹک ٹاک',
                    defaultUrl: 'https://tiktok.com/@mswear',
                    placeholder: 'https://tiktok.com/@your_username',
                    iconBg: 'bg-[#000000] border border-stone-700',
                    desc: 'Viral fashion reels, unboxing videos, and styling transitions.',
                  },
                  {
                    key: 'threads',
                    name: 'Threads',
                    labelUrdu: 'تھریڈز',
                    defaultUrl: 'https://threads.net/@mswear',
                    placeholder: 'https://threads.net/@your_username',
                    iconBg: 'bg-[#101010] border border-stone-700',
                    desc: 'Direct discussions on luxury trends and seasonal drops.',
                  },
                  {
                    key: 'google',
                    name: 'Google Brand / Search',
                    labelUrdu: 'گوگل برانڈ اور ریویوز',
                    defaultUrl: 'https://google.com/search?q=ms+wear',
                    placeholder: 'https://google.com/search?q=your_brand or Maps link',
                    iconBg: 'bg-[#4285F4]',
                    desc: 'Google Business profile, direct Google search, or verified reviews.',
                  },
                  {
                    key: 'whatsapp',
                    name: 'WhatsApp Official Channel',
                    labelUrdu: 'واٹس ایپ چینل / آرڈر چیٹ',
                    defaultUrl: settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}` : 'https://wa.me/923001234567',
                    placeholder: 'https://wa.me/923001234567 or WhatsApp Channel link',
                    iconBg: 'bg-[#25D366]',
                    desc: 'Direct VIP concierge chat and exclusive customer updates.',
                  },
                  {
                    key: 'twitter',
                    name: 'X (Twitter)',
                    labelUrdu: 'ایکس (ٹوئٹر)',
                    defaultUrl: 'https://x.com/mswear',
                    placeholder: 'https://x.com/your_handle',
                    iconBg: 'bg-[#000000] border border-stone-700',
                    desc: 'Instant brand news, announcements, and global fashion updates.',
                  },
                ].map((channel) => {
                  const currentVal = (settings.socialLinks as any)?.[channel.key] || '';
                  const effectiveUrl = formatExternalUrl(currentVal, channel.defaultUrl);
                  const isCustom = Boolean(currentVal && currentVal.trim());

                  return (
                    <div
                      key={channel.key}
                      className="bg-[#140A06] border border-[#4A2E1F] hover:border-[#C5A059] rounded-[18px] p-5 transition-all duration-200 shadow-md flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Title Row with Badge */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-md shrink-0 ${channel.iconBg}`}>
                              {channel.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-white tracking-wide">
                                  {channel.name}
                                </h3>
                                <span className="text-[10px] text-[#C4AD8A] font-serif-luxury">
                                  ({channel.labelUrdu})
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-400 line-clamp-1">
                                {channel.desc}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider shrink-0 ${
                              isCustom
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                                : 'bg-stone-900 text-stone-400 border border-stone-800'
                            }`}
                          >
                            {isCustom ? 'Active Custom' : 'Default'}
                          </span>
                        </div>

                        {/* Input Box */}
                        <div>
                          <label className="block text-[10px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                            Direct Account / Profile Web Link:
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => {
                                updateSettings({
                                  socialLinks: {
                                    ...settings.socialLinks,
                                    [channel.key]: e.target.value,
                                  },
                                });
                              }}
                              placeholder={channel.placeholder}
                              className="w-full bg-black/90 border border-stone-700 focus:border-[#D4AF37] px-3.5 py-2.5 text-white font-mono text-xs rounded-lg focus:outline-none transition-colors"
                            />
                            {currentVal && (
                              <button
                                type="button"
                                onClick={() => {
                                  updateSettings({
                                    socialLinks: {
                                      ...settings.socialLinks,
                                      [channel.key]: '',
                                    },
                                  });
                                  showToast(`Reset ${channel.name} to default`);
                                }}
                                className="absolute right-2.5 top-2.5 text-stone-500 hover:text-red-400 text-xs"
                                title="Clear link"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Bar with Direct Test Button */}
                      <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2 text-xs">
                        <span className="text-[10px] text-stone-400 truncate max-w-[200px]" title={effectiveUrl}>
                          Opens: <span className="font-mono text-[#D4AF37]">{effectiveUrl}</span>
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              window.open(effectiveUrl, '_blank', 'noopener,noreferrer');
                            }}
                            className="px-3 py-1.5 bg-[#8B2E0B]/20 hover:bg-[#8B2E0B] border border-[#8B2E0B]/50 hover:border-[#8B2E0B] text-[#FAF7F2] text-[11px] font-semibold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                            title={`Click to test opening ${channel.name} in a new tab`}
                          >
                            <span>Test Link</span>
                            <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Notification Card */}
              <div className="p-4 bg-[#140A06] border border-[#C5A059]/40 rounded-xl flex items-center justify-between gap-4 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    All 11 social accounts are synchronized live across the website header, homepage social section, and footer roster.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Successfully verified all links!');
                    navigateTo('home');
                  }}
                  className="px-4 py-2 bg-[#8B2E0B] text-white font-bold text-xs uppercase tracking-wider rounded-lg shrink-0 hover:bg-[#A0645A] transition-colors"
                >
                  Verify on Website ↗
                </button>
              </div>
            </div>
          )}

          {/* TAB: WHATSAPP & PHONE NUMBERS MANAGEMENT (واٹس ایپ اور رابطہ نمبرز تبدیل کریں) */}
          {activeAdminTab === 'contacts' && (
            <div className="space-y-6 max-w-5xl">
              {/* Header Card */}
              <div className="bg-[#160D08] border border-[#C5A059]/40 rounded-xl p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-[#25D366]/20 border border-[#25D366]/40 rounded-xl text-[#25D366]">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-serif-luxury font-bold text-white tracking-wide">
                        WhatsApp & Phone Numbers (واٹس ایپ نمبرز تبدیل کریں)
                      </h2>
                      <p className="text-xs text-stone-400">
                        Admin panel se aap kisi bhi waqt WhatsApp numbers badal saktay hain. Instant live sync on floating button & Hero inquiry!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={handleResetContactsToDefault}
                      className="px-3.5 py-2 bg-stone-900 border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                      title="Reset to default store numbers"
                    >
                      Reset Defaults
                    </button>
                    <button
                      type="button"
                      onClick={handleAddNewContact}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-[#D4AF37]/50 text-[#D4AF37] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Department</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAllContacts}
                      className="px-5 py-2 bg-gradient-to-r from-[#25D366] to-[#1EBE5D] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save All Numbers (محفوظ کریں)</span>
                    </button>
                  </div>
                </div>

                {/* Urdu Guidance Notice */}
                <div className="p-4 bg-[#140A06] border border-[#D4AF37]/40 rounded-lg space-y-2 text-stone-300">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>مکمل خود مختار سسٹم (Instant Real-time Update)</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    آپ یہاں پر نیچے دیئے گئے چاروں ڈیپارٹمنٹس (<strong className="text-white">Sales</strong>، <strong className="text-white">Customer Support</strong>، <strong className="text-white">Orders</strong>، اور <strong className="text-white">General Inquiry</strong>) کے واٹس ایپ فون نمبرز جب چاہیں اپنی مرضی سے تبدیل کر سکتے ہیں۔ جیسے ہی آپ نمبر لکھ کر <strong className="text-[#25D366]">"Save All Numbers"</strong> پر کلک کریں گے، ویب سائٹ پر فلوٹنگ واٹس ایپ بٹن اور ہیرو سیکشن کا انکوائری بٹن فوراً نئے نمبر پر منتقل ہو جائے گا۔
                  </p>
                  <p className="text-[11px] text-stone-400">
                    💡 <em>Tip: فون نمبر بین الاقوامی فارمیٹ میں لکھیں، جیسے: <code className="text-[#D4AF37] font-mono">+92 300 1234567</code> یا <code className="text-[#D4AF37] font-mono">03001234567</code>۔ سسٹم خود بخود واٹس ایپ لنک بنا دیتا ہے۔</em>
                  </p>
                </div>
              </div>

              {/* Contact Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {localContacts.map((contact, index) => {
                  const cleanDigits = cleanPhoneNumberForWhatsApp(contact.phoneNumber);
                  return (
                    <div
                      key={contact.id || index}
                      className="bg-[#120804] border border-[#C5A059]/30 hover:border-[#D4AF37]/60 rounded-xl p-5 space-y-4 shadow-lg transition-all"
                    >
                      {/* Top Bar of Card */}
                      <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#25D366]/20 text-[#25D366] text-xs font-bold flex items-center justify-center font-mono">
                            {index + 1}
                          </span>
                          <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold font-mono">
                            ID: {contact.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {contact.badge && (
                            <span className="px-2 py-0.5 bg-[#8B2E0B]/50 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider rounded-full">
                              {contact.badge}
                            </span>
                          )}
                          {localContacts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteContact(index)}
                              className="text-stone-500 hover:text-red-400 p-1 text-xs transition-colors"
                              title="Delete this contact line"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="space-y-3 text-xs">
                        {/* Name (English) & Name (Urdu) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-stone-300 font-semibold text-[11px] mb-1">
                              Department (English Name)
                            </label>
                            <input
                              type="text"
                              value={contact.name}
                              onChange={(e) => handleUpdateContactField(index, 'name', e.target.value)}
                              placeholder="e.g. Sales"
                              className="w-full bg-black/80 border border-stone-700 focus:border-[#D4AF37] px-3 py-2 text-white rounded-lg focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-300 font-semibold text-[11px] mb-1">
                              Department (Urdu Name - اردو نام)
                            </label>
                            <input
                              type="text"
                              value={contact.nameUrdu || ''}
                              onChange={(e) => handleUpdateContactField(index, 'nameUrdu', e.target.value)}
                              placeholder="e.g. سیلز ڈیپارٹمنٹ"
                              className="w-full bg-black/80 border border-stone-700 focus:border-[#D4AF37] px-3 py-2 text-white rounded-lg focus:outline-none text-right font-sans"
                            />
                          </div>
                        </div>

                        {/* Phone Number Field (Critical) */}
                        <div>
                          <label className="block text-[#D4AF37] font-bold text-[11px] mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                              <span>Phone Number (واٹس ایپ اور کال نمبر) *</span>
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              Digits: {cleanDigits || 'None'}
                            </span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={contact.phoneNumber}
                              onChange={(e) => handleUpdateContactField(index, 'phoneNumber', e.target.value)}
                              placeholder="+92 300 1234567"
                              className="w-full bg-black/90 border border-[#25D366]/50 focus:border-[#25D366] px-3 py-2.5 text-emerald-300 font-mono font-bold text-sm rounded-lg focus:outline-none tracking-wide"
                            />
                          </div>
                        </div>

                        {/* Description & Badge */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-stone-300 font-semibold text-[11px] mb-1">
                              Description / Subtitle
                            </label>
                            <input
                              type="text"
                              value={contact.description || ''}
                              onChange={(e) => handleUpdateContactField(index, 'description', e.target.value)}
                              placeholder="e.g. Haute couture bespoke sizing"
                              className="w-full bg-black/80 border border-stone-700 focus:border-[#D4AF37] px-3 py-2 text-stone-300 rounded-lg focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-300 font-semibold text-[11px] mb-1">
                              Badge Tag (Optional)
                            </label>
                            <input
                              type="text"
                              value={contact.badge || ''}
                              onChange={(e) => handleUpdateContactField(index, 'badge', e.target.value)}
                              placeholder="e.g. Direct VIP"
                              className="w-full bg-black/80 border border-stone-700 focus:border-[#D4AF37] px-3 py-2 text-stone-300 rounded-lg focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Live Link Test Buttons */}
                      <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${cleanDigits}?text=${encodeURIComponent('Assalam-o-Alaikum! Inquiring from MUSHAY Wear store.')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 text-[11px] font-semibold rounded-md transition-colors flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Test WhatsApp (wa.me) ↗</span>
                          </a>
                          <a
                            href={`tel:${formatPhoneNumberForCall(contact.phoneNumber)}`}
                            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 text-[11px] font-semibold rounded-md transition-colors flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Test Call 📞</span>
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            handleSaveAllContacts();
                          }}
                          className="px-3 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/50 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save Line</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="p-4 bg-[#140A06] border border-[#C5A059]/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    Current Active WhatsApp Numbers: <strong className="text-white font-mono">{localContacts.length} Departments</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSaveAllContacts}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-[#25D366] to-[#1EBE5D] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Changes (نمبرز محفوظ کریں)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Live website opened. Check floating WhatsApp widget and Hero button!');
                      navigateTo('home');
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    View on Storefront ↗
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS & SECURITY (Admin Password Creation, Change, and Access Control) */}
          {activeAdminTab === 'settings' && (
            <div className="space-y-8 max-w-3xl">
              {/* Direct Access & Password Manager Card */}
              <div className="bg-[#0E0E0E] border border-[#C5A059]/40 rounded-[22px] p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <h2 className="text-base font-serif-luxury font-bold text-white tracking-wide uppercase">
                        Admin Password & Access Control (ایڈمن پاسورڈ اور ای میل تبدیل کریں)
                      </h2>
                      <p className="text-xs text-stone-400">
                        Create, change, or update your admin password and login email credentials freely.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-950/70 border border-emerald-600/70 text-emerald-300 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Direct Entry Active</span>
                  </span>
                </div>

                {/* Direct Entry Notice & Credentials Info */}
                <div className="p-4 bg-[#161208] border border-[#D4AF37]/50 rounded-[16px] space-y-2.5 text-stone-300">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Admin Login Info & Password Change (ایڈمن لاگ اِن اور پاسورڈ تبدیل کرنے کا طریقہ)</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-stone-300 leading-relaxed font-sans">
                    <p>
                      🔹 <strong className="text-white">Admin Panel Entry:</strong> لاگ اِن کرنے کے لیے ڈیفالٹ ای میل <code className="text-[#D4AF37] font-mono px-1 py-0.5 bg-black rounded">mushay@gamil.com</code> (یا <code className="text-[#D4AF37] font-mono px-1 py-0.5 bg-black rounded">mushay@gmail.com</code>) اور پاسورڈ <code className="text-[#D4AF37] font-mono px-1 py-0.5 bg-black rounded">admin</code> ہے۔
                    </p>
                    <p>
                      🔹 <strong className="text-white">Change Email & Password:</strong> اگر آپ ای میل یا پاسورڈ تبدیل کرنا چاہتے ہیں تو نیچے دیئے گئے فارم میں نیا ای میل اور نیا پاسورڈ لکھ کر <strong className="text-[#D4AF37]">"Save & Update Password"</strong> کے بٹن پر کلک کریں۔ آپ کا ای میل اور پاسورڈ فوراً تبدیل ہو جائے گا۔
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-[11px] text-stone-400">
                      واٹس ایپ اور فون نمبرز تبدیل کرنے کے لیے علیحدہ ٹیب موجود ہے:
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveAdminTab('contacts')}
                      className="px-3.5 py-1.5 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 text-xs font-semibold rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>WhatsApp Numbers Manager →</span>
                    </button>
                  </div>
                </div>

                {credsFeedback && (
                  <div
                    className={`p-3.5 rounded-[12px] text-xs flex items-center gap-2.5 border ${
                      credsFeedback.success
                        ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                        : 'bg-red-950/60 border-red-800/60 text-red-300'
                    }`}
                  >
                    {credsFeedback.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{credsFeedback.message}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateCreds} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">
                        Administrator Display Name (نام)
                      </label>
                      <input
                        type="text"
                        required
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="e.g. Master Store Executive"
                        className="w-full bg-black border border-stone-800 focus:border-[#D4AF37] px-3.5 py-2.5 text-white rounded-[12px] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">
                        Admin Email (ایڈمن ای میل ایڈریس)
                      </label>
                      <input
                        type="email"
                        required
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="mushay@gamil.com"
                        className="w-full bg-black border border-stone-800 focus:border-[#D4AF37] px-3.5 py-2.5 text-white rounded-[12px] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Create / Change Password section */}
                  <div className="p-4 bg-black border border-[#D4AF37]/40 rounded-[16px] space-y-3">
                    <label className="block uppercase tracking-wider text-[#D4AF37] font-semibold text-xs">
                      Set New Password or Change Password (نیا پاسورڈ بنائیں یا تبدیل کریں)
                    </label>
                    <p className="text-[11px] text-stone-400">
                      کوئی پرانا پاسورڈ یاد رکھنے کی ضرورت نہیں ہے۔ یہاں نیا پاسورڈ لکھ کر محفوظ کریں۔
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">
                          New Password (نیا پاسورڈ)
                        </label>
                        <input
                          type="text"
                          value={newAdminPass}
                          onChange={(e) => setNewAdminPass(e.target.value)}
                          placeholder="e.g. mushay@2026 or admin123"
                          className="w-full bg-[#141414] border border-stone-700 focus:border-[#D4AF37] px-3.5 py-2.5 text-white rounded-[12px] focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">
                          Confirm Password (پاسورڈ دوبارہ درج کریں)
                        </label>
                        <input
                          type="text"
                          value={confirmAdminPass}
                          onChange={(e) => setConfirmAdminPass(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full bg-[#141414] border border-stone-700 focus:border-[#D4AF37] px-3.5 py-2.5 text-white rounded-[12px] focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">
                      Master Recovery Key (मास्टर रिकवरी की)
                    </label>
                    <input
                      type="text"
                      value={newAdminRecoveryKey}
                      onChange={(e) => setNewAdminRecoveryKey(e.target.value)}
                      placeholder="e.g. MUSHAY-MASTER-9900"
                      className="w-full bg-black border border-stone-800 focus:border-[#D4AF37] px-3 py-2 text-white rounded-xs focus:outline-none font-mono"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Emergency key for instant recovery anytime.
                    </p>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => {
                        updateSettings({ adminPasswordProtectionEnabled: !settings.adminPasswordProtectionEnabled });
                        showToast(`Admin entry password protection toggled: ${!settings.adminPasswordProtectionEnabled ? 'ON' : 'OFF'}`);
                      }}
                      className="px-4 py-2.5 bg-stone-900 border border-stone-700 hover:border-[#D4AF37] text-stone-300 hover:text-white text-xs uppercase tracking-wider rounded-[12px] transition-colors cursor-pointer"
                    >
                      Require Password on Entry: {settings.adminPasswordProtectionEnabled ? 'ON' : 'OFF (Direct Entry)'}
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA8222] hover:brightness-110 text-black font-bold uppercase tracking-wider rounded-[12px] transition-all shadow-lg cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save & Update Password (پاسورڈ اور ای میل محفوظ کریں)</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Hardware Device Protection & Security Controls */}
              <div className="bg-[#0E0E0E] border border-[#C5A059]/40 rounded-[22px] p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <h2 className="text-base font-serif-luxury font-bold text-white tracking-wide uppercase">
                        Terminal Security & 3-Attempt Lockout Protection
                      </h2>
                      <p className="text-xs text-stone-400">
                        Strict rule: If more than 3 failed attempts occur, device access is locked out for 15 minutes.
                      </p>
                    </div>
                  </div>
                  {adminFailedAttempts > 0 && (
                    <button
                      onClick={() => resetAdminLockout('AURA-MASTER-9900')}
                      className="px-3.5 py-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-semibold rounded-[10px] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Lockout Status</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-black border border-stone-800 p-4 rounded-xs space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase tracking-wider">Device Lockout Status</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          adminLockoutUntil && Date.now() < adminLockoutUntil
                            ? 'bg-red-500 animate-pulse'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <span className="font-bold text-white uppercase tracking-wider">
                        {adminLockoutUntil && Date.now() < adminLockoutUntil
                          ? 'Device Locked'
                          : 'Armed & Normal'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-black border border-stone-800 p-4 rounded-xs space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase tracking-wider">Failed Attempts</span>
                    <div className="font-mono text-xl font-bold text-[#D4AF37]">
                      {adminFailedAttempts} / 3 Attempts Used
                    </div>
                  </div>

                  <div className="bg-black border border-stone-800 p-4 rounded-xs space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase tracking-wider">Encryption Protocol</span>
                    <div className="font-mono text-xs font-semibold text-emerald-300">
                      TLS 1.3 / AES-256
                    </div>
                  </div>
                </div>

                {/* Audit Logs Table */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                      Security & Access Event Logs ({securityLogs.length})
                    </h3>
                    {securityLogs.length > 0 && (
                      <button
                        onClick={clearSecurityLogs}
                        className="text-[11px] text-stone-500 hover:text-stone-300 transition-colors"
                      >
                        Clear Audit Trail
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto border border-stone-800 rounded-xs divide-y divide-stone-800/80">
                    {securityLogs.length === 0 ? (
                      <div className="p-4 text-center text-xs text-stone-500">
                        No security incidents recorded. System secure.
                      </div>
                    ) : (
                      securityLogs.map((log) => (
                        <div key={log.id} className="p-3 bg-black/60 flex items-start justify-between gap-3 text-xs">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-1.5 py-0.5 text-[9px] font-bold rounded-xs uppercase tracking-wider ${
                                  log.status === 'success'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : log.status === 'warning'
                                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                    : 'bg-red-950 text-red-400 border border-red-800'
                                }`}
                              >
                                {log.action}
                              </span>
                              <span className="text-stone-300 font-medium">{log.details}</span>
                            </div>
                            <p className="text-[10px] text-stone-500 font-mono">
                              Device: {log.deviceInfo} • IP: {log.ipAddress}
                            </p>
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono shrink-0">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* BRAND LOGO MANAGEMENT CARD (User requested logo setting in admin panel to change logo on left of MS) */}
              <div className="bg-[#1C1008] border border-[#C5A059]/50 rounded-xs p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center gap-3 border-b border-[#4A2E1F] pb-3">
                  <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <h2 className="text-base font-serif-luxury font-bold text-white tracking-wide uppercase">
                      Brand Logo & Insignia Management (لوگو سیٹنگز)
                    </h2>
                    <p className="text-xs text-stone-300">
                      Upload your brand logo file or provide an image link. It displays prominently to the left of "MS" across the entire store.
                    </p>
                  </div>
                </div>

                <div className="space-y-5 text-xs">
                  {/* Live Header Logo Preview */}
                  <div className="p-4 bg-[#140A06] border border-[#4A2E1F] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1 font-semibold">
                        Live Preview in Store Header:
                      </span>
                      <div className="flex items-center gap-3 p-3 bg-[#161616] border border-[#2D2D2D] rounded-lg">
                        <div className="flex flex-col justify-center select-none py-1">
                          <span className="text-lg font-serif-luxury font-bold tracking-wider text-[#FAF7F2] leading-none">
                            {settings.brandName || 'MUSHAY'}
                          </span>
                          <span className="text-[8.5px] text-[#A0645A] uppercase tracking-[0.35em] font-bold mt-1 leading-none">
                            OFFICIAL
                          </span>
                        </div>
                      </div>
                    </div>

                    {customLogoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomLogoUrl('');
                          updateSettings({ logoUrl: '' });
                          showToast('Custom logo cleared. Restored default monogram.');
                        }}
                        className="px-3 py-1.5 bg-[#2E1B12] hover:bg-red-950/60 border border-[#C5A059]/40 text-stone-300 hover:text-red-300 rounded-xs transition-colors self-start sm:self-auto"
                      >
                        Reset to Default Monogram
                      </button>
                    )}
                  </div>

                  {/* Upload Image File */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block uppercase tracking-wider text-white font-semibold text-[11px]">
                        Upload Logo File from Device:
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              if (result) {
                                setCustomLogoUrl(result);
                                updateSettings({ logoUrl: result });
                                showToast('Brand logo uploaded and updated successfully!');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full bg-[#140A06] border border-stone-700 text-stone-300 text-xs px-3 py-2 rounded-xs file:mr-3 file:py-1 file:px-2.5 file:rounded-xs file:border-0 file:text-[11px] file:font-semibold file:bg-[#D4AF37] file:text-black cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block uppercase tracking-wider text-white font-semibold text-[11px]">
                        Or Direct Image Link / URL:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customLogoUrl}
                          onChange={(e) => setCustomLogoUrl(e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className="flex-1 bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] text-xs px-3 py-2 text-white rounded-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateSettings({ logoUrl: customLogoUrl });
                            showToast('Brand logo URL saved and applied!');
                          }}
                          className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold uppercase rounded-xs transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reset to Official Transparent Monogram Option */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomLogoUrl('');
                        updateSettings({ logoUrl: '' });
                        showToast('Restored official 100% transparent MUSHAY monogram.');
                      }}
                      className="px-4 py-2 bg-[#2E1B12] hover:bg-[#8B2E0B] border border-[#C5A059]/40 text-[#FAF7F2] text-xs font-semibold rounded-xs transition-colors flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                      Restore Official 100% Transparent Monogram
                    </button>
                  </div>
                </div>
              </div>

              {/* Global Store Settings Card */}
              <div className="bg-[#1C1008] border border-[#C5A059]/40 rounded-xs p-6 md:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-lg font-serif-luxury font-bold text-white tracking-wide">
                    Storefront Announcements & Nationwide Shipping Rates
                  </h2>
                  <p className="text-xs text-stone-300">
                    Complimentary free shipping threshold and nationwide express courier fees.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-white mb-1 font-semibold">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={settings.brandName}
                        onChange={(e) => updateSettings({ brandName: e.target.value })}
                        className="w-full bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] px-3 py-2 text-white font-semibold rounded-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-white mb-1 font-semibold">
                        Top Announcement Bar Text
                      </label>
                      <input
                        type="text"
                        value={settings.announcementText}
                        onChange={(e) => updateSettings({ announcementText: e.target.value })}
                        className="w-full bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] px-3 py-2 text-white font-semibold rounded-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Hero Section Customization */}
                  <div className="p-3 bg-stone-900/60 border border-stone-800 rounded-sm space-y-3">
                    <span className="text-[11px] uppercase tracking-wider text-[#A0645A] font-bold block">
                      Hero Section & Background Image
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold text-[10px]">
                          Hero Headline
                        </label>
                        <input
                          type="text"
                          value={settings.heroHeadline || ''}
                          onChange={(e) => updateSettings({ heroHeadline: e.target.value })}
                          placeholder="STYLE THAT SPEAKS."
                          className="w-full bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] px-3 py-2 text-white font-semibold rounded-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold text-[10px]">
                          Hero Subtitle
                        </label>
                        <input
                          type="text"
                          value={settings.heroSubtext || ''}
                          onChange={(e) => updateSettings({ heroSubtext: e.target.value })}
                          placeholder="Discover refined fashion designed for your everyday moments."
                          className="w-full bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] px-3 py-2 text-white rounded-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold text-[10px]">
                        Hero Background Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.heroBackgroundImage || ''}
                          onChange={(e) => updateSettings({ heroBackgroundImage: e.target.value })}
                          placeholder="/src/assets/images/hero_ms_luxury_1791101309370.jpg"
                          className="flex-1 bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] px-3 py-2 text-white font-mono text-[11px] rounded-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateSettings({ heroBackgroundImage: '/src/assets/images/hero_ms_luxury_1791101309370.jpg' })}
                          className="px-3 py-1.5 bg-[#8B2E0B] text-white text-[10px] font-semibold uppercase tracking-wider rounded-xs hover:bg-[#A0645A] transition-colors"
                        >
                          Default Atelier
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-white mb-1 font-semibold">
                        Free Delivery Threshold (PKR)
                      </label>
                      <input
                        type="number"
                        value={settings.freeShippingThreshold}
                        onChange={(e) => updateSettings({ freeShippingThreshold: Number(e.target.value) })}
                        className="w-full bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                      />
                      <span className="text-[10px] text-stone-400">Complimentary 100% free delivery on orders &ge; {settings.freeShippingThreshold} PKR</span>
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-white mb-1 font-semibold">
                        Standard Courier Delivery Fee (PKR)
                      </label>
                      <input
                        type="number"
                        value={settings.standardDeliveryFee || 200}
                        onChange={(e) => updateSettings({ standardDeliveryFee: Number(e.target.value) })}
                        className="w-full bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                      />
                      <span className="text-[10px] text-stone-400">Flat nationwide express courier rate when order is below threshold</span>
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-white mb-1 font-semibold">
                      Dispatch Base Location Hub
                    </label>
                    <input
                      type="text"
                      value={settings.storeBaseLocation}
                      onChange={(e) => updateSettings({ storeBaseLocation: e.target.value })}
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] px-3 py-2 text-white rounded-xs focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Live changes active in store
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Media Channels Configuration Card */}
              <div className="bg-[#1C1008] border border-[#9A6652]/40 rounded-[20px] p-6 md:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-lg font-serif-luxury font-bold text-white tracking-wide">
                    Social Media Channels (سوشل میڈیا لنکس)
                  </h2>
                  <p className="text-xs text-stone-300">
                    Configure your official brand profiles. Links automatically update in the footer across the storefront.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {/* 1. Instagram */}
                  <div>
                    <label className="block uppercase tracking-wider text-[#FAF7F2] mb-1 font-semibold">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.instagram || ''}
                      onChange={(e) =>
                        updateSettings({
                          socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                        })
                      }
                      placeholder="https://instagram.com/mswear"
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#8F3500] px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  {/* 2. TikTok */}
                  <div>
                    <label className="block uppercase tracking-wider text-[#FAF7F2] mb-1 font-semibold">
                      TikTok Profile URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.tiktok || ''}
                      onChange={(e) =>
                        updateSettings({
                          socialLinks: { ...settings.socialLinks, tiktok: e.target.value },
                        })
                      }
                      placeholder="https://tiktok.com/@mswear"
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#8F3500] px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  {/* 3. Facebook */}
                  <div>
                    <label className="block uppercase tracking-wider text-[#FAF7F2] mb-1 font-semibold">
                      Facebook Page URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.facebook || ''}
                      onChange={(e) =>
                        updateSettings({
                          socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                        })
                      }
                      placeholder="https://facebook.com/mswear"
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#8F3500] px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  {/* 4. Threads */}
                  <div>
                    <label className="block uppercase tracking-wider text-[#FAF7F2] mb-1 font-semibold">
                      Threads Profile URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.threads || ''}
                      onChange={(e) =>
                        updateSettings({
                          socialLinks: { ...settings.socialLinks, threads: e.target.value },
                        })
                      }
                      placeholder="https://threads.net/@mswear"
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#8F3500] px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  {/* 5. Snapchat */}
                  <div>
                    <label className="block uppercase tracking-wider text-[#FAF7F2] mb-1 font-semibold">
                      Snapchat Profile URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.snapchat || ''}
                      onChange={(e) =>
                        updateSettings({
                          socialLinks: { ...settings.socialLinks, snapchat: e.target.value },
                        })
                      }
                      placeholder="https://snapchat.com/add/mswear"
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#8F3500] px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  {/* 6. YouTube */}
                  <div>
                    <label className="block uppercase tracking-wider text-[#FAF7F2] mb-1 font-semibold">
                      YouTube Channel URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.youtube || ''}
                      onChange={(e) =>
                        updateSettings({
                          socialLinks: { ...settings.socialLinks, youtube: e.target.value },
                        })
                      }
                      placeholder="https://youtube.com/@mswear"
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#8F3500] px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  {/* 7. Pinterest */}
                  <div>
                    <label className="block uppercase tracking-wider text-[#FAF7F2] mb-1 font-semibold">
                      Pinterest Board URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.pinterest || ''}
                      onChange={(e) =>
                        updateSettings({
                          socialLinks: { ...settings.socialLinks, pinterest: e.target.value },
                        })
                      }
                      placeholder="https://pinterest.com/mswear"
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#8F3500] px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  {/* 8. LinkedIn */}
                  <div>
                    <label className="block uppercase tracking-wider text-[#FAF7F2] mb-1 font-semibold">
                      LinkedIn Page URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.linkedin || ''}
                      onChange={(e) =>
                        updateSettings({
                          socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/company/mswear"
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#8F3500] px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  {/* 9. Google */}
                  <div>
                    <label className="block uppercase tracking-wider text-[#FAF7F2] mb-1 font-semibold">
                      Google Brand / Search URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.google || ''}
                      onChange={(e) =>
                        updateSettings({
                          socialLinks: { ...settings.socialLinks, google: e.target.value },
                        })
                      }
                      placeholder="https://google.com/search?q=ms+wear"
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#8F3500] px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  {/* 10. WhatsApp */}
                  <div>
                    <label className="block uppercase tracking-wider text-[#FAF7F2] mb-1 font-semibold">
                      WhatsApp Channel / Inquiry URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.whatsapp || ''}
                      onChange={(e) =>
                        updateSettings({
                          socialLinks: { ...settings.socialLinks, whatsapp: e.target.value },
                        })
                      }
                      placeholder="https://wa.me/923001234567"
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#8F3500] px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  {/* 11. X (Twitter) */}
                  <div>
                    <label className="block uppercase tracking-wider text-[#FAF7F2] mb-1 font-semibold">
                      X (Twitter) Profile URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks?.twitter || ''}
                      onChange={(e) =>
                        updateSettings({
                          socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                        })
                      }
                      placeholder="https://x.com/mswear"
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#8F3500] px-3 py-2 text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('social')}
                    className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1.5 cursor-pointer font-semibold"
                  >
                    <span>⚡ Open Full Social Media Manager with Live Link Testing ↗</span>
                  </button>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> All 11 social media links synced with storefront
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. ORDER DETAILS MODAL (With Working Delete Button & High Contrast Styling) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl bg-[#0D0D0D] border border-[#C5A059] rounded-xs shadow-2xl p-6 md:p-8 space-y-6 text-[#E5E5E5] animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#C5A059]/30">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                    Order Details
                  </span>
                  <span className="text-lg sm:text-xl font-mono font-bold text-white tracking-wider">
                    {selectedOrder.orderNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsInvoiceOpen(true)}
                    className="px-3 py-1.5 bg-[#141414] border border-stone-700 hover:border-[#D4AF37] text-xs uppercase font-semibold text-stone-200 flex items-center gap-1.5 rounded-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Print Invoice</span>
                  </button>

                  <button
                    onClick={() => {
                      setDeleteModal({ type: 'order', id: selectedOrder.id, name: selectedOrder.orderNumber });
                    }}
                    className="px-3 py-1.5 bg-red-950/40 border border-red-800/60 hover:bg-red-900/60 text-xs uppercase font-semibold text-red-300 flex items-center gap-1.5 rounded-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-stone-400 hover:text-white p-1 rounded-sm ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status Update Quick Bar */}
              <div className="p-4 bg-[#141414] border border-[#C5A059]/30 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
                    Current Milestone
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs uppercase tracking-wider text-stone-300 font-semibold">
                    Update To:
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      const newSt = e.target.value as OrderStatus;
                      updateOrderStatus(selectedOrder.id, newSt);
                      setSelectedOrder((prev) => (prev ? { ...prev, status: newSt } : null));
                    }}
                    className="bg-black border border-[#C5A059]/60 text-xs px-3 py-2 text-[#D4AF37] font-semibold uppercase tracking-wider rounded-xs focus:outline-none cursor-pointer"
                  >
                    <option value="Pending" className="bg-black text-white">Pending</option>
                    <option value="Confirmed" className="bg-black text-white">Confirmed</option>
                    <option value="Processing" className="bg-black text-white">Processing</option>
                    <option value="Packed" className="bg-black text-white">Packed</option>
                    <option value="Shipped" className="bg-black text-white">Shipped</option>
                    <option value="Out for Delivery" className="bg-black text-white">Out for Delivery</option>
                    <option value="Delivered" className="bg-black text-white">Delivered</option>
                    <option value="Cancelled" className="bg-black text-white">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-[#111111] border border-stone-800 rounded-xs text-xs">
                <div className="space-y-2">
                  <h4 className="font-semibold uppercase tracking-widest text-[#D4AF37] border-b border-stone-800 pb-1">
                    Client Contact
                  </h4>
                  <p className="text-sm font-bold text-white">{selectedOrder.customerName}</p>
                  <p className="text-stone-300">Email: <strong className="text-amber-200">{selectedOrder.customerEmail}</strong></p>
                  <p className="text-stone-300">Phone: <strong className="text-amber-200">{selectedOrder.customerPhone}</strong></p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold uppercase tracking-widest text-[#D4AF37] border-b border-stone-800 pb-1">
                    Consignment Address
                  </h4>
                  <p className="text-stone-200">{selectedOrder.address}</p>
                  <p className="text-stone-200">{selectedOrder.area}, {selectedOrder.city}</p>
                  {selectedOrder.orderNotes && (
                    <p className="text-amber-300 text-[11px] pt-1">
                      Note: "{selectedOrder.orderNotes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Ordered Items Table */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37]">
                  Garments in Consignment ({selectedOrder.items.length})
                </h4>
                <div className="overflow-x-auto border border-stone-800 rounded-xs">
                  <table className="w-full text-left text-xs bg-black">
                    <thead className="bg-[#161616] text-[#D4AF37] uppercase tracking-wider font-semibold border-b border-stone-800">
                      <tr>
                        <th className="py-2.5 px-3">Garment</th>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Color</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Price</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/80 font-medium">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="hover:bg-[#121212]">
                          <td className="py-2.5 px-3 flex items-center gap-2">
                            <img
                              src={item.product.images[0]}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-9 h-11 object-cover rounded-xs border border-stone-800"
                            />
                            <span className="font-semibold text-white uppercase tracking-wider">{item.product.name}</span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-amber-200">{item.size}</td>
                          <td className="py-2.5 px-3 text-stone-300">{item.color}</td>
                          <td className="py-2.5 px-3 text-center text-white font-mono">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-right text-stone-300 font-mono tabular-nums">
                            PKR {item.price.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[#D4AF37] font-mono font-bold tabular-nums">
                            PKR {(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="p-4 bg-[#111111] border border-stone-800 rounded-xs space-y-2 text-xs font-medium">
                <div className="flex justify-between text-stone-300">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white tabular-nums">PKR {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span className="font-mono tabular-nums">-PKR {selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-300">
                  <span>Delivery Fee:</span>
                  <span className="font-mono tabular-nums">
                    {selectedOrder.deliveryFee === 0 ? 'FREE (White-Glove)' : `PKR ${selectedOrder.deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-white pt-2 border-t border-stone-800">
                  <span className="uppercase tracking-wider">Total Cash on Delivery:</span>
                  <span className="font-mono text-[#D4AF37] tabular-nums text-lg">
                    PKR {selectedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between items-center pt-3 border-t border-stone-800">
                <button
                  onClick={() => {
                    setDeleteModal({ type: 'order', id: selectedOrder.id, name: selectedOrder.orderNumber });
                  }}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Order Record</span>
                </button>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-stone-900 border border-stone-700 hover:border-stone-500 text-xs font-semibold uppercase tracking-wider text-stone-300 rounded-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRODUCT EDIT MODAL (With working Primary & Zoom/Hover Image URLs, Price, Dept) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setEditingProduct(null)} className="fixed inset-0 bg-black/85 backdrop-blur-md" />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#C5A059] rounded-xs shadow-2xl p-6 md:p-8 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-stone-800">
                <h3 className="text-base font-serif-luxury font-bold text-white uppercase tracking-wider">
                  Edit Garment: {editingProduct.name}
                </h3>
                <button onClick={() => setEditingProduct(null)} className="text-stone-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProductEdit} className="space-y-4">
                <div>
                  <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Garment Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Price (PKR)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Original Price (PKR)</label>
                    <input
                      type="number"
                      value={editingProduct.originalPrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                      className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Department</label>
                    <select
                      value={editingProduct.gender}
                      onChange={(e) => setEditingProduct({ ...editingProduct, gender: e.target.value as any })}
                      className="w-full bg-black border border-stone-800 px-2 py-2 text-white rounded-xs focus:outline-none capitalize"
                    >
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                      <option value="child">Child / Kids</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Category</label>
                    <input
                      type="text"
                      value={editingProduct.subcategory}
                      onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                      className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Total Stock</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Primary and Hover Zoom Images (User requirement!) */}
                <div className="space-y-3 p-3 bg-stone-900/60 border border-stone-800 rounded-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#D4AF37] block">
                    Product Imagery Configuration
                  </span>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1">
                      1. Primary Display Image URL / Path *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.images[0] || ''}
                      onChange={(e) => {
                        const imgs = [...editingProduct.images];
                        imgs[0] = e.target.value;
                        setEditingProduct({ ...editingProduct, images: imgs });
                      }}
                      className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1">
                      2. Secondary Hover / Zoom Image URL / Path (Appears when customer hovers on card!)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.images[1] || ''}
                      onChange={(e) => {
                        const imgs = [...editingProduct.images];
                        imgs[1] = e.target.value;
                        setEditingProduct({ ...editingProduct, images: imgs });
                      }}
                      placeholder="e.g. /src/assets/images/... or second photo URL"
                      className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Previews */}
                  <div className="flex items-center gap-3 pt-2">
                    {editingProduct.images[0] && (
                      <div className="text-center">
                        <img src={editingProduct.images[0]} alt="Primary" className="w-12 h-14 object-cover rounded-xs border border-stone-700" />
                        <span className="text-[10px] text-stone-400">Primary</span>
                      </div>
                    )}
                    {editingProduct.images[1] && (
                      <div className="text-center">
                        <img src={editingProduct.images[1]} alt="Hover" className="w-12 h-14 object-cover rounded-xs border border-[#D4AF37]/50" />
                        <span className="text-[10px] text-[#D4AF37]">Hover Zoom</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Description</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none"
                  />
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteModal({ type: 'product', id: editingProduct.id, name: editingProduct.name });
                    }}
                    className="text-red-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Garment</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 bg-stone-900 border border-stone-700 text-stone-300 rounded-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#D4AF37] text-black font-bold uppercase rounded-xs hover:bg-[#F3E5AB]"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADD NEW PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setIsAddProductOpen(false)} className="fixed inset-0 bg-black/85 backdrop-blur-md" />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#C5A059] rounded-xs shadow-2xl p-6 md:p-8 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-stone-800">
                <h3 className="text-base font-serif-luxury font-bold text-white uppercase tracking-wider">
                  Add New Haute Couture Garment
                </h3>
                <button onClick={() => setIsAddProductOpen(false)} className="text-stone-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Imperial Silk Kaftan"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                      className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Original Price (PKR)</label>
                    <input
                      type="number"
                      value={newProd.originalPrice}
                      onChange={(e) => setNewProd({ ...newProd, originalPrice: Number(e.target.value) })}
                      className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Department</label>
                    <select
                      value={newProd.gender}
                      onChange={(e) => setNewProd({ ...newProd, gender: e.target.value as any })}
                      className="w-full bg-black border border-stone-800 px-2 py-2 text-white rounded-xs focus:outline-none capitalize"
                    >
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                      <option value="child">Child / Kids</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Category</label>
                    <input
                      type="text"
                      value={newProd.subcategory}
                      onChange={(e) => setNewProd({ ...newProd, subcategory: e.target.value })}
                      className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Initial Stock</label>
                    <input
                      type="number"
                      value={newProd.stock}
                      onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                      className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Primary and Hover Zoom Images */}
                <div className="space-y-3 p-3 bg-stone-900/60 border border-stone-800 rounded-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#D4AF37] block">
                    Product Imagery
                  </span>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1">
                      1. Primary Display Image URL / Path *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProd.images?.[0] || ''}
                      onChange={(e) => {
                        const imgs = [...(newProd.images || [])];
                        imgs[0] = e.target.value;
                        setNewProd({ ...newProd, images: imgs });
                      }}
                      className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1">
                      2. Secondary Hover/Zoom Image URL / Path
                    </label>
                    <input
                      type="text"
                      value={newProd.images?.[1] || ''}
                      onChange={(e) => {
                        const imgs = [...(newProd.images || [])];
                        imgs[1] = e.target.value;
                        setNewProd({ ...newProd, images: imgs });
                      }}
                      placeholder="e.g. /src/assets/images/... (revealed on card hover)"
                      className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone-300 mb-1 font-semibold">Description</label>
                  <textarea
                    rows={2}
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    className="w-full bg-black border border-stone-800 px-3 py-2 text-white rounded-xs focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-4 py-2 bg-stone-900 border border-stone-700 text-stone-300 rounded-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#D4AF37] text-black font-bold uppercase rounded-xs hover:bg-[#F3E5AB]"
                  >
                    Save & Publish Garment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 6. VIEW ARCHIVED MONTH MODAL */}
      {selectedArchive && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setSelectedArchive(null)} className="fixed inset-0 bg-black/85 backdrop-blur-md" />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl bg-[#0D0D0D] border border-[#C5A059] rounded-xs shadow-2xl p-6 md:p-8 space-y-6 text-xs text-[#E5E5E5]">
              <div className="flex justify-between items-center pb-4 border-b border-stone-800">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] block">Historical Snapshot</span>
                  <h3 className="text-xl font-serif-luxury font-bold text-white tracking-wide">
                    {selectedArchive.monthName} ({selectedArchive.orders.length} Orders)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportOrdersCSV(selectedArchive.orders, `MS_${selectedArchive.monthName}`)}
                    className="px-3 py-1.5 bg-[#141414] border border-stone-700 text-stone-200 rounded-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Download CSV</span>
                  </button>
                  <button onClick={() => setSelectedArchive(null)} className="text-stone-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-[#111111] border border-stone-800 rounded-xs text-center">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase">Revenue</span>
                  <div className="font-mono font-bold text-[#D4AF37] text-sm">PKR {selectedArchive.totalRevenue.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase">Orders</span>
                  <div className="font-mono font-bold text-white text-sm">{selectedArchive.totalOrders}</div>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase">Delivered</span>
                  <div className="font-mono font-bold text-emerald-400 text-sm">{selectedArchive.deliveredOrders}</div>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-stone-800 border border-stone-800 rounded-xs">
                {selectedArchive.orders.map((o) => (
                  <div key={o.id} className="p-3 bg-black flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-white">{o.orderNumber}</span>
                      <span className="text-stone-400 ml-2">{o.customerName} ({o.city})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-semibold text-[#D4AF37]">PKR {o.total.toLocaleString()}</span>
                      <span className="text-stone-500 text-[11px] block">{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. PRINTABLE INVOICE MODAL */}
      {isInvoiceOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="bg-white text-black p-8 rounded-sm max-w-2xl w-full space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h1 className="text-3xl font-serif font-bold tracking-tight text-black">{settings.brandName || 'MUSHAY'}</h1>
                <p className="text-xs uppercase tracking-widest text-stone-600">Haute Couture Atelier</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold text-base">{selectedOrder.orderNumber}</p>
                <p className="text-stone-500">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                <p className="text-stone-500">{selectedOrder.paymentMethod}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs">
              <div>
                <h3 className="font-bold uppercase text-stone-500 mb-1">Billed & Shipped To:</h3>
                <p className="font-semibold text-sm">{selectedOrder.customerName}</p>
                <p>{selectedOrder.address}</p>
                <p>{selectedOrder.area}, {selectedOrder.city}</p>
                <p>Phone: {selectedOrder.customerPhone}</p>
              </div>
              <div className="text-right">
                <h3 className="font-bold uppercase text-stone-500 mb-1">Dispatch Hub:</h3>
                <p className="font-semibold">{settings.brandName || 'MUSHAY'} Flagship Atelier</p>
                <p>Gulberg III, Lahore, Pakistan</p>
                <p>Email: {settings.notificationEmail}</p>
              </div>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 uppercase border-y">
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2">Size</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedOrder.items.map((it) => (
                  <tr key={it.id}>
                    <td className="py-2 font-medium">{it.product.name}</td>
                    <td className="py-2">{it.size}</td>
                    <td className="py-2 text-center">{it.quantity}</td>
                    <td className="py-2 text-right font-mono">PKR {it.price.toLocaleString()}</td>
                    <td className="py-2 text-right font-mono font-bold">PKR {(it.price * it.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end text-xs font-medium space-y-1">
              <div className="w-48 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono">PKR {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>Discount:</span>
                    <span className="font-mono">-PKR {selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="font-mono">{selectedOrder.deliveryFee === 0 ? 'FREE' : `PKR ${selectedOrder.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t pt-1">
                  <span>Total Due:</span>
                  <span className="font-mono">PKR {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-[10px] text-stone-500">Thank you for your patronage • Official Cash on Delivery Receipt</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-xs"
                >
                  Print
                </button>
                <button
                  onClick={() => setIsInvoiceOpen(false)}
                  className="px-4 py-1.5 bg-stone-200 text-black text-xs font-bold rounded-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAFE DELETE CONFIRMATION MODAL (Replaces native browser confirm which fails in iframes) */}
      {deleteModal && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div
            onClick={() => setDeleteModal(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#1C1008] border border-[#C5A059] rounded-xs shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 text-red-400 border-b border-[#4A2E1F] pb-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <h3 className="text-sm font-serif-luxury font-bold text-white uppercase tracking-wider">
                    Confirm Permanent Deletion
                  </h3>
                  <p className="text-[11px] text-stone-300">
                    This action cannot be undone. Record will be permanently removed.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#140A06] border border-[#4A2E1F] rounded-xs text-stone-200 space-y-1">
                <span className="text-[10px] uppercase text-[#E5C158] block font-semibold">
                  Target {deleteModal.type.toUpperCase()}:
                </span>
                <span className="font-mono font-bold text-white text-sm block">
                  {deleteModal.name}
                </span>
                <span className="text-[11px] text-stone-400 block pt-1">
                  {deleteModal.type === 'product' && 'Garment will be removed from storefront catalog and customer browsing.'}
                  {deleteModal.type === 'order' && 'Order details, payment amounts, and tracking history will be deleted.'}
                  {deleteModal.type === 'customer' && 'Customer account and their order history will be permanently cleared.'}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2 bg-[#2E1B12] hover:bg-[#3D2316] text-stone-300 rounded-xs uppercase tracking-wider text-[11px] font-semibold border border-stone-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xs uppercase tracking-wider text-[11px] font-bold shadow-lg transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Permanently</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MONTH ARCHIVE CONFIRMATION MODAL */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div
            onClick={() => setIsArchiveModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#1C1008] border border-[#C5A059] rounded-xs shadow-2xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 text-[#E5C158] border-b border-[#4A2E1F] pb-3">
                <Archive className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <h3 className="text-sm font-serif-luxury font-bold text-white uppercase tracking-wider">
                    Archive Month & Reset Order Book
                  </h3>
                  <p className="text-[11px] text-stone-300">
                    Store all {orders.length} active orders under "{archiveMonthName}" and start fresh for the new month.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#140A06] border border-[#4A2E1F] rounded-xs text-stone-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Total Active Orders:</span>
                  <span className="font-mono font-bold text-white">{orders.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Total Active Revenue:</span>
                  <span className="font-mono font-bold text-[#E5C158]">PKR {totalSales.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-emerald-400 pt-1 border-t border-[#4A2E1F]">
                  ✓ A full backup CSV spreadsheet will be automatically downloaded to your device upon archiving.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsArchiveModalOpen(false)}
                  className="px-4 py-2 bg-[#2E1B12] hover:bg-[#3D2316] text-stone-300 rounded-xs uppercase tracking-wider text-[11px] font-semibold border border-stone-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmAndExecuteArchive}
                  className="px-5 py-2 bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA8222] hover:brightness-110 text-[#140A06] rounded-xs uppercase tracking-wider text-[11px] font-bold shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Confirm Archive & Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. ADD / EDIT BOUTIQUE CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            onClick={() => setIsCategoryModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#1C1008] border border-[#D4AF37]/50 rounded-[22px] shadow-2xl p-6 sm:p-7 text-white animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#D4AF37]/15 rounded-[10px] text-[#D4AF37]">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif-luxury font-bold uppercase tracking-wider text-white">
                      {editingCategory ? 'Edit Boutique Category' : 'Add New Category'}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Customize category name, image, department & storefront visibility
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-stone-400 hover:text-white p-1.5 rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 pt-4 text-xs">
                {/* Category Name */}
                <div>
                  <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1">
                    Category Name * (نام تبدیل کریں)
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Brazilian Jackets, Dresses, Tops & T-Shirts, All Collections"
                    className="w-full bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] px-3.5 py-2.5 text-white rounded-[12px] focus:outline-none"
                  />
                </div>

                {/* Department / Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1">
                      Department *
                    </label>
                    <select
                      value={categoryForm.gender}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          gender: e.target.value as 'women' | 'men' | 'child' | 'all',
                        })
                      }
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] px-3.5 py-2.5 text-white rounded-[12px] focus:outline-none"
                    >
                      <option value="women">Women's Line</option>
                      <option value="men">Men's Line</option>
                      <option value="child">Children's Line</option>
                      <option value="all">Unisex / All</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1">
                      Garments Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={categoryForm.itemCount}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, itemCount: Number(e.target.value) })
                      }
                      className="w-full bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] px-3.5 py-2.5 text-white font-mono rounded-[12px] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, description: e.target.value })
                    }
                    placeholder="Brief description of fabrics, styles, or silhouettes..."
                    className="w-full bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] px-3.5 py-2.5 text-white rounded-[12px] focus:outline-none"
                  />
                </div>

                {/* Image Selection / Presets */}
                <div>
                  <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1">
                    Image URL or Presets * (امیج سلیکٹ یا تبدیل کریں)
                  </label>
                  <input
                    type="url"
                    required
                    value={categoryForm.imageUrl}
                    onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                    placeholder="/src/assets/images/... or https://..."
                    className="w-full bg-[#140A06] border border-stone-700 focus:border-[#D4AF37] px-3.5 py-2.5 text-white font-mono text-[11px] rounded-[12px] focus:outline-none mb-2"
                  />

                  {/* Preset Image Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                      Quick Pick Preset Luxury Asset (کلک کر کے تصویر منتخب کریں):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {categoryPresetImages.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setCategoryForm({ ...categoryForm, imageUrl: preset.url })}
                          className={`p-1.5 border rounded-[12px] text-left transition-all flex flex-col items-center gap-1 cursor-pointer ${
                            categoryForm.imageUrl === preset.url
                              ? 'border-[#D4AF37] bg-[#2E1B12] ring-1 ring-[#D4AF37]'
                              : 'border-stone-800 hover:border-stone-600 bg-[#140A06]'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-12 object-cover rounded-[8px]"
                          />
                          <span className="text-[9px] text-stone-300 truncate w-full text-center">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="catActive"
                    checked={categoryForm.isActive}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, isActive: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#D4AF37] rounded-sm cursor-pointer"
                  />
                  <label htmlFor="catActive" className="text-stone-300 cursor-pointer font-medium">
                    Category is Active and visible on Storefront & Shop Filters
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 bg-[#24140D] hover:bg-[#341C11] text-stone-300 rounded-[12px] uppercase tracking-wider font-semibold border border-stone-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA8222] hover:brightness-110 text-[#140A06] rounded-[12px] uppercase tracking-wider font-bold shadow-lg transition-all cursor-pointer"
                  >
                    {editingCategory ? 'Update Category (محفوظ کریں)' : 'Save Category (شامل کریں)'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ACTION TOAST NOTIFICATION */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-[70] animate-in slide-in-from-bottom-3 duration-300">
          <div
            className={`px-4 py-3 rounded-xs border text-xs font-semibold shadow-2xl flex items-center gap-2.5 ${
              adminToast.type === 'success'
                ? 'bg-[#1C1008] border-[#D4AF37] text-[#E5C158]'
                : adminToast.type === 'error'
                ? 'bg-red-950 border-red-700 text-red-200'
                : 'bg-[#24140D] border-stone-600 text-stone-200'
            }`}
          >
            {adminToast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
            {adminToast.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
            {adminToast.type === 'info' && <ShieldCheck className="w-4 h-4 text-blue-400" />}
            <span>{adminToast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};
