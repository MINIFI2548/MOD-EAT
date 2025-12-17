import { t } from "elysia";

export interface MenuItem { 
    menuId : number, 
    menuName : string, 
    pictureUrl : string, 
    price : number, 
    status: string, 
    description?: string,
    options: {
        optionGroup:string, 
        optionItems:{
            name:string, 
            price:string
        }[]
    }[] 
}

export type menuStatus = 'enable' | 'disable'

export const MenuStatusSchema = t.Union([
  t.Literal('enable'),
  t.Literal('disable'),
]);