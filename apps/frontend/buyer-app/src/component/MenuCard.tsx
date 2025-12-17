import type { MenuItem } from "@mod-eat/api-types";
// ตัด useCartContext ออกจากตรงนี้ เพราะเราจะไป Add ใน Modal แทน

interface MenuCardProps {
    menu: MenuItem;
    onClick: (menu: MenuItem) => void; // รับ prop onClick เข้ามา
}

export default function MenuCard({ menu, onClick }: MenuCardProps) { 
    
    // ตรวจสอบสถานะ
    const isDisabled = menu.status === 'disable';

    const handleClick = () => {
    // ถ้าหมด ให้จบการทำงานทันที (กดไม่ได้)
        if (isDisabled) return;
        onClick(menu);
    }

    return(
        <div 
            onClick={handleClick}
            className={`
                relative flex items-center justify-between p-3 rounded-xl border transition-all 
                ${isDisabled 
                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-80' // สไตล์ตอนหมด (สีเทา, เมาส์กากบาท)
                    : 'bg-white border-orange-50 shadow-sm hover:shadow-md cursor-pointer active:scale-[0.98]' // สไตล์ปกติ
                }
            `}
        >
            <div className="flex items-center gap-4">
                {/* --- ส่วนรูปภาพ --- */}
                <div className="w-16 h-16 rounded-lg shrink-0 overflow-hidden relative">
                    <img 
                        src={menu?.pictureUrl ?? 'https://placehold.co/400x400'} 
                        alt={menu.menuName} 
                        className={`w-full h-full object-cover ${isDisabled ? 'grayscale' : ''}`} // ทำให้รูปเป็นขาวดำถ้าหมด
                        onError={(e) => (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/400x400'}
                    />
                    
                    {/* --- Layer ป้าย "หมด" (แสดงเฉพาะตอน disable) --- */}
                    {isDisabled && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                            <span className="text-white text-xs font-bold px-2 py-0.5 bg-red-600 rounded-full shadow-sm border border-white/20">
                                หมด
                            </span>
                        </div>
                    )}
                </div>
                
                {/* --- ส่วนข้อความ --- */}
                <div>
                    <h3 className={`font-bold text-base line-clamp-1 ${isDisabled ? 'text-gray-500' : 'text-gray-800'}`}>
                        {menu.menuName}
                    </h3>
                    <p className={`font-bold mt-1 ${isDisabled ? 'text-gray-400' : 'text-orange-600'}`}>
                        {isDisabled ? 'สินค้าหมด' : `${menu.price} บาท`}
                    </p>
                </div>
            </div>

            {/* --- ปุ่มบวก (ซ่อนถ้าหมด) --- */}
            {!isDisabled ? (
                <div className="bg-orange-100 text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
            ) : (
                // แสดงเป็นขีดฆ่า หรือปล่อยว่างก็ได้
                 <div className="w-8 h-8 flex items-center justify-center">
                    <span className="text-gray-300 text-xs font-bold">Sold Out</span>
                 </div>
            )}
        </div>
    )
}