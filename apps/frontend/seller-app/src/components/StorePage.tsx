import { useEffect, useState } from "react";
import { useRestaurantContext } from "../context/RestaurantContext";
import { api } from "@mod-eat/api-types";

export default function StorePage() {
    const { name, setName } = useRestaurantContext();
    const [isShopOpen, setIsShopOpen] = useState(true);
    const [tempName, setTempName] = useState(name);

    // const handleSave = () => {
    //     setName(tempName);
    //     alert("บันทึกข้อมูลร้านค้าเรียบร้อย");
    // };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* Header Section */}
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800">ตั้งค่าร้านค้า</h2>
                <p className="text-gray-500 text-sm">จัดการข้อมูลทั่วไปและสถานะร้าน</p>
            </div>

            {/* 1. Shop Status (ย้ายมาจาก Dashboard) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">สถานะร้านค้า</h3>
                    <p className={`text-sm ${isShopOpen ? 'text-green-600' : 'text-gray-500'}`}>
                        {isShopOpen ? 'ร้านเปิดอยู่ (ลูกค้าสามารถสั่งอาหารได้)' : 'ร้านปิดชั่วคราว (งดรับออเดอร์)'}
                    </p>
                </div>
                
                {/* Toggle Switch */}
                <button 
                    onClick={() => setIsShopOpen(!isShopOpen)}
                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${
                        isShopOpen ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                >
                    <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-200 ${
                        isShopOpen ? 'translate-x-6' : 'translate-x-0'
                    }`}></div>
                </button>
            </div>
        </div>
    );
}