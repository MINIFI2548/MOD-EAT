// components/MenuPage.tsx
import { api } from '@mod-eat/api-types';
import { useEffect, useState } from 'react';
import { useRestaurantContext } from '../context/RestaurantContext';
import type { MenuItem } from '@mod-eat/api-types';


export default function MenuPage() {
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const { id } = useRestaurantContext()

    useEffect(() => { 
        api.seller.dashboard.menus.get({
            query : {id : id}
        })
        .then(({data}) => {
            // console.log(data)
            setMenus(data)
        })
    }, [])

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
            setMenus(prev => prev.filter(m => m.menuId !== id));
        }
    };

    // เปลี่ยนสถานะ (มีของ / หมด)
    const handleToggleStatus = (id: number) => {
    setMenus(prev =>
        prev.map(m =>
            m.menuId === id
                ? {
                    ...m,
                    status: m.status === 'enable'
                        ? 'disable'
                        : 'enable'
                  }
                : m
        )
        );
    };

    // บันทึกข้อมูล (รับค่าจาก Modal)
    const handleSave = (item: MenuItem) => {
        if (editingItem) {
            // Update Existing
            setMenus(prev => prev.map(m => m.menuId === item.menuId ? item : m));
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">จัดการเมนูอาหาร</h2>
                    <p className="text-sm text-gray-500">รายการอาหารทั้งหมด <span className="font-medium text-gray-700">{menus.length}</span> รายการ</p>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors font-medium text-sm"
                >
                    <span>+</span> เพิ่มเมนูใหม่
                </button>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menus.map((menu, index) => (
                    <div key={index} className={`bg-white border rounded-xl p-4 shadow-sm relative transition-all ${menu.status == 'disable' ? 'opacity-75 bg-gray-50' : ''}`}>
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                            <button 
                                onClick={() => handleToggleStatus(menu.menuId)}
                                className={`text-xs px-2 py-1 rounded-full border font-medium transition-colors ${
                                    menu.status == "enable" 
                                    ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' 
                                    : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                                }`}
                            >
                                {menu.status == "enable" ? 'พร้อมขาย' : 'ไม่หร้อมขาย'}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex gap-4 mb-4">
                            {/* รูปตัวอย่าง (ใช้ Emoji หรือ Placeholder แทนรูปจริงไปก่อน) */}
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                                🍲
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-lg">{menu.menuName}</h3>
                                <p className="text-orange-600 font-bold">฿{menu.price}</p>
                                {/* <p className="text-xs text-gray-500 mt-1">{menu.category}</p> */}
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
                                onClick={() => handleDelete(menu.menuId)}
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