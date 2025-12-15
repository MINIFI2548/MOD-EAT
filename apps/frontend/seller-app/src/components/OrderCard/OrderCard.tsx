import { api, type Order, type OrderItem } from "@mod-eat/api-types";
import { useEffect, useState } from "react";

export default function OrderCard ({order} : {order:OrderItem}) {  
    // Function เพื่อกำหนดป้ายกำกับและสถานะถัดไปตามสถานะปัจจุบัน
    // console.log(order)
    const [currentStatus, setCurrentStatus] = useState(order.status);

    const getNextStatusAndLabel = () => {
        if (currentStatus === 'ordered') {
            return {
                label: '✓ ยืนยันรับออเดอร์',
                nextStatus: 'cooking',
                buttonClasses: 'bg-blue-500 hover:bg-blue-600'
            };
        } else if (currentStatus === 'cooking') {
            return {
                label: 'เสร็จแล้ว (ทำเสร็จ)',
                nextStatus: 'cooked',
                buttonClasses: 'bg-green-500 hover:bg-green-600'
            };
        } else if (currentStatus === 'cooked') {
            // เมื่ออาหารเสร็จแล้ว ขั้นตอนถัดไปคือการส่งมอบให้ลูกค้า หรือจบออเดอร์
            return {
                label: 'ส่งมอบแล้ว / จบงาน',
                nextStatus: 'received', // สถานะนี้มักใช้เพื่อเคลียร์ออเดอร์ออกจากหน้าจอครัว
                buttonClasses: 'bg-gray-600 hover:bg-gray-700'
            };
        }

        // Default case (สำหรับสถานะ received, cancel หรืออื่นๆ)
        return {
            label: 'ไม่มีการดำเนินการ',
            nextStatus: '',
            buttonClasses: 'bg-gray-300 cursor-not-allowed text-gray-500'
        };
    };

    // Function เพื่อกำหนดคลาส CSS ตามสถานะของออเดอร์
    const getStatusClasses = () => {
        if (currentStatus === 'ordered') {
            return 'bg-red-100 text-red-600';      // รอยืนยัน (Pending)
        } else if (currentStatus === 'cooking') {
            return 'bg-yellow-100 text-yellow-700'; // กำลังทำ (Cooking)
        } else if (currentStatus === 'cooked') {
            return 'bg-green-100 text-green-700';    // เสร็จแล้ว (Finished)
        }else if (currentStatus === 'received' || currentStatus === 'cancel') {
            return 'bg-green-100 text-black-700';    // เสร็จแล้ว (Finished)
        }
        return 'bg-gray-100 text-gray-700';
    };

    // Function เวลากดปุ่ม
    const testhandle = (order) => {
        console.log(order)
    }
    const buttonHandle = () => {

    };
    
    const onOrderAction = () =>{
        console.log(currentStatus)
        
        if(currentStatus == 'ordered'){
            setCurrentStatus("cooking")
        }else if(currentStatus == 'cooking'){
            setCurrentStatus("cooked")
        }else if(currentStatus == 'cooked'){
            setCurrentStatus("received")
        }

        order.status = currentStatus
        console.log(currentStatus)
        api.seller.dashboard.orderStatus.post({
            orderId : order.orderId as number, 
            orderItemId : order.itemId as string, 
            status: nextStatus as string
        }).then(({data}) => console.log(data?.query))
    }

    const { label, nextStatus, buttonClasses } = getNextStatusAndLabel();

    return <>
    <div
        key={order.itemId}
        className="border border-gray-200 rounded-lg p-5 hover:shadow-md"
    >
        <div className="flex justify-between items-start mb-3">
            <div>
                <h3 className="text-lg font-bold text-gray-800">
                    คำสั่งซื้อ #{order.itemId} | {order.menuName} {order.quantity} จาน
                </h3>
                {/* <p className="text-sm text-gray-600">ลูกค้า: {'order.customer'}</p> */}
                {/* <p className="text-sm text-gray-500">เวลา: {'order.time'}</p> */}
            </div>

            {/* Status Label */}
            <span className={`OrderSatus px-3 py-1 text-sm font-medium rounded-full ${getStatusClasses()}`}>
                {order.status === 'ordered' ? 'รอยืนยัน' : order.status === 'cooking' ? 'กำลังทำ' : 'เสร็จแล้ว'}
            </span>
        </div>

        <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-1">ตัวเลือก:</p>
                {
                    order.selectedOption.map(({option, optionGroup} : {option:any, optionGroup:any}) => {
                        return (<ul className="text-sm text-gray-600 space-y-1">
                            {optionGroup} : {option.name}
                        </ul>)
                        console.log(order.itemId, optionGroup, option)
                    })
                }
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <p className="text-lg font-bold text-orange-600">
                รวม: {order.price} บาท
            </p>

            {/* Action Button */}
            <button
                onClick={() => onOrderAction()}
                // Disable button if no valid next action is defined
                disabled={!nextStatus}
                className={`px-4 py-2 text-white text-sm font-medium rounded-lg ${buttonClasses}`}
            >
                {label}
            </button>
        </div>
    </div>
    </>
}