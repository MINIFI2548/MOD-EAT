import { api } from '@mod-eat/api-types';
import { useEffect, useState } from 'react';
import { useRestaurantContext } from '../context/RestaurantContext';
import type { MenuItem } from '@mod-eat/api-types';
import MenuCard from './MenuCard'; // Import ไฟล์ Card ที่แยกไว้

export default function MenuPage() {
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const { id } = useRestaurantContext();

    // Fetch Data
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const { data } = await api.seller.dashboard.menus.get({ query: { id: id } });
                if(data) setMenus(data as any);
            } catch (error) {
                console.error("Failed to fetch menus", error);
            }
        };
        fetchMenus();
    }, [id]);

    // --- Actions ---
    const handleAddNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (menuId: number) => {
        if (confirm("คุณต้องการลบเมนูนี้ใช่หรือไม่?")) {
            // TODO: Call API Delete here
            setMenus(prev => prev.filter(m => m.menuId !== menuId));
        }
    };

    const handleToggleStatus = (menuId: number) => {
        const currentMenu = menus.find(m => m.menuId === menuId);
        if (!currentMenu) return;

        const newStatus = currentMenu.status === 'enable' ? 'disable' : 'enable';
        setMenus(prev => prev.map(m =>
            m.menuId === menuId
                ? { ...m, status: newStatus }
                : m
        ));
        try {
            api.seller.dashboard.menu.put({
                menuId: menuId,
                status: newStatus
            });
            console.log(`Updated menu ${menuId} status to ${newStatus}`);
        } catch (error) {
            console.error("Failed to update status", error);
            
                        setMenus(prev => prev.map(m =>
                m.menuId === menuId
                    ? { ...m, status: currentMenu.status }
                    : m
            ));
            alert("ไม่สามารถบันทึกสถานะได้ กรุณาลองใหม่อีกครั้ง");
        }
    };
    const handleSave = (item: any) => {
        // Map ข้อมูลจาก Form กลับเป็น Structure ของ MenuItem
        const newItem: MenuItem = {
            menuId: editingItem ? editingItem.menuId : Date.now(), // Mock ID ถ้าเป็น new
            menuName: item.menuName,
            price: Number(item.price),
            description: item.description,
            pictureUrl: item.pictureUrl,
            status: item.isAvailable ? 'enable' : 'disable',
            options: editingItem?.options || [] // รักษา options เดิมไว้
        };

        if (editingItem) {
            setMenus(prev => prev.map(m => m.menuId === newItem.menuId ? newItem : m));
        } else {
            setMenus(prev => [...prev, newItem]);
        }
        setIsModalOpen(false);
        // TODO: Call API Save/Update here
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {menus.map((menu) => (
                    <MenuCard 
                        key={menu.menuId}
                        menu={menu}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                    />
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

// --- Sub Component: Modal Form (ปรับปรุงใหม่) ---
interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: MenuItem | null;
    onSave: (item: any) => void;
}

function MenuModal({ isOpen, onClose, initialData, onSave }: MenuModalProps) {
    // กำหนดค่าเริ่มต้น State
    const [formData, setFormData] = useState({
        menuName: initialData?.menuName || '',
        price: initialData?.price || 0,
        description: initialData?.description || '',
        pictureUrl: initialData?.pictureUrl || '',
        isAvailable: initialData?.status === 'disable' ? false : true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        // ---------------------------------------------------------------------------
        // ✨ จุดที่แก้ไข: เปลี่ยนพื้นหลังเป็นแบบ Glassmorphism (เบลอ + ขาวจางๆ) 
        // จากเดิม: bg-black bg-opacity-50
        // เป็น:    bg-white/30 backdrop-blur-md border border-white/20
        // ---------------------------------------------------------------------------
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500/10 backdrop-blur-md transition-all">
            
            {/* ตัวกล่อง Modal ใส่เงาให้ชัดขึ้น (shadow-2xl) เพื่อให้ลอยเด่นจากพื้นหลังที่เบลอ */}
            <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 animate-fade-in-up">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-orange-50">
                    <h3 className="font-bold text-lg text-gray-800">
                        {initialData ? '✏️ แก้ไขเมนู' : '✨ เพิ่มเมนูใหม่'}
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                    >
                        &times;
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Image Preview & URL */}
                    <div className="flex gap-4 items-start">
                        <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                             {formData.pictureUrl ? (
                                <img src={formData.pictureUrl} alt="Preview" className="w-full h-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />
                             ) : <span className="text-2xl opacity-50">📷</span>}
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm transition-shadow"
                                placeholder="https://..."
                                value={formData.pictureUrl}
                                onChange={e => setFormData({ ...formData, pictureUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อเมนู <span className="text-red-500">*</span></label>
                        <input
                            required
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-shadow"
                            value={formData.menuName}
                            onChange={e => setFormData({ ...formData, menuName: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (บาท) <span className="text-red-500">*</span></label>
                            <input
                                required
                                type="number"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-shadow"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                        <textarea
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm transition-shadow"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 cursor-pointer accent-orange-500"
                            checked={formData.isAvailable}
                            onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                        />
                        <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                            เปิดขายทันที (Active)
                        </label>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold shadow-md hover:shadow-lg transition-all"
                        >
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}