import type { AppSever } from "../../../apps/backend/src/index"
import { treaty } from "@elysiajs/eden";

export const api = treaty<AppSever>('http://192.168.0.95:3000', {
    fetch:{
        credentials: 'include'
    }
})

export * from './order.interface'
export * from './menu.interface'
export * from './slip.interface'