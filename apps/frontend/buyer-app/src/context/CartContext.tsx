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

    const addToCart  = (menu : MenuItem) => { 
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.menuId === menu.menuId);
            if (existingItem) {
                return prevCart.map((item) =>
                item.menuId === menu.menuId ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...menu, quantity: 1 }];
            }  
        })
    }

    const increaseQuantity = (productId: any) => {
        setCart((prev) => 
            prev.map((item) => 
                item.menuId === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    // [เพิ่มใหม่] ฟังก์ชันลดจำนวน (ถ้าเหลือ 0 ให้ลบออก)
        const decreaseQuantity = (productId: any) => {
            setCart((prev) => 
                prev.reduce((acc, item) => {
                    if (item.menuId === productId) {
                        if (item.quantity > 1) {
                            acc.push({ ...item, quantity: item.quantity - 1 });
                        }
                        // ถ้าเหลือ 1 แล้วกดลบ ก็ไม่ต้อง push เข้า acc (คือลบออกไปเลย)
                    } else {
                        acc.push(item);
                    }
                    return acc;
                }, [] as any[])
            );
        };

    const contextValue = { 
        cart, 
        addToCart,
        increaseQuantity, 
        decreaseQuantity,
        restaurantId,
        setRestaurantId, 
        restPayment,
        setResPayment
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