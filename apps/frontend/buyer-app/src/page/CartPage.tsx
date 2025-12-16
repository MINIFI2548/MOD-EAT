import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import CartItemCard from "../component/CartItemCard";
import MenuDetailModal from "../component/MenuDetailModal"; // Import Modal

export default function CartPage() {
  const navigate = useNavigate();   
  const { cart, updateCartItem } = useCartContext(); // ดึง updateCartItem มาใช้

  // State สำหรับเก็บ index ของ item ที่กำลังแก้ไข (null = ไม่ได้แก้ไข)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const totalPrice = () => { 
      let t = 0
      cart.forEach((item: any) => { 
          t += (item.price * item.quantity)
      })
      return t
  } 

  return (
    <div className="bg-orange-50 min-h-screen flex flex-col pb-32">
      
      {/* Header (เหมือนเดิม) */}
      <div className="bg-linear-to-r from-orange-500 to-orange-400 text-white pt-6 pb-6 px-4 rounded-b-3xl shadow-md sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all">
            <span className="text-lg font-bold">{"<"}</span>
            <span className="text-sm font-medium">กลับ</span>
          </button>
          <h1 className="text-2xl font-bold tracking-wide shadow-black drop-shadow-md">ตะกร้าสินค้า</h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        {cart.length > 0 ? (
            cart.map((item: any, index: number) => (
            <CartItemCard 
                key={index} 
                item={item} 
                index={index} // ส่ง index ไปด้วย
                onClick={() =>console.log('edit')}
            />
            ))
        ) : (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                <p>ไม่มีสินค้าในตะกร้า</p>
            </div>
        )}
      </div>

      {/* Footer Summary (เหมือนเดิม) */}
      {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50 rounded-t-3xl">
            <div className="max-w-md mx-auto p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                    <span>ยอดรวมสุทธิ</span>
                    <span className="text-orange-600">฿{totalPrice().toLocaleString()}</span>
                </div>
                <button onClick={() => navigate('/payment')} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-3 rounded-xl shadow-lg shadow-orange-200">
                    ชำระเงิน
                </button>
            </div>
          </div>
      )}

      {/* --- Modal สำหรับแก้ไข (แสดงเมื่อ editingIndex ไม่เป็น null) --- */}
      {editingIndex !== null && cart[editingIndex] && (
        <MenuDetailModal
            // ใช้ข้อมูลจาก cart item ใส่เป็น initialData
            menu={cart[editingIndex]} 
            initialData={cart[editingIndex]}
            
            isEditing={true} // เปิดโหมดแก้ไข
            
            onClose={() => setEditingIndex(null)} // ปิด Modal
            
            onUpdate={(updatedItem) => {
                // บันทึกข้อมูลกลับไปที่ context ตาม index เดิม
                updateCartItem(editingIndex, updatedItem);
            }}
        />
      )}

    </div>
  );
}