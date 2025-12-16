import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { api, type OrderCart, type OrderItem } from "@mod-eat/api-types";
import QrScanner from 'qr-scanner';
import { useToast } from "../context/ToastContext";

interface createdOrder { 
  status : string,
  orderItems : OrderItem[]
}

export default function PaymentPage() {
    const navigate = useNavigate();
    const { cart, restaurantId, restPayment } = useCartContext();
    const { toast } = useToast();
    // รับยอดรวมมาจากหน้าตะกร้า (ถ้าไม่มีให้ default เป็น 0)
    const totalPrice = () => { 
          let t = 0
          cart.map((item : OrderCart ) => { 
              t += (item.price * item.quantity)
          })
          return t
      } 

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [qrCode, SetQrCode] = useState<string>('')
    const qrUrl = `https://promptpay.io/${restPayment}/${totalPrice()}`;
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0]// ดึงข้อมูลจากรูปที่อัปมาก่อน 
        if (file){ 
          if (file) {
            // 2. อัปเดต State (เพื่อให้ UI ส่วนอื่นรู้ว่ามีไฟล์แล้ว)
            setSelectedFile(file)
            
              try {
                // 3. ส่งตัวแปร 'file' (local variable) เข้าไปสแกนโดยตรง 
                // *ห้ามส่ง selectedFile เพราะค่ามันยังไม่อัปเดต*
                const result = await QrScanner.scanImage(file)

                console.log("Decoded Result:", result);
                SetQrCode(result)
                // alert(`QR Code คือ: ${result}`)
                
              } catch (error) {
                SetQrCode('')
                console.log("No QR code found or error:", error)
                alert("ไม่พบ QR Code ในรูปภาพนี้")
              }
            }
        }
    };

    const handleConfirm = () => {
      if (!selectedFile) {
        alert("กรุณาแนบสลิปการโอนเงิน");
        return;
      }
      // navigate("/"); // กลับหน้าแรก หรือไปหน้า Success
      console.log(cart)

      const orderItems = cart.map((item : OrderCart) => {
      return {
          menuId: item.menuId,
          menuName: item.menuName,
          price: item.price,
          // ถ้ามีข้อมูล option ให้ใส่ ถ้าไม่มีให้ใส่ []
          selectedOption: item.selectedOption || [], 
          // ถ้ามีจำนวนให้ใส่ ถ้าไม่มีให้เป็น 1
          quantity: item.quantity || 1, 
          // ถ้ามี description ให้ใส่ ถ้าไม่มีให้เป็น string ว่าง ""
          description: item.description || "" 
        }
      })
      try{
        console.log(orderItems)
        api.buyer.order.create.post({
          
            order : {
              restaurantId : restaurantId, 
              price : totalPrice(), 
              slip : qrCode, 
              orderItems : orderItems
            }
          
        }).then(({ data } : {data : any}) => {
          console.log(data)
          if(data.status != "sucess"){
            throw Error("bad slip")
          }
          let history = JSON.parse(localStorage?.getItem('historyOrder') ?? '[]')
          const orderLists : OrderItem[] = data.orderItems;
          history = [...history, ...orderLists]
          console.log("history : ")
          console.log(history)
          localStorage.setItem('historyOrder', JSON.stringify(history))
          toast.success("สั่งซื้อสำเร็จ!")
          navigate('/history')
        })
        // TODO: ส่งข้อมูลไป Backend
        // alert("ยืนยันการสั่งซื้อเรียบร้อย!");
        }catch(err){
          console.log(err)
          alert(err)
          
        }
      }

      const handleDownloadQR = async () => {
        try {
            // 1. ดึงข้อมูลรูปภาพมาเป็น Blob (Binary Large Object)
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            
            // 2. สร้าง URL ชั่วคราวจาก Blob
            const blobUrl = window.URL.createObjectURL(blob);
            
            // 3. สร้าง element <a> จำลองเพื่อสั่งกดดาวน์โหลด
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `QR-${restPayment}-${totalPrice()}.png`; // ตั้งชื่อไฟล์ที่นี่
            document.body.appendChild(link);
            
            // 4. สั่งกดและลบ element ทิ้ง
            link.click();
            document.body.removeChild(link);
            
            // 5. คืน memory
            window.URL.revokeObjectURL(blobUrl);
            
        } catch (error) {
            console.error("Download failed:", error);
            alert("ไม่สามารถดาวน์โหลดได้ กรุณากดค้างที่รูปภาพเพื่อบันทึก");
        }
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
            <div className="flex flex-col items-center justify-center p-6 bg-white m-4 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-gray-500 font-bold mb-4 text-lg">สแกนเพื่อชำระเงิน</p>
              
              {/* Container ของรูป QR Code */}
              <div className="p-3 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <img 
                      src={`https://promptpay.io/${restPayment}/${totalPrice()}`} // URL ของ QR Code
                      alt="PromptPay QR Code" 
                      className="w-64 h-64 rounded-xl"
                  />
              </div>

              {/* === เพิ่มปุ่ม Download ตรงนี้ === */}
              <button 
                    onClick={handleDownloadQR}
                    className="flex items-center gap-2 mt-4 px-5 py-2.5 bg-orange-50 text-orange-600 rounded-xl font-bold text-sm border border-orange-100 hover:bg-orange-100 transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>บันทึก QR Code</span>
                </button>
                {/* ================================ */}

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
                            qrCode  ? (
                              <>
                                  <svg className="w-10 h-10 text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                  <p className="text-gray-700 font-medium text-sm truncate max-w-[200px]">{selectedFile.name}</p>
                                  <p className="text-green-600 text-xs mt-1">อัปโหลดสำเร็จ</p>
                              </>
                            ) : (
                              <>
                                  <svg className="w-10 h-10 text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                  <p className="text-gray-700 font-medium text-sm truncate max-w-[200px]">{selectedFile.name}</p>
                                  <p className="text-red-600 text-xs mt-1">อัปโหลดสำเร็จ ไม่พบ QrCode {qrCode} </p>
                              </>
                            )

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
                    disabled={!(selectedFile && qrCode)}
                    className={`w-full mt-6 font-bold text-lg py-3 rounded-lg shadow-sm transition-all duration-200
                        ${(selectedFile && qrCode) 
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