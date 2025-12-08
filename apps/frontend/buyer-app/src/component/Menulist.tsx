import { useState, useEffect } from "react";
import { api } from "@mod-eat/api-types";
import MenuCard from "./MenuCard";

export default function Menulist(restaurantId : any) { 
    const [menuLists, setMenuLists] = useState([])
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
            setMenuLists(res.data)
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
            <h1>เมนูอาหาร</h1>
            <div className="flex flex-col gap-4">
                <div className="RestList flex flex-col w-full gap-1">
                    {
                        menuLists.map((menu, index) => { 
                            return <MenuCard menu={menu} key={index} />
                        })
                    }
                </div>
            </div>
        </>
    )
}