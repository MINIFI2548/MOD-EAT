import { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import { api } from  '../../../../../packages/api-types/index'
import { useRestaurantContext } from '../context/RestaurantContext';
 
interface LoginResponse {
  loggedIn: boolean;
  message: string;
  // ใส่ field อื่นๆ ที่ API ส่งกลับมาด้วย
}

// export default function LoginPage({ onLogin }) {
export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [selectId, setSelectId] = useState(0);
    const [selectRestName, setSelectRestName] = useState('เลือกร้านของคุณ');
    const [restaurantsName, setRestaurantsName] = useState([{id : 0, name : "", status : ""}]);
    const {id,setId, setName, name} = useRestaurantContext();
    let navigate = useNavigate();

    const callrestNames = async () => { 
        const { data } = await api.seller.auth.restaurantsName.get()
        if (data){
            setRestaurantsName(data)
        }
    }
    useEffect(() => {
        callrestNames()
    }, [])

    const handleSubmit = async (event : any) => {
        event.preventDefault();
        try{
            await api.seller.auth.login.post({ 
                id: selectId, 
                name: selectRestName, 
                password: password
            }).then((res) => {
                console.log("login success") 
                // console.log(res)
                const data = res.data as LoginResponse
                // console.log(data)
                if(data.loggedIn){
                    setId(selectId)
                    setName(selectRestName)
                    localStorage.setItem('loginRespone', JSON.stringify(data))
                    localStorage.setItem('restaurant', JSON.stringify({id: selectId, name: selectRestName}))
                    navigate('/dashboard')
                    // console.log(id, name)
                }else{
                    alert(data.message)
                }
           })

        }catch(error){
            console.error('fail')
            console.error(error)
        }
        // if (store && store.password === password) {
        //     localStorage.setItem('isLoggedIn', 'true');
        //     localStorage.setItem('loggedInStore', storeId);
        //     localStorage.setItem('loggedInStoreName', store.name);

        //     alert('เข้าสู่ระบบสำเร็จ!');
        //     onLogin();
        // } else {
        //     alert('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
        //     setPassword('');
        // }
    };

    const handleChange = async (event : any) => {
        const data =  await JSON.parse(event.target.value);
        setSelectRestName(data.name)
        setSelectId(data.id)
        console.log(data)
        console.log(selectId, selectRestName)
    };

    return (
        <div className="bg-orange-50 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        {/* Logo/Title Section */}
                        <div className="text-center mb-8">
                            <div className="inline-block rounded-full p-4 mb-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-5xl">
                                    🍽️
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                ระบบจัดการร้านอาหาร
                            </h1>
                            <p className="text-gray-600">สำหรับแม่ค้า</p>
                        </div>

                        <div>
                            {/* Store Selection */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    ชื่อร้าน
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectRestName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer"
                                    >
                                        <option value="เลือกร้านของคุณ">{selectRestName}</option>
                                        {
                                            restaurantsName?.map(rest => (
                                                <option key={rest.id} value={JSON.stringify(rest)}>
                                                    {rest.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    รหัสผ่าน
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="กรอกรหัสผ่าน"
                                />
                            </div>

                            {/* Login Button */}
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600"
                            >
                                เข้าสู่ระบบ
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">© ModEat G3 STUDIO.</p>
                </div>
            </div>
        </div>
    );
}