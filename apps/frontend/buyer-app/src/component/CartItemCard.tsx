import { useCartContext } from "../context/CartContext";

interface CartItemCardProps {
    item: any;
    index : number;
    onClick: () => void; // รับ prop onClick สำหรับเปิด Modal
}

export default function CartItemCard({ item, index, onClick }: CartItemCardProps) {
    const { increaseQuantity, decreaseQuantity } = useCartContext();

    // คำนวณราคารวม (ราคาต่อหน่วย * จำนวน)
    const totalPrice = item.price * item.quantity;

    return (
        <div 
            onClick={onClick} // กดที่การ์ดเพื่อแก้ไข
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md active:scale-[0.99] cursor-pointer"
        >
            {/* รูปภาพ */}
            <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0 overflow-hidden">
                <img 
                    src={item.pictureUrl || "https://placehold.co/200x200"} 
                    alt={item.menuName} 
                    className="w-full h-full object-cover" 
                />
            </div>

            {/* รายละเอียด */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                    <h3 className="text-gray-900 font-bold text-lg leading-tight truncate">
                        {item.menuName}
                    </h3>
                    
                    {/* --- แก้ไขการดึงข้อมูล Option ตรงนี้ --- */}
                    {item.selectedOption && item.selectedOption.length > 0 && (
                        <div className="mt-1 flex flex-col gap-0.5">
                            {item.selectedOption.map((opt: any, idx: number) => (
                                <p key={idx} className="text-xs text-gray-500 truncate">
                                    <span className="font-semibold text-gray-600">
                                        {opt.optionGroup} : 
                                    </span> 
                                    {/* ต้องเข้าถึง .option.name */}
                                    {" " + opt.option.name} 
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Note */}
                    {item.description && (
                        <p className="text-orange-500 text-xs mt-1 italic truncate">
                            Note: "{item.description}"
                        </p>
                    )}
                </div>

                <div className="flex justify-between items-end mt-2">
                    <span className="text-orange-600 font-bold text-lg">
                        ฿{totalPrice.toLocaleString()}
                    </span>
                    
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200"
                         onClick={(e) => e.stopPropagation()} 
                    >
                        {/* ส่ง index ไปแทน menuId */}
                        <button 
                            onClick={() => decreaseQuantity(index)} 
                            className="w-6 h-6 bg-white rounded shadow-sm text-gray-600 flex items-center justify-center font-bold active:scale-90"
                        >
                            {item.quantity === 1 ? '🗑️' : '-'}
                        </button>
                        <span className="font-bold text-gray-800 text-sm w-4 text-center">
                            {item.quantity}
                        </span>
                        <button 
                            onClick={() => increaseQuantity(index)} 
                            className="w-6 h-6 bg-orange-500 rounded shadow-sm text-white flex items-center justify-center font-bold active:scale-90"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}