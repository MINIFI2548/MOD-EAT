import { useNavigate } from "react-router-dom"
// import { useCartContext } from "../context/CartContext"; // ไม่ได้ใช้ในนี้ Comment ออกได้ครับ

interface RestaurantProps {
    id: number;
    name: string;
    description: string;
    status: string; // 'open' | 'closed'
    picture_url: string;
    promptpay: string;
    queue: number;
}

export default function RestaurantCard({ restaurant }: { restaurant: RestaurantProps }) {
    const navigate = useNavigate()
    
    // ตรวจสอบสถานะว่าปิดหรือไม่
    const isClosed = restaurant.status === 'closed';

    // Logic สีของจุดสถานะ (เฉพาะตอนร้านเปิด)
    const getStatusColorClass = () => {
        if (restaurant.queue > 10) return 'bg-red-500 shadow-red-200';
        if (restaurant.queue > 5) return 'bg-yellow-400 shadow-yellow-200';
        return 'bg-green-500 shadow-green-200';
    }

    // Logic ข้อความสถานะการรอ
    const waitStatusText = () => {
        if (restaurant.queue === 0) return 'คิวว่าง';
        if (restaurant.queue <= 5) return 'รอไม่นาน';
        if (restaurant.queue <= 10) return 'คิวเริ่มเยอะ';
        return 'รอนานมาก';
    }

    const handleClick = () => {
        // ถ้าปิด ห้ามไปต่อ
        if (isClosed) return;

        navigate('/menu', {
            state: { restaurant }
        })
    };

    return (
        <div
            onClick={handleClick}
            className={`
                relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ml-[2%] mr-[2%]
                ${isClosed 
                    ? 'bg-gray-100 border-gray-200 opacity-80 cursor-not-allowed grayscale-[0.8]' // สไตล์ร้านปิด
                    : 'bg-white border-gray-100 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5' // สไตล์ร้านเปิด
                }
            `}
        >
            {/* --- ส่วนรูปภาพ --- */}
            <div className="shrink-0 relative">
                <div className="w-20 h-20 rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center">
                    <img
                        src={restaurant.picture_url}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
                
                {/* Overlay เมื่อร้านปิด */}
                {isClosed && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            ร้านปิด
                        </span>
                    </div>
                )}
            </div>

            {/* --- ส่วนข้อมูลร้านค้า --- */}
            <div className="flex-1 min-w-0 flex flex-col justify-center h-20">
                <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-lg leading-tight truncate pr-2 ${isClosed ? 'text-gray-500' : 'text-gray-800'}`}>
                        {restaurant.name}
                    </h3>
                </div>
                
                <p className={`text-sm mt-1 truncate line-clamp-2 ${isClosed ? 'text-gray-400' : 'text-gray-500'}`}>
                    {restaurant.description}
                </p>

                {/* แสดงสถานะ "ปิดชั่วคราว" แบบข้อความเสริมถ้าร้านปิด */}
                {isClosed && (
                    <p className="text-red-500 text-xs font-bold mt-auto">
                        * ไม่สามารถสั่งได้ขณะนี้
                    </p>
                )}
            </div>

            {/* --- ส่วนสถานะคิว (แสดงเฉพาะตอนเปิด) --- */}
            {!isClosed && (
                <div className="flex flex-col items-end justify-center self-center min-w-[70px]">
                    <div className="flex items-center gap-1.5 mb-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                        {/* จุดสี + เงา */}
                        <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${getStatusColorClass()}`}></span>
                        <span className="text-gray-700 font-bold text-sm">
                            {restaurant.queue} คิว
                        </span>
                    </div>
                    <span className={`text-xs font-medium ${
                        restaurant.queue > 10 ? 'text-red-500' : 
                        restaurant.queue > 5 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                        {waitStatusText()}
                    </span>
                </div>
            )}
        </div>
    )
}