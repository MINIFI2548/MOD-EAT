import { useState } from 'react';
export default function StockPage({ stocks, onAddStock, onToggleStock, onDeleteStock }) {

    const [newItemName, setNewItemName] = useState('');
    const [newCategory, setNewCategory] = useState('');

    const categoriesWithIcons = [
        { name: 'เนื้อสัตว์', icon: '🥩' },
        { name: 'ผัก', icon: '🥬' },
        { name: 'เครื่องปรุง', icon: '🧂' },
        { name: 'ข้าว/แป้ง', icon: '🍚' },
        { name: 'น้ำมัน', icon: '💧' },
        { name: 'อื่นๆ', icon: '📦' },
    ];

    const getCategoryIcon = (categoryName) => {
        const category = categoriesWithIcons.find(cat => cat.name === categoryName);
        return category ? category.icon : '❓'; // Default icon if not found
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (newItemName.trim() && newCategory) {
            // Assuming onAddStock will generate an ID and default status (true)
            onAddStock({ name: newItemName.trim(), category: newCategory, status: true });
            setNewItemName(''); // Clear input after adding
            // setNewCategory('เครื่องปรุง'); // Reset category if desired
        }
    };

    return (
        <div className="space-y-10">

            {/* 1. เพิ่มวัตถุดิบใหม่ (Add New Stock Item Form) */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">เพิ่มวัตถุดิบใหม่</h2>

                <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

                    {/* Item Name Input */}
                    <div className="md:col-span-2">
                        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">ชื่อวัตถุดิบ</label>
                        <input
                            type="text"
                            id="itemName"
                            placeholder="เช่น เนื้อวัว"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-orange-500 focus:border-orange-500 text-sm"
                            required
                        />
                    </div>

                    {/* Category Dropdown with Icons */}
                    <div className="md:col-span-1">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">หมวดหมู่</label>
                        <div className="relative">
                            <select
                                id="category"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 pr-8 focus:ring-orange-500 focus:border-orange-500 text-sm appearance-none" // appearance-none to hide default arrow
                                required
                            >
                                <option value="" disabled>เลือกหมวดหมู่</option> {/* Added placeholder option */}
                                {categoriesWithIcons.map(cat => (
                                    <option key={cat.name} value={cat.name}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                            {/* Custom arrow for the dropdown */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Add Button */}
                    <div className="md:col-span-1">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2.5 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center text-sm font-medium"
                        >
                            <span className="text-xl mr-1">+</span> เพิ่มวัตถุดิบ
                        </button>
                    </div>
                </form>
            </div>

            {/* --- */}

            {/* 2. จัดการสต็อกวัตถุดิบ (Stock Management List) */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">จัดการสต็อกวัตถุดิบ</h2>
                <p className="text-sm text-gray-500 mb-4">เปิด/ปิดวัตถุดิบ - ถ้าปิดระบบจะบอกว่าวัตถุดิบหมด</p>

                {/* Group stocks by category (iterate through categoriesWithIcons to maintain order) */}
                {categoriesWithIcons.map(category => (
                    <div key={category.name} className="space-y-2 pt-4">
                        <h3 className="text-md font-bold text-gray-700 flex items-center">
                            <span className="mr-2 text-xl">{category.icon}</span> {category.name}
                        </h3>

                        {/* Filter stocks belonging to this category */}
                        {stocks
                            .filter(s => s.category === category.name)
                            .map(stock => (
                                <div
                                    key={stock.id}
                                    className={`flex justify-between items-center p-4 rounded-lg transition duration-150 ${stock.status ? 'bg-green-50' : 'bg-red-50'}`} // Red background for inactive
                                >
                                    <div className="flex items-center">
                                        {/* Item Icon */}
                                        <span className="mr-3 text-xl">{getCategoryIcon(stock.category)}</span>
                                        <div>
                                            <h4 className="font-medium text-gray-800">{stock.name}</h4>
                                            <p className={`text-xs ${stock.status ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                                                <span className={`w-2 h-2 rounded-full mr-1 ${stock.status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {stock.status ? 'พร้อมใช้' : 'หมด'} {/* 'หมด' for inactive */}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {/* Toggle Switch */}
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={stock.status}
                                                onChange={() => onToggleStock(stock.id)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => onDeleteStock(stock.id)}
                                            className="text-gray-400 hover:text-red-600 transition duration-150"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        {/* Optional: Message if no stocks in this category */}
                        {stocks.filter(s => s.category === category.name).length === 0 && (
                            <p className="text-sm text-gray-500 p-2">ไม่มีวัตถุดิบในหมวดหมู่ {category.name}</p>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
}