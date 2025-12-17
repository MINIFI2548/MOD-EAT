import { useEffect, useState } from 'react';
import OptionGroupCard, { type OptionGroup } from './OptionGroupCard'; 
import { api } from '@mod-eat/api-types';
import { useRestaurantContext } from '../context/RestaurantContext';

export default function OptionManagementPage() {
    const [groups, setGroups] = useState<OptionGroup[]>([]);
    const { id } = useRestaurantContext()

    // Fetch ข้อมูลเริ่มต้น
    useEffect(() => { 
        if (id) {
            api.seller.dashboard.options.get({ query: { id: id } })
                .then(({ data }) => {
                    if (data) {
                        setGroups(data as OptionGroup[])
                    }
                })
                .catch(err => console.error("Error fetching options:", err));
        }
    }, [id])

    // --- Logic ---

    // 1. Toggle Status พร้อมเรียก API
    const handleToggleStatus = async (groupIndex: number, itemIndex: number) => {
        // Clone state เดิมมาเพื่อแก้ไข
        const newGroups = [...groups];
        const targetGroup = { ...newGroups[groupIndex] }; // Clone group
        const targetItem = { ...targetGroup.optionItems[itemIndex] }; // Clone item

        // เก็บค่าเดิมไว้เผื่อต้อง Revert กรณี API Error
        const previousStatus = targetItem.status;
        const newStatus = previousStatus === 'enable' ? 'disable' : 'enable';

        // 1. Optimistic Update: อัปเดต UI ทันที
        targetItem.status = newStatus;
        
        // ใส่ข้อมูลที่แก้แล้วกลับเข้าไปใน newGroups
        targetGroup.optionItems = [...targetGroup.optionItems];
        targetGroup.optionItems[itemIndex] = targetItem;
        newGroups[groupIndex] = targetGroup;
        
        setGroups(newGroups);

        try {
            // 2. เรียก API Update
            await api.seller.dashboard.option.put({
                status: newStatus,
                optionId: targetItem.id
            });
            console.log(`Updated Option ID ${targetItem.id} to ${newStatus}`);
        } catch (error) {
            console.error("Failed to update status:", error);
            
            // 3. Revert: ถ้าพัง ให้แก้ค่ากลับเป็นเหมือนเดิม
            targetItem.status = previousStatus;
            targetGroup.optionItems[itemIndex] = targetItem;
            newGroups[groupIndex] = targetGroup;
            setGroups([...newGroups]); // Trigger re-render
            alert("ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง");
        }
    };

    return (
        <div>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">จัดการตัวเลือก (Options)</h2>
                    <p className="text-sm text-gray-500">
                        กลุ่มตัวเลือกทั้งหมด <span className="font-medium text-gray-700">{groups.length}</span> กลุ่ม
                    </p>
                </div>
            </div>

            {/* Groups Grid */}
            {groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {groups.map((group, index) => (
                        <OptionGroupCard
                            key={index} // ถ้ามี group.id ใช้ group.id จะดีกว่า index
                            group={group}
                            groupIndex={index}
                            onToggleStatus={handleToggleStatus}
                            onDeleteItem={() => {}} // ยังไม่มีฟังก์ชัน
                            onAddItem={() => {}}    // ยังไม่มีฟังก์ชัน
                            onDeleteGroup={() => {}} // ยังไม่มีฟังก์ชัน
                        />
                    ))}
                </div>
            ) : (
                // Empty State
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <div className="text-4xl mb-2">⚙️</div>
                    <p className="text-gray-500 font-medium">ยังไม่มีข้อมูลตัวเลือก</p>
                </div>
            )}
        </div>
    );
}