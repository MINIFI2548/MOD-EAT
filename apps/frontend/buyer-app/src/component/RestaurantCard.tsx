import { useNavigate } from "react-router-dom"
import { useCartContext } from "../context/CartContext";

export default function RestaurantCard({restaurant} : {restaurant : any}){ 
    const { setRestaurantId } = useCartContext();
    let navigate = useNavigate()

    //todo ฟังก์ชันเลือกสีของจุดสถานะ (Dot)
    const getStatusColorClass = () => {
        const color = () =>{
            if(restaurant.queue > 10 ){
                return 'red'
            }else if(restaurant.queue > 5){ 
                return 'yellow'
            }else{
                return 'green'
            }
        }
        switch (color()) {
        case 'red': return 'bg-red-500';
        case 'yellow': return 'bg-yellow-400';
        case 'green': return 'bg-green-500';
        default: return 'bg-gray-300';
        }
    }
    //todo เอาจำนวนคิวมาคิด
    const waitStatus = () => {
        return `รอไม่นาน`
    }

    const handleClick = () => {
        setRestaurantId(restaurant.id)
        navigate('/menu', { 
            state : { restaurant }
        })
    };


    return(
    <>
        <div className="RestaurantCard bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer ml-[2%] mr-[2%]"
        onClick={handleClick}>
            <div className="shrink-0">
                <div className="w-16 h-16 rounded-xl bg-orange-50 overflow-hidden flex items-center justify-center">
                    <img 
                        src={restaurant.picture_url} // todo data from DB 
                        alt={name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback ถ้าโหลดรูปไม่ได้ ให้แสดงสีพื้นหลังแทน
                            e.target.style.display = 'none'; 
                        }}
                    />
                </div>
            </div>

            {/* ส่วนข้อมูลร้านค้า (ชื่อและประเภท) */}
            <div className="flex-1 min-w-0">
                <h3 className="text-gray-800 font-bold text-lg leading-tight truncate">
                {restaurant.name} {/* //todo data from DB */}
                </h3>
                <p className="text-gray-500 text-sm mt-1 truncate">
                {restaurant.description} {/* //todo data from DB */}
                </p>
            </div>
            {/* ส่วนสถานะคิว (ขวามือ) */}
            <div className="flex flex-col items-end w-50">
                <div className="flex items-center gap-2 mb-1">
                {/* จุดสีแสดงสถานะ */}
                <span className={`w-3 h-3 rounded-full ${getStatusColorClass()}`}></span>
                <span className="text-gray-700 font-medium text-sm">
                    คิว {restaurant.queue} จาน {/* //todo data from DB */}
                </span>
                </div>
                <span className="text-gray-400 text-xs">
                {waitStatus()}
                </span>
            </div>
        </div>
    </>
    )
}