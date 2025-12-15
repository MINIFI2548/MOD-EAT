import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Menulist from '../component/Menulist';
import CartBar from '../component/CatBar';
import { useCartContext } from '../context/CartContext';

export default function RestaurantMenuPage() { 
    //- cart begin 
    const { cart, setRestaurantId, setResPayment, restaurantId, restPayment} = useCartContext();

    // update cart on local store
    useEffect(()=> {
        if(!cart){
            return
        }
        localStorage.setItem('orderCart', JSON.stringify(cart))
    }, [cart])
    //- cart end
    const { state } = useLocation();
    const restaurant = state?.restaurant;
    setRestaurantId(restaurant.id)
    setResPayment(restaurant.promptpay)
    
    const navigate = useNavigate()
    // log cart 
    useEffect(() => { 
        console.log(restaurantId)
        console.log(restPayment)
        console.log('Cart : ')
        console.log(cart)
    }, [cart])

    return (<>
            {/* --- Header Section (สีส้ม) --- */}
            <div className="bg-linear-to-r from-orange-500 to-orange-400 text-white pt-6 pb-4 px-4 rounded-b-3xl shadow-md sticky top-0 z-10 flex items-center justify-center"> 
                {/* ส่วนปุ่มกลับ: ใช้ absolute เพื่อให้ลอยอยู่ซ้ายสุดโดยไม่ดัน logo */}
                <div className="absolute left-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all"
                    >
                        <span className="text-lg font-bold">{"<"}</span>
                        <span className="text-sm font-medium">กลับ</span>
                    </button>
                </div>

                {/* ส่วน Logo และ ชื่อร้าน: จะอยู่ตรงกลางจอพอดีเพราะ Parent ใช้ justify-center */}
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
                <Menulist restaurantId = {restaurant.id} />
            </div>

            {cart?.length > 0 && (<CartBar />)} 
             </>
    )
}