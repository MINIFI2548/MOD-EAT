import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartProvider, useCartContext } from '../context/CartContext';
import Menulist from '../component/Menulist';
import CartBar from '../component/CatBar';

export default function RestaurantMenuPage() { 
    //- cart begin 
    const { cart, addToCart } = useCartContext();

    // update cart on local store
    useEffect(()=> {
        localStorage.setItem('orderCart', JSON.stringify(cart))
    }, [cart])
    //- cart end
    const { state } = useLocation();
    const restaurant = state?.restaurant;
    // console.log(restaurant)

    const navigate = useNavigate()

    return (<>
            {/* --- Header Section (สีส้ม) --- */}
            <div className="bg-linear-to-r from-orange-500 to-orange-400 text-white pt-6 pb-4 px-4 rounded-b-3xl shadow-md sticky top-0 z-10 flex flex-row">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="fllex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all"
                    >
                        <span className="text-lg font-bold">{"<"}</span>
                        <span className="text-sm font-medium">กลับ</span>
                    </button>
                </div>

                <div className="flex flex-2 justify-center items-center gap-4 px-2 pb-2 justify-self-end ">
                    <div className="w-12 h-12 bg-white rounded-full p-1 shadow-inner">
                        <img 
                            src={restaurant.picture_url} 
                            alt="logo" 
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => e.target.src = 'https://placehold.co/100x100?text=Logo'}
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-wide shadow-black drop-shadow-md">{restaurant.name}</h1>
                        <p className="text-s tracking-wide shadow-black drop-shadow-md">{restaurant.description}</p>
                    </div>
                </div>
            </div>
        
            <div className="bg-orange-50 min-h-screen flex flex-col">
                <Menulist restaurantId = {restaurant.id} />
            </div>

            {cart.length > 0 && (<CartBar />)} 
             </>
    )
}