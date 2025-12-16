import { useState } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

// --- Mock Data ---
const hourlyData = [
    { time: '10:00', sales: 0 },
    { time: '11:00', sales: 0 },
    { time: '12:00', sales: 0 }, // Peak
    { time: '13:00', sales: 0 },
    { time: '14:00', sales: 0 },
    { time: '15:00', sales: 0 },
    { time: '16:00', sales: 0 },
];

const topMenuData = [
    { name: 'กระเพาหมูสับ', quantity: 0 },
    { name: 'ข้าวขาหมู', quantity: 0 },
    { name: 'ข้าวไข่เจียว', quantity: 0 },
    { name: 'สุกกี้', quantity: 0 },

];

const COLORS = ['#F97316', '#3B82F6']; // Orange-500, Blue-500

export default function SummaryPage() {
    const [dateFilter, setDateFilter] = useState('today');

    return (
        <div className="p-6 pb-20 space-y-6">
            
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">สรุปยอดขาย</h2>
                    <p className="text-gray-500 text-sm">ภาพรวมรายได้และสถิติร้านค้า</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-1 flex self-start md:self-auto">
                    {['today', 'week', 'month'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setDateFilter(filter)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                dateFilter === filter 
                                ? 'bg-orange-100 text-orange-600' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {filter === 'today' ? 'วันนี้' : filter === 'week' ? '7 วัน' : 'เดือนนี้'}
                        </button>
                    ))}
                </div>
            </div>

            {/* 1. KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <KPICard title="ยอดขายรวม" value="฿135" icon="💰" trend="0" isPositive={true} />
                <KPICard title="จำนวนออเดอร์" value="3" icon="🧾" trend="0" isPositive={true} />
                <KPICard title="เฉลี่ยต่อบิล" value="฿45" icon="⚖️" trend="0" isPositive={true} />
                {/* <KPICard title="รายการยกเลิก" value="3" icon="❌" subText="คิดเป็น 2.1%" /> */}
            </div>

            {/* 2. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                
                {/* Main Graph: Hourly Sales */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-4">ยอดขายรายชั่วโมง (ช่วงเวลาขายดี)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="sales" 
                                    stroke="#F97316" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#F97316' }} 
                                    activeDot={{ r: 6 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 3. Top Menu Ranking */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4">🏆 5 อันดับ เมนูขายดีประจำวัน</h3>
                <div className="space-y-4">
                    {topMenuData.map((menu, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                                index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                index === 1 ? 'bg-gray-100 text-gray-600' :
                                index === 2 ? 'bg-orange-50 text-orange-800' : 'text-gray-500'
                            }`}>
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-700 font-medium">{menu.name}</span>
                                    <span className="text-gray-500 text-sm">{menu.quantity} จาน</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div 
                                        className="bg-orange-500 h-2 rounded-full" 
                                        style={{ width: `${(menu.quantity / topMenuData[0].quantity) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Sub-component for KPI Card
function KPICard({ title, value, icon, trend, isPositive, subText } : any) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-orange-50 rounded-lg text-2xl">{icon}</div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-gray-500 text-sm mb-1">{title}</p>
            <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
            {subText && <p className="text-xs text-gray-400 mt-1">{subText}</p>}
        </div>
    );
}