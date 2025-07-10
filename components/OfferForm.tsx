'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMenu } from '@/contexts/MenuContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, Calendar, Percent, Trash2, Edit, Settings, Tag, Clock, AlertTriangle, CheckCircle, Upload, X } from 'lucide-react';

const daysOfWeek = [
  { value: 0, label: 'Vasárnap', shortLabel: 'V' },
  { value: 1, label: 'Hétfő', shortLabel: 'H' },
  { value: 2, label: 'Kedd', shortLabel: 'K' },
  { value: 3, label: 'Szerda', shortLabel: 'Sz' },
  { value: 4, label: 'Csütörtök', shortLabel: 'Cs' },
  { value: 5, label: 'Péntek', shortLabel: 'P' },
  { value: 6, label: 'Szombat', shortLabel: 'Szo' },
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

export function OfferForm() {
  const { offers, addOffer, updateOffer, deleteOffer, addCategoryToOffer, addMenuItemToOffer, getNextOfferOrderNumber } = useMenu();
  const { t } = useLanguage();
  
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('create');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalTab, setEditModalTab] = useState('categories');
  
  // Offer creation form
  const [offerForm, setOfferForm] = useState({
    displayName: '',
    description: '',
    isRecurring: true,
    daysOfWeek: [] as number[],
    startDate: '',
    endDate: '',
    discountPercentage: '',
    isActive: true,
  });

  // Category form for offers
  const [categoryForm, setCategoryForm] = useState({
    displayName: '',
    icon: '',
  });

  // Menu item form for offers
  const [itemForm, setItemForm] = useState({
    displayName: '',
    categoryId: '',
    price: '',
    currency: 'HUF',
    phoneticPronunciation: '',
    ingredients: '',
    allergens: '',
    calories: '',
    extraDescription: '',
    image: '',
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerForm.displayName.trim()) return;

    addOffer({
      displayName: offerForm.displayName.trim(),
      description: offerForm.description.trim() || undefined,
      isRecurring: offerForm.isRecurring,
      daysOfWeek: offerForm.daysOfWeek,
      startDate: offerForm.startDate || undefined,
      endDate: offerForm.endDate || undefined,
      discountPercentage: offerForm.discountPercentage ? parseFloat(offerForm.discountPercentage) : undefined,
      isActive: offerForm.isActive,
      categories: [],
      menuItems: [],
    });

    setOfferForm({
      displayName: '',
      description: '',
      isRecurring: true,
      daysOfWeek: [],
      startDate: '',
      endDate: '',
      discountPercentage: '',
      isActive: true,
    });
  };

  const handleDayToggle = (day: number) => {
    setOfferForm(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.displayName.trim() || !selectedOffer) return;

    addCategoryToOffer(selectedOffer, {
      displayName: categoryForm.displayName.trim(),
      icon: categoryForm.icon || undefined,
    });

    setCategoryForm({
      displayName: '',
      icon: '',
    });
  };

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.displayName.trim() || !itemForm.categoryId || !itemForm.price || !selectedOffer) return;

    addMenuItemToOffer(selectedOffer, {
      displayName: itemForm.displayName.trim(),
      categoryId: itemForm.categoryId,
      price: parseFloat(itemForm.price),
      currency: itemForm.currency,
      phoneticPronunciation: itemForm.phoneticPronunciation.trim() || undefined,
      ingredients: itemForm.ingredients.trim() || undefined,
      allergens: itemForm.allergens.trim() || undefined,
      calories: itemForm.calories ? parseInt(itemForm.calories) : undefined,
      extraDescription: itemForm.extraDescription.trim() || undefined,
      image: itemForm.image || undefined,
    });

    setItemForm({
      displayName: '',
      categoryId: '',
      price: '',
      currency: 'HUF',
      phoneticPronunciation: '',
      ingredients: '',
      allergens: '',
      calories: '',
      extraDescription: '',
      image: '',
    });
    setUploadedFile(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setItemForm(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setItemForm(prev => ({ ...prev, image: '' }));
    setUploadedFile(null);
  };

  const selectedOfferData = offers.find(o => o.id === selectedOffer);
  const nextOrderNumber = selectedOffer && itemForm.categoryId 
    ? getNextOfferOrderNumber(selectedOffer, itemForm.categoryId) 
    : null;

  const openEditModal = (offerId: string) => {
    setSelectedOffer(offerId);
    setShowEditModal(true);
    setEditModalTab('categories');
  };

  // Get current day for status checking
  const currentDay = new Date().getDay();

  const getOfferStatus = (offer: any) => {
    const isActive = offer.isActive;
    const hasToday = offer.daysOfWeek.includes(currentDay);
    const hasContent = offer.categories.length > 0 && offer.menuItems.length > 0;
    
    if (!isActive) return { status: 'inactive', label: 'Inaktív', color: 'bg-red-100 text-red-700', icon: AlertTriangle };
    if (!hasToday) return { status: 'wrong-day', label: 'Nem ma', color: 'bg-orange-100 text-orange-700', icon: Calendar };
    if (!hasContent) return { status: 'empty', label: 'Üres', color: 'bg-gray-100 text-gray-700', icon: Tag };
    return { status: 'active', label: 'Aktív', color: 'bg-green-100 text-green-700', icon: CheckCircle };
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Akció Létrehozása</TabsTrigger>
          <TabsTrigger value="manage">Akciók Kezelése</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Új Akció Létrehozása</span>
              </CardTitle>
              <CardDescription>
                Hozzon létre új akciókat speciális napokra vagy időszakokra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOfferSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="offerName">Akció Neve *</Label>
                    <Input
                      id="offerName"
                      value={offerForm.displayName}
                      onChange={(e) => setOfferForm(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="pl. Hétfői Reggeli Akció"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">Kedvezmény % (Opcionális)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        value={offerForm.discountPercentage}
                        onChange={(e) => setOfferForm(prev => ({ ...prev, discountPercentage: e.target.value }))}
                        placeholder="pl. 20"
                      />
                      <Percent className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offerDescription">Leírás (Opcionális)</Label>
                  <Textarea
                    id="offerDescription"
                    value={offerForm.description}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Rövid leírás az akcióról"
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isRecurring"
                        checked={offerForm.isRecurring}
                        onCheckedChange={(checked) => setOfferForm(prev => ({ ...prev, isRecurring: !!checked }))}
                      />
                      <Label htmlFor="isRecurring">Ismétlődő akció</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={offerForm.isActive}
                        onCheckedChange={(checked) => setOfferForm(prev => ({ ...prev, isActive: !!checked }))}
                      />
                      <Label htmlFor="isActive">Aktív akció</Label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Aktív Napok</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {daysOfWeek.map(day => (
                        <div key={day.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${day.value}`}
                            checked={offerForm.daysOfWeek.includes(day.value)}
                            onCheckedChange={() => handleDayToggle(day.value)}
                          />
                          <Label htmlFor={`day-${day.value}`} className="text-sm font-medium">
                            {day.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!offerForm.isRecurring && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Kezdő Dátum</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={offerForm.startDate}
                          onChange={(e) => setOfferForm(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">Befejező Dátum</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={offerForm.endDate}
                          onChange={(e) => setOfferForm(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Akció Létrehozása
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Létrehozott Akciók</CardTitle>
              <CardDescription>Kezelje és szerkessze a meglévő akciókat</CardDescription>
            </CardHeader>
            <CardContent>
              {offers.length === 0 ? (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Még nincsenek akciók</h3>
                  <p className="text-muted-foreground mb-4">
                    Hozza létre az első akcióját a fenti "Akció Létrehozása" fülön.
                  </p>
                  <Button onClick={() => setActiveTab('create')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Első Akció Létrehozása
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {offers.map(offer => {
                    const status = getOfferStatus(offer);
                    const StatusIcon = status.icon;
                    
                    return (
                      <div key={offer.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                        {/* Header Row */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">{offer.displayName}</h3>
                              <Badge className={`${status.color} flex items-center space-x-1 px-2 py-1`}>
                                <StatusIcon className="h-3 w-3" />
                                <span className="text-xs font-medium">{status.label}</span>
                              </Badge>
                            </div>
                            
                            {offer.description && (
                              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                {offer.description}
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <Button 
                              onClick={() => openEditModal(offer.id)}
                              variant="outline"
                              size="sm"
                              className="flex items-center space-x-1"
                            >
                              <Settings className="w-4 h-4" />
                              <span>Szerkesztés</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteOffer(offer.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {offer.discountPercentage && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Percent className="h-3 w-3 mr-1" />
                              {offer.discountPercentage}% kedvezmény
                            </Badge>
                          )}
                          {offer.isRecurring && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <Calendar className="h-3 w-3 mr-1" />
                              Ismétlődő
                            </Badge>
                          )}
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            <Tag className="h-3 w-3 mr-1" />
                            {offer.categories.length} kategória
                          </Badge>
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            <Clock className="h-3 w-3 mr-1" />
                            {offer.menuItems.length} menü elem
                          </Badge>
                        </div>

                        {/* Details Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                          {/* Left Column - Days */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Aktív Napok
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {offer.daysOfWeek.length > 0 ? (
                                offer.daysOfWeek.map(day => (
                                  <Badge key={day} variant="secondary" className="text-xs">
                                    {daysOfWeek[day].label}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500 italic">Nincs nap kiválasztva</span>
                              )}
                            </div>
                            
                            {!offer.isRecurring && (offer.startDate || offer.endDate) && (
                              <div className="mt-2 text-xs text-gray-500">
                                {offer.startDate && <div>Kezdés: {offer.startDate}</div>}
                                {offer.endDate && <div>Befejezés: {offer.endDate}</div>}
                              </div>
                            )}
                          </div>

                          {/* Right Column - Categories */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <Tag className="h-4 w-4 mr-1" />
                              Kategóriák
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {offer.categories.length > 0 ? (
                                <>
                                  {offer.categories.slice(0, 4).map(category => (
                                    <Badge key={category.id} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                      {category.displayName}
                                    </Badge>
                                  ))}
                                  {offer.categories.length > 4 && (
                                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                                      +{offer.categories.length - 4} további
                                    </Badge>
                                  )}
                                </>
                              ) : (
                                <span className="text-sm text-gray-500 italic">Nincsenek kategóriák</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <span>{selectedOfferData?.displayName} - Szerkesztés</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedOfferData && (
            <div className="space-y-6">
              <Tabs value={editModalTab} onValueChange={setEditModalTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="categories">Kategóriák Kezelése</TabsTrigger>
                  <TabsTrigger value="items">Menü Elemek Kezelése</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Új Kategória Hozzáadása</CardTitle>
                      <CardDescription>
                        Hozzon létre kategóriákat az akció menü elemeinek rendszerezéséhez
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="categoryName">Kategória Neve *</Label>
                            <Input
                              id="categoryName"
                              value={categoryForm.displayName}
                              onChange={(e) => setCategoryForm(prev => ({ ...prev, displayName: e.target.value }))}
                              placeholder="pl. Akciós Reggelik"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="categoryIcon">Ikon (Opcionális)</Label>
                            <Select 
                              value={categoryForm.icon} 
                              onValueChange={(value) => setCategoryForm(prev => ({ ...prev, icon: value }))}
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
                        </div>

                        <Button type="submit" className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Kategória Hozzáadása
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Jelenlegi Kategóriák ({selectedOfferData.categories.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedOfferData.categories.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Tag className="h-8 w-8 mx-auto mb-2" />
                          <p>Még nincsenek kategóriák létrehozva</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedOfferData.categories.map(category => (
                            <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{category.displayName}</span>
                              </div>
                              {category.icon && (
                                <Badge variant="outline" className="text-xs">
                                  {category.icon}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="items" className="space-y-6">
                  {selectedOfferData.categories.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Először hozzon létre kategóriákat</h3>
                        <p className="text-muted-foreground mb-4">
                          A menü elemek hozzáadásához először kategóriákat kell létrehoznia.
                        </p>
                        <Button onClick={() => setEditModalTab('categories')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Kategóriák Létrehozása
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle>Új Menü Elem Hozzáadása</CardTitle>
                          <CardDescription>
                            Adjon hozzá új elemeket az akció kategóriáihoz
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleItemSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="itemName">Elem Neve *</Label>
                                <Input
                                  id="itemName"
                                  value={itemForm.displayName}
                                  onChange={(e) => setItemForm(prev => ({ ...prev, displayName: e.target.value }))}
                                  placeholder="pl. Akciós Reggeli"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="itemCategory">Kategória *</Label>
                                <Select 
                                  value={itemForm.categoryId} 
                                  onValueChange={(value) => setItemForm(prev => ({ ...prev, categoryId: value }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Válasszon kategóriát" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {selectedOfferData.categories.map(category => (
                                      <SelectItem key={category.id} value={category.id}>
                                        {category.displayName}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {nextOrderNumber && (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <strong>Automatikus sorszám:</strong> #{nextOrderNumber}
                                </p>
                              </div>
                            )}

                            {/* Image Upload Section */}
                            <div className="space-y-2">
                              <Label htmlFor="offerItemImage">Étel Képe (Opcionális)</Label>
                              {!itemForm.image ? (
                                <div className="flex items-center space-x-2">
                                  <Input
                                    id="offerItemImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="flex-1"
                                  />
                                  <Button type="button" variant="outline" size="icon">
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="relative inline-block">
                                    <img
                                      src={itemForm.image}
                                      alt="Uploaded food"
                                      className="w-32 h-24 object-cover rounded-lg border"
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                      onClick={removeImage}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  {uploadedFile && (
                                    <p className="text-sm text-muted-foreground">
                                      Feltöltve: {uploadedFile.name}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="itemPrice">Ár *</Label>
                                <Input
                                  id="itemPrice"
                                  type="number"
                                  step="0.01"
                                  value={itemForm.price}
                                  onChange={(e) => setItemForm(prev => ({ ...prev, price: e.target.value }))}
                                  placeholder="pl. 12.99"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="itemCurrency">Pénznem *</Label>
                                <Select 
                                  value={itemForm.currency} 
                                  onValueChange={(value) => setItemForm(prev => ({ ...prev, currency: value }))}
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
                                <Label htmlFor="itemCalories">Kalóriák (Opcionális)</Label>
                                <Input
                                  id="itemCalories"
                                  type="number"
                                  value={itemForm.calories}
                                  onChange={(e) => setItemForm(prev => ({ ...prev, calories: e.target.value }))}
                                  placeholder="pl. 450"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="itemIngredients">Összetevők (Opcionális)</Label>
                              <Textarea
                                id="itemIngredients"
                                value={itemForm.ingredients}
                                onChange={(e) => setItemForm(prev => ({ ...prev, ingredients: e.target.value }))}
                                placeholder="pl. Friss alapanyagok..."
                                rows={2}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="itemAllergens">Allergének (Opcionális)</Label>
                                <Input
                                  id="itemAllergens"
                                  value={itemForm.allergens}
                                  onChange={(e) => setItemForm(prev => ({ ...prev, allergens: e.target.value }))}
                                  placeholder="pl. Glutén, Tojás"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="itemPronunciation">Kiejtés (Opcionális)</Label>
                                <Input
                                  id="itemPronunciation"
                                  value={itemForm.phoneticPronunciation}
                                  onChange={(e) => setItemForm(prev => ({ ...prev, phoneticPronunciation: e.target.value }))}
                                  placeholder="pl. AK-ci-ósh REG-ge-li"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="itemDescription">További Leírás (Opcionális)</Label>
                              <Textarea
                                id="itemDescription"
                                value={itemForm.extraDescription}
                                onChange={(e) => setItemForm(prev => ({ ...prev, extraDescription: e.target.value }))}
                                placeholder="További részletek az ételről..."
                                rows={2}
                              />
                            </div>

                            <Button type="submit" className="w-full" size="lg">
                              <Plus className="w-4 h-4 mr-2" />
                              Elem Hozzáadása
                            </Button>
                          </form>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Jelenlegi Menü Elemek ({selectedOfferData.menuItems.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedOfferData.menuItems.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <Clock className="h-8 w-8 mx-auto mb-2" />
                              <p>Még nincsenek menü elemek hozzáadva</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {selectedOfferData.categories.map(category => {
                                const categoryItems = selectedOfferData.menuItems.filter(
                                  item => item.categoryId === category.id
                                );
                                
                                if (categoryItems.length === 0) return null;

                                return (
                                  <div key={category.id} className="space-y-2">
                                    <h4 className="font-semibold text-sm text-muted-foreground flex items-center space-x-2">
                                      <Tag className="h-3 w-3" />
                                      <span>{category.displayName}</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {categoryItems.map(item => (
                                        <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                                          <div className="flex items-start space-x-3">
                                            {item.image && (
                                              <img
                                                src={item.image}
                                                alt={item.displayName}
                                                className="w-12 h-9 object-cover rounded border flex-shrink-0"
                                              />
                                            )}
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center space-x-2 mb-1">
                                                <Badge variant="outline" className="text-xs">
                                                  #{item.orderNumber}
                                                </Badge>
                                                <span className="font-medium text-sm">{item.displayName}</span>
                                              </div>
                                              <div className="text-sm text-muted-foreground">
                                                <span className="font-semibold">{item.price} {item.currency}</span>
                                                {item.calories && (
                                                  <span className="ml-2">• {item.calories} cal</span>
                                                )}
                                              </div>
                                              {item.ingredients && (
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                  {item.ingredients}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}