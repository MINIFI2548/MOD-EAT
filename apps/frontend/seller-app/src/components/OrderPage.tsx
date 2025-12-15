import type { OrderItem } from "@mod-eat/api-types"
import OrderCard from "./OrderCard/OrderCard"
export default function OrderPage({queue} : {queue : OrderItem[]}) {

    console.log('order page')
    // console.log(queue)

    return (
        <>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800">คำสั่งซื้อปัจจุบัน</h2>
            </div>

            {/* Order Cards */}
            <div className="space-y-4">
                {
                (queue||[]).map((order, index) => {
                    return <OrderCard key={index} order={order}/>
                })}
            </div>
        </>
    )
}