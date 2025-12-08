import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart } = useCartContext();

  // รับยอดรวมมาจากหน้าตะกร้า (ถ้าไม่มีให้ default เป็น 0)
  const totalPrice = () => { 
        let t = 0
        cart.map(item => { 
            t += (item.price * item.quantity)
        })
        console.log(t)
        return t
    } 

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleConfirm = () => {
    if (!selectedFile) {
      alert("กรุณาแนบสลิปการโอนเงิน");
      return;
    }
    // TODO: ส่งข้อมูลไป Backend
    alert("ยืนยันการสั่งซื้อเรียบร้อย!");
    // navigate("/"); // กลับหน้าแรก หรือไปหน้า Success
    console.log(cart)
  };

  return (
    <div className="bg-orange-50 min-h-screen flex flex-col pb-10">
      
      {/* --- Header Section --- */}
      <div className="bg-linear-to-r from-orange-500 to-orange-400 text-white pt-6 pb-6 px-4 rounded-b-3xl shadow-md sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all"
          >
            <span className="text-lg font-bold">{"<"}</span>
            <span className="text-sm font-medium">กลับ</span>
          </button>
          <h1 className="text-2xl font-bold tracking-wide shadow-black drop-shadow-md">
            ชำระเงิน
          </h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex flex-col gap-4 p-4 max-w-md mx-auto w-full">
        
        {/* --- Card 1: QR Code Section --- */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <h2 className="text-gray-900 font-bold text-lg mb-4">ชำระเงินผ่าน QR Code</h2>
            
            {/* QR Mockup */}
            <div className="bg-white p-2 border border-gray-100 rounded-lg shadow-inner mb-4">
                <img 
                    src="https://placehold.co/200x200?text=QR+Code" 
                    alt="QR Code" 
                    className="w-48 h-48 object-contain"
                />
            </div>

            <div className="mb-2">
                <span className="text-gray-600 font-medium">ยอดชำระ: </span>
                <span className="text-orange-600 font-bold text-xl">{totalPrice()} บาท</span>
            </div>
            
            <p className="text-gray-500 text-sm">สแกน QR Code เพื่อชำระเงิน</p>
            {/* <p className="text-gray-400 text-xs mt-1">รองรับ PromptPay, True Wallet, SCB Easy</p> */}
        </div>

        {/* --- Card 2: Upload Slip Section --- */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-gray-900 font-bold text-lg mb-4">ยืนยันการชำระเงิน</h2>
            
            <p className="text-gray-600 text-sm mb-2">แนบสลิปการโอนเงิน <span className="text-red-500">*</span></p>

            <label className="cursor-pointer group">
                <input 
                    type="file" 
                    className="hidden" 
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                />
                <div className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors duration-200
                    ${selectedFile ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    
                    {selectedFile ? (
                        // กรณีเลือกไฟล์แล้ว
                        <>
                            <svg className="w-10 h-10 text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            <p className="text-gray-700 font-medium text-sm truncate max-w-[200px]">{selectedFile.name}</p>
                            <p className="text-green-600 text-xs mt-1">อัปโหลดสำเร็จ</p>
                        </>
                    ) : (
                        // กรณีรอยังไม่เลือกไฟล์
                        <>
                             <svg className="w-10 h-10 text-gray-400 mb-2 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <p className="text-gray-500 font-medium text-sm text-center">คลิกเพื่อเลือกไฟล์หรือลากไฟล์มาวาง</p>
                            {/* <p className="text-gray-400 text-xs mt-1">รองรับไฟล์ JPG, PNG (ขนาดไม่เกิน 5MB)</p> */}
                        </>
                    )}
                </div>
            </label>

            {/* ปุ่มยืนยัน */}
            <button 
                onClick={handleConfirm}
                disabled={!selectedFile}
                className={`w-full mt-6 font-bold text-lg py-3 rounded-lg shadow-sm transition-all duration-200
                    ${selectedFile 
                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200 cursor-pointer' 
                        : 'bg-gray-400 text-gray-100 cursor-not-allowed' // สีเทาตามรูป mock up เมื่อยังไม่เลือกไฟล์
                    }`}
            >
                ยืนยันการสั่งซื้อ
            </button>
        </div>

      </div>
    </div>
  );
}