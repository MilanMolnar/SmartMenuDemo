'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMenu } from '@/contexts/MenuContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus } from 'lucide-react';

export function CategoryForm() {
  const [displayName, setDisplayName] = useState('');
  const [icon, setIcon] = useState('');
  const { addCategory, categories } = useMenu();
  const { t } = useLanguage();

  const iconOptions = [
    { value: 'Coffee', label: t('icons.coffee') },
    { value: 'Beef', label: t('icons.beef') },
    { value: 'IceCream', label: t('icons.iceCream') },
    { value: 'Pizza', label: t('icons.pizza') },
    { value: 'Salad', label: t('icons.salad') },
    { value: 'Fish', label: t('icons.fish') },
    { value: 'Soup', label: t('icons.soup') },
    { value: 'Wine', label: t('icons.wine') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    addCategory({
      displayName: displayName.trim(),
      icon: icon || undefined,
    });

    setDisplayName('');
    setIcon('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="categoryName">{t('categories.displayName')} {t('common.required')}</Label>
          <Input
            id="categoryName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t('categories.displayNamePlaceholder')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryIcon">{t('categories.icon')} {t('common.optional')}</Label>
          <Select value={icon} onValueChange={setIcon}>
            <SelectTrigger>
              <SelectValue placeholder={t('categories.iconPlaceholder')} />
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

        <Button type="submit" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          {t('categories.addButton')}
        </Button>
      </form>

      <div className="space-y-2">
        <Label>{t('categories.current')}</Label>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>{category.displayName}</span>
              {category.icon && (
                <span className="text-sm text-muted-foreground">{category.icon}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}