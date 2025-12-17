import type { AppSever } from "../../../apps/backend/src/index"
import { treaty } from "@elysiajs/eden";

// ตรวจสอบว่ารันบน Browser หรือไม่
const isBrowser = typeof window !== 'undefined';

// กำหนด Port ของ Backend (ปกติ Elysia คุณรันที่ 3000)
const BACKEND_PORT = 3000;

// ถ้าเป็น Browser ให้ใช้ window.location ถ้าไม่ใช่ (เช่น Server) ให้ใช้ localhost
const protocol = isBrowser ? window.location.protocol : 'http:';
const hostname = isBrowser ? window.location.hostname : 'localhost';

// สร้าง URL แบบ Dynamic
// window.location.protocol = 'http:' หรือ 'https:'
// window.location.hostname = 'localhost' หรือ '192.168.0.95'
// const backendUrl = `${protocol}//${hostname}:${BACKEND_PORT}`;
const backendUrl = `${protocol}//${hostname}:${BACKEND_PORT}`;
export const api = treaty<AppSever>(backendUrl, {
    fetch:{
        credentials: 'include'
    }
})

export * from './order.interface'
export * from './menu.interface'
export * from './slip.interface'