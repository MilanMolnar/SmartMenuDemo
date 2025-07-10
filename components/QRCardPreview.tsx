'use client';

import { Button } from '@/components/ui/button';
import { QrCode, Download, Printer } from 'lucide-react';
import { useMenu } from '@/contexts/MenuContext';
import { useLanguage } from '@/contexts/LanguageContext';
import html2canvas from 'html2canvas';
import {useRef} from "react"

const fontClassMap = {
  'Inter': 'font-inter',
  'Roboto': 'font-roboto',
  'Open Sans': 'font-open-sans',
  'Lato': 'font-lato',
  'Montserrat': 'font-montserrat',
  'Poppins': 'font-poppins'
};

export function QRCardPreview() {
  const { qrCardStyle } = useMenu();
  const { t } = useLanguage();
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    // Render the node to canvas
    const canvas = await html2canvas(previewRef.current, { useCORS: true });
    // Get image data
    const dataUrl = canvas.toDataURL('image/png');
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qr-card.png';
    link.click();
  };

  const handlePrint = () => {
    if (!previewRef.current) return;
    // Open a new window with only the card
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head>
        <title>Print QR Card</title>
        <style>
          /* Ensure no margins */
          @page { margin: 0; }
          body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
        </style>
      </head><body>
        ${previewRef.current.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const backgroundImages = [
    { value: 'restaurant-interior', label: t('qrCard.restaurantInterior'), url: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg' },
    { value: 'food-pattern', label: t('qrCard.foodPattern'), url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' },
    { value: 'wooden-table', label: t('qrCard.woodenTable'), url: 'https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg' },
    { value: 'kitchen', label: t('qrCard.kitchen'), url: 'https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg' },
    { value: 'dining-room', label: t('qrCard.diningRoom'), url: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg' },
  ];

  const cardSizeOptions = [
    { value: 'business', label: t('qrCard.businessCard'), width: 350, height: 200 },
    { value: 'postcard', label: t('qrCard.postcard'), width: 600, height: 400 },
    { value: 'flyer', label: t('qrCard.flyer'), width: 425, height: 275 },
    { value: 'custom', label: t('qrCard.customSize'), width: 400, height: 300 },
  ];

  const getBackgroundStyle = () => {
    if (qrCardStyle.backgroundType === 'solid') {
      return { backgroundColor: qrCardStyle.backgroundColor };
    } else if (qrCardStyle.backgroundType === 'upload' && qrCardStyle.uploadedImage) {
      return { 
        backgroundImage: `url(${qrCardStyle.uploadedImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    } else if (qrCardStyle.backgroundType === 'image') {
      const selectedImage = backgroundImages.find(img => img.value === qrCardStyle.backgroundImage);
      return { 
        backgroundImage: `url(${selectedImage?.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return { backgroundColor: qrCardStyle.backgroundColor };
  };

  const fontClass = fontClassMap[qrCardStyle.fontFamily as keyof typeof fontClassMap] || 'font-inter';
  const selectedCardSize = cardSizeOptions.find(option => option.value === qrCardStyle.cardSize);

  return (
    <div   className="space-y-6">
      {/* QR Card Preview */}
      <div className="flex justify-center">
        <div 
           ref={previewRef}
          className={`relative flex flex-col items-center justify-center ${fontClass} shadow-lg rounded-lg overflow-hidden`}
          style={{
            width: `${Math.min(qrCardStyle.customWidth, 400)}px`,
            height: `${Math.min(qrCardStyle.customHeight, 300)}px`,
            ...getBackgroundStyle()
          }}
        >
          {/* Overlay for better text readability */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: `${qrCardStyle.cardColor}80` }}
          />
          
          <div className="relative z-10 text-center p-4 space-y-3 flex flex-col items-center justify-center h-full">
            <h2 
              className="text-lg font-bold leading-tight"
              style={{ 
                color: qrCardStyle.textColor,
                fontSize: `${Math.max(12, Math.min(24, qrCardStyle.customWidth / 20))}px`
              }}
            >
              {qrCardStyle.restaurantName}
            </h2>
            
            <div 
              className="bg-white p-2 rounded-lg shadow-lg inline-block"
              style={{
                padding: `${Math.max(8, qrCardStyle.customWidth / 50)}px`
              }}
            >
              <QrCode 
                className="text-black" 
                style={{
                  width: `${Math.max(40, Math.min(80, qrCardStyle.customWidth / 6))}px`,
                  height: `${Math.max(40, Math.min(80, qrCardStyle.customWidth / 6))}px`
                }}
              />
            </div>
            
            <div className="space-y-1">
              <p 
                className="font-medium leading-tight"
                style={{ 
                  color: qrCardStyle.textColor,
                  fontSize: `${Math.max(8, Math.min(14, qrCardStyle.customWidth / 30))}px`
                }}
              >
                {t('menu.scanToView')}
              </p>
              <p 
                className="opacity-90 leading-tight"
                style={{ 
                  color: qrCardStyle.textColor,
                  fontSize: `${Math.max(6, Math.min(12, qrCardStyle.customWidth / 35))}px`
                }}
              >
                /demo/menu
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-1">
        <p className="text-sm font-medium">
          {selectedCardSize?.label || t('qrCard.customSize')}
        </p>
        <p className="text-xs text-muted-foreground">
          {qrCardStyle.customWidth} × {qrCardStyle.customHeight} {t('common.pixels')}
        </p>
        <p className="text-xs text-muted-foreground">
          {t('qrCard.currentRatio')}: {(qrCardStyle.customWidth / qrCardStyle.customHeight).toFixed(2)}:1
        </p>
      </div>

     <div className="flex space-x-2">
        <Button variant="outline" className="flex-1" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          {t('qrCard.download')}
        </Button>
        <Button variant="outline" className="flex-1" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          {t('qrCard.print')}
        </Button>
      </div>
    </div>
  );
}