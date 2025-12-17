import { useState } from 'react';

// Define Interface ให้ตรงกับ JSON ที่ได้รับจาก API
export interface OptionItem {
    id: number; // เพิ่ม id ตามโครงสร้างใหม่
    name: string;
    price: number;
    status: 'enable' | 'disable';
}

export interface OptionGroup {
    optionGroup: string;
    optionItems: OptionItem[];
}

interface OptionGroupCardProps {
    group: OptionGroup;
    groupIndex: number;
    onToggleStatus: (groupIndex: number, itemIndex: number) => void;
    onDeleteItem: (groupIndex: number, itemIndex: number) => void;
    onAddItem: (groupIndex: number) => void;
    onDeleteGroup: (groupIndex: number) => void;
}

export default function OptionGroupCard({ 
    group, 
    groupIndex, 
    onToggleStatus, 
    onDeleteItem, 
    onAddItem, 
    onDeleteGroup 
}: OptionGroupCardProps) {

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            
            {/* Card Header */}
            <div className="bg-orange-50 px-4 py-3 border-b border-orange-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg truncate" title={group.optionGroup}>
                    {group.optionGroup}
                </h3>
            </div>

            {/* List Items */}
            <div className="divide-y divide-gray-100 grow">
                {group.optionItems.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-sm">ไม่มีตัวเลือก</div>
                ) : (
                    group.optionItems.map((item, itemIndex) => {
                        const isEnable = item.status === 'enable';
                        
                        return (
                            <div key={item.id} className={`flex justify-between items-center p-3 hover:bg-gray-50 transition-colors ${!isEnable ? 'bg-gray-50' : ''}`}>
                                
                                {/* Left Info: Toggle & Name */}
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {/* Toggle Switch */}
                                    <button 
                                        onClick={() => onToggleStatus(groupIndex, itemIndex)}
                                        className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 relative ${
                                            isEnable ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            isEnable ? 'translate-x-4' : 'translate-x-0'
                                        }`}></div>
                                    </button>

                                    <div className={`truncate ${!isEnable ? 'opacity-50' : ''}`}>
                                        <p className="font-medium text-gray-700 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.price > 0 ? `+${item.price} บาท` : 'ฟรี'}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Action: Status Label & Delete */}
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                    {!isEnable && (
                                        <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                                            หมด
                                        </span>
                                    )}
                                    <button 
                                        onClick={() => onDeleteItem(groupIndex, itemIndex)}
                                        className="text-gray-300 hover:text-red-500 text-lg px-2"
                                        title="ลบตัวเลือก"
                                    >
                                        &times;
                                    </button>
                                </div>

                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}