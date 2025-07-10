'use client';

import { useState } from 'react';
import { useMenu } from '@/contexts/MenuContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tag, Calendar, Edit, Trash2, Save, X, AlertTriangle, Utensils, Clock } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { SVGProps } from 'react';
import { MenuItem, Category, Offer } from '@/contexts/MenuContext';

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

const currencies = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'HUF', label: 'HUF (Ft)', symbol: 'Ft' },
  { value: 'CAD', label: 'CAD (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'AUD (A$)', symbol: 'A$' },
];

const iconOptions = [
  { value: 'Coffee', label: 'Kávé' },
  { value: 'Beef', label: 'Marhahús' },
  { value: 'IceCream', label: 'Fagylalt' },
  { value: 'Pizza', label: 'Pizza' },
  { value: 'Salad', label: 'Saláta' },
  { value: 'Fish', label: 'Hal' },
  { value: 'Soup', label: 'Leves' },
  { value: 'Wine', label: 'Bor' },
];

type EditModalType = 'category' | 'menuItem' | 'offer' | null;
type EditableItem = MenuItem | Category | Offer;
type EditFormData = Partial<MenuItem & Category & Offer>;

export function MenuPreview() {
  const { 
    categories, 
    menuItems, 
    offers, 
    menuStyle, 
    updateOffer, 
    deleteOffer,
    // We'll need to add these functions to the context
  } = useMenu();
  const { t } = useLanguage();

  // Modal state
  const [editModalType, setEditModalType] = useState<EditModalType>(null);
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
  const [editForm, setEditForm] = useState<EditFormData>({});

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const currentDay = new Date().getDay();
  
  // Filter active offers for today
  const activeOffers = offers.filter(offer => {
    const isActive = offer.isActive;
    const hasToday = offer.daysOfWeek.includes(currentDay);
    const hasContent = offer.categories.length > 0 && offer.menuItems.length > 0;
    
    return isActive && hasToday && hasContent;
  });

  // Filter inactive offers
  const inactiveOffers = offers.filter(offer => {
    const isActive = offer.isActive;
    const hasToday = offer.daysOfWeek.includes(currentDay);
    const hasContent = offer.categories.length > 0 && offer.menuItems.length > 0;
    
    return !isActive || !hasToday || !hasContent;
  });

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

  // Modal handlers
  const openEditModal = (type: EditModalType, item: EditableItem) => {
    setEditModalType(type);
    setEditingItem(item);
    setEditForm({ ...item });
  };

  const closeEditModal = () => {
    setEditModalType(null);
    setEditingItem(null);
    setEditForm({});
  };

  const handleSave = () => {
    if (editModalType === 'offer' && editingItem) {
      updateOffer(editingItem.id, editForm as Partial<Offer>);
    }
    // TODO: Add handlers for category and menuItem updates
    closeEditModal();
  };

  const handleDelete = () => {
    if (editModalType === 'offer' && editingItem) {
      deleteOffer(editingItem.id);
    }
    // TODO: Add handlers for category and menuItem deletion
    closeEditModal();
  };

  const handleDayToggle = (day: number) => {
    setEditForm((prev: EditFormData) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek?.includes(day)
        ? prev.daysOfWeek.filter((d: number) => d !== day)
        : [...(prev.daysOfWeek || []), day]
    }));
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
          onClick={() => openEditModal('menuItem', item)}
        >
          {item.image && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          )}
          
          <div className="relative h-full p-3 flex flex-col justify-between">
            <div className="flex justify-end">
              <Edit className="h-3 w-3 opacity-60 text-white" />
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
          onClick={() => openEditModal('menuItem', item)}
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
              <Edit className="h-3 w-3 opacity-40" style={{ color: menuStyle.textColor }} />
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

          {/* Price on right */}
          <div className="flex-shrink-0">
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
          onClick={() => openEditModal('menuItem', item)}
        >
          <div className="space-y-2">
            {/* Header with order number, name, and price */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span 
                    className="text-xs font-medium opacity-60"
                    style={{ color: menuStyle.textColor }}
                  >
                    #{item.orderNumber}
                  </span>
                  <Edit className="h-3 w-3 opacity-40" style={{ color: menuStyle.textColor }} />
                </div>
                <h5 
                  className="font-semibold text-lg leading-tight"
                  style={{ color: menuStyle.textColor }}
                >
                  {item.displayName}
                </h5>
              </div>
              <span 
                className="font-bold text-lg ml-4"
                style={{ color: menuStyle.textColor }}
              >
                {formatPrice(item.price, item.currency)}
              </span>
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
          onClick={() => openEditModal('menuItem', item)}
        >
          {item.image && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          )}
          
          <div className="relative h-full p-4 flex flex-col justify-between">
            <div className="flex justify-end">
              <Edit className="h-3 w-3 opacity-60 text-white" />
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
          onClick={() => openEditModal('menuItem', item)}
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
              <Edit className="h-3 w-3 opacity-40" style={{ color: menuStyle.textColor }} />
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

          <div className="flex-shrink-0">
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
          onClick={() => openEditModal('menuItem', item)}
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
                  <Edit className="h-4 w-4 opacity-40" style={{ color: menuStyle.textColor }} />
                </div>
                <h5 
                  className="font-semibold text-xl leading-tight"
                  style={{ color: menuStyle.textColor }}
                >
                  {item.displayName}
                </h5>
              </div>
              <span 
                className="font-bold text-xl ml-6"
                style={{ color: menuStyle.textColor }}
              >
                {formatPrice(item.price, item.currency)}
              </span>
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
    <div className="max-h-[600px] overflow-y-auto">
      <div 
        className={`p-4 rounded-lg ${fontClass}`}
        style={{ 
          backgroundColor: menuStyle.backgroundColor,
          color: menuStyle.textColor 
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <Utensils className="h-8 w-8 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">{t('menu.dinerMenu')}</h1>
          <p className="text-sm opacity-75">{t('menu.tagline')}</p>
        </div>

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
                  className="rounded-lg p-4 border-2 border-dashed space-y-4 cursor-pointer hover:bg-opacity-80 transition-colors"
                  style={{ 
                    backgroundColor: menuStyle.cardColor,
                    borderColor: menuStyle.accentColor
                  }}
                  onClick={() => openEditModal('offer', offer)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{offer.displayName}</h3>
                    <div className="flex items-center space-x-2">
                      {offer.discountPercentage && (
                        <Badge 
                          variant="default" 
                          style={{ backgroundColor: menuStyle.accentColor }}
                          className="text-white"
                        >
                          -{offer.discountPercentage}%
                        </Badge>
                      )}
                      <Edit className="h-3 w-3 opacity-60" />
                    </div>
                  </div>
                  {offer.description && (
                    <p className="text-sm opacity-75">{offer.description}</p>
                  )}
                  <div className="flex items-center space-x-2 text-xs opacity-60">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {offer.daysOfWeek.map(day => daysOfWeek[day]).join(', ')}
                    </span>
                    {offer.isRecurring && <span>• Ismétlődő</span>}
                  </div>

                  {/* Offer Items Wrapped Inside Dashed Box */}
                  {offer.categories.map(category => {
                    const categoryItems = offer.menuItems
                      .filter(item => item.categoryId === category.id)
                      .sort((a, b) => a.orderNumber - b.orderNumber);

                    if (categoryItems.length === 0) return null;

                    return (
                      <div key={category.id} className="mt-4">
                        <h4 
                          className="font-semibold mb-2 text-sm opacity-75 flex items-center space-x-2 cursor-pointer hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal('category', category);
                          }}
                        >
                          <Tag className="h-3 w-3" />
                          <span>{category.displayName}</span>
                          <Edit className="h-2 w-2 opacity-40" />
                        </h4>
                        
                        <div className="space-y-2">
                          {categoryItems.map(item => (
                            <div
                              key={item.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal('menuItem', item);
                              }}
                            >
                              {renderMenuItemCard(item, true)}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inactive Offers Section */}
        {inactiveOffers.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-bold text-orange-700">Inaktív Akciók</h2>
              <Badge variant="secondary" className="text-xs">
                {inactiveOffers.length}
              </Badge>
            </div>
            
            {inactiveOffers.map(offer => {
              const isInactive = !offer.isActive;
              const isWrongDay = !offer.daysOfWeek.includes(currentDay);
              const hasNoContent = offer.categories.length === 0 || offer.menuItems.length === 0;

              return (
                <div key={offer.id} className="mb-3 opacity-60">
                  <div 
                    className="rounded p-2 text-sm border-2 border-dashed mb-2 cursor-pointer hover:bg-opacity-80 transition-colors"
                    style={{ 
                      backgroundColor: `${menuStyle.cardColor}80`,
                      borderColor: '#f59e0b'
                    }}
                    onClick={() => openEditModal('offer', offer)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs">{offer.displayName}</span>
                      <div className="flex items-center space-x-1">
                        {offer.discountPercentage && (
                          <Badge 
                            variant="default" 
                            style={{ backgroundColor: menuStyle.accentColor }}
                            className="text-white text-xs"
                          >
                            -{offer.discountPercentage}%
                          </Badge>
                        )}
                        {isInactive && (
                          <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                            Inaktív
                          </Badge>
                        )}
                        {isWrongDay && (
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                            Másnap
                          </Badge>
                        )}
                        {hasNoContent && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            Üres
                          </Badge>
                        )}
                        <Edit className="h-3 w-3 opacity-60" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-xs opacity-60">
                      <Calendar className="h-2 w-2" />
                      <span>{offer.daysOfWeek.map(day => daysOfWeek[day]).join(', ')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Regular Menu Categories */}
        {categorizedItems.map(category => {
          const raw = Icons[category.icon as keyof typeof Icons] ?? Icons.Tag;
          const CategoryIcon = raw as React.ComponentType<SVGProps<SVGSVGElement>>;

          return (
            <div key={category.id} className="mb-8">
              <div 
                className="flex items-center space-x-2 mb-4 cursor-pointer hover:opacity-80"
                onClick={() => openEditModal('category', category)}
              >
                <CategoryIcon className="h-5 w-5" />
                <h2 className="text-xl font-bold">{category.displayName}</h2>
                <Edit className="h-4 w-4 opacity-60" />
              </div>
              
              <div className="space-y-3">
                {category.items.length === 0 ? (
                  <p className="text-sm opacity-50 italic">{t('preview.noItems')}</p>
                ) : (
                  category.items.map(item => renderRegularMenuItemCard(item))
                )}
              </div>
            </div>
          );
        })}

        {/* Empty state when no content */}
        {categorizedItems.length === 0 && activeOffers.length === 0 && inactiveOffers.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Még nincs menü</h3>
            <p className="text-muted-foreground">
              A menü jelenleg üres. Kérjük, próbálja újra később.
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={editModalType !== null} onOpenChange={closeEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <span>
                {editModalType === 'offer' && 'Akció Szerkesztése'}
                {editModalType === 'category' && 'Kategória Szerkesztése'}
                {editModalType === 'menuItem' && 'Menü Elem Szerkesztése'}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {editModalType === 'offer' && editForm && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="offerName">Akció Neve</Label>
                  <Input
                    id="offerName"
                    value={editForm.displayName || ''}
                    onChange={(e) => setEditForm((prev: EditFormData) => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Kedvezmény %</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.discountPercentage || ''}
                    onChange={(e) => setEditForm((prev: EditFormData) => ({ ...prev, discountPercentage: parseFloat(e.target.value) || undefined }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="offerDescription">Leírás</Label>
                <Textarea
                  id="offerDescription"
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm((prev: EditFormData) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRecurring"
                      checked={editForm.isRecurring || false}
                      onCheckedChange={(checked) => setEditForm((prev: EditFormData) => ({ ...prev, isRecurring: !!checked }))}
                    />
                    <Label htmlFor="isRecurring">Ismétlődő akció</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={editForm.isActive || false}
                      onCheckedChange={(checked) => setEditForm((prev: EditFormData) => ({ ...prev, isActive: !!checked }))}
                    />
                    <Label htmlFor="isActive">Aktív akció</Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Aktív Napok</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {daysOfWeek.map((day, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${index}`}
                          checked={editForm.daysOfWeek?.includes(index) || false}
                          onCheckedChange={() => handleDayToggle(index)}
                        />
                        <Label htmlFor={`day-${index}`} className="text-sm font-medium">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Mentés
                </Button>
                <Button variant="outline" onClick={closeEditModal} className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  Mégse
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Törlés
                </Button>
              </div>
            </div>
          )}

          {editModalType === 'category' && editForm && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Kategória Neve</Label>
                <Input
                  id="categoryName"
                  value={editForm.displayName || ''}
                  onChange={(e) => setEditForm((prev: EditFormData) => ({ ...prev, displayName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryIcon">Ikon</Label>
                <Select 
                  value={editForm.icon || ''} 
                  onValueChange={(value) => setEditForm((prev: EditFormData) => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Válasszon ikont" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Mentés
                </Button>
                <Button variant="outline" onClick={closeEditModal} className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  Mégse
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Törlés
                </Button>
              </div>
            </div>
          )}

          {editModalType === 'menuItem' && editForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Elem Neve</Label>
                  <Input
                    id="itemName"
                    value={editForm.displayName || ''}
                    onChange={(e) => setEditForm((prev: EditFormData) => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemPrice">Ár</Label>
                  <Input
                    id="itemPrice"
                    type="number"
                    step="0.01"
                    value={editForm.price || ''}
                    onChange={(e) => setEditForm((prev: EditFormData) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemCurrency">Pénznem</Label>
                  <Select 
                    value={editForm.currency || 'HUF'} 
                    onValueChange={(value) => setEditForm((prev: EditFormData) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(currency => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemCalories">Kalóriák</Label>
                  <Input
                    id="itemCalories"
                    type="number"
                    value={editForm.calories || ''}
                    onChange={(e) => setEditForm((prev: EditFormData) => ({ ...prev, calories: parseInt(e.target.value) || undefined }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemIngredients">Összetevők</Label>
                <Textarea
                  id="itemIngredients"
                  value={editForm.ingredients || ''}
                  onChange={(e) => setEditForm((prev: EditFormData) => ({ ...prev, ingredients: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Mentés
                </Button>
                <Button variant="outline" onClick={closeEditModal} className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  Mégse
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Törlés
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}