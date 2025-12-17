import { api, type MenuItem } from '@mod-eat/api-types';

interface MenuCardProps {
    menu: MenuItem;
    onToggleStatus: (id: number) => void;
    onEdit: (item: MenuItem) => void;
    onDelete: (id: number) => void;
}

export default function MenuCard({ menu, onToggleStatus, onEdit, onDelete }: MenuCardProps) {
    
    // Helper สำหรับเลือกสีป้ายสถานะ
    const getStatusColor = (status: string) => {
        return status === 'enable'
            ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
            : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200';
    };

    return (
        <div className={`bg-white border rounded-xl p-4 shadow-sm relative transition-all flex flex-col h-full ${menu.status === 'disable' ? 'opacity-75 bg-gray-50' : ''}`}>
            
            {/* Status Badge (มุมขวาบน) */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={() => onToggleStatus(menu.menuId)}
                    className={`text-xs px-2 py-1 rounded-full border font-medium transition-colors ${getStatusColor(menu.status)}`}
                >
                    {menu.status === 'enable' ? 'พร้อมขาย' : 'หมดชั่วคราว'}
                </button>
            </div>

            {/* Content Section */}
            <div className="flex gap-4 mb-4">
                {/* Image Handling */}
                <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center text-3xl">
                    {menu.pictureUrl ? (
                        <img 
                            src={menu.pictureUrl} 
                            alt={menu.menuName} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback ถ้าโหลดรูปไม่ได้ ให้ซ่อน img แล้วโชว์ emoji แทน
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerText = '🍲';
                            }}
                        />
                    ) : (
                        <span>🍲</span>
                    )}
                </div>

                <div className="flex-1 pr-16"> {/* pr-16 เพื่อหลบปุ่ม Status */}
                    <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{menu.menuName}</h3>
                    <p className="text-orange-600 font-bold">฿{menu.price}</p>
                </div>
            </div>

            {/* Description (จำกัดบรรทัด) */}
            <div className="grow">
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-10">
                    {menu.description || "- ไม่มีคำอธิบาย -"}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
                <button
                    onClick={() => onEdit(menu)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                    ✏️ แก้ไข
                </button>
                <button
                    onClick={() => onDelete(menu.menuId)}
                    className="px-3 py-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
}