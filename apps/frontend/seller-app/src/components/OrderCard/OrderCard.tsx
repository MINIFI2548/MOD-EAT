// components/OrderCard/OrderCard.tsx
import type { OrderItem } from "@mod-eat/api-types";
import { useRestaurantContext } from "../../context/RestaurantContext";
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

// ฟังก์ชันช่วยแปลงสถานะเป็นภาษาไทยและสี (แยกออกมาเพื่อให้โค้ดอ่านง่าย)
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'ordered': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700">🟡 รอยืนยัน</span>;
        case 'cooking': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">🍳 กำลังทำ</span>;
        case 'cooked': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">✅ รอเสิร์ฟ</span>;
        case 'received': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600">🏁 จบงาน</span>;
        case 'cancel': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700">❌ ยกเลิก</span>;
        default: return <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-500">{status}</span>;
    }
};

export default function OrderCard({ order }: { order: OrderItem }) {
    const { updateOrderStatus } = useRestaurantContext();

    // ฟังก์ชันเปลี่ยนสถานะ (เหมือนเดิม)
    const handleStatusChange = (newStatus: string) => {
        // ... (Logic เดิมของคุณ ถ้ามี alert หรือ confirm ก็ใส่ไว้ที่นี่)
        updateOrderStatus(order.itemId, newStatus);
    };
    
    // todo จัดรูปแบบเวลา (ถ้า order.createdAt เป็น string ให้ระวัง error ตรงนี้ อาจต้อง new Date(order.createdAt))
    // const timeString = order.createdAt ? format(new Date(order.createdAt), 'HH:mm', { locale: th }) : '-';

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
            {/* --- ส่วนหัวการ์ด: โต๊ะ และ เวลา --- */}
            {/* <div className="bg-orange-50 px-4 py-3 flex justify-between items-center border-b border-orange-100">
                <div className="flex items-center gap-2">
                    <span className="bg-orange-500 text-white text-sm font-bold px-2.5 py-1 rounded-lg">
                        โต๊ะ {order.tableNo || '-'}
                    </span>
                    <span className="text-xs text-gray-500">#{order.itemId}</span>
                </div>
                <div className="text-gray-500 text-sm flex items-center gap-1">
                    🕒 {timeString} น.
                </div>
            </div> */}

            {/* --- ส่วนเนื้อหา: เมนู และ ตัวเลือก (ให้ยืดหยุ่นเต็มพื้นที่ที่เหลือ) --- */}
            <div className="p-4 grow flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                        {/* ใช้ truncate เพื่อตัดคำถ้ายาวเกินไป ไม่ให้ดัน layout */}
                        <h3 className="text-lg font-bold text-gray-800 leading-tight truncate" title={order.menuName}>
                            {order.menuName}
                        </h3>
                        <span className="text-orange-600 font-bold text-lg whitespace-nowrap">
                            ฿{order.price}
                        </span>
                    </div>

                    {/* แสดง Options แบบเป็น Tag จะดูสะอาดตากว่า */}
                    <div className="flex flex-wrap gap-1 mt-2">
                        {order.selectedOption && order.selectedOption.length > 0 ? (
                            order.selectedOption.map((opt : any, index : number) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                                    {opt.name}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-400">- ไม่มีตัวเลือกเสริม -</span>
                        )}
                    </div>
                </div>
                
                {/* แสดงสถานะปัจจุบัน */}
                 <div className="mt-4 flex justify-end">
                    {getStatusBadge(order.status!)}
                </div>
            </div>

            {/* --- ส่วนท้าย: ปุ่ม Action (เต็มความกว้าง) --- */}
            {order.status !== 'received' && order.status !== 'cancel' && (
                <div className="border-t border-gray-100 bg-gray-50 p-2 flex gap-2">
                     {/* ปุ่มสำหรับสถานะ 'ordered' -> ไป 'cooking' */}
                    {order.status === 'ordered' && (
                        <button 
                            onClick={() => handleStatusChange('cooking')}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-1"
                        >
                            🍳 เริ่มทำ
                        </button>
                    )}
                    
                     {/* ปุ่มสำหรับสถานะ 'cooking' -> ไป 'cooked' */}
                    {order.status === 'cooking' && (
                        <button 
                            onClick={() => handleStatusChange('cooked')}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-1"
                        >
                            ✅ ทำเสร็จแล้ว
                        </button>
                    )}

                     {/* ปุ่มสำหรับสถานะ 'cooked' -> ไป 'received' (จบงาน) */}
                     {order.status === 'cooked' && (
                        <button 
                            onClick={() => handleStatusChange('received')}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-1"
                        >
                            🏁 เสิร์ฟ/จบงาน
                        </button>
                    )}

                    {/* ปุ่มยกเลิก แสดงตลอดถ้าย้งไม่จบงาน */}
                     <button 
                        onClick={() => {
                             if(confirm('ยืนยันการยกเลิกออเดอร์นี้?')) handleStatusChange('cancel');
                        }}
                        className="px-3 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
                        title="ยกเลิกออเดอร์"
                    >
                        ❌
                    </button>
                </div>
            )}
        </div>
    );
}