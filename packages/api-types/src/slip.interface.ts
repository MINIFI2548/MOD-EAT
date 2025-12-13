// 1. ส่วนย่อย: ข้อมูลธนาคาร (Bank Info)
export interface BankInfo {
  id: string;   // รหัสธนาคาร เช่น "004", "014"
  name: string; // ชื่อธนาคาร
}

// 2. ส่วนย่อย: รายละเอียดบัญชี (Account Details)
export interface AccountProxy {
  type: string;    // เช่น "NATID", "BILLERID", "MSISDN"
  account: string; // เลขที่ผูกพร้อมเพย์
}

export interface AccountDetail {
  name: string;
  bank: {
    account: string | null; // เลขบัญชี (มักจะถูก mask มาเป็น xxx)
  };
  proxy?: AccountProxy; // ผู้โอน (Sender) อาจจะไม่มีข้อมูลส่วนนี้
}

// 3. ส่วนย่อย: ข้อมูลผู้ส่ง/ผู้รับ (Party)
export interface TransactionParty {
  account: AccountDetail;
  bank: BankInfo;
}

// 4. ส่วนข้อมูลหลักของสลิป (Slip Data)
export interface SlipData {
  referenceId: string;
  decode: string;        // ข้อมูลดิบจากการถอดรหัส QR
  transRef: string;      // รหัสอ้างอิงธุรกรรมของธนาคาร
  dateTime: string;      // ISO 8601 Format (e.g. 2025-10-05T14:48:00.000Z)
  amount: number;
  ref1: string | null;
  ref2: string | null;
  ref3: string | null;
  receiver: TransactionParty;
  sender: TransactionParty;
}

// ==========================================
// 5. Response หลัก (API Response)
// ==========================================

// กรณีสำเร็จ (Success)
export interface SlipSuccessResponse {
  code: "200000"; // ล็อคค่าไว้เช็คเงื่อนไข
  message: string;
  data: SlipData;
}

// กรณีไม่สำเร็จ (Error)
export interface SlipErrorResponse {
  code: string;     // รหัสอื่นที่ไม่ใช่ 200000 เช่น 400001
  message: string;
  data?: never;     // กรณี Error จะไม่มี object data
}

// รวมเป็น Type เดียวเพื่อนำไปใช้
export type SlipApiResponse = SlipSuccessResponse | SlipErrorResponse;