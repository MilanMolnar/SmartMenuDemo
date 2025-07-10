'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UtensilsCrossed, QrCode, Eye, LogOut, CreditCard, Database, Trash2, Info, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CategoryForm } from '@/components/CategoryForm';
import { MenuItemForm } from '@/components/MenuItemForm';
import { OfferForm } from '@/components/OfferForm';
import { StyleSettings } from '@/components/StyleSettings';
import { MenuPreview } from '@/components/MenuPreview';
import { QRCodeModal } from '@/components/QRCodeModal';
import { QRCardDesigner } from '@/components/QRCardDesigner';
import { QRCardPreview } from '@/components/QRCardPreview';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMenu } from '@/contexts/MenuContext';

export default function AdminPage() {
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  const router = useRouter();
  const { t } = useLanguage();
  const { categories, menuItems, offers, addDummyData, clearAllData } = useMenu();

  const handleLogout = () => {
    router.push('/login');
  };

  const isEmpty = categories.length === 0 && menuItems.length === 0 && offers.length === 0;

  return (
    <div className="min-h-scree bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">{t('header.title')}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button
                variant="outline"
                onClick={() => setShowQRModal(true)}
                className="flex items-center space-x-2"
              >
                <QrCode className="h-4 w-4" />
                <span>{t('header.generateQR')}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/demo/menu')}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>{t('header.viewMenu')}</span>
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('header.logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className=" mx-auto px-8 sm:px-12 lg:px-28 py-8">
        {/* Empty State Alert */}
        {isEmpty && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="flex items-center justify-between">
                <span>{t('admin.emptyMenuMessage')}</span>
                <div className="flex space-x-2 ml-4">
                  <Button
                    onClick={addDummyData}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Database className="h-4 w-4" />
                    <span>{t('admin.addDummyData')}</span>
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Data Management Controls */}
        {!isEmpty && (
          <div className="mb-6 flex justify-end">
            <div className="flex space-x-2">
              <Button
                onClick={addDummyData}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Database className="h-4 w-4" />
                <span>{t('admin.addDummyData')}</span>
              </Button>
              <Button
                onClick={clearAllData}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>{t('admin.clearAllData')}</span>
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="categories">{t('tabs.categories')}</TabsTrigger>
                <TabsTrigger value="items">{t('tabs.menuItems')}</TabsTrigger>
                <TabsTrigger value="offers">
                  <Tag className="h-4 w-4 mr-1" />
                  Akciók
                </TabsTrigger>
                <TabsTrigger value="style">{t('tabs.style')}</TabsTrigger>
                <TabsTrigger value="qr-card">{t('tabs.qrCard')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="categories" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('categories.title')}</CardTitle>
                    <CardDescription>
                      {t('categories.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CategoryForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="items" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('menuItems.title')}</CardTitle>
                    <CardDescription>
                      {t('menuItems.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MenuItemForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="offers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Tag className="h-5 w-5" />
                      <span>Akciók Kezelése</span>
                    </CardTitle>
                    <CardDescription>
                      Hozzon létre és kezeljen speciális akciókat, kedvezményeket
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OfferForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('style.title')}</CardTitle>
                    <CardDescription>
                      {t('style.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StyleSettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="qr-card" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <span>{t('qrCard.title')}</span>
                    </CardTitle>
                    <CardDescription>
                      {t('qrCard.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QRCardDesigner />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>
                  {activeTab === 'qr-card' ? t('preview.qrCardPreview') : t('preview.livePreview')}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'qr-card' 
                    ? t('preview.qrCardDescription')
                    : t('preview.menuDescription')
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === 'qr-card' ? <QRCardPreview /> : <MenuPreview />}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <QRCodeModal 
        isOpen={showQRModal} 
        onClose={() => setShowQRModal(false)} 
      />
    </div>
  );
}