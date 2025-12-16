import { useEffect, useState } from 'react'; // เพิ่ม useState
import { useLocation, useNavigate } from 'react-router-dom';
import Menulist from '../component/Menulist';
import CartBar from '../component/CatBar';
import MenuDetailModal from '../component/MenuDetailModal'; // Import Modal มาที่นี่
import { useCartContext } from '../context/CartContext';
import type { MenuItem } from "@mod-eat/api-types"; // Import Type

export default function RestaurantMenuPage() { 
    const { cart, setRestaurantId, setResPayment, restaurantId, restPayment} = useCartContext();
    const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null); // สร้าง State สำหรับ Modal ที่นี่

    // update cart on local store
    useEffect(()=> {
        if(!cart){ return }
        localStorage.setItem('orderCart', JSON.stringify(cart))
    }, [cart])

    const { state } = useLocation();
    const restaurant = state?.restaurant;
    
    // เซ็ตค่า context แค่ครั้งแรก หรือเมื่อ restaurant เปลี่ยน
    useEffect(() => {
        if (restaurant) {
            setRestaurantId(restaurant.id)
            setResPayment(restaurant.promptpay)
        }
    }, [restaurant])
    
    const navigate = useNavigate()

    return (
        <>
            {/* --- Header Section --- */}
            <div className="bg-linear-to-r from-orange-500 to-orange-400 text-white pt-6 pb-4 px-4 rounded-b-3xl shadow-md sticky top-0 z-10 flex items-center justify-center"> 
                <div className="absolute left-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all"
                    >
                        <span className="text-lg font-bold">{"<"}</span>
                        <span className="text-sm font-medium">กลับ</span>
                    </button>
                </div>

                <div className="flex justify-center items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full p-1 shadow-inner shrink-0">
                        <img 
                            src={restaurant.picture_url} 
                            alt="logo" 
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/100x100?text=Logo'}
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-wide shadow-black drop-shadow-md">{restaurant.name}</h1>
                        <p className="text-sm tracking-wide shadow-black drop-shadow-md">{restaurant.description}</p>
                    </div>
                </div>
            </div>
        
            <div className="bg-orange-50 min-h-screen flex flex-col">
                {/* ส่ง function รับค่าคลิกไปที่ Menulist */}
                <Menulist 
                    restaurantId={restaurant.id} 
                    onMenuClick={(menu) => setSelectedMenu(menu)}
                />
            </div>

            {/* --- ส่วน Modal --- */}
            {selectedMenu && (
                <MenuDetailModal 
                    menu={selectedMenu} 
                    onClose={() => setSelectedMenu(null)} 
                />
            )}

            {/* --- ส่วน CartBar --- */}
            {/* แสดงเมื่อมีของในตะกร้า AND Modal ไม่ได้เปิดอยู่ (!selectedMenu) */}
            {cart?.length > 0 && !selectedMenu && (<CartBar />)} 
        </>
    )
}