"use client"; // Add this line at the top

import React, { useState, useEffect, useRef } from 'react';
import { Plus, User, Tally3, Scissors, ShoppingCart, Printer, Search, Edit, Trash2, X, Sun, Moon, Settings, Palette, Pocket, Layers, LogOut, KeyRound, ArrowLeft } from 'lucide-react';

// --- Type Definitions for TypeScript ---
interface Measurements {
    length: string;
    shoulders: string;
    sleeveLength: string;
    sleeveWidth: string;
    neck: string;
    chest: string;
    waist: string;
    cuffsLength: string;
    cuffsWidth: string;
    chestPlate: string;
    bottomWidth: string;
}

interface LooseMeasurements {
    bodyLoose: string;
    waistLoose: string;
    hipLoose: string;
    chestLoose: string;
    bicep: string;
    wrist: string;
}

interface Customer {
    id: number;
    name: string;
    phone: string;
    notes: string;
    measurements: {
        standard: Measurements;
        loose: LooseMeasurements;
    };
}

interface Order {
    id: number;
    orderDate: string;
    deliveryDate: string;
    status: string;
    details: {
        fabric: string;
        color: string;
        collar: string;
        cuffs: string;
        pockets: string;
        stitching: string;
        buttons: string;
        quantity: number;
        pricePerThobe: number;
        specialInstructions: string;
    };
    measurements: Measurements;
    looseMeasurements: LooseMeasurements;
    payment: {
        deposit: number;
        discount: number;
        extra: number;
        paymentMethod: string;
    };
    customer: Customer | { id: null; name: string; phone: string }; // <-- Fix here
    customerId?: number; // Optional, used for lookup
}

interface SettingsData {
    shopName: string;
    shopPhone: string;
    shopAddress: string;
    vatNumber: string;
}


// --- Custom SVG Icons ---
const CollarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 9l6-6 6 6"/>
    <path d="M12 3v10.5a1.5 1.5 0 0 1-3 0V3"/>
    <path d="M18 9a6 6 0 0 0-12 0"/>
  </svg>
);

const CuffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 14v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4"/>
    <path d="M15 14h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2"/>
    <path d="M5 14H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/>
    <circle cx="12" cy="11" r="1"/>
  </svg>
);

const StitchingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 12s4-8 8-8 8 8 8 8-4 8-8 8-8-8-8-8z"/>
    <path d="M12 12l-2-2.5"/>
    <path d="M14 14.5l-2-2.5"/>
    <path d="M12 12l2 2.5"/>
    <path d="M10 9.5l2 2.5"/>
  </svg>
);

const ButtonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="1"/>
    <path d="M12 8v-1.5"/>
    <path d="M12 17.5v-1.5"/>
    <path d="M16 12h1.5"/>
    <path d="M6.5 12H8"/>
  </svg>
);

const ThobeMeasurementDiagram = () => (
    <div className="w-full h-full flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg min-h-[280px]">
        <img src="thobe.png" alt="Thobe Measurement Diagram" className="w-auto h-full max-h-[300px] object-contain" />
    </div>
);


// --- TRANSLATION DATA (i18n) ---
const translations = {
  ar: {
    appName: "نظام الخياط الذكي",
    dashboard: "لوحة التحكم",
    orders: "الطلبات",
    customers: "العملاء",
    settings: "الإعدادات",
    newOrder: "طلب جديد",
    newCustomer: "عميل جديد",
    searchByNameOrPhone: "ابحث بالاسم أو رقم الجوال...",
    customer: "العميل",
    selectCustomer: "اختر عميل",
    orAddNewCustomer: "أو أضف عميل جديد",
    customerName: "اسم العميل",
    customerPhone: "رقم جوال العميل",
    address: "العنوان",
    notes: "ملاحظات",
    save: "حفظ",
    cancel: "إلغاء",
    orderDetails: "تفاصيل الطلب",
    orderStatus: "حالة الطلب",
    fabric: "القماش",
    color: "اللون",
    collar: "الياقة",
    cuffs: "الكفة",
    pockets: "الجيب",
    stitching: "الخياطة",
    buttons: "الأزرار",
    quantity: "الكمية",
    pricePerThobe: "سعر الثوب",
    specialInstructions: "تعليمات خاصة",
    measurements: "المقاسات",
    useSavedMeasurements: "استخدام المقاسات المحفوظة",
    updateMeasurements: "تحديث المقاسات",
    length: "الطول",
    shoulders: "الكتف",
    sleeveLength: "طول الكم",
    sleeveWidth: "وسع الكم",
    neck: "الرقبة",
    chest: "الصدر",
    waist: "الخصر",
    cuffsLength: "طول الكفة",
    cuffsWidth: "وسع الكفة",
    chestPlate: "صفطة الصدر",
    bottomWidth: "وسع الأسفل",
    looseSizeOptional: "مقاسات الوسع (اختياري)",
    bodyLoose: "وسع الجسم",
    waistLoose: "وسع الخصر",
    hipLoose: "وسع الورك",
    chestLoose: "وسع الصدر",
    bicep: "العضلة",
    wrist: "المعصم",
    paymentDetails: "تفاصيل الدفع",
    totalAmount: "المبلغ الإجمالي",
    deposit: "مدفوع",
    remaining: "المتبقي",
    recordPayment: "تسجيل دفعة",
    printInvoice: "طباعة الفاتورة",
    invoice: "فاتورة",
    orderNumber: "رقم الطلب",
    date: "التاريخ",
    billTo: "فاتورة إلى",
    phone: "الجوال",
    description: "الوصف",
    unitPrice: "سعر الوحدة",
    total: "المجموع",
    thankYou: "شكراً لتعاملكم معنا!",
    allOrders: "كل الطلبات",
    orderDate: "تاريخ الطلب",
    deliveryDate: "تاريخ التسليم",
    status: "الحالة",
    actions: "إجراءات",
    edit: "تعديل",
    delete: "حذف",
    confirmDelete: "هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.",
    yesDelete: "نعم, احذف",
    allCustomers: "كل العملاء",
    editCustomer: "تعديل العميل",
    shopSettings: "إعدادات المحل",
    shopName: "اسم المحل",
    shopPhone: "رقم هاتف المحل",
    shopAddress: "عنوان المحل",
    vatNumber: "الرقم الضريبي",
    settingsSaved: "تم حفظ الإعدادات بنجاح!",
    orderCreated: "تم إنشاء الطلب بنجاح!",
    orderUpdated: "تم تحديث الطلب بنجاح!",
    customerCreated: "تم إنشاء العميل بنجاح!",
    customerUpdated: "تم تحديث العميل بنجاح!",
    itemDeleted: "تم الحذف بنجاح!",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    password: "كلمة المرور",
    incorrectPassword: "كلمة المرور غير صحيحة",
    adminLogin: "دخول المدير",
    back: "رجوع",
    saveAndPrint: "حفظ وطباعة",
    customerInformation: "معلومات العميل",
    designStyle: "تفاصيل التصميم",
    subTotal: "المجموع الفرعي",
    discount: "خصم",
    extra: "إضافي",
    paymentMethod: "طريقة الدفع",
    customerRequired: "اسم العميل ورقم الجوال مطلوبان",
    // Statuses
    'New Order': 'طلب جديد',
    'Fabric Cutting': 'قص القماش',
    'Sewing': 'جاري الخياطة',
    'Ready for Pickup': 'جاهز للاستلام',
    'Completed': 'مكتمل',
    'Cancelled': 'ملغي',
    // Fabrics
    'Japanese Synthetic': 'ياباني صناعي',
    'Korean Cotton': 'قطن كوري',
    'Indonesian Blend': 'مخلوط إندونيسي',
    'Swiss Cotton': 'قطن سويسري',
    // Collars
    'Standard Saudi': 'سعودي عادي',
    'Round': 'دائري',
    'Stand-up': 'واقف',
    // Cuffs
    'Simple': 'سادة',
    'Cufflinks': 'كبك',
    // Pockets
    'Standard Chest': 'جيب صدر عادي',
    'Hidden Side': 'جيب جانبي مخفي',
    // Stitching
    'Hidden': 'مخفي',
    'Visible': 'ظاهر',
    dashboardMetrics: {
      totalOrders: "إجمالي الطلبات (الشهر)",
      monthlyRevenue: "إيرادات الشهر (SAR)",
      ordersInProgress: "طلبات قيد التنفيذ",
      readyForPickup: "طلبات جاهزة للاستلام",
    },
    recentOrders: "أحدث الطلبات",
  },
  en: {
    appName: "Smart Tailor POS",
    dashboard: "Dashboard",
    orders: "Orders",
    customers: "Customers",
    settings: "Settings",
    newOrder: "New Order",
    newCustomer: "New Customer",
    searchByNameOrPhone: "Search by name or phone...",
    customer: "Customer",
    selectCustomer: "Select a customer",
    orAddNewCustomer: "or Add a new customer",
    customerName: "Customer Name",
    customerPhone: "Customer Phone",
    address: "Address",
    notes: "Notes",
    save: "Save",
    cancel: "Cancel",
    orderDetails: "Order Details",
    orderStatus: "Order Status",
    fabric: "Fabric",
    color: "Color",
    collar: "Collar",
    cuffs: "Cuffs",
    pockets: "Pockets",
    stitching: "Stitching",
    buttons: "Buttons",
    quantity: "Quantity",
    pricePerThobe: "Price per Thobe",
    specialInstructions: "Special Instructions",
    measurements: "Measurements",
    useSavedMeasurements: "Use Saved Measurements",
    updateMeasurements: "Update Measurements",
    length: "Length",
    shoulders: "Shoulders",
    sleeveLength: "Sleeve Length",
    sleeveWidth: "Sleeve Width",
    neck: "Neck",
    chest: "Chest",
    waist: "Waist",
    cuffsLength: "Cuffs Length",
    cuffsWidth: "Cuffs Width",
    chestPlate: "Chest Plate",
    bottomWidth: "Bottom Width",
    looseSizeOptional: "Loose Size (Optional)",
    bodyLoose: "Body Loose",
    waistLoose: "Waist Loose",
    hipLoose: "Hip Loose",
    chestLoose: "Chest Loose",
    bicep: "Bicep",
    wrist: "Wrist",
    paymentDetails: "Payment Details",
    totalAmount: "Total Amount",
    deposit: "Paid",
    remaining: "Due Amount",
    recordPayment: "Record Payment",
    printInvoice: "Print Invoice",
    invoice: "Invoice",
    orderNumber: "Order #",
    date: "Date",
    billTo: "Bill To",
    phone: "Phone",
    description: "Description",
    unitPrice: "Unit Price",
    total: "Total",
    thankYou: "Thank you for your order!",
    allOrders: "All Orders",
    orderDate: "Order Date",
    deliveryDate: "Delivery Date",
    status: "Status",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this item? This action cannot be undone.",
    yesDelete: "Yes, Delete",
    allCustomers: "All Customers",
    editCustomer: "Edit Customer",
    shopSettings: "Shop Settings",
    shopName: "Shop Name",
    shopPhone: "Shop Phone",
    shopAddress: "Shop Address",
    vatNumber: "VAT Number",
    settingsSaved: "Settings saved successfully!",
    orderCreated: "Order created successfully!",
    orderUpdated: "Order updated successfully!",
    customerCreated: "Customer created successfully!",
    customerUpdated: "Customer updated successfully!",
    itemDeleted: "Item deleted successfully!",
    login: "Login",
    logout: "Logout",
    password: "Password",
    incorrectPassword: "Incorrect Password",
    adminLogin: "Admin Login",
    back: "Back",
    saveAndPrint: "Save & Print",
    customerInformation: "Customer Information",
    designStyle: "Design Style",
    subTotal: "Sub Total",
    discount: "Discount",
    extra: "Extra",
    paymentMethod: "Payment Method",
    customerRequired: "Customer Name and Phone are required.",
    // Statuses
    'New Order': 'New Order',
    'Fabric Cutting': 'Fabric Cutting',
    'Sewing': 'Sewing',
    'Ready for Pickup': 'Ready for Pickup',
    'Completed': 'Completed',
    'Cancelled': 'Cancelled',
    // Fabrics
    'Japanese Synthetic': 'Japanese Synthetic',
    'Korean Cotton': 'Korean Cotton',
    'Indonesian Blend': 'Indonesian Blend',
    'Swiss Cotton': 'Swiss Cotton',
    // Collars
    'Standard Saudi': 'Standard Saudi',
    'Round': 'Round',
    'Stand-up': 'Stand-up',
    // Cuffs
    'Simple': 'Simple',
    'Cufflinks': 'Cufflinks',
    // Pockets
    'Standard Chest': 'Standard Chest',
    'Hidden Side': 'Hidden Side',
    // Stitching
    'Hidden': 'Hidden',
    'Visible': 'Visible',
    dashboardMetrics: {
      totalOrders: "Total Orders (Month)",
      monthlyRevenue: "Monthly Revenue (SAR)",
      ordersInProgress: "Orders In Progress",
      readyForPickup: "Ready for Pickup",
    },
    recentOrders: "Recent Orders",
  }
};

const useLanguage = () => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const savedLang = typeof window !== 'undefined' ? localStorage.getItem('thobe_pos_lang') || 'en' : 'en';
        setLanguage(savedLang);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = language;
            localStorage.setItem('thobe_pos_lang', language);
        }
    }, [language]);

    const t = (key: string): string => {
        const keys = key.split('.');
        let result: any = translations[language as 'ar' | 'en'];
        for (const k of keys) {
            result = result[k];
            if (!result) {
                let fallbackResult: any = translations['en'];
                for (const fk of keys) {
                    fallbackResult = fallbackResult[fk];
                    if (!fallbackResult) return key;
                }
                return fallbackResult as string;
            }
        }
        return result as string || key;
    };

    return { language, setLanguage, t };
};

const useTheme = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('thobe_pos_theme') || 'light' : 'light';
        setTheme(savedTheme);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(theme);
            localStorage.setItem('thobe_pos_theme', theme);
        }
    }, [theme]);

    return [theme, setTheme];
};

// --- MOCK API for localStorage ---
const api = {
  get: (key: string): any[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  set: (key: string, data: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  },
  getSettings: (): SettingsData => {
    if (typeof window === 'undefined') {
        return { shopName: 'Sundus', shopPhone: '0533205878', shopAddress: 'Abdullah Fuad, Dammam', vatNumber: '300123456789013' };
    }
    const defaults = {
        shopName: 'Sundus',
        shopPhone: '0533205878',
        shopAddress: 'Abdullah Fuad, Dammam',
        vatNumber: '300123456789013'
    };
    const data = localStorage.getItem('thobe_pos_settings');
    return data ? JSON.parse(data) : defaults;
  },
  setSettings: (data: SettingsData) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('thobe_pos_settings', JSON.stringify(data));
  }
};

// --- DATA CONSTANTS ---
const ORDER_STATUSES = ['New Order', 'Fabric Cutting', 'Sewing', 'Ready for Pickup', 'Completed', 'Cancelled'];
const FABRIC_OPTIONS = ['Japanese Synthetic', 'Korean Cotton', 'Indonesian Blend', 'Swiss Cotton'];
const COLLAR_OPTIONS = ['Standard Saudi', 'Round', 'Stand-up'];
const CUFF_OPTIONS = ['Simple', 'Cufflinks'];
const POCKET_OPTIONS = ['Standard Chest', 'Hidden Side'];
const STITCHING_OPTIONS = ['Hidden', 'Visible'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New Order': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Fabric Cutting': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Sewing': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    case 'Ready for Pickup': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// --- UI COMPONENTS ---

const Toast = ({ message, type, onDismiss }: { message: string, type: 'success' | 'error', onDismiss: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
    };

    return (
        <div className={`fixed bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg z-50 ${colors[type]}`}>
            {message}
        </div>
    );
};

const ConfirmationModal = ({ t, onConfirm, onCancel }: { t: (key: string) => string, onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('confirmDelete')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{t('confirmDelete')}</p>
            <div className="flex justify-end space-x-4 rtl:space-x-reverse">
                <button onClick={onCancel} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">{t('cancel')}</button>
                <button onClick={onConfirm} className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700">{t('yesDelete')}</button>
            </div>
        </div>
    </div>
);

const CustomerForm = ({ t, customer, onSave, onCancel }: { t: (key: string) => string, customer: Customer | null, onSave: (data: Customer) => void, onCancel: () => void }) => {
    const defaultMeasurements = { 
        length: '', shoulders: '', sleeveLength: '', sleeveWidth: '', neck: '', chest: '', waist: '',
        cuffsLength: '', cuffsWidth: '', chestPlate: '', bottomWidth: ''
    };
    const defaultLooseMeasurements = {
        bodyLoose: '', waistLoose: '', hipLoose: '', chestLoose: '', bicep: '', wrist: ''
    };
    
    const [formData, setFormData] = useState<Customer>(customer || {
        id: Date.now(),
        name: '',
        phone: '',
        notes: '',
        measurements: { standard: defaultMeasurements, loose: defaultLooseMeasurements }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMeasurementChange = (type: 'standard' | 'loose', e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            measurements: { ...prev.measurements, [type]: { ...prev.measurements[type], [name]: value } }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) {
            console.error(t('customerName') + ' and ' + t('customerPhone') + ' are required.');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-40 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-4xl my-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{customer ? t('editCustomer') : t('newCustomer')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('customerName')}</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('customerPhone')}</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('notes')}</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{t('measurements')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-4 lg:col-span-3">
                             <ThobeMeasurementDiagram />
                        </div>
                        <div className="md:col-span-8 lg:col-span-9">
                            <h4 className="font-semibold mb-2">{t('measurements')}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 content-start">
                                {Object.keys(formData.measurements.standard).map(key => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t(key)}</label>
                                        <input type="number" name={key} value={(formData.measurements.standard as any)[key]} onChange={(e) => handleMeasurementChange('standard', e)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    </div>
                                ))}
                            </div>
                            <h4 className="font-semibold mt-4 mb-2">{t('looseSizeOptional')}</h4>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 content-start">
                                {Object.keys(formData.measurements.loose).map(key => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t(key)}</label>
                                        <input type="number" name={key} value={(formData.measurements.loose as any)[key]} onChange={(e) => handleMeasurementChange('loose', e)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 rtl:space-x-reverse mt-6">
                        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 flex items-center">{t('save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const OrderForm = ({ t, order, customers, onSave, onCancel, showToast, onSaveAndPrint }: { t: (key: string) => string, order: Order | null, customers: Customer[], onSave: (data: any) => void, onCancel: () => void, showToast: (message: string, type: 'success' | 'error') => void, onSaveAndPrint: (data: any) => void }) => {
    const defaultMeasurements = { 
        length: '', shoulders: '', sleeveLength: '', sleeveWidth: '', neck: '', chest: '', waist: '',
        cuffsLength: '', cuffsWidth: '', chestPlate: '', bottomWidth: ''
    };
    const defaultLooseMeasurements = {
        bodyLoose: '', waistLoose: '', hipLoose: '', chestLoose: '', bicep: '', wrist: ''
    };
    
    const [formData, setFormData] = useState<Order>(() => {
    if (order) {
        // If editing, use the minimal customer object for the form
        const foundCustomer = customers.find(c => c.id === order.customerId);
        return {
            ...order,
            customer: foundCustomer
                ? { id: foundCustomer.id, name: foundCustomer.name, phone: foundCustomer.phone }
                : { id: null, name: '', phone: '' }
        };
    }
    return {
        id: Date.now(),
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: '',
        status: 'New Order',
        details: {
            fabric: 'Japanese Synthetic', color: 'أبيض', collar: 'Standard Saudi',
            cuffs: 'Simple', pockets: 'Standard Chest', stitching: 'Hidden',
            buttons: 'عادي', quantity: 1, pricePerThobe: 0, specialInstructions: ''
        },
        measurements: defaultMeasurements,
        looseMeasurements: defaultLooseMeasurements,
        payment: { deposit: 0, discount: 0, extra: 0, paymentMethod: 'Cash' },
        customer: { id: null, name: '', phone: '' }
    };
});
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);

    const handleCustomerDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            customer: {
                ...prev.customer,
                [name]: value,
                id: prev.customer.id ?? null // Always keep id as null or number
            }
        }));
    };
    
    const checkExistingCustomer = () => {
        if (formData.customer.phone) {
            const existing = customers.find(c => c.phone === formData.customer.phone);
            setFoundCustomer(existing || null);
        } else {
            setFoundCustomer(null);
        }
    };

    const handleUseSavedMeasurements = () => {
        if (foundCustomer) {
            setFormData(prev => ({
                ...prev,
                measurements: foundCustomer.measurements.standard || defaultMeasurements,
                looseMeasurements: foundCustomer.measurements.loose || defaultLooseMeasurements,
                customer: { ...prev.customer, name: foundCustomer.name }
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['quantity', 'pricePerThobe'].includes(name);
        setFormData(prev => ({
            ...prev,
            details: { ...prev.details, [name]: isNumeric ? parseFloat(value) || 0 : value }
        }));
    };
    
    const handleMeasurementChange = (type: 'measurements' | 'looseMeasurements', e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [type]: { ...prev[type], [name]: value }
        }));
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            payment: { ...prev.payment, [name]: parseFloat(value) || 0 }
        }));
    };

    const handleSubmit = (e: React.FormEvent, andPrint = false) => {
        e.preventDefault();
        if (!formData.customer.name || !formData.customer.phone) {
            showToast(t('customerRequired'), 'error');
            return;
        }
        if (andPrint) {
            onSaveAndPrint(formData);
        } else {
            onSave(formData);
        }
    };

    const fabricCost = formData.details.quantity * formData.details.pricePerThobe;
    const subTotal = fabricCost + formData.payment.extra;
    const totalAmount = subTotal - formData.payment.discount;
    const remaining = totalAmount - formData.payment.deposit;
    
    const detailFields = [
        { name: 'fabric', options: FABRIC_OPTIONS, icon: Layers },
        { name: 'color', type: 'text', icon: Palette },
        { name: 'collar', options: COLLAR_OPTIONS, icon: CollarIcon },
        { name: 'cuffs', options: CUFF_OPTIONS, icon: CuffIcon },
        { name: 'pockets', options: POCKET_OPTIONS, icon: Pocket },
        { name: 'stitching', options: STITCHING_OPTIONS, icon: StitchingIcon },
        { name: 'buttons', type: 'text', icon: ButtonIcon },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-40 p-4 overflow-y-auto">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-6xl my-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{order ? t('edit') + ' ' + t('orders') : t('newOrder')}</h2>
                    <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                {/* Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 p-4 border rounded-lg dark:border-gray-700">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{t('customerInformation')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="name" placeholder={t('customerName')} value={formData.customer.name} onChange={handleCustomerDetailChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                            <div>
                                <input type="tel" name="phone" placeholder={t('customerPhone')} value={formData.customer.phone} onChange={handleCustomerDetailChange} onBlur={checkExistingCustomer} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                                {foundCustomer && (
                                    <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                                        <span>{t('customer')} {foundCustomer.name} {t('found')}.</span>
                                        <button type="button" onClick={handleUseSavedMeasurements} className="ml-2 rtl:mr-2 font-semibold underline">{t('useSavedMeasurements')}</button>
                                    </div>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <input type="text" name="address" placeholder={t('address')} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border rounded-lg dark:border-gray-700 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('orderDate')}</label>
                            <input type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('deliveryDate')}</label>
                            <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="p-4 border rounded-lg dark:border-gray-700 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t('measurements')} & {t('designStyle')}</h3>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium">{t('quantity')}</label>
                            <input type="number" name="quantity" min="1" value={formData.details.quantity} onChange={handleDetailChange} className="w-20 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-4 lg:col-span-3">
                            <ThobeMeasurementDiagram />
                        </div>
                        <div className="md:col-span-8 lg:col-span-5">
                            <h4 className="font-semibold mb-2">{t('measurements')}</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 content-start">
                                {Object.keys(formData.measurements).map(key => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t(key)}</label>
                                        <input type="number" name={key} value={(formData.measurements as any)[key]} onChange={(e) => handleMeasurementChange('measurements', e)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    </div>
                                ))}
                            </div>
                            <h4 className="font-semibold mt-4 mb-2">{t('looseSizeOptional')}</h4>
                             <div className="grid grid-cols-2 gap-x-4 gap-y-2 content-start">
                                {Object.keys(formData.looseMeasurements).map(key => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t(key)}</label>
                                        <input type="number" name={key} value={(formData.looseMeasurements as any)[key]} onChange={(e) => handleMeasurementChange('looseMeasurements', e)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-12 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 content-start">
                            {detailFields.map(field => (
                                <div key={field.name}>
                                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        <field.icon size={16} className="mr-2 rtl:ml-2" />
                                        {t(field.name)}
                                    </label>
                                    {field.type === 'text' ? (
                                        <input type="text" name={field.name} value={(formData.details as any)[field.name]} onChange={handleDetailChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    ) : (
                                        <select name={field.name} value={(formData.details as any)[field.name]} onChange={handleDetailChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            {field.options.map(opt => <option key={opt} value={opt}>{t(opt)}</option>)}
                                        </select>
                                    )}
                                </div>
                            ))}
                            <textarea name="specialInstructions" rows={3} placeholder={t('specialInstructions')} value={formData.details.specialInstructions} onChange={handleDetailChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:col-span-2 lg:col-span-1"></textarea>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 p-4 border rounded-lg dark:border-gray-700">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{t('paymentDetails')}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pricePerThobe')}</label>
                                <input type="number" name="pricePerThobe" value={formData.details.pricePerThobe} onChange={handleDetailChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('extra')}</label>
                                <input type="number" name="extra" value={formData.payment.extra} onChange={handlePaymentChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('discount')}</label>
                                <input type="number" name="discount" value={formData.payment.discount} onChange={handlePaymentChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('deposit')}</label>
                                <input type="number" name="deposit" value={formData.payment.deposit} onChange={handlePaymentChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                        </div>
                    </div>
                     <div className="p-4 border rounded-lg dark:border-gray-700 flex flex-col justify-center space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{t('subTotal')}</span>
                            <span className="font-semibold text-md">{subTotal.toFixed(2)} SAR</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-lg">
                            <span>{t('totalAmount')}</span>
                            <span>{totalAmount.toFixed(2)} SAR</span>
                        </div>
                        <div className="flex justify-between items-center text-red-600 dark:text-red-400 font-bold text-lg">
                            <span>{t('remaining')}</span>
                            <span>{remaining.toFixed(2)} SAR</span>
                        </div>
                    </div>
                </div>


                <div className="flex justify-end space-x-4 rtl:space-x-reverse">
                    <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">{t('cancel')}</button>
                    <button type="button" onClick={(e) => handleSubmit(e, true)} className="px-6 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 flex items-center gap-2">
                        <Printer size={18}/> {t('saveAndPrint')}
                    </button>
                    <button type="submit" className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 flex items-center">{t('save')}</button>
                </div>
            </form>
        </div>
    );
};

const Invoice = ({ order, customer, settings }: { order: Order, customer: Customer, settings: SettingsData }) => {

    const t = (key: string): string => {
        const keys = key.split('.');
        let result = translations['en'];
        for (const k of keys) {
            result = (result as any)[k];
            if (!result) return key;
        }
        return result as string || key;
    };

    const totalAmount = (Number(order.details.quantity) || 0) * (Number(order.details.pricePerThobe) || 0);

    return (
        <div className="p-8 bg-white text-black" dir="ltr">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{settings.shopName}</h1>
                    <p>{settings.shopAddress}</p>
                    <p>{t('phone')}: {settings.shopPhone}</p>
                    <p>{t('vatNumber')}: {settings.vatNumber}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-600">{t('invoice')}</h2>
                    <p>{t('orderNumber')}: {order.id}</p>
                    <p>{t('orderDate')}: {new Date(order.orderDate).toLocaleDateString('en-GB')}</p>
                    {order.deliveryDate && <p>{t('deliveryDate')}: {new Date(order.deliveryDate).toLocaleDateString('en-GB')}</p>}
                </div>
            </div>
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700">{t('billTo')}:</h3>
                <p className="font-bold">{customer.name}</p>
                <p>{t('phone')}: {customer.phone}</p>
            </div>
            
            <div className="mb-8">
                <h3 className="font-semibold text-gray-700 mb-2">{t('measurements')}:</h3>
                <div className="grid grid-cols-4 gap-x-8 gap-y-2 p-4 bg-gray-50 rounded-lg text-sm">
                    {Object.entries(order.measurements).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-gray-200 py-1">
                            <span className="font-medium text-gray-600">{t(key)}:</span>
                            <span className="font-mono">{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <table className="w-full mb-8">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 text-left font-semibold">{t('description')}</th>
                        <th className="p-2 text-center font-semibold">{t('quantity')}</th>
                        <th className="p-2 text-center font-semibold">{t('unitPrice')}</th>
                        <th className="p-2 text-right font-semibold">{t('total')}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b">
                        <td className="p-2">
                            Custom Thobe - {t(order.details.fabric)}, {t(order.details.collar)}, {t(order.details.cuffs)}
                            <p className="text-xs text-gray-500">{order.details.specialInstructions}</p>
                        </td>
                        <td className="p-2 text-center">{order.details.quantity}</td>
                        <td className="p-2 text-center">{Number(order.details.pricePerThobe).toFixed(2)}</td>
                        <td className="p-2 text-right">{totalAmount.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <div className="flex justify-end">
                <div className="w-full max-w-xs">
                    <div className="flex justify-between font-bold text-xl border-t-2 pt-2 mt-2"><span>{t('totalAmount')}</span><span>{totalAmount.toFixed(2)} SAR</span></div>
                    <div className="flex justify-between mt-2"><span>{t('deposit')}</span><span>{Number(order.payment.deposit).toFixed(2)} SAR</span></div>
                    <div className="flex justify-between font-bold text-green-600"><span>{t('remaining')}</span><span>{(totalAmount - Number(order.payment.deposit)).toFixed(2)} SAR</span></div>
                </div>
            </div>
            <div className="text-center mt-12 text-gray-600">
                <p>{t('thankYou')}</p>
            </div>
        </div>
    );
};

const InvoiceModal = ({ t, order, customer, settings, onCancel }: { t: (key: string) => string, order: Order, customer: Customer, settings: SettingsData, onCancel: () => void }) => {
    const componentRef = useRef<HTMLDivElement>(null);
    
    const handlePrint = () => {
        const node = componentRef.current;
        if (!node) {
            console.error("Print component not found.");
            return;
        }

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            console.error("Please allow popups for this website to print the invoice.");
            return;
        }

        const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
            .map(el => el.outerHTML)
            .join('');

        const content = node.innerHTML;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>${t('invoice')}</title>
                    ${styles}
                </head>
                <body>
                    ${content}
                </body>
            </html>
        `);

        printWindow.document.close();

        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 overflow-y-auto">
            <div className="bg-gray-100 dark:bg-gray-900 w-full max-w-3xl my-8 rounded-lg">
                <div className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 rounded-t-lg shadow">
                     <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('invoice')}</h2>
                     <div>
                        <button onClick={handlePrint} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                            <Printer size={18} /> {t('printInvoice')}
                        </button>
                        <button onClick={onCancel} className="ms-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <X size={24} />
                        </button>
                    </div>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                    <div ref={componentRef}>
                        <Invoice order={order} customer={customer} settings={settings} />
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- PAGE COMPONENTS ---

const Dashboard = ({ t, orders, customers, onNewOrderClick, onEditOrder, onDeleteOrder, onPrintInvoice }: { t: (key: string) => string, orders: Order[], customers: Customer[], onNewOrderClick: () => void, onEditOrder: (order: Order) => void, onDeleteOrder: (id: number) => void, onPrintInvoice: (order: Order) => void }) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyOrders = orders.filter(o => new Date(o.orderDate) >= startOfMonth && o.status !== 'Cancelled');
    const monthlyRevenue = monthlyOrders.reduce((acc, o) => {
        const total = (Number(o.details.quantity) || 0) * (Number(o.details.pricePerThobe) || 0);
        return acc + total;
    }, 0);

    const ordersInProgress = orders.filter(o => ['Fabric Cutting', 'Sewing'].includes(o.status)).length;
    const readyForPickup = orders.filter(o => o.status === 'Ready for Pickup').length;
    
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0, 5);

    const metrics = [
        { label: t('dashboardMetrics.totalOrders'), value: monthlyOrders.length, icon: ShoppingCart },
        { label: t('dashboardMetrics.monthlyRevenue'), value: monthlyRevenue.toFixed(2), icon: Tally3 },
        { label: t('dashboardMetrics.ordersInProgress'), value: ordersInProgress, icon: Scissors },
        { label: t('dashboardMetrics.readyForPickup'), value: readyForPickup, icon: User },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard')}</h1>
                <button onClick={onNewOrderClick} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                    <Plus size={18} /> {t('newOrder')}
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map(metric => (
                    <div key={metric.label} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mr-4 rtl:ml-4">
                            <metric.icon className="text-blue-600 dark:text-blue-300" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('recentOrders')}</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('orderNumber')}</th>
                                <th scope="col" className="px-6 py-3">{t('customer')}</th>
                                <th scope="col" className="px-6 py-3">{t('orderDate')}</th>
                                <th scope="col" className="px-6 py-3">{t('totalAmount')}</th>
                                <th scope="col" className="px-6 py-3">{t('status')}</th>
                                <th scope="col" className="px-6 py-3 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => {
                                const customer = customers.find(c => c.id === order.customerId);
                                const totalAmount = (Number(order.details.quantity) || 0) * (Number(order.details.pricePerThobe) || 0);
                                return (
                                    <tr key={order.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{order.id}</td>
                                        <td className="px-6 py-4">{customer ? customer.name : 'N/A'}</td>
                                        <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString('en-GB')}</td>
                                        <td className="px-6 py-4">{totalAmount.toFixed(2)} SAR</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                {t(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => onPrintInvoice(order)} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title={t('printInvoice')}><Printer size={18} /></button>
                                                <button onClick={() => onEditOrder(order)} className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" title={t('edit')}><Edit size={18} /></button>
                                                <button onClick={() => onDeleteOrder(order.id)} className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title={t('delete')}><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const OrdersPage = ({ t, orders, setOrders, customers, setCustomers, showToast, onNewOrderClick, onEditOrder, onDeleteOrder, onPrintInvoice }: { t: (key: string) => string, orders: Order[], setOrders: React.Dispatch<React.SetStateAction<Order[]>>, customers: Customer[], setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>, showToast: (message: string, type: 'success' | 'error') => void, onNewOrderClick: () => void, onEditOrder: (order: Order) => void, onDeleteOrder: (id: number) => void, onPrintInvoice: (order: Order) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredOrders = orders.filter(order => {
        const customer = customers.find(c => c.id === order.customerId);
        const searchLower = searchTerm.toLowerCase();
        return (
            (customer && (customer.name.toLowerCase().includes(searchLower) || customer.phone.includes(searchLower))) ||
            String(order.id).includes(searchLower)
        );
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('allOrders')}</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('searchByNameOrPhone')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 pl-10 rtl:pr-10 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('orderNumber')}</th>
                                <th scope="col" className="px-6 py-3">{t('customer')}</th>
                                <th scope="col" className="px-6 py-3">{t('orderDate')}</th>
                                <th scope="col" className="px-6 py-3">{t('deliveryDate')}</th>
                                <th scope="col" className="px-6 py-3">{t('totalAmount')}</th>
                                <th scope="col" className="px-6 py-3">{t('status')}</th>
                                <th scope="col" className="px-6 py-3 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => {
                                const customer = customers.find(c => c.id === order.customerId);
                                const totalAmount = (Number(order.details.quantity) || 0) * (Number(order.details.pricePerThobe) || 0);
                                return (
                                    <tr key={order.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{order.id}</td>
                                        <td className="px-6 py-4">{customer ? customer.name : 'N/A'}</td>
                                        <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString('en-GB')}</td>
                                        <td className="px-6 py-4">{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-GB') : '-'}</td>
                                        <td className="px-6 py-4">{totalAmount.toFixed(2)} SAR</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                {t(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => onPrintInvoice(order)} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title={t('printInvoice')}><Printer size={18} /></button>
                                                <button onClick={() => onEditOrder(order)} className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" title={t('edit')}><Edit size={18} /></button>
                                                <button onClick={() => onDeleteOrder(order.id)} className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title={t('delete')}><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const CustomersPage = ({ t, customers, setCustomers, showToast }: { t: (key: string) => string, customers: Customer[], setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>, showToast: (message: string, type: 'success' | 'error') => void }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleNewCustomer = () => {
        setEditingCustomer(null);
        setIsFormOpen(true);
    };

    const handleEditCustomer = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsFormOpen(true);
    };

    const handleDeleteCustomer = (id: number) => {
        setDeletingId(id);
    };
    
    const confirmDelete = () => {
        const updatedCustomers = customers.filter(c => c.id !== deletingId);
        setCustomers(updatedCustomers);
        setDeletingId(null);
        showToast(t('itemDeleted'), 'success');
    };

    const handleSaveCustomer = (customerData: Customer) => {
        if (editingCustomer) {
            const updatedCustomers = customers.map(c => c.id === editingCustomer.id ? customerData : c);
            setCustomers(updatedCustomers);
            showToast(t('customerUpdated'), 'success');
        } else {
            setCustomers([customerData, ...customers]);
            showToast(t('customerCreated'), 'success');
        }
        setIsFormOpen(false);
        setEditingCustomer(null);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('customers')}</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('searchByNameOrPhone')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 pl-10 rtl:pr-10 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <button onClick={handleNewCustomer} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                        <Plus size={18} /> {t('newCustomer')}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('customerName')}</th>
                                <th scope="col" className="px-6 py-3">{t('customerPhone')}</th>
                                <th scope="col" className="px-6 py-3">{t('notes')}</th>
                                <th scope="col" className="px-6 py-3 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{customer.name}</td>
                                    <td className="px-6 py-4">{customer.phone}</td>
                                    <td className="px-6 py-4">{customer.notes}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <button onClick={() => handleEditCustomer(customer)} className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" title={t('edit')}><Edit size={18} /></button>
                                            <button onClick={() => handleDeleteCustomer(customer.id)} className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title={t('delete')}><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isFormOpen && <CustomerForm t={t} customer={editingCustomer} onSave={handleSaveCustomer} onCancel={() => setIsFormOpen(false)} />}
            {deletingId && <ConfirmationModal t={t} onConfirm={confirmDelete} onCancel={() => setDeletingId(null)} />}
        </div>
    );
};

const SettingsPage = ({ t, showToast }: { t: (key: string) => string, showToast: (message: string, type: 'success' | 'error') => void }) => {
    const [settings, setSettings] = useState<SettingsData>(api.getSettings());

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        api.setSettings(settings);
        showToast(t('settingsSaved'), 'success');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('shopSettings')}</h1>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('shopName')}</label>
                            <input type="text" name="shopName" value={settings.shopName} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('shopPhone')}</label>
                            <input type="text" name="shopPhone" value={settings.shopPhone} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('shopAddress')}</label>
                            <input type="text" name="shopAddress" value={settings.shopAddress} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('vatNumber')}</label>
                            <input type="text" name="vatNumber" value={settings.vatNumber} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-8">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                           {t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const LoginPage = ({ t, onLogin, language, setLanguage }: { t: (key: string) => string, onLogin: () => void, language: string, setLanguage: (lang: string) => void }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const passwordInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        passwordInputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would be a secure check against a server.
        if (password === 'admin123') {
            onLogin();
        } else {
            setError(t('incorrectPassword'));
            setPassword('');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <div className="text-center">
                    <Scissors className="mx-auto text-blue-600" size={48} />
                    <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{t('appName')}</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('adminLogin')}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <KeyRound className="absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            ref={passwordInputRef}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('password')}
                            className="w-full pl-10 rtl:pr-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        {t('login')}
                    </button>
                </form>
                 <div className="text-center">
                    <button 
                        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} 
                        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                        {language === 'en' ? 'العربية' : 'English'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
export default function App() {
    const { language, setLanguage, t } = useLanguage();
    const [theme, setTheme] = useTheme();
    const [page, setPage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [printingOrder, setPrintingOrder] = useState<{order: Order, customer: Customer} | null>(null);
    
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(sessionStorage.getItem('isAuthenticated') === 'true');
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            setOrders(api.get('thobe_pos_orders'));
            setCustomers(api.get('thobe_pos_customers'));
        }
    }, [isAuthenticated]);
    
    useEffect(() => {
        if (isAuthenticated) {
            api.set('thobe_pos_orders', orders);
        }
    }, [orders, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            api.set('thobe_pos_customers', customers);
        }
    }, [customers, isAuthenticated]);
    
    const handleLogin = () => {
        sessionStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    };

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
    };

    const handleNewOrderClick = () => {
        setEditingOrder(null);
        setIsFormOpen(true);
    };

    const handleEditOrder = (order: Order) => {
        setEditingOrder(order);
        setIsFormOpen(true);
    };
    
    const handleDeleteOrder = (id: number) => {
        setDeletingId(id);
    };

    const confirmDelete = () => {
        setOrders(orders.filter(o => o.id !== deletingId));
        setDeletingId(null);
        showToast(t('itemDeleted'), 'success');
    };

    const handlePrintInvoice = (order: Order) => {
        const customer = customers.find(c => c.id === order.customerId);
        if(customer) {
            setPrintingOrder({order, customer});
        }
    };

    const handleSaveOrder = (orderData: any, andPrint = false) => {
        const { customer, ...restOfOrder } = orderData;
        let customerToSave = customers.find(c => c.phone === customer.phone);
        let customerIdToSave;
        let customerForInvoice;

        if (customerToSave) {
            customerIdToSave = customerToSave.id;
            customerForInvoice = { ...customerToSave, name: customer.name, measurements: { standard: orderData.measurements, loose: orderData.looseMeasurements } };
            if (customerToSave.name !== customer.name || JSON.stringify(customerToSave.measurements) !== JSON.stringify({ standard: orderData.measurements, loose: orderData.looseMeasurements })) {
                setCustomers(customers.map(c => c.id === customerIdToSave ? customerForInvoice : c));
            }
        } else {
            const newCustomer: Customer = { 
                id: Date.now(), 
                name: customer.name, 
                phone: customer.phone, 
                measurements: { standard: orderData.measurements, loose: orderData.looseMeasurements },
                notes: '' 
            };
            setCustomers(prevCustomers => [newCustomer, ...prevCustomers]);
            customerIdToSave = newCustomer.id;
            customerForInvoice = newCustomer;
        }

        const finalOrderData = { ...restOfOrder, customerId: customerIdToSave };
        delete finalOrderData.customer;

        if (editingOrder) {
            setOrders(orders.map(o => o.id === editingOrder.id ? finalOrderData : o));
            showToast(t('orderUpdated'), 'success');
        } else {
            const newOrderId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
            finalOrderData.id = newOrderId;
            setOrders(prevOrders => [finalOrderData, ...prevOrders]);
            showToast(t('orderCreated'), 'success');
        }
        setIsFormOpen(false);
        setEditingOrder(null);
        if (andPrint) {
            setPrintingOrder({order: finalOrderData, customer: customerForInvoice});
        }
    };

    const handleSaveAndPrint = (orderData: any) => {
        handleSaveOrder(orderData, true);
    }

    if (!isAuthenticated) {
        return <LoginPage t={t} onLogin={handleLogin} language={language} setLanguage={setLanguage} />;
    }

    const renderPage = () => {
        switch (page) {
            case 'dashboard': return <Dashboard t={t} orders={orders} customers={customers} onNewOrderClick={handleNewOrderClick} onEditOrder={handleEditOrder} onDeleteOrder={handleDeleteOrder} onPrintInvoice={handlePrintInvoice} />;
            case 'orders': return <OrdersPage t={t} orders={orders} setOrders={setOrders} customers={customers} setCustomers={setCustomers} showToast={showToast} onEditOrder={handleEditOrder} onDeleteOrder={handleDeleteOrder} onPrintInvoice={handlePrintInvoice} />;
            case 'customers': return <CustomersPage t={t} customers={customers} setCustomers={setCustomers} showToast={showToast} />;
            case 'settings': return <SettingsPage t={t} showToast={showToast} />;
            default: return <Dashboard t={t} orders={orders} customers={customers} onNewOrderClick={handleNewOrderClick} />;
        }
    };

    const navItems = [
        { id: 'dashboard', icon: Tally3, label: t('dashboard') },
        { id: 'orders', icon: ShoppingCart, label: t('orders') },
        { id: 'customers', icon: User, label: t('customers') },
        { id: 'settings', icon: Settings, label: t('settings') },
    ];

    return (
        <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans`}>
            {/* Sidebar */}
            <aside className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-64 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')} md:translate-x-0 absolute md:relative z-30 h-full`}>
                <div className="flex items-center justify-center h-20 border-b dark:border-gray-700">
                    <Scissors className="text-blue-600" size={24} />
                    <h1 className="text-xl font-bold ml-2 rtl:mr-2">{t('appName')}</h1>
                </div>
                <nav className="flex-grow px-4 py-6">
                    {navItems.map(item => (
                        <a
                            key={item.id}
                            href="#"
                            onClick={(e) => { e.preventDefault(); setPage(item.id); setIsSidebarOpen(false); }}
                            className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200 ${page === item.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            <item.icon size={20} />
                            <span className="mx-4 font-medium">{item.label}</span>
                        </a>
                    ))}
                </nav>
                <div className="p-4 border-t dark:border-gray-700 space-y-4">
                     <button 
                        onClick={handleLogout} 
                        className="flex items-center w-full px-4 py-3 text-left rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"
                    >
                        <LogOut size={20} />
                        <span className="mx-4 font-medium">{t('logout')}</span>
                    </button>
                    <div className="flex items-center justify-around">
                        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 font-bold">
                            {language === 'en' ? 'AR' : 'EN'}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between md:justify-end items-center h-20 px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                    <button className="md:hidden text-gray-600 dark:text-gray-300" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Tally3 size={24} />
                    </button>
                    <div className="flex items-center">
                        {/* Header content like user profile dropdown can go here */}
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
                    {renderPage()}
                </main>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
            {isFormOpen && <OrderForm t={t} order={editingOrder} customers={customers} onSave={handleSaveOrder} onSaveAndPrint={handleSaveAndPrint} onCancel={() => setIsFormOpen(false)} showToast={showToast} />}
            {deletingId && <ConfirmationModal t={t} onConfirm={confirmDelete} onCancel={() => setDeletingId(null)} />}
            {printingOrder && <InvoiceModal t={t} order={printingOrder.order} customer={printingOrder.customer} settings={api.getSettings()} onCancel={() => setPrintingOrder(null)} />}
        </div>
    );
}
