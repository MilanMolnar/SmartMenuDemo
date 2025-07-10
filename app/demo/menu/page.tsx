'use client';

import { useState } from 'react';
import { useMenu } from '@/contexts/MenuContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Users, Utensils, Tag, Calendar, ImageIcon, Maximize2, X } from 'lucide-react';
import { MenuItem, Offer } from '@/contexts/MenuContext';

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

export default function MenuPage() {
  const { categories, menuItems, offers, menuStyle, selectedItems, toggleSelectedItem, getTotalPrice, clearSelectedItems } = useMenu();
  const { t } = useLanguage();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
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
    toggleSelectedItem(item);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const currentDay = new Date().getDay();
  
  // Debug: Log current day and offers
  console.log('Current day:', currentDay, daysOfWeek[currentDay]);
  console.log('All offers:', offers);
  
  // Filter active offers for today - simplified logic
  const activeOffers = offers.filter(offer => {
    const isActive = offer.isActive;
    const hasToday = offer.daysOfWeek.includes(currentDay);
    const hasContent = offer.categories.length > 0 && offer.menuItems.length > 0;
    
    console.log(`Offer "${offer.displayName}":`, {
      isActive,
      hasToday,
      hasContent,
      daysOfWeek: offer.daysOfWeek,
      categoriesCount: offer.categories.length,
      itemsCount: offer.menuItems.length
    });
    
    return isActive && hasToday && hasContent;
  });

  console.log('Active offers for today:', activeOffers);

  const categorizedItems = categories.map(category => ({
    ...category,
    items: menuItems
      .filter(item => item.categoryId === category.id)
      .sort((a, b) => a.orderNumber - b.orderNumber)
  }));

  const fontClass = fontClassMap[menuStyle.fontFamily as keyof typeof fontClassMap] || 'font-inter';

  const formatPrice = (price: number, currency: string) => {
    const symbol = currencySymbols[currency] || currency;
    if (currency === 'HUF') {
      return `${price.toFixed(0)} ${symbol}`;
    }
    return `${symbol}${price.toFixed(2)}`;
  };

  // Render menu item based on selected design
  const renderMenuItemCard = (item: MenuItem, isOffer: boolean = false) => {
    const design = menuStyle.menuCardDesign;

    if (design === 'picture-canvas') {
      return (
        <div
          key={item.id}
          className={`rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md relative overflow-hidden h-32 ${isOffer ? 'border-2 border-dashed' : ''}`}
          style={{ 
            backgroundImage: item.image ? `url(${item.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: item.image ? 'transparent' : menuStyle.cardColor,
            borderColor: isOffer ? `${menuStyle.accentColor}60` : 'transparent'
          }}
          onClick={(e) => handleItemClick(item, e)}
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
              style={{ color: item.image ? '#fff' : menuStyle.textColor }}
            >
              #{item.orderNumber}
            </span>
            
            <div className="flex items-center justify-between">
              <h5 
                className="font-semibold text-m leading-tight"
                style={{ color: item.image ? '#fff' : menuStyle.textColor }}
              >
                {item.displayName}
              </h5>
              <span 
                className="font-bold text-m"
                style={{ color: item.image ? '#fff' : menuStyle.textColor }}
              >
                {formatPrice(item.price, item.currency)}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (design === 'menu-with-picture') {
      return (
        <div
          key={item.id}
          className={`rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md p-4 flex items-center space-x-4 ${isOffer ? 'border-2 border-dashed' : ''}`}
          style={{ 
            backgroundColor: menuStyle.cardColor,
            borderColor: isOffer ? `${menuStyle.accentColor}60` : 'transparent'
          }}
          onClick={(e) => handleItemClick(item, e)}
        >
          {/* Picture on left */}
          <div className="flex-shrink-0">
            {item.image ? (
              <img
                src={item.image}
                alt={item.displayName}
                className="w-16 h-12 object-cover rounded border"
              />
            ) : (
              <div 
                className="w-16 h-12 rounded border flex items-center justify-center"
                style={{ backgroundColor: `${menuStyle.accentColor}20` }}
              >
                <Utensils className="w-6 h-6" style={{ color: menuStyle.accentColor }} />
              </div>
            )}
          </div>

          {/* Order number and name in center */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span 
                className="text-xs font-medium opacity-60"
                style={{ color: menuStyle.textColor }}
              >
                #{item.orderNumber}
              </span>
            </div>
            <h5 
              className="font-semibold text-sm leading-tight truncate"
              style={{ color: menuStyle.textColor }}
            >
              {item.displayName}
            </h5>
            {item.calories && (
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 opacity-60" style={{ color: menuStyle.textColor }} />
                <span className="text-xs opacity-60" style={{ color: menuStyle.textColor }}>
                  {item.calories} cal
                </span>
              </div>
            )}
          </div>

          {/* Checkbox and price on right */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <div className="checkbox-container">
              <Checkbox
                checked={selectedItems.some(selected => selected.id === item.id)}
                onCheckedChange={() => handleCheckboxChange(item)}
                className="w-5 h-5"
              />
            </div>
            <span 
              className="font-bold text-lg"
              style={{ color: menuStyle.textColor }}
            >
              {formatPrice(item.price, item.currency)}
            </span>
          </div>
        </div>
      );
    }

    if (design === 'text-menu') {
      return (
        <div
          key={item.id}
          className={`rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md p-4 ${isOffer ? 'border-2 border-dashed' : ''}`}
          style={{ 
            backgroundColor: menuStyle.cardColor,
            borderColor: isOffer ? `${menuStyle.accentColor}60` : 'transparent'
          }}
          onClick={(e) => handleItemClick(item, e)}
        >
          <div className="space-y-2">
            {/* Header with order number, name, checkbox and price */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span 
                    className="text-xs font-medium opacity-60"
                    style={{ color: menuStyle.textColor }}
                  >
                    #{item.orderNumber}
                  </span>
                </div>
                <h5 
                  className="font-semibold text-lg leading-tight"
                  style={{ color: menuStyle.textColor }}
                >
                  {item.displayName}
                </h5>
              </div>
              <div className="flex items-center space-x-3 ml-4">
                <div className="checkbox-container">
                  <Checkbox
                    checked={selectedItems.some(selected => selected.id === item.id)}
                    onCheckedChange={() => handleCheckboxChange(item)}
                    className="w-5 h-5"
                  />
                </div>
                <span 
                  className="font-bold text-lg"
                  style={{ color: menuStyle.textColor }}
                >
                  {formatPrice(item.price, item.currency)}
                </span>
              </div>
            </div>

            {/* Ingredients */}
            {item.ingredients && (
              <p 
                className="text-sm leading-relaxed"
                style={{ color: `${menuStyle.textColor}CC` }}
              >
                {item.ingredients}
              </p>
            )}

            {/* Additional details */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {item.calories && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" style={{ color: menuStyle.accentColor }} />
                  <span style={{ color: menuStyle.textColor }}>
                    {item.calories} calories
                  </span>
                </div>
              )}
              {item.allergens && (
                <span 
                  className="px-2 py-1 rounded text-xs"
                  style={{ 
                    backgroundColor: `${menuStyle.accentColor}20`,
                    color: menuStyle.accentColor
                  }}
                >
                  Allergens: {item.allergens}
                </span>
              )}
            </div>

            {/* Extra description */}
            {item.extraDescription && (
              <p 
                className="text-xs italic"
                style={{ color: `${menuStyle.textColor}99` }}
              >
                {item.extraDescription}
              </p>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderRegularMenuItemCard = (item: MenuItem) => {
    const design = menuStyle.menuCardDesign;

    if (design === 'picture-canvas') {
      return (
        <div
          key={item.id}
          className="rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md relative overflow-hidden h-40"
          style={{ 
            backgroundImage: item.image ? `url(${item.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: item.image ? 'transparent' : menuStyle.cardColor
          }}
          onClick={(e) => handleItemClick(item, e)}
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
              className="text-xs font-medium opacity-90 pt-14"
              style={{ color: item.image ? '#fff' : menuStyle.textColor }}
            >
              #{item.orderNumber}
            </span>
            
            <div className="flex items-center justify-between">
              <h5 
                className="font-semibold text-lg leading-tight"
                style={{ color: item.image ? '#fff' : menuStyle.textColor }}
              >
                {item.displayName}
              </h5>
              <span 
                className="font-bold text-sm"
                style={{ color: item.image ? '#fff' : menuStyle.textColor }}
              >
                {formatPrice(item.price, item.currency)}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (design === 'menu-with-picture') {
      return (
        <div
          key={item.id}
          className="rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md p-4 flex items-center space-x-4"
          style={{ backgroundColor: menuStyle.cardColor }}
          onClick={(e) => handleItemClick(item, e)}
        >
          <div className="flex-shrink-0">
            {item.image ? (
              <img
                src={item.image}
                alt={item.displayName}
                className="w-20 h-16 object-cover rounded border"
              />
            ) : (
              <div 
                className="w-20 h-16 rounded border flex items-center justify-center"
                style={{ backgroundColor: `${menuStyle.accentColor}20` }}
              >
                <Utensils className="w-8 h-8" style={{ color: menuStyle.accentColor }} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span 
                className="text-xs font-medium opacity-60"
                style={{ color: menuStyle.textColor }}
              >
                #{item.orderNumber}
              </span>
            </div>
            <h5 
              className="font-semibold text-lg leading-tight"
              style={{ color: menuStyle.textColor }}
            >
              {item.displayName}
            </h5>
            {item.calories && (
              <div className="flex items-center space-x-1 mt-2">
                <Clock className="w-3 h-3 opacity-60" style={{ color: menuStyle.textColor }} />
                <span className="text-xs opacity-60" style={{ color: menuStyle.textColor }}>
                  {item.calories} cal
                </span>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 flex items-center space-x-3">
            <div className="checkbox-container">
              <Checkbox
                checked={selectedItems.some(selected => selected.id === item.id)}
                onCheckedChange={() => handleCheckboxChange(item)}
                className="w-5 h-5"
              />
            </div>
            <span 
              className="font-bold text-xl"
              style={{ color: menuStyle.textColor }}
            >
              {formatPrice(item.price, item.currency)}
            </span>
          </div>
        </div>
      );
    }

    if (design === 'text-menu') {
      return (
        <div
          key={item.id}
          className="rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md p-6"
          style={{ backgroundColor: menuStyle.cardColor }}
          onClick={(e) => handleItemClick(item, e)}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span 
                    className="text-sm font-medium opacity-60"
                    style={{ color: menuStyle.textColor }}
                  >
                    #{item.orderNumber}
                  </span>
                </div>
                <h5 
                  className="font-semibold text-xl leading-tight"
                  style={{ color: menuStyle.textColor }}
                >
                  {item.displayName}
                </h5>
              </div>
              <div className="flex items-center space-x-4 ml-6">
                <div className="checkbox-container">
                  <Checkbox
                    checked={selectedItems.some(selected => selected.id === item.id)}
                    onCheckedChange={() => handleCheckboxChange(item)}
                    className="w-5 h-5"
                  />
                </div>
                <span 
                  className="font-bold text-xl"
                  style={{ color: menuStyle.textColor }}
                >
                  {formatPrice(item.price, item.currency)}
                </span>
              </div>
            </div>

            {item.ingredients && (
              <p 
                className="text-base leading-relaxed"
                style={{ color: `${menuStyle.textColor}DD` }}
              >
                {item.ingredients}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm">
              {item.calories && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" style={{ color: menuStyle.accentColor }} />
                  <span style={{ color: menuStyle.textColor }}>
                    {item.calories} calories
                  </span>
                </div>
              )}
              {item.allergens && (
                <span 
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ 
                    backgroundColor: `${menuStyle.accentColor}20`,
                    color: menuStyle.accentColor
                  }}
                >
                  Allergens: {item.allergens}
                </span>
              )}
            </div>

            {item.extraDescription && (
              <p 
                className="text-sm italic pt-2 border-t"
                style={{ 
                  color: `${menuStyle.textColor}AA`,
                  borderColor: `${menuStyle.textColor}20`
                }}
              >
                {item.extraDescription}
              </p>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      className={`min-h-screen pb-20 ${fontClass}`}
      style={{ 
        backgroundColor: menuStyle.backgroundColor,
        color: menuStyle.textColor 
      }}
    >
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm sticky top-0 z-10 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <Utensils className="h-8 w-8 mx-auto mb-2" />
            <h1 className="text-2xl font-bold">{t('menu.dinerMenu')}</h1>
            <p className="text-sm opacity-75">{t('menu.tagline')}</p>
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
              <Badge variant="secondary" className="text-xs">
                {daysOfWeek[currentDay]}
              </Badge>
            </div>
            
            {activeOffers.map(offer => (
              <div key={offer.id} className="mb-6">
                <div 
                  className="rounded-lg p-4 mb-3 border-2 border-dashed"
                  style={{ 
                    backgroundColor: `${menuStyle.cardColor}`,
                    borderColor: menuStyle.accentColor
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{offer.displayName}</h3>
                    {offer.discountPercentage && (
                      <Badge 
                        variant="default" 
                        style={{ backgroundColor: menuStyle.accentColor }}
                        className="text-white"
                      >
                        -{offer.discountPercentage}%
                      </Badge>
                    )}
                  </div>
                  {offer.description && (
                    <p className="text-sm opacity-75 mb-2">{offer.description}</p>
                  )}
                  <div className="flex items-center space-x-2 text-xs opacity-60">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {offer.daysOfWeek.map(day => daysOfWeek[day]).join(', ')}
                    </span>
                    {offer.isRecurring && <span>• Ismétlődő</span>}
                  </div>
                </div>

                {/* Offer Categories and Items */}
                {offer.categories.map(category => {
                  const categoryItems = offer.menuItems
                    .filter(item => item.categoryId === category.id)
                    .sort((a, b) => a.orderNumber - b.orderNumber);

                  if (categoryItems.length === 0) return null;

                  return (
                    <div key={category.id} className="mb-4">
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
            ))}
          </div>
        )}

        {/* Regular Menu Categories */}
        {categorizedItems.map(category => (
          <div key={category.id} className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-xl font-bold">{category.displayName}</h2>
            </div>
            
            <div className="space-y-3">
              {category.items.map(item => renderRegularMenuItemCard(item))}
            </div>
          </div>
        ))}

        {/* Empty state when no content */}
        {categorizedItems.length === 0 && activeOffers.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Még nincs menü</h3>
            <p className="text-muted-foreground">
              A menü jelenleg üres. Kérjük, próbálja újra később.
            </p>
          </div>
        )}
      </div>

      {/* Total Button */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-20">
          <div className="max-w-md mx-auto">
            <Button
              onClick={() => setShowTotalModal(true)}
              className={`w-full py-4 text-lg font-semibold shadow-lg ${fontClass}`}
              style={{
                backgroundColor: menuStyle.buttonColor,
                color: menuStyle.buttonTextColor
              }}
            >
              {t('menu.total')}: {formatPrice(getTotalPrice(), selectedItems[0]?.currency || 'USD')} ({selectedItems.length} {t('menu.items')})
            </Button>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent 
          className={`max-w-md mx-auto ${fontClass}`}
          style={{
            backgroundColor: menuStyle.modalBackgroundColor,
            color: menuStyle.modalTextColor
          }}
        >
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <span>#{selectedItem.orderNumber}</span>
                  <span>{selectedItem.displayName}</span>
                  {/* Show if it's from an offer */}
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
                      style={{ backgroundColor: menuStyle.modalCardColor }}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {selectedItem.calories} calories
                    </Badge>
                  )}
                </div>

                {selectedItem.phoneticPronunciation && (
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: menuStyle.modalCardColor }}
                  >
                    <h4 className="font-semibold mb-1">{t('menu.pronunciation')}</h4>
                    <p className="text-sm italic">
                      {selectedItem.phoneticPronunciation}
                    </p>
                  </div>
                )}

                {selectedItem.ingredients && (
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: menuStyle.modalCardColor }}
                  >
                    <h4 className="font-semibold mb-1">{t('menuItems.ingredients')}</h4>
                    <p className="text-sm">{selectedItem.ingredients}</p>
                  </div>
                )}

                {selectedItem.allergens && (
                  <div 
                    className="p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: menuStyle.modalCardColor,
                      borderColor: menuStyle.accentColor
                    }}
                  >
                    <h4 className="font-semibold mb-1">{t('menuItems.allergens')}</h4>
                    <p className="text-sm" style={{ color: menuStyle.accentColor }}>
                      {selectedItem.allergens}
                    </p>
                  </div>
                )}

                {selectedItem.extraDescription && (
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: menuStyle.modalCardColor }}
                  >
                    <h4 className="font-semibold mb-1">{t('menu.description')}</h4>
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
            backgroundColor: menuStyle.modalBackgroundColor,
            color: menuStyle.modalTextColor
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{t('menu.orderSummary')}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              {selectedItems.map(item => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: menuStyle.modalCardColor }}
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
            
            <Separator style={{ backgroundColor: menuStyle.accentColor }} />
            
            <div className="flex items-center justify-between text-lg font-bold">
              <span>{t('menu.total')} ({selectedItems.length} {t('menu.items')})</span>
              <span>{formatPrice(getTotalPrice(), selectedItems[0]?.currency || 'USD')}</span>
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
                  borderColor: menuStyle.accentColor,
                  color: menuStyle.accentColor
                }}
              >
                {t('menu.clearAll')}
              </Button>
              <Button 
                onClick={() => setShowTotalModal(false)}
                className="flex-1"
                style={{
                  backgroundColor: menuStyle.buttonColor,
                  color: menuStyle.buttonTextColor
                }}
              >
                {t('menu.continue')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}