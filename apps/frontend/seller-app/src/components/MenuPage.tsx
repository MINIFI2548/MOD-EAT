// components/MenuPage.tsx
import { useState } from 'react';

// Define Type สำหรับ Menu Item
interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
    description: string;
    isAvailable: boolean;
    image?: string;
}

// Mock Data เริ่มต้น (เพื่อให้เห็นภาพ)
const initialMenus: MenuItem[] = [
    { id: 1, name: "กะเพราหมูสับ", price: 55, category: "อาหารจานเดียว", description: "เผ็ดร้อน ถึงเครื่อง", isAvailable: true },
    { id: 2, name: "ข้าวผัดปู", price: 80, category: "อาหารจานเดียว", description: "เนื้อปูเน้นๆ", isAvailable: true },
    { id: 3, name: "ต้มยำกุ้ง", price: 120, category: "กับข้าว", description: "กุ้งแม่น้ำตัวโต", isAvailable: false },
    { id: 4, name: "น้ำลำไย", price: 25, category: "เครื่องดื่ม", description: "หวานเย็นชื่นใจ", isAvailable: true },
];

export default function MenuPage() {
    const [menus, setMenus] = useState<MenuItem[]>(initialMenus);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    // --- Actions ---
    
    // เปิด Modal สำหรับเพิ่มเมนูใหม่
    const handleAddNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    // เปิด Modal สำหรับแก้ไข
    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    // ลบเมนู
    const handleDelete = (id: number) => {
        if (confirm("คุณต้องการลบเมนูนี้ใช่หรือไม่?")) {
            setMenus(prev => prev.filter(m => m.id !== id));
        }
    };

    // เปลี่ยนสถานะ (มีของ / หมด)
    const handleToggleStatus = (id: number) => {
        setMenus(prev => prev.map(m => 
            m.id === id ? { ...m, isAvailable: !m.isAvailable } : m
        ));
    };

    // บันทึกข้อมูล (รับค่าจาก Modal)
    const handleSave = (item: MenuItem) => {
        if (editingItem) {
            // Update Existing
            setMenus(prev => prev.map(m => m.id === item.id ? item : m));
        } else {
            // Create New (Generate ID แบบง่ายๆ)
            const newItem = { ...item, id: Date.now() }; 
            setMenus(prev => [...prev, newItem]);
        }
        setIsModalOpen(false);
    };

    return (
        <div>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">จัดการเมนูอาหาร</h2>
                    <p className="text-sm text-gray-500">ทั้งหมด {menus.length} รายการ</p>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                >
                    <span>+</span> เพิ่มเมนูใหม่
                </button>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menus.map((menu) => (
                    <div key={menu.id} className={`bg-white border rounded-xl p-4 shadow-sm relative transition-all ${!menu.isAvailable ? 'opacity-75 bg-gray-50' : ''}`}>
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                            <button 
                                onClick={() => handleToggleStatus(menu.id)}
                                className={`text-xs px-2 py-1 rounded-full border font-medium transition-colors ${
                                    menu.isAvailable 
                                    ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' 
                                    : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                                }`}
                            >
                                {menu.isAvailable ? 'พร้อมขาย' : 'ของหมด'}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex gap-4 mb-4">
                            {/* รูปตัวอย่าง (ใช้ Emoji หรือ Placeholder แทนรูปจริงไปก่อน) */}
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                                🍲
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-lg">{menu.name}</h3>
                                <p className="text-orange-600 font-bold">฿{menu.price}</p>
                                <p className="text-xs text-gray-500 mt-1">{menu.category}</p>
                            </div>
                        </div>
                        
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                            {menu.description || "- ไม่มีคำอธิบาย -"}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                            <button 
                                onClick={() => handleEdit(menu)}
                                className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ✏️ แก้ไข
                            </button>
                            <button 
                                onClick={() => handleDelete(menu.id)}
                                className="px-3 py-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            >
                                🗑️ ลบ
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Render Modal */}
            {isModalOpen && (
                <MenuModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    initialData={editingItem}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

// --- Sub Component: Modal Form ---
interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: MenuItem | null;
    onSave: (item: any) => void;
}

function MenuModal({ isOpen, onClose, initialData, onSave }: MenuModalProps) {
    const [formData, setFormData] = useState({
        id: initialData?.id || 0,
        name: initialData?.name || '',
        price: initialData?.price || 0,
        category: initialData?.category || 'อาหารจานเดียว',
        description: initialData?.description || '',
        isAvailable: initialData?.isAvailable ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-orange-50">
                    <h3 className="font-bold text-lg text-gray-800">
                        {initialData ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อเมนู</label>
                        <input 
                            required
                            type="text" 
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (บาท)</label>
                            <input 
                                required
                                type="number" 
                                min="0"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                            <select 
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="อาหารจานเดียว">อาหารจานเดียว</option>
                                <option value="กับข้าว">กับข้าว</option>
                                <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                                <option value="ของทานเล่น">ของทานเล่น</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด (Option)</label>
                        <textarea 
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                         <input 
                            type="checkbox"
                            id="isAvailable"
                            className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                            checked={formData.isAvailable}
                            onChange={e => setFormData({...formData, isAvailable: e.target.checked})}
                         />
                         <label htmlFor="isAvailable" className="text-sm text-gray-700">เปิดขายทันที</label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            ยกเลิก
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
                        >
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}