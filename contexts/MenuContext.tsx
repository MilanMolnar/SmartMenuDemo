'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';


export const defaultQRCardStyle: QRCardStyle = {
  backgroundType: 'solid',
  backgroundColor: '#ffffff',
  backgroundImage: 'restaurant-interior',
  // if you want "no upload" state, explicitly set to undefined:
  uploadedImage: undefined,
  restaurantName: 'Étterem Neve',
  cardColor: '#ffffff',
  textColor: '#000000',
  fontFamily: 'Inter',
  cardSize: 'business',
  aspectRatio: '3:2',
  customWidth: 350,
  customHeight: 200
};

export interface MenuItem {
  id: string;
  displayName: string;
  orderNumber: number;
  categoryId: string;
  price: number;
  currency: string;
  phoneticPronunciation?: string;
  ingredients?: string;
  allergens?: string;
  calories?: number;
  extraDescription?: string;
  image?: string; // Base64 encoded image or URL
}

export interface Category {
  id: string;
  displayName: string;
  icon?: string;
}

export interface Offer {
  id: string;
  displayName: string;
  description?: string;
  isRecurring: boolean;
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
  startDate?: string;
  endDate?: string;
  discountPercentage?: number;
  categories: Category[];
  menuItems: MenuItem[];
  isActive: boolean;
}

export interface MenuStyle {
  backgroundColor: string;
  textColor: string;
  cardColor: string;
  fontFamily: string;
  modalBackgroundColor: string;
  modalTextColor: string;
  modalCardColor: string;
  buttonColor: string;
  buttonTextColor: string;
  accentColor: string;
  menuCardDesign: 'picture-canvas' | 'menu-with-picture' | 'text-menu';
}

export interface QRCardStyle {
  backgroundType: 'solid' | 'image' | 'upload';
  backgroundColor: string;
  backgroundImage: string;
  uploadedImage?: string;
  restaurantName: string;
  cardColor: string;
  textColor: string;
  fontFamily: string;
  cardSize: 'business' | 'postcard' | 'flyer' | 'custom';
  aspectRatio: '3:2' | '4:3' | '16:9' | '1:1' | 'custom';
  customWidth: number;
  customHeight: number;
}

interface MenuContextType {
  categories: Category[];
  menuItems: MenuItem[];
  offers: Offer[];
  menuStyle: MenuStyle;
  qrCardStyle: QRCardStyle;
  selectedItems: MenuItem[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'orderNumber'>) => void;
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  updateOffer: (offerId: string, offer: Partial<Offer>) => void;
  deleteOffer: (offerId: string) => void;
  addCategoryToOffer: (offerId: string, category: Omit<Category, 'id'>) => void;
  addMenuItemToOffer: (offerId: string, item: Omit<MenuItem, 'id' | 'orderNumber'>) => void;
  updateMenuStyle: (style: Partial<MenuStyle>) => void;
  updateQRCardStyle: (style: Partial<QRCardStyle>) => void;
  toggleSelectedItem: (item: MenuItem) => void;
  clearSelectedItems: () => void;
  getTotalPrice: () => number;
  addDummyData: () => void;
  clearAllData: () => void;
  getNextOrderNumber: (categoryId: string) => number;
  getNextOfferOrderNumber: (offerId: string, categoryId: string) => number;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const defaultMenuStyle: MenuStyle = {
  backgroundColor: '#f8f9fa',
  textColor: '#212529',
  cardColor: '#ffffff',
  fontFamily: 'Inter',
  modalBackgroundColor: '#ffffff',
  modalTextColor: '#000000',
  modalCardColor: '#f8f9fa',
  buttonColor: '#000000',
  buttonTextColor: '#ffffff',
  accentColor: '#3b82f6',
  menuCardDesign: 'picture-canvas'
};

// Hungarian dummy data with sample food images
const dummyCategories: Category[] = [
  { id: '1', displayName: 'Reggelik', icon: 'Coffee' },
  { id: '2', displayName: 'Főételek', icon: 'Beef' },
  { id: '3', displayName: 'Desszertek', icon: 'IceCream' },
];

const dummyMenuItems: MenuItem[] = [
  {
    id: '1',
    displayName: 'Klasszikus Magyar Reggeli',
    orderNumber: 101,
    categoryId: '1',
    price: 2890,
    currency: 'HUF',
    ingredients: 'Két tojás, szalonna, kolbász, kenyér, paradicsom',
    allergens: 'Tojás, Glutén',
    calories: 650,
    extraDescription: 'Hagyományos magyar reggeli friss alapanyagokból',
    image: 'https://images.pexels.com/photos/101533/pexels-photo-101533.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    displayName: 'Palacsinta Nutellával',
    orderNumber: 102,
    categoryId: '1',
    price: 1890,
    currency: 'HUF',
    ingredients: 'Három palacsinta, Nutella, porcukor',
    allergens: 'Glutén, Tejtermék, Mogyoró',
    calories: 520,
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    displayName: 'Rántott Schnitzel',
    orderNumber: 201,
    categoryId: '2',
    price: 3490,
    currency: 'HUF',
    ingredients: 'Sertéshús, bundázás, petrezselymes burgonya, savanyúság',
    allergens: 'Glutén, Tojás',
    calories: 750,
    extraDescription: 'Házi készítésű schnitzel friss burgonyával',
    image: 'https://images.pexels.com/photos/8753657/pexels-photo-8753657.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    displayName: 'Goulash Leves',
    orderNumber: 202,
    categoryId: '2',
    price: 1890,
    currency: 'HUF',
    ingredients: 'Marhahús, burgonya, paprika, hagyma, fűszerek',
    allergens: 'Glutén',
    calories: 420,
    phoneticPronunciation: 'GU-lash LE-vesh',
    image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    displayName: 'Somlói Galuska',
    orderNumber: 301,
    categoryId: '3',
    price: 1590,
    currency: 'HUF',
    ingredients: 'Piskóta, dió, mazsola, csokoládé, tejszín',
    allergens: 'Glutén, Tejtermék, Dió, Tojás',
    calories: 480,
    extraDescription: 'Hagyományos magyar desszert',
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    displayName: 'Kürtőskalács',
    orderNumber: 302,
    categoryId: '3',
    price: 890,
    currency: 'HUF',
    ingredients: 'Édes tészta, cukor, fahéj',
    allergens: 'Glutén, Tejtermék, Tojás',
    calories: 320,
    phoneticPronunciation: 'KUER-tosh-ka-lach',
    extraDescription: 'Frissen sült, meleg kürtőskalács',
    image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
];

const dummyOffers: Offer[] = [
  {
    id: '1',
    displayName: 'Hétfő-Csütörtök Reggeli Akció',
    description: 'Hétfőtől csütörtökig 20% kedvezmény a reggelikből',
    isRecurring: true,
    daysOfWeek: [1, 2, 3, 4], // Monday, Tuesday, Wednesday, Thursday
    discountPercentage: 20,
    isActive: true,
    categories: [
      { id: 'offer1-cat1', displayName: 'Akciós Reggelik', icon: 'Coffee' }
    ],
    menuItems: [
      {
        id: 'offer1-item1',
        displayName: 'Akciós Magyar Reggeli',
        orderNumber: 101,
        categoryId: 'offer1-cat1',
        price: 2312, // 20% off from 2890
        currency: 'HUF',
        ingredients: 'Két tojás, szalonna, kolbász, kenyér, paradicsom',
        allergens: 'Tojás, Glutén',
        calories: 650,
        extraDescription: 'Hagyományos magyar reggeli 20% kedvezménnyel',
        image: 'https://images.pexels.com/photos/101533/pexels-photo-101533.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'offer1-item2',
        displayName: 'Akciós Palacsinta',
        orderNumber: 102,
        categoryId: 'offer1-cat1',
        price: 1512, // 20% off from 1890
        currency: 'HUF',
        ingredients: 'Három palacsinta, Nutella, porcukor',
        allergens: 'Glutén, Tejtermék, Mogyoró',
        calories: 520,
        extraDescription: 'Nutellás palacsinta 20% kedvezménnyel',
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ]
  },
  {
    id: '2',
    displayName: 'Hétvégi Családi Menü',
    description: 'Szombat-vasárnap családi kedvezmények',
    isRecurring: true,
    daysOfWeek: [6, 0], // Saturday, Sunday
    discountPercentage: 15,
    isActive: true,
    categories: [
      { id: 'offer2-cat1', displayName: 'Családi Főételek', icon: 'Beef' }
    ],
    menuItems: [
      {
        id: 'offer2-item1',
        displayName: 'Családi Schnitzel Tál',
        orderNumber: 201,
        categoryId: 'offer2-cat1',
        price: 2966, // 15% off from 3490
        currency: 'HUF',
        ingredients: 'Nagy adag sertéshús, bundázás, petrezselymes burgonya',
        allergens: 'Glutén, Tojás',
        calories: 950,
        extraDescription: '15% kedvezmény hétvégén, családi méret',
        image: 'https://images.pexels.com/photos/8753657/pexels-photo-8753657.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ]
  },
  {
    id: '3',
    displayName: 'Csütörtöki Desszert Akció',
    description: 'Minden csütörtökön 25% kedvezmény a desszertekből',
    isRecurring: true,
    daysOfWeek: [4], // Thursday only
    discountPercentage: 25,
    isActive: true,
    categories: [
      { id: 'offer3-cat1', displayName: 'Akciós Desszertek', icon: 'IceCream' }
    ],
    menuItems: [
      {
        id: 'offer3-item1',
        displayName: 'Akciós Somlói Galuska',
        orderNumber: 301,
        categoryId: 'offer3-cat1',
        price: 1192, // 25% off from 1590
        currency: 'HUF',
        ingredients: 'Piskóta, dió, mazsola, csokoládé, tejszín',
        allergens: 'Glutén, Tejtermék, Dió, Tojás',
        calories: 480,
        extraDescription: 'Hagyományos magyar desszert 25% kedvezménnyel',
        image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'offer3-item2',
        displayName: 'Akciós Kürtőskalács',
        orderNumber: 302,
        categoryId: 'offer3-cat1',
        price: 667, // 25% off from 890
        currency: 'HUF',
        ingredients: 'Édes tészta, cukor, fahéj',
        allergens: 'Glutén, Tejtermék, Tojás',
        calories: 320,
        phoneticPronunciation: 'KUER-tosh-ka-lach',
        extraDescription: 'Frissen sült kürtőskalács 25% kedvezménnyel',
        image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ]
  }
];

export function MenuProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [menuStyle, setMenuStyle] = useState<MenuStyle>(defaultMenuStyle);
  const [qrCardStyle, setQRCardStyle] = useState<QRCardStyle>(defaultQRCardStyle);
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);

  const getNextOrderNumber = (categoryId: string): number => {
    // Find the category index (1-based)
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) return 101; // Default to first category if not found
    
    const categoryOrderBase = (categoryIndex + 1) * 100;
    
    // Find existing items in this category
    const categoryItems = menuItems.filter(item => item.categoryId === categoryId);
    
    if (categoryItems.length === 0) {
      return categoryOrderBase + 1; // First item: 101, 201, 301, etc.
    }
    
    // Find the highest order number in this category
    const maxOrderNumber = Math.max(...categoryItems.map(item => item.orderNumber));
    return maxOrderNumber + 1;
  };

  const getNextOfferOrderNumber = (offerId: string, categoryId: string): number => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return 101;

    const categoryIndex = offer.categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) return 101;
    
    const categoryOrderBase = (categoryIndex + 1) * 100;
    
    // Find existing items in this category within the offer
    const categoryItems = offer.menuItems.filter(item => item.categoryId === categoryId);
    
    if (categoryItems.length === 0) {
      return categoryOrderBase + 1;
    }
    
    const maxOrderNumber = Math.max(...categoryItems.map(item => item.orderNumber));
    return maxOrderNumber + 1;
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const addMenuItem = (item: Omit<MenuItem, 'id' | 'orderNumber'>) => {
    const orderNumber = getNextOrderNumber(item.categoryId);
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
      orderNumber,
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const addOffer = (offer: Omit<Offer, 'id'>) => {
    const newOffer: Offer = {
      ...offer,
      id: Date.now().toString(),
    };
    setOffers(prev => [...prev, newOffer]);
  };

  const updateOffer = (offerId: string, offerUpdate: Partial<Offer>) => {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId ? { ...offer, ...offerUpdate } : offer
    ));
  };

  const deleteOffer = (offerId: string) => {
    setOffers(prev => prev.filter(offer => offer.id !== offerId));
  };

  const addCategoryToOffer = (offerId: string, category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: `${offerId}-cat-${Date.now()}`,
    };
    
    setOffers(prev => prev.map(offer => 
      offer.id === offerId 
        ? { ...offer, categories: [...offer.categories, newCategory] }
        : offer
    ));
  };

  const addMenuItemToOffer = (offerId: string, item: Omit<MenuItem, 'id' | 'orderNumber'>) => {
    const orderNumber = getNextOfferOrderNumber(offerId, item.categoryId);
    const newItem: MenuItem = {
      ...item,
      id: `${offerId}-item-${Date.now()}`,
      orderNumber,
    };
    
    setOffers(prev => prev.map(offer => 
      offer.id === offerId 
        ? { ...offer, menuItems: [...offer.menuItems, newItem] }
        : offer
    ));
  };

  const updateMenuStyle = (style: Partial<MenuStyle>) => {
    setMenuStyle(prev => ({ ...prev, ...style }));
  };

  const updateQRCardStyle = (style: Partial<QRCardStyle>) => {
    setQRCardStyle(prev => ({ ...prev, ...style }));
  };

  const toggleSelectedItem = (item: MenuItem) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const clearSelectedItems = () => {
    setSelectedItems([]);
  };

  const getTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + item.price, 0);
  };

  const addDummyData = () => {
    setCategories(dummyCategories);
    setMenuItems(dummyMenuItems);
    setOffers(dummyOffers);
  };

  const clearAllData = () => {
    setCategories([]);
    setMenuItems([]);
    setOffers([]);
    setSelectedItems([]);
  };

  return (
    <MenuContext.Provider value={{
      categories,
      menuItems,
      offers,
      menuStyle,
      qrCardStyle,
      selectedItems,
      addCategory,
      addMenuItem,
      addOffer,
      updateOffer,
      deleteOffer,
      addCategoryToOffer,
      addMenuItemToOffer,
      updateMenuStyle,
      updateQRCardStyle,
      toggleSelectedItem,
      clearSelectedItems,
      getTotalPrice,
      addDummyData,
      clearAllData,
      getNextOrderNumber,
      getNextOfferOrderNumber,
    }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}