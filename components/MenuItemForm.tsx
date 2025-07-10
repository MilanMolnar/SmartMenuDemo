'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMenu } from '@/contexts/MenuContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, Upload, X } from 'lucide-react';

const currencies = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'HUF', label: 'HUF (Ft)', symbol: 'Ft' },
  { value: 'CAD', label: 'CAD (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'AUD (A$)', symbol: 'A$' },
];

export function MenuItemForm() {
  const [formData, setFormData] = useState({
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

  const { addMenuItem, categories, getNextOrderNumber } = useMenu();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.displayName.trim() || !formData.categoryId || !formData.price) {
      return;
    }

    addMenuItem({
      displayName: formData.displayName.trim(),
      categoryId: formData.categoryId,
      price: parseFloat(formData.price),
      currency: formData.currency,
      phoneticPronunciation: formData.phoneticPronunciation.trim() || undefined,
      ingredients: formData.ingredients.trim() || undefined,
      allergens: formData.allergens.trim() || undefined,
      calories: formData.calories ? parseInt(formData.calories) : undefined,
      extraDescription: formData.extraDescription.trim() || undefined,
      image: formData.image || undefined,
    });

    setFormData({
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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setUploadedFile(null);
  };

  const nextOrderNumber = formData.categoryId ? getNextOrderNumber(formData.categoryId) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">{t('menuItems.displayName')} {t('common.required')}</Label>
          <Input
            id="displayName"
            value={formData.displayName}
            onChange={(e) => handleChange('displayName', e.target.value)}
            placeholder={t('menuItems.displayNamePlaceholder')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">{t('menuItems.category')} {t('common.required')}</Label>
          <Select value={formData.categoryId} onValueChange={(value) => handleChange('categoryId', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('menuItems.categoryPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
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
            <strong>{t('menuItems.autoOrderNumber')}:</strong> #{nextOrderNumber}
          </p>
        </div>
      )}

      {/* Image Upload Section */}
      <div className="space-y-2">
        <Label htmlFor="itemImage">Étel Képe {t('common.optional')}</Label>
        {!formData.image ? (
          <div className="flex items-center space-x-2">
            <Input
              id="itemImage"
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
                src={formData.image}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">{t('menuItems.price')} {t('common.required')}</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder={t('menuItems.pricePlaceholder')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">{t('menuItems.currency')} {t('common.required')}</Label>
          <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneticPronunciation">{t('menuItems.phoneticPronunciation')} {t('common.optional')}</Label>
        <Input
          id="phoneticPronunciation"
          value={formData.phoneticPronunciation}
          onChange={(e) => handleChange('phoneticPronunciation', e.target.value)}
          placeholder={t('menuItems.phoneticPronunciationPlaceholder')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ingredients">{t('menuItems.ingredients')} {t('common.optional')}</Label>
        <Textarea
          id="ingredients"
          value={formData.ingredients}
          onChange={(e) => handleChange('ingredients', e.target.value)}
          placeholder={t('menuItems.ingredientsPlaceholder')}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="allergens">{t('menuItems.allergens')} {t('common.optional')}</Label>
          <Input
            id="allergens"
            value={formData.allergens}
            onChange={(e) => handleChange('allergens', e.target.value)}
            placeholder={t('menuItems.allergensPlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="calories">{t('menuItems.calories')} {t('common.optional')}</Label>
          <Input
            id="calories"
            type="number"
            value={formData.calories}
            onChange={(e) => handleChange('calories', e.target.value)}
            placeholder={t('menuItems.caloriesPlaceholder')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="extraDescription">{t('menuItems.extraDescription')} {t('common.optional')}</Label>
        <Textarea
          id="extraDescription"
          value={formData.extraDescription}
          onChange={(e) => handleChange('extraDescription', e.target.value)}
          placeholder={t('menuItems.extraDescriptionPlaceholder')}
          rows={2}
        />
      </div>

      <Button type="submit" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        {t('menuItems.addButton')}
      </Button>
    </form>
  );
}