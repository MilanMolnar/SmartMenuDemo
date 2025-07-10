'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Users, Utensils, Tag, Calendar, Maximize2, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { SVGProps } from 'react';

// Static sample data for QR demo with images
const sampleCategories = [
  { id: '1', displayName: 'Reggelik', icon: 'Coffee' },
  { id: '2', displayName: 'Főételek', icon: 'Beef' },
  { id: '3', displayName: 'Desszertek', icon: 'IceCream' },
];

const sampleMenuItems = [
  {
    id: '1',
    displayName: 'Palacsinta Nutellával',
    orderNumber: 101,
    categoryId: '1',
    price: 1890,
    currency: 'HUF',
    ingredients: 'Három palacsinta, Nutella, porcukor',
    allergens: 'Glutén, Tejtermék, Mogyoró',
    calories: 520,
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
   {id: '2',
    displayName: 'Klasszikus Magyar Reggeli',
    orderNumber: 102,
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

const sampleOffers = [
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
      { id: 'offer2-cat1', displayName: 'Családi Akció', icon: 'Beef' }
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
      },
       {
        id: 'offer2-item2',
        displayName: 'Családi kiadós rántotta',
        orderNumber: 202,
        categoryId: 'offer2-cat1',
        price: 1899, // 15% off from 3490
        currency: 'HUF',
        ingredients: 'Nagy adag rántotta',
        allergens: 'Tojás',
        calories: 600,
        extraDescription: '15% kedvezmény hétvégén, családi méret',
        image: 'https://images.pexels.com/photos/101533/pexels-photo-101533.jpeg?auto=compress&cs=tinysrgb&w=400'
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

// Static menu style for consistency - using picture-canvas design
const sampleMenuStyle = {
  backgroundColor: '#f8f9fa',
  textColor: '#212529',
  cardColor: '#ffffff',
  fontFamily: 'Inter',
  modalBackgroundColor: '#ffffff',
  modalTextColor: '#000000',
  modalCardColor: '#f8f9fa',
  buttonColor: '#000000',
  buttonTextColor: '#ffffff',
  accentColor: '#6d9eed',
  menuCardDesign: 'picture-canvas'
};

const fontClassMap = {
  'Inter': 'font-inter',
  'Roboto': 'font-roboto',
  'Open Sans': 'font-open-sans',
  'Lato': 'font-lato',
  'Montserrat': 'font-montserrat',
  'Poppins': 'font-poppins'
};

const currencySymbols: { [key: string]: string } = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'HUF': 'Ft',
  'CAD': 'C$',
  'AUD': 'A$',
};

const daysOfWeek = [
  'Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'
];

interface MenuItem {
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
  image?: string;
}

export default function QRDemoMenuPage() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [showTotalModal, setShowTotalModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleItemClick = (item: MenuItem, e: React.MouseEvent) => {
    // Don't open modal if checkbox was clicked
    if ((e.target as HTMLElement).closest('.checkbox-container')) {
      return;
    }
    // Don't open modal if image was clicked
    if ((e.target as HTMLElement).closest('.image-container')) {
      return;
    }
    setSelectedItem(item);
  };

  const handleCheckboxChange = (item: MenuItem) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const getTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + item.price, 0);
  };

  const clearSelectedItems = () => {
    setSelectedItems([]);
  };

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const currentDay = new Date().getDay();
  
  // Filter active offers for today
  const activeOffers = sampleOffers.filter(offer => {
    const isActive = offer.isActive;
    const hasToday = offer.daysOfWeek.includes(currentDay);
    const hasContent = offer.categories.length > 0 && offer.menuItems.length > 0;
    
    return isActive && hasToday && hasContent;
  });

  const categorizedItems = sampleCategories.map(category => ({
    ...category,
    items: sampleMenuItems
      .filter(item => item.categoryId === category.id)
      .sort((a, b) => a.orderNumber - b.orderNumber)
  }));

  const fontClass = fontClassMap[sampleMenuStyle.fontFamily as keyof typeof fontClassMap] || 'font-inter';

  const formatPrice = (price: number, currency: string) => {
    const symbol = currencySymbols[currency] || currency;
    if (currency === 'HUF') {
      return `${price.toFixed(0)} ${symbol}`;
    }
    return `${symbol}${price.toFixed(2)}`;
  };
const renderMenuItemCard = (item: MenuItem, isOffer: boolean = false) => {
  return (
    <div
      key={item.id}
      className={`rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md relative overflow-hidden h-32 ${
        isOffer ? 'border-2 border-dashed' : ''
      }`}
      style={{
        backgroundImage: item.image ? `url(${item.image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: item.image ? 'transparent' : sampleMenuStyle.cardColor,
        borderColor: isOffer ? `${sampleMenuStyle.accentColor}60` : 'transparent',
      }}
      onClick={e => handleItemClick(item, e)}
    >
      {item.image && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      )}
      <div className="relative h-full p-3 flex flex-col justify-between">
        <div className="flex justify-end">
          <div className="checkbox-container">
            <Checkbox
              checked={selectedItems.some(selected => selected.id === item.id)}
              onCheckedChange={() => handleCheckboxChange(item)}
              className="w-5 h-5 bg-white/20 border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
          </div>
        </div>
        <span
          className="text-xs font-medium opacity-80 pt-8"
          style={{ color: item.image ? '#fff' : sampleMenuStyle.textColor }}
        >
          #{item.orderNumber}
        </span>
        <div className="flex items-center justify-between">
          <h5
            className="font-semibold text-md leading-tight"
            style={{ color: item.image ? '#fff' : sampleMenuStyle.textColor }}
          >
            {item.displayName}
          </h5>
          <span
            className="font-bold text-md"
            style={{ color: item.image ? '#fff' : sampleMenuStyle.textColor }}
          >
            {formatPrice(item.price, item.currency)}
          </span>
        </div>
      </div>
    </div>
  );
};

const renderRegularMenuItemCard = (item: MenuItem) => {
  return (
    <div
      key={item.id}
      className="rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md relative overflow-hidden h-40"
      style={{
        backgroundImage: item.image ? `url(${item.image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: item.image ? 'transparent' : sampleMenuStyle.cardColor,
      }}
      onClick={e => handleItemClick(item, e)}
    >
      {item.image && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      )}
      <div className="relative h-full p-4 flex flex-col justify-between">
        <div className="flex justify-end">
          <div className="checkbox-container">
            <Checkbox
              checked={selectedItems.some(selected => selected.id === item.id)}
              onCheckedChange={() => handleCheckboxChange(item)}
              className="w-5 h-5 bg-white/20 border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
          </div>
        </div>
        <span
          className="text-xs font-medium opacity-80 pt-14"
          style={{ color: item.image ? '#fff' : sampleMenuStyle.textColor }}
        >
          #{item.orderNumber}
        </span>
        <div className="flex items-center justify-between">
          <h5
            className="font-semibold text-md leading-tight"
            style={{ color: item.image ? '#fff' : sampleMenuStyle.textColor }}
          >
            {item.displayName}
          </h5>
          <span
            className="font-bold text-md"
            style={{ color: item.image ? '#fff' : sampleMenuStyle.textColor }}
          >
            {formatPrice(item.price, item.currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
  return (
    <div 
      className={`min-h-screen pb-20 ${fontClass}`}
      style={{ 
        backgroundColor: sampleMenuStyle.backgroundColor,
        color: sampleMenuStyle.textColor 
      }}
    >
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm top-0 z-10 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <Utensils className="h-8 w-8 mx-auto mb-2" />
            <h1 className="text-2xl font-bold">Demo Étterem</h1>
            <p className="text-sm opacity-75">Friss • Helyi • Finom</p>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-md mx-auto p-4">
        {/* Active Offers Section */}
        {activeOffers.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="h-5 w-5" />
              <h2 className="text-xl font-bold">Mai Akciók</h2>
              <Badge variant="secondary" className="text-xs">{daysOfWeek[currentDay]}</Badge>
            </div>

            {activeOffers.map(offer => (
              <div key={offer.id} className="mb-6">
                <div className="rounded-lg p-4 border-2 border-dashed space-y-4" style={{ backgroundColor: sampleMenuStyle.cardColor, borderColor: sampleMenuStyle.accentColor }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{offer.displayName}</h3>
                    {offer.discountPercentage && (
                      <Badge variant="default" style={{ backgroundColor: sampleMenuStyle.accentColor }} className="text-white">-{offer.discountPercentage}%</Badge>
                    )}
                  </div>
                  {offer.description && <p className="text-sm opacity-75">{offer.description}</p>}
                  <div className="flex items-center space-x-2 text-xs opacity-60">
                    <Calendar className="h-3 w-3" />
                    <span>{offer.daysOfWeek.map(day => daysOfWeek[day]).join(', ')}</span>
                    {offer.isRecurring && <span>• Ismétlődő</span>}
                  </div>

                  {/* Offer Items Wrapped Inside Dashed Box */}
                  {offer.categories.map(category => {
                    const categoryItems = offer.menuItems.filter(item => item.categoryId === category.id).sort((a, b) => a.orderNumber - b.orderNumber);
                    if (!categoryItems.length) return null;
                    return (
                      <div key={category.id} className="mt-4">
                        <h4 className="font-semibold mb-2 text-sm opacity-75 flex items-center space-x-2">
                          <Tag className="h-3 w-3" />
                          <span>{category.displayName}</span>
                        </h4>
                        <div className="space-y-2">
                          {categoryItems.map(item => renderMenuItemCard(item, true))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

       {/* Regular Menu Categories */}
  {categorizedItems.map(category => {
  const raw = Icons[category.icon as keyof typeof Icons] ?? Icons.Tag;
  const CategoryIcon = raw as React.ComponentType<SVGProps<SVGSVGElement>>;

  return (
    <div key={category.id} className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <CategoryIcon className="h-5 w-5" />
        <h2 className="text-xl font-bold">{category.displayName}</h2>
      </div>
      <div className="space-y-3">
        {category.items.map(item => renderRegularMenuItemCard(item))}
      </div>
    </div>
  );
})}
</div>

      {/* Total Button */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-20">
          <div className="max-w-md mx-auto">
            <Button
              onClick={() => setShowTotalModal(true)}
              className={`w-full py-4 text-lg font-semibold shadow-lg ${fontClass}`}
              style={{
                backgroundColor: sampleMenuStyle.buttonColor,
                color: sampleMenuStyle.buttonTextColor
              }}
            >
              Összesen: {formatPrice(getTotalPrice(), selectedItems[0]?.currency || 'HUF')} ({selectedItems.length} tétel)
            </Button>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent 
          className={`max-w-md mx-auto ${fontClass}`}
          style={{
            backgroundColor: sampleMenuStyle.modalBackgroundColor,
            color: sampleMenuStyle.modalTextColor
          }}
        >
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <span>#{selectedItem.orderNumber}</span>
                  <span>{selectedItem.displayName}</span>
                  {selectedItem.id.includes('offer') && (
                    <Tag className="h-4 w-4 text-orange-500" />
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Image in modal */}
                {selectedItem.image && (
                  <div className="relative">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.displayName}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleImageClick(selectedItem.image!)}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => handleImageClick(selectedItem.image!)}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{formatPrice(selectedItem.price, selectedItem.currency)}</span>
                  {selectedItem.calories && (
                    <Badge 
                      variant="secondary" 
                      style={{ backgroundColor: sampleMenuStyle.modalCardColor }}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {selectedItem.calories} kalória
                    </Badge>
                  )}
                </div>

                {selectedItem.phoneticPronunciation && (
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: sampleMenuStyle.modalCardColor }}
                  >
                    <h4 className="font-semibold mb-1">Kiejtés</h4>
                    <p className="text-sm italic">
                      {selectedItem.phoneticPronunciation}
                    </p>
                  </div>
                )}

                {selectedItem.ingredients && (
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: sampleMenuStyle.modalCardColor }}
                  >
                    <h4 className="font-semibold mb-1">Összetevők</h4>
                    <p className="text-sm">{selectedItem.ingredients}</p>
                  </div>
                )}

                {selectedItem.allergens && (
                  <div 
                    className="p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: sampleMenuStyle.modalCardColor,
                      borderColor: sampleMenuStyle.accentColor
                    }}
                  >
                    <h4 className="font-semibold mb-1">Allergének</h4>
                    <p className="text-sm" style={{ color: sampleMenuStyle.accentColor }}>
                      {selectedItem.allergens}
                    </p>
                  </div>
                )}

                {selectedItem.extraDescription && (
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: sampleMenuStyle.modalCardColor }}
                  >
                    <h4 className="font-semibold mb-1">Leírás</h4>
                    <p className="text-sm">{selectedItem.extraDescription}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Food image"
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setShowImageModal(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Total Modal */}
      <Dialog open={showTotalModal} onOpenChange={setShowTotalModal}>
        <DialogContent 
          className={`max-w-md mx-auto ${fontClass}`}
          style={{
            backgroundColor: sampleMenuStyle.modalBackgroundColor,
            color: sampleMenuStyle.modalTextColor
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Rendelés Összegzése</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              {selectedItems.map(item => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: sampleMenuStyle.modalCardColor }}
                >
                  <div className="flex items-center space-x-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.displayName}
                        className="w-12 h-9 object-cover rounded border"
                      />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium opacity-60">#{item.orderNumber}</span>
                        <span className="font-semibold">{item.displayName}</span>
                        {item.id.includes('offer') && (
                          <Tag className="h-3 w-3 text-orange-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="font-bold">{formatPrice(item.price, item.currency)}</span>
                </div>
              ))}
            </div>
            
            <Separator style={{ backgroundColor: sampleMenuStyle.accentColor }} />
            
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Összesen ({selectedItems.length} tétel)</span>
              <span>{formatPrice(getTotalPrice(), selectedItems[0]?.currency || 'HUF')}</span>
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  clearSelectedItems();
                  setShowTotalModal(false);
                }}
                className="flex-1"
                style={{
                  borderColor: sampleMenuStyle.accentColor,
                  color: sampleMenuStyle.accentColor
                }}
              >
                Összes Törlése
              </Button>
              <Button 
                onClick={() => setShowTotalModal(false)}
                className="flex-1"
                style={{
                  backgroundColor: sampleMenuStyle.buttonColor,
                  color: sampleMenuStyle.buttonTextColor
                }}
              >
                Folytatás
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}