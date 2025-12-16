import { useState } from 'react';

// --- Interfaces ---
interface OptionItem {
    id: string;
    name: string;
    price: number;
    isAvailable: boolean; // ตัวคุม เปิด/ปิด
}

interface OptionGroup {
    id: string;
    name: string; // ชื่อกลุ่ม เช่น "เนื้อสัตว์", "ความหวาน"
    items: OptionItem[];
}

// --- Mock Data ---
const initialGroups: OptionGroup[] = [
    {
        id: 'g1',
        name: 'เนื้อสัตว์ (Meat)',
        items: [
            { id: 'i1', name: 'หมูสับ', price: 0, isAvailable: true },
            { id: 'i2', name: 'หมูชิ้น', price: 0, isAvailable: true },
            { id: 'i3', name: 'ไก่', price: 0, isAvailable: true },
            { id: 'i4', name: 'เนื้อวัว', price: 10, isAvailable: false }, // หมด
            { id: 'i5', name: 'ทะเล', price: 20, isAvailable: true },
        ]
    },
    {
        id: 'g2',
        name: 'ระดับความเผ็ด',
        items: [
            { id: 'i6', name: 'ไม่เผ็ด', price: 0, isAvailable: true },
            { id: 'i7', name: 'เผ็ดน้อย', price: 0, isAvailable: true },
            { id: 'i8', name: 'เผ็ดกลาง', price: 0, isAvailable: true },
            { id: 'i9', name: 'เผ็ดมาก', price: 0, isAvailable: true },
        ]
    },
    {
        id: 'g3',
        name: 'ท็อปปิ้งเพิ่มเติม',
        items: [
            { id: 'i10', name: 'ไข่ดาว', price: 10, isAvailable: true },
            { id: 'i11', name: 'ไข่เจียว', price: 15, isAvailable: true },
        ]
    }
];

export default function OptionManagementPage() {
    const [groups, setGroups] = useState<OptionGroup[]>(initialGroups);
    const [newGroupName, setNewGroupName] = useState('');

    // --- Logic ---

    // 1. Toggle เปิด/ปิด สถานะของตัวเลือก
    const handleToggleItem = (groupId: string, itemId: string) => {
        setGroups(prev => prev.map(group => {
            if (group.id !== groupId) return group;
            return {
                ...group,
                items: group.items.map(item => 
                    item.id === itemId 
                    ? { ...item, isAvailable: !item.isAvailable }
                    : item
                )
            };
        }));
    };

    // 2. เพิ่มกลุ่มใหม่
    const handleAddGroup = () => {
        if (!newGroupName.trim()) return;
        const newGroup: OptionGroup = {
            id: Date.now().toString(),
            name: newGroupName,
            items: []
        };
        setGroups([...groups, newGroup]);
        setNewGroupName('');
    };

    // 3. ลบกลุ่ม
    const handleDeleteGroup = (groupId: string) => {
        if(confirm('ยืนยันการลบกลุ่มตัวเลือกนี้?')) {
            setGroups(prev => prev.filter(g => g.id !== groupId));
        }
    };

    // 4. เพิ่มตัวเลือกย่อยในกลุ่ม
    const handleAddItem = (groupId: string) => {
        // ในการใช้งานจริงอาจจะทำเป็น Modal เด้ง แต่เพื่อความง่ายใช้ prompt ไปก่อน
        const name = prompt("ชื่อตัวเลือก (เช่น ไข่ดาว)");
        if (!name) return;
        const priceStr = prompt("ราคาบวกเพิ่ม (ใส่ 0 ถ้าฟรี)");
        const price = priceStr ? parseInt(priceStr) : 0;

        const newItem: OptionItem = {
            id: Date.now().toString(),
            name,
            price,
            isAvailable: true
        };

        setGroups(prev => prev.map(group => 
            group.id === groupId 
            ? { ...group, items: [...group.items, newItem] }
            : group
        ));
    };

    // 5. ลบตัวเลือกย่อย
    const handleDeleteItem = (groupId: string, itemId: string) => {
        setGroups(prev => prev.map(group => {
            if (group.id !== groupId) return group;
            return {
                ...group,
                items: group.items.filter(item => item.id !== itemId)
            };
        }));
    };

    return (
        <div className="p-4 md:p-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">จัดการตัวเลือก (Options)</h2>
                    <p className="text-gray-500 text-sm">จัดการกลุ่มตัวเลือกและสถานะสินค้าหมด</p>
                </div>
                
                {/* Add New Group Form */}
                <div className="flex gap-2 w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="ชื่อกลุ่มใหม่ (เช่น ไซส์แก้ว)" 
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                    />
                    <button 
                        onClick={handleAddGroup}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg whitespace-nowrap font-medium text-sm shadow-sm"
                    >
                        + สร้างกลุ่ม
                    </button>
                </div>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {groups.map((group) => (
                    <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        
                        {/* Card Header */}
                        <div className="bg-orange-50 px-4 py-3 border-b border-orange-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 text-lg">{group.name}</h3>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleAddItem(group.id)}
                                    className="text-xs bg-white border border-orange-200 text-orange-600 px-2 py-1 rounded hover:bg-orange-50"
                                >
                                    + เพิ่มตัวเลือก
                                </button>
                                <button 
                                    onClick={() => handleDeleteGroup(group.id)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>

                        {/* List Items */}
                        <div className="divide-y divide-gray-100">
                            {group.items.length === 0 ? (
                                <div className="p-4 text-center text-gray-400 text-sm">ยังไม่มีตัวเลือกในกลุ่มนี้</div>
                            ) : (
                                group.items.map((item) => (
                                    <div key={item.id} className={`flex justify-between items-center p-3 hover:bg-gray-50 transition-colors ${!item.isAvailable ? 'bg-gray-50' : ''}`}>
                                        
                                        {/* Left Info */}
                                        <div className="flex items-center gap-3">
                                            {/* Toggle Switch */}
                                            <button 
                                                onClick={() => handleToggleItem(group.id, item.id)}
                                                className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${
                                                    item.isAvailable ? 'bg-green-500' : 'bg-gray-300'
                                                }`}
                                            >
                                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                                    item.isAvailable ? 'translate-x-4' : 'translate-x-0'
                                                }`}></div>
                                            </button>

                                            <div className={!item.isAvailable ? 'opacity-50' : ''}>
                                                <p className="font-medium text-gray-700">{item.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {item.price > 0 ? `+${item.price} บาท` : 'ฟรี'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Action */}
                                        <div className="flex items-center gap-3">
                                            {!item.isAvailable && (
                                                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                                    หมด
                                                </span>
                                            )}
                                            <button 
                                                onClick={() => handleDeleteItem(group.id, item.id)}
                                                className="text-gray-300 hover:text-red-500 text-sm"
                                            >
                                                &times;
                                            </button>
                                        </div>

                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}