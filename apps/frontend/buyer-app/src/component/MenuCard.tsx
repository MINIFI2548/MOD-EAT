import type { MenuItem } from "@mod-eat/api-types";
import { useCartContext } from "../context/CartContext"

export default function MenuCard({menu} : { menu : MenuItem}) { 
    const {addToCart} = useCartContext();
    const handleOrdering = () => {
        console.log("New Menu to Cart :")
        console.log(menu)
        addToCart(menu)
    }

    return(
            <div className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-orange-50 ml-[2%} mr-[2]">
                
                <div className="flex items-center gap-4">
                {/* รูปเมนู */}
                <div className="w-16 h-16 bg-orange-50 rounded-lg shrink-0 overflow-hidden">
                    <img src={menu?.pictureUrl ?? 'https://placehold.co/400x400'} alt={menu.menuName} className="w-full h-full object-cover" />
                </div>
                
                {/* ชื่อและราคา */}
                <div>
                    <h3 className="text-gray-800 font-bold text-base">{menu.menuName}</h3>
                    <p className="text-orange-600 font-bold mt-1">{menu.price} บาท</p>
                </div>
                </div>

                {/* ปุ่มบวก */}
                <button
                    onClick={handleOrdering} 
                    className="bg-orange-500 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md active:scale-95 transition-transform">
                <span>+</span>
                </button>

            </div>
    )
}