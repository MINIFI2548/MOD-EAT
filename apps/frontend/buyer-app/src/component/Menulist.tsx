import { useState, useEffect } from "react";
import { api } from "@mod-eat/api-types";
import MenuCard from "./MenuCard";
import type { MenuItem } from "@mod-eat/api-types";

export default function Menulist(restaurantId : any) { 
    const [menuLists, setMenuLists] = useState<MenuItem[]>([])
    restaurantId = restaurantId.restaurantId
    // console.log(restaurantId)
    const callMenu = async () => {
        const URL = `/menus?id=${restaurantId}`
        console.log(URL)
        api.buyer.menus.get({
            query : {
                id : restaurantId
        }})
        .then((res) => {
            console.log(res.data)
            setMenuLists(res.data as MenuItem[])
        })
    } 
    useEffect(() => { 
        callMenu()
    }, [])
    // useEffect(() => { 
    //     console.log(menuLists)
    // }, [menuLists])
    
    return(
        <>
            <h1 className="ml-[4%]" >เมนูอาหาร</h1>
            <div className="flex flex-col gap-4 ">
                <div className="RestList flex flex-col gap-1 w-[96%] ml-[2%]">
                    {
                        menuLists.map((menu, index) => { 
                            if (menu.status == 'enable') { 
                                return <MenuCard menu={menu} key={index} />
                            }
                        })
                    }
                </div>
            </div>
        </>
    )
}