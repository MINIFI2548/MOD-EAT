import OrderHistoryCard from "../component/OrderHistoryCard";
import { api, type OrderItem } from "@mod-eat/api-types"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import { useWebSocket } from "../context/WebSocketContext";
import { useToast } from "../context/ToastContext";

// Icon ลูกศรย้อนกลับ (ใช้ SVG หรือ Icon library ที่คุณมี)
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export default function OrderHistoryPage() {
    
    const { toast } = useToast()

    const [history, setHistory] = useState<OrderItem[]>(JSON.parse(localStorage?.getItem('historyOrder') ?? '[]'))
    const navigate = useNavigate()

    const { socket, connecting } = useWebSocket()
    
// ฟังก์ชันแปลสถานะเป็นภาษาไทย (เอาไว้โชว์ใน popup)
    const getStatusText = (status: string) => {
        switch(status) {
            case 'cooking': return 'กำลังปรุง';
            case 'cooked': return 'ปรุงเสร็จแล้ว';
            case 'received': return 'เสิร์ฟแล้ว';
            case 'cancel': return 'ถูกยกเลิก';
            default: return status;
        }
    }

    socket?.subscribe((({data} : { data : any}) => {
        setHistory((prevHistory) => { // ใช้ callback ใน setState เพื่อให้ได้ค่าล่าสุดเสมอ
             return prevHistory.map((historyItem) => {
                const matchingStatus = data.find((s : any) => s.itemId === historyItem.itemId);
                
                // ตรวจสอบว่ามีข้อมูลใหม่ และ สถานะ "เปลี่ยนไปจากเดิม" หรือไม่
                if (matchingStatus && matchingStatus.status !== historyItem.status) {
                    
                    // --- แจ้งเตือนตรงนี้ ---
                    const statusText = getStatusText(matchingStatus.status);
                    toast.info(`เมนู "${historyItem.menuName}" สถานะเปลี่ยนเป็น: ${statusText}`);
                    // --------------------

                    return { ...historyItem, status: matchingStatus.status };
                }
                
                return historyItem;
            });
        });
        console.log(history)
    }))
    
    useEffect(()=>{
        setHistory(JSON.parse(localStorage?.getItem('historyOrder') ?? '[]'))
        console.log(history);
        // วิธีดึง itemId ออกมา
        const itemIds: string[] = history.map((item:OrderItem) => item.itemId).filter((id): id is string => id !== undefined);
        api.buyer.order.history.post({itemIds : itemIds})
        .then(({data}) => {
            console.log(data)
            if(data){
                // todo fix type
                setHistory(data as any)
                localStorage.setItem('historyOrder', JSON.stringify(data))
                console.log(history);
            }
        })
        connecting()
    }, [])

    return (
    <div className="bg-orange-50 min-h-screen flex flex-col pb-10 font-sans">
        
        {/* --- Header Section (เหมือนหน้าตะกร้าสินค้า) --- */}
        <div className="bg-linear-to-r from-orange-500 to-orange-400 text-white pt-6 pb-6 px-4 rounded-b-3xl shadow-md sticky top-0 z-10">
        <div className="relative flex items-center justify-center">
            {/* ปุ่ม Back */}
            <button 
            className="absolute left-0 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
            onClick={() => navigate("/")}
            >
            <ChevronLeftIcon />
            <span className="text-sm font-medium">กลับ</span>
            </button>
            
            {/* Title */}
            <h1 className="text-2xl font-bold tracking-wide drop-shadow-md">
            ประวัติการสั่งซื้อ
            </h1>
        </div>
        </div>

        {/* --- Content Section --- */}
        <div className="flex flex-col gap-4 p-4">
            {
                [...history].reverse().map((orderItem : OrderItem, index) => {
                    return <OrderHistoryCard order={orderItem}  key={index} />
                })
            }
        </div>
    </div>
    )
}