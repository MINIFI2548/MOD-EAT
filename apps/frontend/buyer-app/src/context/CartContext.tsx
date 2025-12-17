import type { OrderCart, MenuItem } from "@mod-eat/api-types";
import {createContext, useState, useContext, type ReactNode, useEffect, use} from "react";

const CartContext = createContext<any | undefined>(undefined);

export const CartProvider = ({ children }: {children : ReactNode}) => {
    const [cart, setCart] = useState<OrderCart[]>(JSON.parse(localStorage.getItem('orderCart') ?? '[]' ))
    const [restaurantId, setRestaurantId] = useState(0)
    const [restPayment, setResPayment] = useState('') 

    useEffect(() => { 
        setCart([])
    }, [restaurantId])

    // Helper Function: สำหรับเปรียบเทียบว่า Option เหมือนกันเป๊ะหรือไม่
    const isOptionsEqual = (opt1: any[], opt2: any[]) => {
        // ใช้วิธีแปลงเป็น JSON String เพื่อเทียบ Object (ง่ายและเร็วสำหรับเคสนี้)
        return JSON.stringify(opt1) === JSON.stringify(opt2);
    }

    const addToCart  = (newItem : any) => { 
        setCart((prevCart) => {
            // ค้นหาว่ามี Item นี้อยู่แล้วหรือไม่ โดยเช็ค 3 อย่าง: id, description, options
            const existingItemIndex = prevCart.findIndex((item) => 
                item.menuId === newItem.menuId && 
                item.description === newItem.description &&
                isOptionsEqual(item.selectedOption!, newItem.selectedOption)
            );

            if (existingItemIndex > -1) {
                // กรณี: เจอของที่เหมือนกันเป๊ะ -> บวกจำนวนเพิ่ม
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += newItem.quantity;
                return newCart;
            } else {
                // กรณี: ไม่เจอ หรือ มีจุดต่างกัน -> เพิ่มเป็นแถวใหม่
                return [...prevCart, newItem];
            }  
        })
    }

    // ... (logic increase/decrease quantity ก็ต้องเช็ค index แทน menuId)
    // หมายเหตุ: increaseQuantity/decreaseQuantity เดิมใช้ menuId ซึ่งตอนนี้จะไม่เวิร์คแล้วถ้ามีเมนูซ้ำกันหลายแถว
    // **แนะนำให้เปลี่ยน logic ใน CartPage ให้ส่ง Index มาลบ หรือส่งทั้ง Object มาเทียบครับ**
    // เพื่อความง่าย ผมขอแก้ increase/decrease ให้รับเป็น index ของ Array แทนครับ

    const increaseQuantity = (index: number) => {
        setCart((prev) => {
            const newCart = [...prev];
            newCart[index].quantity += 0.5;
            return newCart;
        });
    };

    const decreaseQuantity = (index: number) => {
        setCart((prev) => {
            const newCart = [...prev];
            if (newCart[index].quantity > 1) {
                newCart[index].quantity -= 0.5;
            } else {
                newCart.splice(index, 1); // ลบออกจาก Array
            }
            return newCart;
        });
    };
    // ฟังก์ชันสำหรับแก้ไข Item โดยระบุ Index
    // แก้ไข updateCartItem ให้รองรับ Logic เดียวกัน (ถ้าแก้แล้วไปซ้ำกับอันอื่นควรรวมกัน หรือ update ทับเฉยๆ ก็ได้)
    // แต่เบื้องต้น update ทับ index เดิมไปก่อนตาม Code ก่อนหน้า
    const updateCartItem = (index: number, updatedItem: any) => {
        setCart((prev) => {
            const newCart = [...prev];
            newCart[index] = updatedItem;
            return newCart;
        });
    };
    

    const contextValue = { 
        cart, 
        addToCart,
        increaseQuantity, 
        decreaseQuantity,
        restaurantId,
        setRestaurantId, 
        restPayment,
        setResPayment,
        updateCartItem
    }
    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    )
}

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a MyProvider');
  }
  return context;
};