import { useState, useEffect } from "react";
import type { MenuItem } from "@mod-eat/api-types";
import { useCartContext } from "../context/CartContext";

interface MenuDetailModalProps {
  menu: MenuItem;           // ข้อมูลเมนู (หรือ Item ในตะกร้าที่มี structure เหมือนกัน)
  onClose: () => void;
  isEditing?: boolean;      // บอกว่าเป็นโหมดแก้ไขหรือไม่
  initialData?: any;        // ข้อมูลเดิมในตะกร้า (Selected Option, Note, Qty)
  onUpdate?: (updatedItem: any) => void; // ฟังก์ชัน callback เมื่อกดบันทึก
  
}

interface OptionItem {
  name: string;
  price: number;
  status?: string;
}

export default function MenuDetailModal({ menu, onClose, isEditing = false, initialData, onUpdate }: MenuDetailModalProps) {
  const { addToCart } = useCartContext();
  
  // ตั้งค่าเริ่มต้นจาก initialData ถ้ามี (โหมดแก้ไข) หรือใช้ค่า default (โหมดเพิ่มใหม่)
  const [quantity, setQuantity] = useState(initialData?.quantity || 1);
  const [note, setNote] = useState(initialData?.description || "");
  const [selections, setSelections] = useState<Record<string, OptionItem>>({});

  useEffect(() => {
    const currentSelections: Record<string, OptionItem> = {};

    if (isEditing && initialData?.selectedOption) {
      // --- กรณีแก้ไข: ดึง Option ที่เคยเลือกไว้มาใส่ใน State ---
      initialData.selectedOption.forEach((opt: any) => {
        currentSelections[opt.group] = { name: opt.name, price: opt.price };
      });
    } else {
      // --- กรณีเพิ่มใหม่: เลือกตัวแรกเป็น Default ---
      menu.options?.forEach((group: any) => {
        if (group.optionItems && group.optionItems.length > 0) {
          currentSelections[group.optionGroup] = group.optionItems[0];
        }
      });
    }
    setSelections(currentSelections);
  }, [menu, isEditing, initialData]);

  const handleSelectOption = (groupName: string, item: OptionItem) => {
    setSelections((prev) => ({
      ...prev,
      [groupName]: item,
    }));
  };

  const calculateTotalPrice = () => {
    let optionPrice = 0;
    Object.values(selections).forEach((item) => {
      optionPrice += item.price;
    });
    return (menu.price + optionPrice) * quantity;
  };

  const handleConfirm = () => {
    // จัด Format Data ใหม่ให้ตรงตาม Requirement
    const selectedOptionsArray = Object.keys(selections).map(key => ({
        optionGroup: key,           // ชื่อกลุ่ม เช่น "พิเศษ, ธรรมดา"
        option: {                   // Object ย่อยข้างใน
            name: selections[key].name, 
            price: selections[key].price
        }
    }));

    const finalItem = {
      ...menu, 
      quantity: quantity,
      selectedOption: selectedOptionsArray, // ใช้ Array รูปแบบใหม่นี้
      description: note,
      // คำนวณราคาต่อหน่วย (Base + Options)
      price: menu.price + Object.values(selections).reduce((sum, item) => sum + item.price, 0)
    };

    if (isEditing && onUpdate) {
        console.log("Updating item:", finalItem);
        onUpdate(finalItem);
    } else {
        console.log("Adding to cart:", finalItem);
        addToCart(finalItem);
    }
    
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={onClose}></div>

      <div className="fixed bottom-0 left-0 w-full bg-white z-50 rounded-t-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slide-up">
        
        {/* Header รูปภาพ */}
        <div className="relative h-48 sm:h-64 bg-gray-200 shrink-0">
          <img 
            src={menu.pictureUrl || "https://placehold.co/400x300"} 
            alt={menu.menuName} 
            className="w-full h-full object-cover"
          />
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-md">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-24">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{menu.menuName}</h2>
            <p className="text-gray-500">เริ่มต้น ฿{menu.price}</p>
          </div>
          <hr className="border-gray-100 my-4" />

          {/* Options */}
          {menu.options?.map((group: any, index: number) => (
            <div key={index} className="mb-6">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{group.optionGroup}</h3>
                <div className="flex flex-col gap-2">
                  {group.optionItems.map((item: OptionItem, idx: number) => {
                    // เช็คสถานะของ Option (สมมติ API ส่ง status มาให้ใน item)
                    // ถ้าไม่มี field status ให้แก้เป็น const isOptionDisabled = false; ไปก่อน
                    const isOptionDisabled = item?.status === 'disable'; 
                    const isSelected = selections[group.optionGroup]?.name === item.name;
                    return (
                        <label 
                            key={idx} 
                            className={`
                                flex items-center justify-between p-3 rounded-xl border transition-all 
                                ${isOptionDisabled 
                                    ? 'bg-gray-100 border-gray-100 cursor-not-allowed opacity-60' // สไตล์ตัวเลือกที่หมด
                                    : isSelected 
                                        ? 'border-orange-500 bg-orange-50/50 cursor-pointer' 
                                        : 'border-gray-200 hover:border-orange-200 cursor-pointer'
                                }
                            `}
                            // ดักจับการคลิก
                            onClick={(e) => {
                                if (isOptionDisabled) {
                                    e.preventDefault(); // ห้ามกด
                                    e.stopPropagation();
                                    return;
                                }
                                handleSelectOption(group.optionGroup, item);
                            }}
                        >
                            <div className="flex items-center gap-3">
                                {/* วงกลม Radio */}
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
                                    ${isOptionDisabled ? 'border-gray-300 bg-gray-200' : // สีเทา
                                      isSelected ? 'border-orange-500' : 'border-gray-300'}
                                `}>
                                    {isSelected && !isOptionDisabled && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
                                </div>
                                
                                {/* ชื่อตัวเลือก */}
                                <span className={`
                                    ${isOptionDisabled ? 'text-gray-400 line-through' : // ขีดฆ่าชื่อ
                                      isSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}
                                `}>
                                    {item.name} {isOptionDisabled && <span className="text-red-400 no-underline text-xs ml-1">(หมด)</span>}
                                </span>
                            </div>
                            
                            {/* ราคา */}
                            {item.price > 0 && (
                                <span className={`text-sm ${isOptionDisabled ? 'text-gray-300' : 'text-gray-500'}`}>
                                    + ฿{item.price}
                                </span>
                            )}
                        </label>
                    );
                })}
                </div>
            </div>
          ))}

          {/* Note */}
          <div className="mb-6">
            <h3 className="font-bold text-lg text-gray-800 mb-2">รายละเอียดเพิ่มเติม</h3>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 focus:border-orange-500 outline-none"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4">
            <div className="flex items-center gap-4 max-w-md mx-auto">
                <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1.5 h-12">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-full font-bold text-lg text-orange-500">-</button>
                    <span className="w-6 text-center font-bold text-gray-800">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-full font-bold text-lg text-orange-500">+</button>
                </div>

                <button 
                    onClick={handleConfirm}
                    className="flex-1 bg-orange-500 text-white font-bold h-12 rounded-xl flex items-center justify-between px-6 shadow-lg shadow-orange-200 active:scale-95 transition-all"
                >
                    <span>{isEditing ? "บันทึกการแก้ไข" : "เพิ่มลงตะกร้า"}</span>
                    <span>฿{calculateTotalPrice()}</span>
                </button>
            </div>
        </div>
      </div>
    </>
  );
}