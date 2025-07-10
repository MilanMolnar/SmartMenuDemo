'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode as QrCodeIcon, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import QRCode from 'react-qr-code';

// Define the URL to encode in the QR code
const QR_CODE_URL = 'https://superlative-sunshine-fbc31a.netlify.app/demo/qr';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleViewMenu = () => {
    router.push('/demo/menu');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center space-x-2">
            <QrCodeIcon className="w-5 h-5" />
            <span>{t('qrModal.title')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg inline-block">
              {/* Render the QR code */}
              <QRCode title="Demo Étterem" value={QR_CODE_URL} size={200} />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {t('qrModal.mockDescription')}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleViewMenu}
              className="w-full flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t('qrModal.viewPublicMenu')}</span>
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground break-all">
                {QR_CODE_URL}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>{t('qrModal.demoNote')}</strong> {t('qrModal.demoDescription')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}