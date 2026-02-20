import { useState, useEffect } from 'react'
import { api } from '@mod-eat/api-types'
import RestaurantCard from '../component/RestaurantCard'
import { useCartContext } from '../context/CartContext'
import { useNavigate } from 'react-router'
export default function SelectRestaurantPage() { 
    const [restaurants, setRestaurants] = useState([])
    const navigate = useNavigate()
    const callAPI = async () => { 
        api.buyer.restaurants.get()
        .then((res) => { 
            setRestaurants(res.data as any)
        }).catch(err =>{
            alert("Error Fetching: " + err
            );
        })
    }
    // ตัวอย่าง Icon SVG แบบ Inline (สามารถเปลี่ยนไปใช้ Library icon ที่คุณมีได้ เช่น Lucide, FontAwesome)
    const HistoryIcon = () => (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-6 h-6"
        >
            <path d="M3 3v18h18" />
            <path d="M18 9l-5 5-2-2-4 4" />
        </svg>
        );

    // หรือใช้รูปนาฬิกา/ใบเสร็จ
    const ReceiptIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    );

    useEffect(() => {
        callAPI()
        localStorage.removeItem('orderCart')
    }, [])
    useEffect(() => {
        console.log(restaurants)
    }, [restaurants])
    
    return ( 
        <> 
            <div className="bg-orange-50 min-h-screen flex flex-col pb-10">    
                {/* --- Header Section --- */}
                <div className="bg-linear-to-r from-orange-500 to-orange-400 text-white pt-6 pb-6 px-4 rounded-b-3xl shadow-md sticky top-0 z-10 mb-1">
                    <div className="flex items-center justify-center">
                        <div className="w-18 h-18 bg-white rounded-full p-1 shadow-inner mr-5">
                            <img 
                                src={'https://placehold.co/100x100?text=Logo'} 
                                alt="logo" 
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => (e.currentTarget).src = 'https://placehold.co/100x100?text=Logo'}
                            />
                        </div>
                        <h1 className="text-2xl font-bold tracking-wide shadow-black drop-shadow-md items-center">
                            เลือกร้านของคุณ
                        </h1>
                        {/* --- ส่วนที่เพิ่ม: ปุ่มประวัติการสั่งซื้อ (Position Absolute เพื่อไม่ให้ดัน Layout ตรงกลาง) --- */}
                        <button 
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors flex flex-col items-center justify-center gap-0.5 cursor-pointer mr-[3%]"
                            onClick={() => navigate('/history')}
                            aria-label="ประวัติการสั่งซื้อ"
                        >
                            <ReceiptIcon />
                            <span className="text-[10px] font-medium leading-none">ประวัติ</span>
                        </button>
                    </div>
                </div>
                <div className="RestList flex flex-col w-full gap-1">
                    {restaurants.map((restaurant, index) => (
                        <RestaurantCard key= {index} restaurant={restaurant} />
                    ))}
                </div>
            </div>
        </>
    )
}