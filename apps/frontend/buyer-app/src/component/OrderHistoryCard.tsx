import type { OrderItem } from "@mod-eat/api-types";

export default function OrderHistoryCard({ order }: { order: OrderItem }) {

    const renderStatusBadge = (status: string) => {
        let bgColor = "";
        let textColor = "";
        let label = "";

        switch (status) {
            case "ordered":
            bgColor = "bg-blue-100";
            textColor = "text-blue-600";
            label = "รับออเดอร์แล้ว";
            break;
            case "cooking":
            bgColor = "bg-yellow-100";
            textColor = "text-yellow-700";
            label = "กำลังปรุง";
            break;
            case "cooked":
            bgColor = "bg-green-100";
            textColor = "text-green-600";
            label = "ปรุงเสร็จแล้ว";
            break;
            case "received":
            bgColor = "bg-gray-100";
            textColor = "text-gray-500";
            label = "ได้รับอาหารแล้ว";
            break;
            case "cancel":
            bgColor = "bg-red-100";
            textColor = "text-red-600";
            label = "ยกเลิก";
            break;
            default:
            // กรณีสถานะไม่ตรงกับที่กำหนด (Fallback)
            bgColor = "bg-gray-100";
            textColor = "text-gray-400";
            label = status;
            break;
        }
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${bgColor} ${textColor}`}>
                {label}
            </span>
        )
    }

    return (
    <>
        {/* --- Card รายการที่ 1 (ตัวอย่างจาก JSON ของคุณ) --- */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 flex flex-col gap-3">
            {/* Header ของการ์ด: วันที่ หรือ Order ID */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-xs text-gray-500">Order ID: #{order.itemId}</span>
                {renderStatusBadge(order?.status ?? 'ordered')}
            </div>

            {/* ส่วนเนื้อหาอาหาร */}
            <div className="flex gap-4">
                {/* รูปภาพ */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                     <img 
                        src="https://placehold.co/150x150?text=Food" 
                        alt="food" 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* รายละเอียด */}
                <div className="flex flex-col flex-1 justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 leading-tight">
                            {order.menuName}
                        </h3>
                        {/* Option: เอามาจาก selectedOption */}
                        <p className="text-sm text-gray-500 mt-1">
                            {/* พิเศษ (+10) */}
                        </p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-2">
                        <div className="text-sm text-gray-600">
                            จำนวน: <span className="font-semibold text-black"> {order.quantity} </span>
                        </div>
                        {/* คำนวณราคา Price (55+10) * 2 */}
                        <div className="text-lg font-bold text-orange-500">
                            {order.price} บาท
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}