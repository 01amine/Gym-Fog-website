"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Language = "en" | "fr" | "ar"

interface Translations {
  // Navigation
  shop: string
  ourStory: string
  contact: string
  backToShop: string
  menu: string
  categories: string

  // Product
  addToCart: string
  buyNow: string
  outOfStock: string
  inStock: string
  onlyLeft: string
  size: string
  color: string
  quantity: string
  sizeGuide: string

  // Cart
  yourCart: string
  cartEmpty: string
  total: string
  checkout: string

  // Favorites
  favorites: string
  noFavorites: string
  addToFavorites: string
  removeFromFavorites: string
  savedToFavorites: string
  removedFromFavorites: string
  browseProducts: string
  clearAll: string
  itemsSaved: string

  // Auth
  signIn: string
  signUp: string
  login: string
  register: string
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phoneNumber: string
  createAccount: string
  welcomeBack: string
  joinTheFight: string
  signInToAccount: string
  signingIn: string
  creatingAccount: string
  logout: string
  profile: string
  myOrders: string
  settings: string

  // Checkout
  deliveryDetails: string
  orderSummary: string
  placeOrder: string
  placingOrder: string
  paymentOnDelivery: string
  shippingAcrossAlgeria: string
  wilaya: string
  deliveryAddress: string
  orderConfirmed: string
  orderPlacedSuccess: string
  continueToShopping: string

  // Home
  testedByFighters: string
  forFighters: string
  shopCombatGear: string
  brandStory: string
  equipment: string
  gearUpForWar: string
  noProductsFound: string
  checkBackSoon: string

  // Story
  builtBy: string
  trueChampion: string
  coachBio: string

  // Contact
  contactUs: string
  directLine: string
  writeMessage: string
  sendWhatsApp: string

  // Footer
  resources: string
  sizeGuides: string
  shippingPolicy: string
  bulkOrders: string
  joinTheWar: string
  subscribeAlerts: string
  emailAddress: string
  allRightsReserved: string
  privacy: string
  terms: string

  // Features
  fastDelivery: string
  qualityGuarantee: string
  securePackage: string

  // Misc
  all: string
  loading: string
  share: string
  productNotFound: string
  back: string
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    shop: "SHOP",
    ourStory: "OUR STORY",
    contact: "CONTACT",
    backToShop: "BACK TO SHOP",
    menu: "MENU",
    categories: "CATEGORIES",

    // Product
    addToCart: "ADD TO CART",
    buyNow: "BUY NOW",
    outOfStock: "OUT OF STOCK",
    inStock: "in stock",
    onlyLeft: "Only {count} left!",
    size: "SIZE",
    color: "COLOR",
    quantity: "QUANTITY",
    sizeGuide: "Size Guide",

    // Cart
    yourCart: "YOUR CART",
    cartEmpty: "Your cart is empty",
    total: "Total",
    checkout: "CHECKOUT",

    // Favorites
    favorites: "FAVORITES",
    noFavorites: "NO FAVORITES YET",
    addToFavorites: "ADD TO FAVORITES",
    removeFromFavorites: "REMOVE FROM FAVORITES",
    savedToFavorites: "SAVED TO FAVORITES",
    removedFromFavorites: "Removed from favorites",
    browseProducts: "BROWSE PRODUCTS",
    clearAll: "Clear All",
    itemsSaved: "items saved",

    // Auth
    signIn: "SIGN IN",
    signUp: "SIGN UP",
    login: "LOGIN",
    register: "REGISTER",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    createAccount: "CREATE ACCOUNT",
    welcomeBack: "Welcome back!",
    joinTheFight: "JOIN THE FIGHT",
    signInToAccount: "Sign in to your account or create a new one",
    signingIn: "SIGNING IN...",
    creatingAccount: "CREATING ACCOUNT...",
    logout: "LOGOUT",
    profile: "PROFILE",
    myOrders: "MY ORDERS",
    settings: "SETTINGS",

    // Checkout
    deliveryDetails: "DELIVERY DETAILS",
    orderSummary: "ORDER SUMMARY",
    placeOrder: "PLACE ORDER",
    placingOrder: "PLACING ORDER...",
    paymentOnDelivery: "PAYMENT ON DELIVERY",
    shippingAcrossAlgeria: "SHIPPING ACROSS ALGERIA",
    wilaya: "Wilaya",
    deliveryAddress: "Delivery Address",
    orderConfirmed: "ORDER CONFIRMED!",
    orderPlacedSuccess: "Thank you for your order.",
    continueToShopping: "CONTINUE SHOPPING",

    // Home
    testedByFighters: "TESTED BY FIGHTERS",
    forFighters: "FOR FIGHTERS",
    shopCombatGear: "SHOP COMBAT GEAR",
    brandStory: "BRAND STORY",
    equipment: "EQUIPMENT",
    gearUpForWar: "GEAR UP FOR WAR",
    noProductsFound: "No products found",
    checkBackSoon: "Check back soon for new gear!",

    // Story
    builtBy: "BUILT BY",
    trueChampion: "A TRUE CHAMPION.",
    coachBio: "Coach Remilaoui Ibrahim is more than just a fighter - he's a mentor who has shaped countless champions in the Algerian combat sports scene. With years of experience in the ring and on the mat, he understands what fighters truly need. GYM FOG was born from his passion to elevate combat sports in Algeria, providing premium gear that meets the demanding standards of real fighters. Every product is tested and approved by champions, for champions.",

    // Contact
    contactUs: "CONTACT US",
    directLine: "DIRECT LINE TO THE HQ",
    writeMessage: "WRITE YOUR MESSAGE HERE...",
    sendWhatsApp: "SEND WHATSAPP MESSAGE",

    // Footer
    resources: "RESOURCES",
    sizeGuides: "SIZE GUIDES",
    shippingPolicy: "SHIPPING POLICY",
    bulkOrders: "BULK ORDERS",
    joinTheWar: "JOIN THE WAR",
    subscribeAlerts: "SUBSCRIBE FOR DROP ALERTS",
    emailAddress: "EMAIL ADDRESS",
    allRightsReserved: "ALL RIGHTS RESERVED.",
    privacy: "PRIVACY",
    terms: "TERMS",

    // Features
    fastDelivery: "Fast Delivery",
    qualityGuarantee: "Quality Guarantee",
    securePackage: "Secure Package",

    // Misc
    all: "ALL",
    loading: "Loading...",
    share: "Share",
    productNotFound: "Product not found",
    back: "BACK",
  },
  fr: {
    // Navigation
    shop: "BOUTIQUE",
    ourStory: "NOTRE HISTOIRE",
    contact: "CONTACT",
    backToShop: "RETOUR BOUTIQUE",
    menu: "MENU",
    categories: "CATEGORIES",

    // Product
    addToCart: "AJOUTER AU PANIER",
    buyNow: "ACHETER",
    outOfStock: "RUPTURE DE STOCK",
    inStock: "en stock",
    onlyLeft: "Plus que {count}!",
    size: "TAILLE",
    color: "COULEUR",
    quantity: "QUANTITE",
    sizeGuide: "Guide des tailles",

    // Cart
    yourCart: "VOTRE PANIER",
    cartEmpty: "Votre panier est vide",
    total: "Total",
    checkout: "COMMANDER",

    // Favorites
    favorites: "FAVORIS",
    noFavorites: "PAS DE FAVORIS",
    addToFavorites: "AJOUTER AUX FAVORIS",
    removeFromFavorites: "RETIRER DES FAVORIS",
    savedToFavorites: "AJOUTE AUX FAVORIS",
    removedFromFavorites: "Retire des favoris",
    browseProducts: "PARCOURIR LES PRODUITS",
    clearAll: "Tout effacer",
    itemsSaved: "articles sauvegardes",

    // Auth
    signIn: "SE CONNECTER",
    signUp: "S'INSCRIRE",
    login: "CONNEXION",
    register: "INSCRIPTION",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    fullName: "Nom complet",
    phoneNumber: "Numero de telephone",
    createAccount: "CREER UN COMPTE",
    welcomeBack: "Bon retour!",
    joinTheFight: "REJOIGNEZ LE COMBAT",
    signInToAccount: "Connectez-vous ou creez un nouveau compte",
    signingIn: "CONNEXION...",
    creatingAccount: "CREATION DU COMPTE...",
    logout: "DECONNEXION",
    profile: "PROFIL",
    myOrders: "MES COMMANDES",
    settings: "PARAMETRES",

    // Checkout
    deliveryDetails: "DETAILS DE LIVRAISON",
    orderSummary: "RESUME DE COMMANDE",
    placeOrder: "PASSER LA COMMANDE",
    placingOrder: "COMMANDE EN COURS...",
    paymentOnDelivery: "PAIEMENT A LA LIVRAISON",
    shippingAcrossAlgeria: "LIVRAISON PARTOUT EN ALGERIE",
    wilaya: "Wilaya",
    deliveryAddress: "Adresse de livraison",
    orderConfirmed: "COMMANDE CONFIRMEE!",
    orderPlacedSuccess: "Merci pour votre commande.",
    continueToShopping: "CONTINUER LES ACHATS",

    // Home
    testedByFighters: "TESTE PAR LES COMBATTANTS",
    forFighters: "POUR LES COMBATTANTS",
    shopCombatGear: "ACHETER EQUIPEMENT",
    brandStory: "NOTRE HISTOIRE",
    equipment: "EQUIPEMENT",
    gearUpForWar: "EQUIPEZ-VOUS",
    noProductsFound: "Aucun produit trouve",
    checkBackSoon: "Revenez bientot pour de nouveaux produits!",

    // Story
    builtBy: "CREE PAR",
    trueChampion: "UN VRAI CHAMPION.",
    coachBio: "Coach Remilaoui Ibrahim est plus qu'un combattant - c'est un mentor qui a forme d'innombrables champions dans le monde des sports de combat algeriens. Avec des annees d'experience sur le ring et le tatami, il comprend ce dont les combattants ont vraiment besoin. GYM FOG est ne de sa passion pour elever les sports de combat en Algerie, fournissant des equipements premium qui repondent aux exigences des vrais combattants.",

    // Contact
    contactUs: "CONTACTEZ-NOUS",
    directLine: "LIGNE DIRECTE AU QG",
    writeMessage: "ECRIVEZ VOTRE MESSAGE ICI...",
    sendWhatsApp: "ENVOYER MESSAGE WHATSAPP",

    // Footer
    resources: "RESSOURCES",
    sizeGuides: "GUIDE DES TAILLES",
    shippingPolicy: "POLITIQUE DE LIVRAISON",
    bulkOrders: "COMMANDES EN GROS",
    joinTheWar: "REJOIGNEZ LA GUERRE",
    subscribeAlerts: "ABONNEZ-VOUS AUX ALERTES",
    emailAddress: "ADRESSE EMAIL",
    allRightsReserved: "TOUS DROITS RESERVES.",
    privacy: "CONFIDENTIALITE",
    terms: "CONDITIONS",

    // Features
    fastDelivery: "Livraison Rapide",
    qualityGuarantee: "Qualite Garantie",
    securePackage: "Emballage Securise",

    // Misc
    all: "TOUT",
    loading: "Chargement...",
    share: "Partager",
    productNotFound: "Produit introuvable",
    back: "RETOUR",
  },
  ar: {
    // Navigation
    shop: "المتجر",
    ourStory: "قصتنا",
    contact: "اتصل بنا",
    backToShop: "العودة للمتجر",
    menu: "القائمة",
    categories: "الفئات",

    // Product
    addToCart: "أضف للسلة",
    buyNow: "اشتري الآن",
    outOfStock: "نفذت الكمية",
    inStock: "متوفر",
    onlyLeft: "بقي {count} فقط!",
    size: "المقاس",
    color: "اللون",
    quantity: "الكمية",
    sizeGuide: "دليل المقاسات",

    // Cart
    yourCart: "سلة التسوق",
    cartEmpty: "سلة التسوق فارغة",
    total: "المجموع",
    checkout: "الدفع",

    // Favorites
    favorites: "المفضلة",
    noFavorites: "لا توجد مفضلات",
    addToFavorites: "أضف للمفضلة",
    removeFromFavorites: "إزالة من المفضلة",
    savedToFavorites: "تم الحفظ في المفضلة",
    removedFromFavorites: "تمت الإزالة من المفضلة",
    browseProducts: "تصفح المنتجات",
    clearAll: "مسح الكل",
    itemsSaved: "منتجات محفوظة",

    // Auth
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    login: "دخول",
    register: "تسجيل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    fullName: "الاسم الكامل",
    phoneNumber: "رقم الهاتف",
    createAccount: "إنشاء حساب",
    welcomeBack: "مرحباً بعودتك!",
    joinTheFight: "انضم للقتال",
    signInToAccount: "سجل دخولك أو أنشئ حساباً جديداً",
    signingIn: "جاري التسجيل...",
    creatingAccount: "جاري إنشاء الحساب...",
    logout: "تسجيل الخروج",
    profile: "الملف الشخصي",
    myOrders: "طلباتي",
    settings: "الإعدادات",

    // Checkout
    deliveryDetails: "تفاصيل التوصيل",
    orderSummary: "ملخص الطلب",
    placeOrder: "تأكيد الطلب",
    placingOrder: "جاري تأكيد الطلب...",
    paymentOnDelivery: "الدفع عند الاستلام",
    shippingAcrossAlgeria: "التوصيل لجميع أنحاء الجزائر",
    wilaya: "الولاية",
    deliveryAddress: "عنوان التوصيل",
    orderConfirmed: "تم تأكيد الطلب!",
    orderPlacedSuccess: "شكراً لطلبك.",
    continueToShopping: "متابعة التسوق",

    // Home
    testedByFighters: "مختبر من المقاتلين",
    forFighters: "للمقاتلين",
    shopCombatGear: "تسوق معدات القتال",
    brandStory: "قصة العلامة",
    equipment: "المعدات",
    gearUpForWar: "جهز نفسك للمعركة",
    noProductsFound: "لم يتم العثور على منتجات",
    checkBackSoon: "عد قريباً لمعدات جديدة!",

    // Story
    builtBy: "أسسها",
    trueChampion: "بطل حقيقي.",
    coachBio: "المدرب رميلاوي إبراهيم ليس مجرد مقاتل - إنه مرشد صنع العديد من الأبطال في عالم الرياضات القتالية الجزائرية. بخبرة سنوات في الحلبة وعلى البساط، يفهم ما يحتاجه المقاتلون حقاً. ولدت GYM FOG من شغفه لرفع مستوى الرياضات القتالية في الجزائر، وتوفير معدات عالية الجودة تلبي متطلبات المقاتلين الحقيقيين.",

    // Contact
    contactUs: "اتصل بنا",
    directLine: "خط مباشر للمقر",
    writeMessage: "اكتب رسالتك هنا...",
    sendWhatsApp: "إرسال رسالة واتساب",

    // Footer
    resources: "الموارد",
    sizeGuides: "دليل المقاسات",
    shippingPolicy: "سياسة الشحن",
    bulkOrders: "طلبات بالجملة",
    joinTheWar: "انضم للحرب",
    subscribeAlerts: "اشترك في التنبيهات",
    emailAddress: "البريد الإلكتروني",
    allRightsReserved: "جميع الحقوق محفوظة.",
    privacy: "الخصوصية",
    terms: "الشروط",

    // Features
    fastDelivery: "توصيل سريع",
    qualityGuarantee: "ضمان الجودة",
    securePackage: "تغليف آمن",

    // Misc
    all: "الكل",
    loading: "جاري التحميل...",
    share: "مشاركة",
    productNotFound: "المنتج غير موجود",
    back: "رجوع",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = "gymfog_language"

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language
      if (stored && translations[stored]) {
        setLanguageState(stored)
      }
    } catch (error) {
      console.error("Failed to load language:", error)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, language)
      // Set RTL direction for Arabic
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = language
    }
  }, [language, isLoaded])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        isRTL: language === "ar",
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
