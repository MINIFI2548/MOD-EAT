type TabButtonProps = {
    isActive: boolean;
    onClick: (tabKey: string) => void;
    tabKey: string;
    icon: string;
    label: string;
};

const TabButton = ({ isActive, onClick, tabKey, icon, label } : TabButtonProps) => {

    const classes = `
        px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 
        ${isActive
            ? 'border-orange-500 text-orange-600' // Active Styles
            : 'border-transparent text-gray-600 hover:border-gray-300' // Inactive Styles
        }
    `;

    return (
        <button
            onClick={() => onClick(tabKey)}
            className={classes}
        >
            <span aria-hidden="true">{icon}</span>
            {label}
        </button>
    );
};

export default function NavBar({ activeTab , onNavClick } : {activeTab : string, onNavClick : (tabKey: string) => void}) {

    const tabs = [
        { key: 'orders', icon: '🍽️', label: 'คำสั่งซื้อ' },
        { key: 'menu', icon: '📋', label: 'จัดการเมนู' },
        { key: 'options', icon: '⚙️', label: 'จัดการตัวเลือก' }, 
        // { key: 'stock', icon: '📦', label: 'จัดการสต็อก' },
        { key: 'sales', icon: '📈', label: 'สรุปยอดขาย' },
        { key: 'store', icon: '🏠', label: 'จัดการร้านค้า' }
    ];

    return (
        <div className="bg-white rounded-t-xl shadow-sm">
            <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                    <TabButton
                        key={tab.key}
                        isActive={activeTab === tab.key}
                        onClick={onNavClick}
                        tabKey={tab.key}
                        icon={tab.icon}
                        label={tab.label}
                    />
                ))}
            </div>
        </div>
    );
}