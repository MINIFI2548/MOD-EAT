import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import OrderPage from '../components/OrderPage';
import { api, type OrderItem } from '@mod-eat/api-types';
import MenuPage from '../components/MenuPage';
import OptionManagementPage from '../components/OptionManagementPage';
import SummaryPage from '../components/SummaryPage';
import StorePage from '../components/StorePage';
import { data, useNavigate } from 'react-router';
import { useRestaurantContext } from '../context/RestaurantContext';

interface webSocketOrderUpdate{
    type : string, 
    orderItems : OrderItem[]
}

// Dashbaord นี้ไม่มีการ Import Fucntion ใด ๆ เข้ามาจากภายนอก
export default function DashboardPage() {
    const { setId } = useRestaurantContext()
    const navigate = useNavigate()

    const [storeName, setStoreName] = useState('ร้านอาหาร');
    // const [orders, setOrders] = useState(ordersData.orders);
    const [activeTab, setActiveTab] = useState('orders');
    const [restaurant, setRestaurant] = useState({id:0, name:""});
    const [queue, setQueue] = useState([{
    oderId: 96,
    itemId: "96-0",
    menuId: 1,
    menuName: "กระเพาหมูสับ",
    price: 55,
    selectedOption: [
        {
            option: {
                name: "พิเสษ",
                price: 10
            },
            optionGroup: "พิเศษ, ธรรมดา"
        }
    ],
    quantity: 1,
    status: "ordered",
    description: ""
    }])

    useEffect(() => { 
        api.seller.auth.verify.get()
        .then(({data}) => {
            console.log(data)
            setId(data?.id)
            setStoreName(data?.name)
        })
    }, [])


    const handleTabClick = (tabKey : any) => {
        setActiveTab(tabKey);
    };
    // console.log(id, name)
    useEffect(()=> {
        const respone = localStorage.getItem('restaurant') 
        // console.log(respone)
        setRestaurant(JSON.parse(JSON.stringify(respone)))
        // console.log(restaurant)  
        // todo 
        const chat = api.seller.dashboard.subscribe({query:{restaurantId:'1'}})
        chat.subscribe(({data}) => {
            const res : webSocketOrderUpdate = data as webSocketOrderUpdate
            // console.log(data)
            if(res.type === "connect"){
                setQueue(res.orderItems)
            }else if(res.type === "update"){
                setQueue(prev => {
                const newItems = res.orderItems.filter(newItem => {
                return !prev.some(oldItem  => oldItem.itemId === newItem.itemId)
            })

        return [...prev, ...newItems]
      })
            }
        })
    }, [])

    useEffect(()=>{
        // console.log(queue)
    }, [queue])

    //todo logout
    const handleLogout = () => {
        // window.location.reload();
        api.seller.auth.logout.get()
        navigate('/')
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loggedInStore');
        localStorage.removeItem('loggedInStoreName');
        // alert('ออกจากระบบสำเร็จ');
        // จะใช่ Function นี้ก็ไป Import เข้ามาซะ ตอนนี้มีแค่ Mock Up อย่างเดียว
        // onLogout();  
    };

    return (
        <div className="bg-orange-50 min-h-screen">
            {/* Header */}
            {/* แก้ไข 1: เปลี่ยน max-w-7xl เป็น w-full และเพิ่ม px ตามขนาดจอ */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {storeName}
                        </h1>
                        <p className="text-sm text-gray-500">ระบบจัดการร้านอาหาร</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm px-3 py-1 rounded hover:bg-orange-50 transition-colors">
                        ออกจากระบบ
                    </button>
                </div>
            </header>

            {/* Main Container */}
            <div className="mx-auto px-4 py-6 Container">
                {/* Tab Navigation */}
                <NavBar
                    activeTab={activeTab}
                    onNavClick={handleTabClick}
                />

                {/* Content Area */}
                <div className="bg-white rounded-b-xl shadow-sm p-6">
                    {/* Content for 'คำสั่งซื้อ' (Orders) Tab */}
                    {activeTab === 'orders' && (
                        // <h1>ordre page</h1>
                        <OrderPage queue={queue}/>
                    )}

                    {/* Content for 'จัดการสต็อก' (Stock) Tab */}
                    {activeTab === 'stock' && (
                        // <StockPage
                        //     stocks={stocks}
                        //     onAddStock={handleAddStock}
                        //     onToggleStock={handleToggleStock}
                        //     onDeleteStock={handleDeleteStock}
                        // />
                        <h1>Stock page coming soon</h1>
                    )}

                    {/* Content for 'จัดการเมนู' (Menu) Tab */}
                    {activeTab === 'menu' && (
                        // <MenuSetupPage
                        //     menus={menus}
                        //     stocks={stocks}
                        //     onAddMenu={handleAddMenu}
                        //     onToggleMenu={handleToggleMenu}
                        //     onDeleteMenu={handleDeleteMenu}
                        //     onEditMenu={handleEditMenu}
                        // />
                        <MenuPage />
                    )}
                    {/* Content for 'จัดการตัวเลือก' (options) Tab */}
                    {activeTab === 'options' && (
                        <OptionManagementPage />
                    )}
                    {/* Content for 'สรุปยอดขาย' (Sales) Tab */}
                    {activeTab === 'sales' && (
                        // <SummaryPage
                        //     summary={summary}
                        // />
                        <SummaryPage /> 
                    )}
                    {/* Content for 'สรุปยอดขาย' (Sales) Tab */}
                    {activeTab === 'store' && (
                        <StorePage /> 
                    )}
                    
                </div>
            </div>
        </div>
    )
}
