import { useState } from "react";
import { useRestaurantContext } from "../context/RestaurantContext";

export default function StorePage() {
    const { name, setName } = useRestaurantContext();
    const [isShopOpen, setIsShopOpen] = useState(true);
    const [tempName, setTempName] = useState(name);

    const handleSave = () => {
        setName(tempName);
        alert("บันทึกข้อมูลร้านค้าเรียบร้อย");
    };

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

            {/* 2. General Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">ข้อมูลทั่วไป</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-4xl">
                            🏠
                        </div>
                        <button className="text-sm text-orange-600 font-medium hover:underline">
                            เปลี่ยนรูปโปรไฟล์
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="md:col-span-2 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อร้าน</label>
                            <input 
                                type="text" 
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบายร้าน (สั้นๆ)</label>
                            <textarea 
                                rows={3}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                placeholder="เช่น อาหารตามสั่ง รสเด็ด ย่านบางมด..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 shadow-md font-bold"
                    >
                        บันทึกการเปลี่ยนแปลง
                    </button>
                </div>
            </div>
        </div>
    );
}