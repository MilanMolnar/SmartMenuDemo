'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Upload, Maximize2 } from 'lucide-react';
import { useMenu, defaultQRCardStyle } from '@/contexts/MenuContext';
import { useLanguage } from '@/contexts/LanguageContext';

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
];

const fontClassMap = {
  'Inter': 'font-inter',
  'Roboto': 'font-roboto',
  'Open Sans': 'font-open-sans',
  'Lato': 'font-lato',
  'Montserrat': 'font-montserrat',
  'Poppins': 'font-poppins'
};

export function QRCardDesigner() {
  const { qrCardStyle, updateQRCardStyle } = useMenu();
  const { t } = useLanguage();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const cardSizeOptions = [
    { value: 'business', label: t('qrCard.businessCard'), width: 350, height: 200 },
    { value: 'postcard', label: t('qrCard.postcard'), width: 600, height: 400 },
    { value: 'flyer', label: t('qrCard.flyer'), width: 425, height: 275 },
    { value: 'custom', label: t('qrCard.customSize'), width: 400, height: 300 },
  ];

  const aspectRatioOptions = [
    { value: '3:2', label: t('qrCard.ratio32'), ratio: 3/2 },
    { value: '4:3', label: t('qrCard.ratio43'), ratio: 4/3 },
    { value: '16:9', label: t('qrCard.ratio169'), ratio: 16/9 },
    { value: '1:1', label: t('qrCard.ratio11'), ratio: 1 },
    { value: 'custom', label: t('qrCard.ratioCustom'), ratio: 0 },
  ];

  const backgroundImages = [
    { value: 'restaurant-interior', label: t('qrCard.restaurantInterior'), url: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg' },
    { value: 'food-pattern', label: t('qrCard.foodPattern'), url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' },
    { value: 'wooden-table', label: t('qrCard.woodenTable'), url: 'https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg' },
    { value: 'kitchen', label: t('qrCard.kitchen'), url: 'https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg' },
    { value: 'dining-room', label: t('qrCard.diningRoom'), url: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg' },
  ];

  const handleStyleChange = (field: keyof typeof qrCardStyle, value: string | number) => {
    updateQRCardStyle({ [field]: value });
  };

  const handleReset = () => {
    setUploadedFile(null);
    updateQRCardStyle(defaultQRCardStyle);
  };

  const handleCardSizeChange = (size: string) => {
    const selectedSize = cardSizeOptions.find(option => option.value === size);
    if (selectedSize) {
      updateQRCardStyle({
        cardSize: size as any,
        customWidth: selectedSize.width,
        customHeight: selectedSize.height
      });
    }
  };

  const handleAspectRatioChange = (ratio: string) => {
    const selectedRatio = aspectRatioOptions.find(option => option.value === ratio);
    if (selectedRatio && selectedRatio.ratio > 0) {
      const newHeight = qrCardStyle.customWidth / selectedRatio.ratio;
      updateQRCardStyle({
        aspectRatio: ratio as any,
        customHeight: Math.round(newHeight)
      });
    } else {
      updateQRCardStyle({ aspectRatio: ratio as any });
    }
  };

  const handleWidthChange = (width: number) => {
    let newHeight = qrCardStyle.customHeight;
    
    if (qrCardStyle.aspectRatio !== 'custom') {
      const selectedRatio = aspectRatioOptions.find(option => option.value === qrCardStyle.aspectRatio);
      if (selectedRatio && selectedRatio.ratio > 0) {
        newHeight = Math.round(width / selectedRatio.ratio);
      }
    }
    
    updateQRCardStyle({
      customWidth: width,
      customHeight: newHeight
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateQRCardStyle({ 
          backgroundType: 'upload',
          uploadedImage: result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="restaurantName">{t('qrCard.restaurantName')}</Label>
          <Input
            id="restaurantName"
            value={qrCardStyle.restaurantName}
            onChange={(e) => handleStyleChange('restaurantName', e.target.value)}
            placeholder={t('qrCard.restaurantNamePlaceholder')}
          />
        </div>

        {/* Size and Dimensions */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2">
            <Maximize2 className="w-4 h-4" />
            <Label className="font-semibold">{t('qrCard.sizeDimensions')}</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardSize">{t('qrCard.cardSize')}</Label>
            <Select 
              value={qrCardStyle.cardSize} 
              onValueChange={handleCardSizeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cardSizeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aspectRatio">{t('qrCard.aspectRatio')}</Label>
            <Select 
              value={qrCardStyle.aspectRatio} 
              onValueChange={handleAspectRatioChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aspectRatioOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customWidth">{t('qrCard.width')}</Label>
              <div className="space-y-2">
                <Slider
                  value={[qrCardStyle.customWidth]}
                  onValueChange={(value) => handleWidthChange(value[0])}
                  max={800}
                  min={200}
                  step={10}
                  className="w-full"
                />
                <Input
                  id="customWidth"
                  type="number"
                  value={qrCardStyle.customWidth}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 200)}
                  min={200}
                  max={800}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customHeight">{t('qrCard.height')}</Label>
              <div className="space-y-2">
                <Slider
                  value={[qrCardStyle.customHeight]}
                  onValueChange={(value) => handleStyleChange('customHeight', value[0])}
                  max={600}
                  min={150}
                  step={10}
                  className="w-full"
                  disabled={qrCardStyle.aspectRatio !== 'custom'}
                />
                <Input
                  id="customHeight"
                  type="number"
                  value={qrCardStyle.customHeight}
                  onChange={(e) => handleStyleChange('customHeight', parseInt(e.target.value) || 150)}
                  min={150}
                  max={600}
                  className="text-sm"
                  disabled={qrCardStyle.aspectRatio !== 'custom'}
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {t('qrCard.currentRatio')}: {(qrCardStyle.customWidth / qrCardStyle.customHeight).toFixed(2)}:1
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundType">{t('qrCard.backgroundType')}</Label>
          <Select 
            value={qrCardStyle.backgroundType} 
            onValueChange={(value: 'solid' | 'image' | 'upload') => handleStyleChange('backgroundType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">{t('qrCard.solidColor')}</SelectItem>
              <SelectItem value="image">{t('qrCard.predefinedImage')}</SelectItem>
              <SelectItem value="upload">{t('qrCard.uploadOwn')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {qrCardStyle.backgroundType === 'solid' && (
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">{t('style.backgroundColor')}</Label>
            <div className="flex items-center space-x-3">
              <input
                id="backgroundColor"
                type="color"
                value={qrCardStyle.backgroundColor}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={qrCardStyle.backgroundColor}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>
        )}

        {qrCardStyle.backgroundType === 'image' && (
          <div className="space-y-2">
            <Label htmlFor="backgroundImage">{t('qrCard.backgroundImage')}</Label>
            <Select 
              value={qrCardStyle.backgroundImage} 
              onValueChange={(value) => handleStyleChange('backgroundImage', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {backgroundImages.map(image => (
                  <SelectItem key={image.value} value={image.value}>
                    {image.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {qrCardStyle.backgroundType === 'upload' && (
          <div className="space-y-2">
            <Label htmlFor="uploadImage">{t('qrCard.uploadImage')}</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="uploadImage"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {uploadedFile && (
              <p className="text-sm text-muted-foreground">
                {t('qrCard.uploaded')}: {uploadedFile.name}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="cardColor">{t('qrCard.cardOverlayColor')}</Label>
          <div className="flex items-center space-x-3">
            <input
              id="cardColor"
              type="color"
              value={qrCardStyle.cardColor}
              onChange={(e) => handleStyleChange('cardColor', e.target.value)}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={qrCardStyle.cardColor}
              onChange={(e) => handleStyleChange('cardColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="textColor">{t('style.textColor')}</Label>
          <div className="flex items-center space-x-3">
            <input
              id="textColor"
              type="color"
              value={qrCardStyle.textColor}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={qrCardStyle.textColor}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontFamily">{t('style.fontFamily')}</Label>
          <Select 
            value={qrCardStyle.fontFamily} 
            onValueChange={(value) => handleStyleChange('fontFamily', value)}
          >
            <SelectTrigger>
              <SelectValue />
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
        <div className="flex justify-end pt-4">
        <Button variant="destructive" size="sm" onClick={handleReset} className="flex items-center space-x-2">
          <span>{t('qrCard.resetDefaults') || 'Reset to Defaults'}</span>
        </Button>
      </div>
      </div>
    </div>
  );
}