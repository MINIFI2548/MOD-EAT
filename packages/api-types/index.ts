import type { AppSever } from "../../apps/backend/src/index"
import { treaty } from "@elysiajs/eden";

export const api = treaty<AppSever>('localhost:3000', {
    fetch:{
        credentials: 'include'
    }
})