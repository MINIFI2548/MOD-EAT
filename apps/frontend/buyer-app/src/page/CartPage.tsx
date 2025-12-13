import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import type { Order, OrderItem } from "@mod-eat/api-types";

export default function CartPage() {
  const navigate = useNavigate();   
  const { cart, increaseQuantity, decreaseQuantity} = useCartContext();

  const totalPrice = () => { 
        let t = 0
        cart.map((item : OrderItem) => { 
            t += (item.price * item.quantity)
        })
        console.log(t)
        return t
    } 

  return (
    <div className="bg-orange-50 min-h-screen flex flex-col pb-32">
      
      {/* --- Header Section (ส่วนหัวเหมือนเดิมแต่เปลี่ยนเนื้อหา) --- */}
      <div className="bg-linear-to-r from-orange-500 to-orange-400 text-white pt-6 pb-6 px-4 rounded-b-3xl shadow-md sticky top-0 z-10">
        <div className="flex items-center justify-between">
          
          {/* ปุ่มย้อนกลับ */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all"
          >
            <span className="text-lg font-bold">{"<"}</span>
            <span className="text-sm font-medium">กลับ</span>
          </button>

          {/* ชื่อหน้า */}
          <h1 className="text-2xl font-bold tracking-wide shadow-black drop-shadow-md">
            ตะกร้าสินค้า
          </h1>
          
          {/* พื้นที่ว่างขวาเพื่อให้ title อยู่ตรงกลาง (dummy) */}
          <div className="w-16"></div>
        </div>
      </div>

      {/* --- Content Section (รายการอาหาร - Mockup) --- */}
      <div className="flex flex-col gap-4 p-4">
       {cart.map((item : OrderItem, index : number) => {
        {/* --- Card 1 (Mockup) --- */}
        return <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">
            {/* รูปภาพ */}
                    <div className="w-20 h-20 bg-gray-200 rounded-xl shrink-0 overflow-hidden">
                        <img src="https://placehold.co/200x200" alt="menu" className="w-full h-full object-cover" />
                    </div>

                    {/* รายละเอียด */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-gray-900 font-bold text-lg">{item.menuName}</h3>
                            {/* <p className="text-gray-400 text-xs"> ตัวเลือกเพิ่มเติม </p>  */}
                        </div>
                        <div className="flex justify-between items-end mt-2">
                            <span className="text-orange-500 font-bold text-lg">{item.price} บาท</span>
                            
                            {/* ปุ่มเพิ่มลดจำนวน */}
                            <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                <button onClick={() => decreaseQuantity(item.menuId)}className="w-6 h-6 bg-white rounded shadow-sm text-gray-600 flex items-center justify-center font-bold active:scale-90 transition">-</button>
                                <span className="font-bold text-gray-800 text-sm w-4 text-center">{item.quantity}</span>
                                <button onClick={() => increaseQuantity(item.menuId)} className="w-6 h-6 bg-orange-500 rounded shadow-sm text-white flex items-center justify-center font-bold active:scale-90 transition">+</button>
                            </div>
                        </div>
                    </div>
                </div>
        }) 
        }

      </div>

      {/* --- Footer Summary (สรุปยอดและปุ่มยืนยัน) --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50 rounded-t-3xl">
        <div className="max-w-md mx-auto p-6 flex flex-col gap-4">
            
            {/* สรุปราคา */}
            {/* <div className="flex justify-between items-center text-sm text-gray-500">
                <span>ค่าอาหาร (4 รายการ)</span>
                <span className="font-medium text-gray-900">160 บาท</span>
            </div> */}
            <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                <span>ยอดรวมสุทธิ</span>
                <span className="text-orange-600">{totalPrice()} บาท</span>
            </div>

            {/* ปุ่มยืนยัน */}
            <button 
                onClick={() => {
                    console.log("Confirm Order") 
                    navigate('/payment')
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-lg py-3 rounded-xl shadow-lg shadow-orange-200 transition-all duration-200"
            >
                ชำระเงิน
            </button>
            
        </div>
      </div>

    </div>
  );
}