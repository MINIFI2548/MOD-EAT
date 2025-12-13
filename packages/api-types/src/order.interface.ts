import { t } from "elysia";

interface Option{
    optionGroup : string, 
    option : {
        name : string, 
        price  : number
    }
}

export interface OrderCart{
    menuId:number, 
    menuName:string, 
    price: number, 
    selectedOption?: Option[], 
    quantity : number, 
    description?: string,
}

export interface OrderItem{ 
    menuId:number, 
    menuName:string, 
    itemId?: string,
    price: number, 
    selectedOption?: any, 
    quantity : number, 
    description?: string,
    status?: string,
    pictureUrl? : string
}
export interface Order{ 
    restaurantId : number,
    price : number,
    slip : string, 
    orderItems : OrderItem[]
}

const OrderItemSchema = t.Object({
    menuId: t.Number(),
    menuName: t.String(),
    price: t.Number(),
    selectedOption: t.Optional(t.Any()),
    quantity: t.Number(),
    description: t.Optional(t.String()),
    status: t.Optional(t.String())
});

const OrderSchema = t.Object({
    restaurantId: t.Number(),
    price: t.Number(),
    slip: t.String(), 
    orderItems: t.Array(OrderItemSchema, {minItems : 1, error:"Need order item"})
});

export{ 
    OrderSchema,
    OrderItemSchema,
}