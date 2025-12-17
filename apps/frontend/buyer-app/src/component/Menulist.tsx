import { useState, useEffect } from "react";
import { api } from "@mod-eat/api-types";
import MenuCard from "./MenuCard";
import type { MenuItem } from "@mod-eat/api-types";
// ตัด MenuDetailModal ออกจากที่นี่

interface MenulistProps {
    restaurantId: any;
    onMenuClick: (menu: MenuItem) => void; // เพิ่ม Prop รับฟังก์ชันเมื่อกดเมนู
}

export default function Menulist({ restaurantId, onMenuClick }: MenulistProps) { 
    const [menuLists, setMenuLists] = useState<MenuItem[]>([])
    
    // ลบ state selectedMenu ออกจากที่นี่ เพราะย้ายไป Parent แล้ว

    const callMenu = async () => {
        api.buyer.menus.get({
            query : { id : restaurantId }
        }).then((res) => {
            setMenuLists(res.data as MenuItem[])
            console.log(res.data)
        })
    } 

    useEffect(() => { 
        callMenu()
    }, [])
    
    const sortedMenus = [...menuLists].sort((a, b) => {
        // กฎ: ให้ 'enable' มาก่อน 'disable'
        
        // ถ้า a เป็น enable และ b เป็น disable -> a ขึ้นก่อน (-1)
        if (a.status === 'enable' && b.status === 'disable') {
            return -1;
        }
        // ถ้า a เป็น disable และ b เป็น enable -> b ขึ้นก่อน (1)
        if (a.status === 'disable' && b.status === 'enable') {
            return 1;
        }
        // ถ้าสถานะเหมือนกัน (เช่น enable ทั้งคู่ หรือ disable ทั้งคู่) ให้เรียงตามลำดับเดิม (0)
        return 0;
    });

    return(
        <>
            <div className="flex items-center gap-3 ml-[4%] my-4">
                <div className="w-1.5 h-7 bg-orange-500 rounded-full shadow-sm"></div>
                <h1 className="text-xl font-bold text-gray-800 tracking-wide">
                    รายการอาหาร
                </h1>
            </div>

            <div className="flex flex-col gap-4 pb-20">
                <div className="RestList flex flex-col gap-2 w-[96%] ml-[2%]">
                    {
                        sortedMenus.map((menu, index) => { 
                            // if (menu.status == 'enable') { 
                                return (
                                    <MenuCard 
                                        menu={menu} 
                                        key={index} 
                                        // เมื่อกด ให้ส่งข้อมูลกลับไปที่ Parent ผ่าน prop
                                        onClick={(item) => onMenuClick(item)}
                                    />
                                )
                            // }
                        })
                    }
                </div>
            </div>

            {/* ลบการแสดง Modal ออกจากตรงนี้ */}
        </>
    )
}