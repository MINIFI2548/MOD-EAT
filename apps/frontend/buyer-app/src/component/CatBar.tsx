import { useNavigate } from "react-router";
import { useCartContext } from "../context/CartContext";

export default function CartBar() { 
    const {cart} = useCartContext()
    const navigate = useNavigate()
    const totalPrice = () => { 
        let t = 0
        cart.map(item => { 
            t += (item.price * item.quantity)
        })
        console.log(t)
        return t
    } 
    return(
    <><div 
        onClick={ () => navigate('/cart')}
        className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-md mx-auto p-4 pb-8 flex items-center justify-between">
            
            {/* ส่วนแสดงราคาและจำนวนรายการ (ซ้าย) */}
            <div className="flex flex-col">
            <span className="text-gray-900 font-bold text-xl">
                รวม: {totalPrice().toString()} บาท
            </span>
            <span className="text-gray-500 text-sm font-medium">
                {/* {`totalItems`} รายการ */}
                {cart.length} รายการ
            </span>
            </div>

            {/* ปุ่มสั่งอาหาร (ขวา) */}
            <button 
            onClick={() => {
                // ใส่ Logic การไปหน้ายืนยันออเดอร์ตรงนี้
                console.log("Proceed to checkout"); 
            }}
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-base py-2.5 px-6 rounded-lg shadow-md transition-all duration-200"
            >
            สั่งอาหาร
            </button>
            
        </div>
    </div></>
    )
}