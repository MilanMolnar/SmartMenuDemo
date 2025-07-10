'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'header.title': 'Menu Admin',
    'header.generateQR': 'Generate QR Code',
    'header.viewMenu': 'View Menu',
    'header.logout': 'Logout',
    'header.language': 'Language',

    // Admin Page
    'admin.emptyMenuMessage': 'Your menu is empty. Start by adding categories and menu items, or load some sample data to get started.',
    'admin.addDummyData': 'Add Sample Data',
    'admin.clearAllData': 'Clear All Data',

    // Tabs
    'tabs.categories': 'Categories',
    'tabs.menuItems': 'Menu Items',
    'tabs.style': 'Style',
    'tabs.qrCard': 'QR Card',

    // Categories
    'categories.title': 'Add Category',
    'categories.description': 'Create categories to organize your menu items',
    'categories.displayName': 'Display Name',
    'categories.displayNamePlaceholder': 'e.g., Appetizers, Main Courses',
    'categories.icon': 'Icon',
    'categories.iconPlaceholder': 'Select an icon',
    'categories.addButton': 'Add Category',
    'categories.current': 'Current Categories',

    // Menu Items
    'menuItems.title': 'Add Menu Item',
    'menuItems.description': 'Add new items to your menu with all the details',
    'menuItems.displayName': 'Display Name',
    'menuItems.displayNamePlaceholder': 'e.g., Grilled Salmon',
    'menuItems.orderNumber': 'Order Number',
    'menuItems.orderNumberPlaceholder': 'e.g., 1',
    'menuItems.autoOrderNumber': 'Auto-assigned Order Number',
    'menuItems.category': 'Category',
    'menuItems.categoryPlaceholder': 'Select category',
    'menuItems.price': 'Price',
    'menuItems.pricePlaceholder': 'e.g., 12.99',
    'menuItems.currency': 'Currency',
    'menuItems.phoneticPronunciation': 'Phonetic Pronunciation',
    'menuItems.phoneticPronunciationPlaceholder': 'e.g., GREE-uhld SAM-uhn',
    'menuItems.ingredients': 'Ingredients',
    'menuItems.ingredientsPlaceholder': 'e.g., Fresh Atlantic salmon, lemon, herbs',
    'menuItems.allergens': 'Allergens',
    'menuItems.allergensPlaceholder': 'e.g., Fish, Dairy',
    'menuItems.calories': 'Calories',
    'menuItems.caloriesPlaceholder': 'e.g., 450',
    'menuItems.extraDescription': 'Extra Description',
    'menuItems.extraDescriptionPlaceholder': 'Additional details about the dish',
    'menuItems.addButton': 'Add Menu Item',

    // Style Settings
    'style.title': 'Menu Style',
    'style.description': 'Customize the appearance of your public menu',
    'style.menuPage': 'Menu Page',
    'style.modalsUI': 'Modals & UI',
    'style.menuPageStyling': 'Menu Page Styling',
    'style.menuPageDescription': 'Customize the appearance of your public menu page',
    'style.modalUIStyling': 'Modal & UI Styling',
    'style.modalUIDescription': 'Customize the appearance of modals, buttons, and interactive elements',
    'style.fontFamily': 'Font Family',
    'style.fontFamilyPlaceholder': 'Select font family',
    'style.backgroundColor': 'Background Color',
    'style.textColor': 'Text Color',
    'style.cardColor': 'Menu Card Color',
    'style.modalBackgroundColor': 'Modal Background Color',
    'style.modalTextColor': 'Modal Text Color',
    'style.modalCardColor': 'Modal Card Color',
    'style.buttonColor': 'Button Background Color',
    'style.buttonTextColor': 'Button Text Color',
    'style.accentColor': 'Accent Color',
    'style.restoreDefaults': 'Restore Defaults',

    // QR Card Designer
    'qrCard.title': 'QR Card Designer',
    'qrCard.description': 'Design the printable QR code card for your restaurant',
    'qrCard.restaurantName': 'Restaurant Name',
    'qrCard.restaurantNamePlaceholder': 'Enter restaurant name',
    'qrCard.sizeDimensions': 'Size & Dimensions',
    'qrCard.cardSize': 'Card Size',
    'qrCard.aspectRatio': 'Aspect Ratio',
    'qrCard.width': 'Width (px)',
    'qrCard.height': 'Height (px)',
    'qrCard.currentRatio': 'Current ratio',
    'qrCard.backgroundType': 'Background Type',
    'qrCard.solidColor': 'Solid Color',
    'qrCard.predefinedImage': 'Predefined Image',
    'qrCard.uploadOwn': 'Upload Your Own',
    'qrCard.backgroundImage': 'Background Image',
    'qrCard.uploadImage': 'Upload Image',
    'qrCard.uploaded': 'Uploaded',
    'qrCard.cardOverlayColor': 'Card Overlay Color',
    'qrCard.download': 'Download',
    'qrCard.print': 'Print',
    'qrCard.resetDefaults' : 'Discard QR Card current design',

    // QR Card Sizes
    'qrCard.businessCard': 'Business Card (3.5" × 2")',
    'qrCard.postcard': 'Postcard (6" × 4")',
    'qrCard.flyer': 'Small Flyer (8.5" × 5.5")',
    'qrCard.customSize': 'Custom Size',

    // Aspect Ratios
    'qrCard.ratio32': '3:2 (Classic)',
    'qrCard.ratio43': '4:3 (Standard)',
    'qrCard.ratio169': '16:9 (Widescreen)',
    'qrCard.ratio11': '1:1 (Square)',
    'qrCard.ratioCustom': 'Custom',

    // Background Images
    'qrCard.restaurantInterior': 'Restaurant Interior',
    'qrCard.foodPattern': 'Food Pattern',
    'qrCard.woodenTable': 'Wooden Table',
    'qrCard.kitchen': 'Kitchen',
    'qrCard.diningRoom': 'Dining Room',

    // Live Preview
    'preview.livePreview': 'Live Preview',
    'preview.qrCardPreview': 'QR Card Preview',
    'preview.menuDescription': 'See how your menu will look to customers',
    'preview.qrCardDescription': 'See how your QR card will look when printed',
    'preview.menuPreview': 'Menu Preview',
    'preview.sampleCategory': 'Sample Category',
    'preview.noItems': 'No items in this category',
    'preview.noCategories': 'No categories created yet',
    'preview.modalPreview': 'Modal Preview',
    'preview.sampleModal': 'Sample Modal',
    'preview.modalContent': 'Modal content area',
    'preview.primaryButton': 'Primary Button',
    'preview.secondary': 'Secondary',

    // Menu Preview
    'menu.dinerMenu': 'Diner Menu',
    'menu.tagline': 'Fresh • Local • Delicious',
    'menu.scanToView': 'Scan to view our menu',
    'menu.total': 'Total',
    'menu.items': 'items',
    'menu.clear': 'Clear',
    'menu.continue': 'Continue',
    'menu.pronunciation': 'Pronunciation',
    'menu.description': 'Description',
    'menu.orderSummary': 'Order Summary',
    'menu.clearAll': 'Clear All',

    // QR Code Modal
    'qrModal.title': 'Menu QR Code',
    'qrModal.mockDescription': 'Mock QR Code - Click below to view the menu',
    'qrModal.viewPublicMenu': 'View Public Menu',
    'qrModal.menuUrl': 'Menu URL: /demo/menu',
    'qrModal.demoNote': 'Demo Note:',
    'qrModal.demoDescription': 'In a real application, customers would scan this QR code with their phones to access the menu directly.',

    // Login
    'login.title': 'Digital Menu Admin',
    'login.description': 'Sign in to manage your restaurant menu',
    'login.username': 'Username',
    'login.usernamePlaceholder': 'Enter your username',
    'login.password': 'Password',
    'login.passwordPlaceholder': 'Enter your password',
    'login.signIn': 'Sign In',
    'login.demoCredentials': 'Demo credentials: Any non-empty username and password',
    'login.error': 'Please enter both username and password',

    // Icon Options
    'icons.coffee': 'Coffee',
    'icons.beef': 'Beef',
    'icons.iceCream': 'Ice Cream',
    'icons.pizza': 'Pizza',
    'icons.salad': 'Salad',
    'icons.fish': 'Fish',
    'icons.soup': 'Soup',
    'icons.wine': 'Wine',

    // Common
    'common.required': '*',
    'common.optional': '(Optional)',
    'common.pixels': 'pixels',
  },
  hu: {
    // Header
    'header.title': 'Menü Admin',
    'header.generateQR': 'QR Kód Generálása',
    'header.viewMenu': 'Menü Megtekintése',
    'header.logout': 'Kijelentkezés',
    'header.language': 'Nyelv',

    // Admin Page
    'admin.emptyMenuMessage': 'A menü üres. Kezdje kategóriák és menü elemek hozzáadásával, vagy töltsön be mintaadatokat a kezdéshez.',
    'admin.addDummyData': 'Mintaadatok Hozzáadása',
    'admin.clearAllData': 'Összes Adat Törlése',

    // Tabs
    'tabs.categories': 'Kategóriák',
    'tabs.menuItems': 'Menü Elemek',
    'tabs.style': 'Stílus',
    'tabs.qrCard': 'QR Kártya',

    // Categories
    'categories.title': 'Kategória Hozzáadása',
    'categories.description': 'Hozzon létre kategóriákat a menü elemeinek rendszerezéséhez',
    'categories.displayName': 'Megjelenítendő Név',
    'categories.displayNamePlaceholder': 'pl. Előételek, Főételek',
    'categories.icon': 'Ikon',
    'categories.iconPlaceholder': 'Válasszon ikont',
    'categories.addButton': 'Kategória Hozzáadása',
    'categories.current': 'Jelenlegi Kategóriák',

    // Menu Items
    'menuItems.title': 'Menü Elem Hozzáadása',
    'menuItems.description': 'Adjon hozzá új elemeket a menühöz minden részlettel',
    'menuItems.displayName': 'Megjelenítendő Név',
    'menuItems.displayNamePlaceholder': 'pl. Grillezett Lazac',
    'menuItems.orderNumber': 'Sorszám',
    'menuItems.orderNumberPlaceholder': 'pl. 1',
    'menuItems.autoOrderNumber': 'Automatikusan Hozzárendelt Sorszám',
    'menuItems.category': 'Kategória',
    'menuItems.categoryPlaceholder': 'Válasszon kategóriát',
    'menuItems.price': 'Ár',
    'menuItems.pricePlaceholder': 'pl. 12.99',
    'menuItems.currency': 'Pénznem',
    'menuItems.phoneticPronunciation': 'Fonetikus Kiejtés',
    'menuItems.phoneticPronunciationPlaceholder': 'pl. GRIL-lett LA-zac',
    'menuItems.ingredients': 'Összetevők',
    'menuItems.ingredientsPlaceholder': 'pl. Friss atlanti lazac, citrom, fűszernövények',
    'menuItems.allergens': 'Allergének',
    'menuItems.allergensPlaceholder': 'pl. Hal, Tejtermék',
    'menuItems.calories': 'Kalóriák',
    'menuItems.caloriesPlaceholder': 'pl. 450',
    'menuItems.extraDescription': 'További Leírás',
    'menuItems.extraDescriptionPlaceholder': 'További részletek az ételről',
    'menuItems.addButton': 'Menü Elem Hozzáadása',

    // Style Settings
    'style.title': 'Menü Stílus',
    'style.description': 'A nyilvános menü megjelenésének testreszabása',
    'style.menuPage': 'Menü Oldal',
    'style.modalsUI': 'Ablakok és UI',
    'style.menuPageStyling': 'Menü Oldal Stílusa',
    'style.menuPageDescription': 'A nyilvános menü oldal megjelenésének testreszabása',
    'style.modalUIStyling': 'Ablak és UI Stílus',
    'style.modalUIDescription': 'Az ablakok, gombok és interaktív elemek megjelenésének testreszabása',
    'style.fontFamily': 'Betűtípus',
    'style.fontFamilyPlaceholder': 'Válasszon betűtípust',
    'style.backgroundColor': 'Háttérszín',
    'style.textColor': 'Szövegszín',
    'style.cardColor': 'Menü Kártya Szín',
    'style.modalBackgroundColor': 'Ablak Háttérszín',
    'style.modalTextColor': 'Ablak Szövegszín',
    'style.modalCardColor': 'Ablak Kártya Szín',
    'style.buttonColor': 'Gomb Háttérszín',
    'style.buttonTextColor': 'Gomb Szövegszín',
    'style.accentColor': 'Kiemelő Szín',
    'style.restoreDefaults': 'Visszaállítás alapértelmezett beállításokra',

    // QR Card Designer
    'qrCard.title': 'QR Kártya Tervező',
    'qrCard.description': 'Tervezze meg a nyomtatható QR kód kártyát az étterme számára',
    'qrCard.restaurantName': 'Étterem Neve',
    'qrCard.restaurantNamePlaceholder': 'Adja meg az étterem nevét',
    'qrCard.sizeDimensions': 'Méret és Méretek',
    'qrCard.cardSize': 'Kártya Méret',
    'qrCard.aspectRatio': 'Képarány',
    'qrCard.width': 'Szélesség (px)',
    'qrCard.height': 'Magasság (px)',
    'qrCard.currentRatio': 'Jelenlegi arány',
    'qrCard.backgroundType': 'Háttér Típus',
    'qrCard.solidColor': 'Egyszínű',
    'qrCard.predefinedImage': 'Előre Definiált Kép',
    'qrCard.uploadOwn': 'Saját Feltöltése',
    'qrCard.backgroundImage': 'Háttérkép',
    'qrCard.uploadImage': 'Kép Feltöltése',
    'qrCard.uploaded': 'Feltöltve',
    'qrCard.cardOverlayColor': 'Kártya Fedőszín',
    'qrCard.download': 'Letöltés',
    'qrCard.print': 'Nyomtatás',
    'qrCard.resetDefaults' : 'QR Kártya jelenlegi design elvetése',

    // QR Card Sizes
    'qrCard.businessCard': 'Névjegykártya (3.5" × 2")',
    'qrCard.postcard': 'Képeslap (6" × 4")',
    'qrCard.flyer': 'Kis Szórólap (8.5" × 5.5")',
    'qrCard.customSize': 'Egyedi Méret',

    // Aspect Ratios
    'qrCard.ratio32': '3:2 (Klasszikus)',
    'qrCard.ratio43': '4:3 (Standard)',
    'qrCard.ratio169': '16:9 (Szélesvásznú)',
    'qrCard.ratio11': '1:1 (Négyzet)',
    'qrCard.ratioCustom': 'Egyedi',

    // Background Images
    'qrCard.restaurantInterior': 'Étterem Belső',
    'qrCard.foodPattern': 'Étel Minta',
    'qrCard.woodenTable': 'Fa Asztal',
    'qrCard.kitchen': 'Konyha',
    'qrCard.diningRoom': 'Étkező',

    // Live Preview
    'preview.livePreview': 'Élő Előnézet',
    'preview.qrCardPreview': 'QR Kártya Előnézet',
    'preview.menuDescription': 'Nézze meg, hogyan fog kinézni a menü a vásárlók számára',
    'preview.qrCardDescription': 'Nézze meg, hogyan fog kinézni a QR kártya nyomtatáskor',
    'preview.menuPreview': 'Menü Előnézet',
    'preview.sampleCategory': 'Minta Kategória',
    'preview.noItems': 'Nincsenek elemek ebben a kategóriában',
    'preview.noCategories': 'Még nincsenek kategóriák létrehozva',
    'preview.modalPreview': 'Ablak Előnézet',
    'preview.sampleModal': 'Minta Ablak',
    'preview.modalContent': 'Ablak tartalom terület',
    'preview.primaryButton': 'Elsődleges Gomb',
    'preview.secondary': 'Másodlagos',

    // Menu Preview
    'menu.dinerMenu': 'Éttermi Menü',
    'menu.tagline': 'Friss • Helyi • Finom',
    'menu.scanToView': 'Szkenneld be a menü megtekintéséhez',
    'menu.total': 'Összesen',
    'menu.items': 'tétel',
    'menu.clear': 'Törlés',
    'menu.continue': 'Folytatás',
    'menu.pronunciation': 'Kiejtés',
    'menu.description': 'Leírás',
    'menu.orderSummary': 'Rendelés Összegzése',
    'menu.clearAll': 'Összes Törlése',

    // QR Code Modal
    'qrModal.title': 'Menü QR Kód',
    'qrModal.mockDescription': 'Teszt QR Kód - Kattintson alább a menü megtekintéséhez',
    'qrModal.viewPublicMenu': 'Nyilvános Menü Megtekintése',
    'qrModal.menuUrl': 'Menü URL: /demo/menu',
    'qrModal.demoNote': 'Demo Megjegyzés:',
    'qrModal.demoDescription': 'Egy valós alkalmazásban a vásárlók a telefonjukkal szkennelnék be ezt a QR kódot, hogy közvetlenül hozzáférjenek a menühöz.',

    // Login
    'login.title': 'Digitális Menü Admin',
    'login.description': 'Jelentkezzen be az éttermi menü kezeléséhez',
    'login.username': 'Felhasználónév',
    'login.usernamePlaceholder': 'Adja meg a felhasználónevét',
    'login.password': 'Jelszó',
    'login.passwordPlaceholder': 'Adja meg a jelszavát',
    'login.signIn': 'Bejelentkezés',
    'login.demoCredentials': 'Demo hitelesítő adatok: Bármilyen nem üres felhasználónév és jelszó',
    'login.error': 'Kérjük, adja meg a felhasználónevet és a jelszót',

    // Icon Options
    'icons.coffee': 'Kávé',
    'icons.beef': 'Marhahús',
    'icons.iceCream': 'Fagylalt',
    'icons.pizza': 'Pizza',
    'icons.salad': 'Saláta',
    'icons.fish': 'Hal',
    'icons.soup': 'Leves',
    'icons.wine': 'Bor',

    // Common
    'common.required': '*',
    'common.optional': '(Opcionális)',
    'common.pixels': 'pixel',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('hu'); // Changed default to Hungarian

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}