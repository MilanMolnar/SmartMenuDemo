'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Monitor, Square, Layout } from 'lucide-react';
import { useMenu } from '@/contexts/MenuContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { defaultMenuStyle } from '@/contexts/MenuContext';
import { Button } from '@/components/ui/button';

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
];

const menuCardDesignOptions = [
  { 
    value: 'picture-canvas', 
    label: 'Picture Canvas Menu',
    description: 'Full background image with overlay text (current design)'
  },
  { 
    value: 'menu-with-picture', 
    label: 'Menu with Picture',
    description: 'Picture on left, order number and name in center, price on right'
  },
  { 
    value: 'text-menu', 
    label: 'Text Menu with Details',
    description: 'Text-only design without pictures, detailed information'
  },
];

const fontClassMap = {
  'Inter': 'font-inter',
  'Roboto': 'font-roboto',
  'Open Sans': 'font-open-sans',
  'Lato': 'font-lato',
  'Montserrat': 'font-montserrat',
  'Poppins': 'font-poppins'
};

export function StyleSettings() {
  const { menuStyle, updateMenuStyle } = useMenu();
  const { t } = useLanguage();

  const handleStyleChange = (field: keyof typeof menuStyle, value: string) => {
    updateMenuStyle({ [field]: value });
  };

  const handleRestoreDefaults = () => {
    updateMenuStyle(defaultMenuStyle);
  };

  const fontClass = fontClassMap[menuStyle.fontFamily as keyof typeof fontClassMap] || 'font-inter';

  return (
    <div className="space-y-6">
      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="menu" className="flex items-center space-x-2">
            <Monitor className="w-4 h-4" />
            <span>{t('style.menuPage')}</span>
          </TabsTrigger>
          <TabsTrigger value="modals" className="flex items-center space-x-2">
            <Square className="w-4 h-4" />
            <span>{t('style.modalsUI')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layout className="w-4 h-4" />
                <span>Menu Card Design</span>
              </CardTitle>
              <CardDescription>
                Choose how menu items are displayed to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="menuCardDesign">Card Design Style</Label>
                <Select value={menuStyle.menuCardDesign} onValueChange={(value: 'picture-canvas' | 'menu-with-picture' | 'text-menu') => handleStyleChange('menuCardDesign', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select card design" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuCardDesignOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Design Preview */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <Label className="text-sm font-medium mb-2 block">Preview:</Label>
                <div className="space-y-2">
                  {menuStyle.menuCardDesign === 'picture-canvas' && (
                    <div className="text-xs text-muted-foreground">
                      📸 Full background image with text overlay - immersive visual experience
                    </div>
                  )}
                  {menuStyle.menuCardDesign === 'menu-with-picture' && (
                    <div className="text-xs text-muted-foreground">
                      🖼️ Picture | Order #123 Item Name | $12.99 - clean layout with image preview
                    </div>
                  )}
                  {menuStyle.menuCardDesign === 'text-menu' && (
                    <div className="text-xs text-muted-foreground">
                      📝 Text-only with detailed ingredients, allergens, and descriptions - classic menu style
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>{t('style.menuPageStyling')}</span>
              </CardTitle>
              <CardDescription>
                {t('style.menuPageDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fontFamily">{t('style.fontFamily')}</Label>
                <Select value={menuStyle.fontFamily} onValueChange={(value) => handleStyleChange('fontFamily', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('style.fontFamilyPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={fontClassMap[option.value as keyof typeof fontClassMap]}>
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backgroundColor">{t('style.backgroundColor')}</Label>
                <div className="flex items-center space-x-3">
                  <input
                    id="backgroundColor"
                    type="color"
                    value={menuStyle.backgroundColor}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={menuStyle.backgroundColor}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                    placeholder="#f8f9fa"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textColor">{t('style.textColor')}</Label>
                <div className="flex items-center space-x-3">
                  <input
                    id="textColor"
                    type="color"
                    value={menuStyle.textColor}
                    onChange={(e) => handleStyleChange('textColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={menuStyle.textColor}
                    onChange={(e) => handleStyleChange('textColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                    placeholder="#212529"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardColor">{t('style.cardColor')}</Label>
                <div className="flex items-center space-x-3">
                  <input
                    id="cardColor"
                    type="color"
                    value={menuStyle.cardColor}
                    onChange={(e) => handleStyleChange('cardColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={menuStyle.cardColor}
                    onChange={(e) => handleStyleChange('cardColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Square className="w-4 h-4" />
                <span>{t('style.modalUIStyling')}</span>
              </CardTitle>
              <CardDescription>
                {t('style.modalUIDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modalBackgroundColor">{t('style.modalBackgroundColor')}</Label>
                <div className="flex items-center space-x-3">
                  <input
                    id="modalBackgroundColor"
                    type="color"
                    value={menuStyle.modalBackgroundColor}
                    onChange={(e) => handleStyleChange('modalBackgroundColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={menuStyle.modalBackgroundColor}
                    onChange={(e) => handleStyleChange('modalBackgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modalTextColor">{t('style.modalTextColor')}</Label>
                <div className="flex items-center space-x-3">
                  <input
                    id="modalTextColor"
                    type="color"
                    value={menuStyle.modalTextColor}
                    onChange={(e) => handleStyleChange('modalTextColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={menuStyle.modalTextColor}
                    onChange={(e) => handleStyleChange('modalTextColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modalCardColor">{t('style.modalCardColor')}</Label>
                <div className="flex items-center space-x-3">
                  <input
                    id="modalCardColor"
                    type="color"
                    value={menuStyle.modalCardColor}
                    onChange={(e) => handleStyleChange('modalCardColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={menuStyle.modalCardColor}
                    onChange={(e) => handleStyleChange('modalCardColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                    placeholder="#f8f9fa"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonColor">{t('style.buttonColor')}</Label>
                <div className="flex items-center space-x-3">
                  <input
                    id="buttonColor"
                    type="color"
                    value={menuStyle.buttonColor}
                    onChange={(e) => handleStyleChange('buttonColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={menuStyle.buttonColor}
                    onChange={(e) => handleStyleChange('buttonColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonTextColor">{t('style.buttonTextColor')}</Label>
                <div className="flex items-center space-x-3">
                  <input
                    id="buttonTextColor"
                    type="color"
                    value={menuStyle.buttonTextColor}
                    onChange={(e) => handleStyleChange('buttonTextColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={menuStyle.buttonTextColor}
                    onChange={(e) => handleStyleChange('buttonTextColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accentColor">{t('style.accentColor')}</Label>
                <div className="flex items-center space-x-3">
                  <input
                    id="accentColor"
                    type="color"
                    value={menuStyle.accentColor}
                    onChange={(e) => handleStyleChange('accentColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={menuStyle.accentColor}
                    onChange={(e) => handleStyleChange('accentColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Restore Defaults button */}
      <div className="flex justify-end pt-4">
        <Button
          variant="destructive"
          onClick={handleRestoreDefaults}
        >
          {t('style.restoreDefaults') /* e.g. "Restore Defaults" */}
        </Button>
      </div>
    </div>
  );
}