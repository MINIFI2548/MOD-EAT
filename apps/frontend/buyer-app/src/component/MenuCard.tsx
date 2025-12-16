import type { MenuItem } from "@mod-eat/api-types";
// ตัด useCartContext ออกจากตรงนี้ เพราะเราจะไป Add ใน Modal แทน

interface MenuCardProps {
    menu: MenuItem;
    onClick: (menu: MenuItem) => void; // รับ prop onClick เข้ามา
}

export default function MenuCard({ menu, onClick }: MenuCardProps) { 
    
    return(
        <div 
            onClick={() => onClick(menu)} // ส่งเมนูที่กดกลับไปหา Parent
            className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-orange-50 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
        >
            <div className="flex items-center gap-4">
                {/* รูปเมนู */}
                <div className="w-16 h-16 bg-orange-50 rounded-lg shrink-0 overflow-hidden relative">
                    <img 
                        src={menu?.pictureUrl ?? 'https://placehold.co/400x400'} 
                        alt={menu.menuName} 
                        className="w-full h-full object-cover" 
                        onError={(e) => (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/400x400'}
                    />
                </div>
                
                {/* ชื่อและราคา */}
                <div>
                    <h3 className="text-gray-800 font-bold text-base line-clamp-1">{menu.menuName}</h3>
                    <p className="text-orange-600 font-bold mt-1">{menu.price} บาท</p>
                </div>
            </div>

            {/* ปุ่มบวก (Visual Only) */}
            <div className="bg-orange-100 text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
        </div>
    )
}