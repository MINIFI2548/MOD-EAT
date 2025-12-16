import type { OrderItem } from "@mod-eat/api-types"
import { useState, useMemo } from "react"
import OrderCard from "./OrderCard/OrderCard"

export default function OrderPage({ queue }: { queue: OrderItem[] }) {
    // State สำหรับตัวเลือกการกรองและการเรียง
    const [filterStatus, setFilterStatus] = useState<string>('active');
    const [sortOrder, setSortOrder] = useState<string>('oldest');

    // Logic การกรองและเรียงลำดับ (เหมือนเดิม)
    const displayOrders = useMemo(() => {
        let filtered = [...(queue || [])];

        if (filterStatus === 'active') {
            filtered = filtered.filter(item => item.status !== 'received' && item.status !== 'cancel');
        } else if (filterStatus !== 'all') {
            filtered = filtered.filter(item => item.status === filterStatus);
        }

        return filtered.sort((a, b) => {
            const idA = String(a.itemId);
            const idB = String(b.itemId);

            switch (sortOrder) {
                case 'newest': return idB.localeCompare(idA, undefined, { numeric: true });
                case 'oldest': return idA.localeCompare(idB, undefined, { numeric: true });
                case 'price_high': return (b.price || 0) - (a.price || 0);
                case 'price_low': return (a.price || 0) - (b.price || 0);
                default: return 0;
            }
        });
    }, [queue, filterStatus, sortOrder]);

    return (
        <div className="pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">จัดการคำสั่งซื้อ</h2>
                    <p className="text-sm text-gray-500">
                        รายการรอทำ: <span className="text-orange-600 font-bold">{displayOrders.length}</span> รายการ
                    </p>
                </div>

                {/* Filters & Sort Controls */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block px-3 py-2 focus:outline-none shadow-sm flex-1 md:flex-none cursor-pointer"
                    >
                        <option value="active">⚡ รายการที่ต้องทำ</option>
                        <option value="ordered">🟡 รอยืนยัน</option>
                        <option value="cooking">🍳 กำลังทำ</option>
                        <option value="cooked">✅ เสร็จแล้ว</option>
                        <option value="received">🏁 จบงานแล้ว</option>
                        <option value="all">📝 ทั้งหมด</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block px-3 py-2 focus:outline-none shadow-sm flex-1 md:flex-none cursor-pointer"
                    >
                        <option value="oldest">🕒 มาก่อน-ได้ก่อน</option>
                        <option value="newest">🆕 มาใหม่ล่าสุด</option>
                        <option value="price_high">💰 ราคาสูง-ต่ำ</option>
                    </select>
                </div>
            </div>

            {/* Content Area */}
            {displayOrders.length > 0 ? (
                // แก้ไขบรรทัดนี้: เพิ่ม lg:gap-6 และอาจจะลดจำนวน column ใน xl ลงถ้ายังรู้สึกแน่น
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                    {displayOrders.map((order) => (
                        <div key={order.itemId} className="h-full">
                             {/* ใช้ h-full เพื่อให้ div ที่หุ้มสูงเท่ากัน และ Card ข้างในจะยืดตาม */}
                            <OrderCard order={order} />
                        </div>
                    ))}
                </div>
            ) : (
                // Empty State
                <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200 mt-4">
                    <div className="text-4xl mb-2">🍽️</div>
                    <p className="text-gray-500 font-medium">ไม่มีรายการคำสั่งซื้อในสถานะนี้</p>
                    <p className="text-sm text-gray-400">เมื่อลูกค้าสั่งอาหาร รายการจะมาปรากฏที่นี่</p>
                </div>
            )}
        </div>
    )
}