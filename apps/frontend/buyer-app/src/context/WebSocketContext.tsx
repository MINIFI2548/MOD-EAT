import type { EdenWS } from "@elysiajs/eden/treaty";
import { api, type OrderItem } from "@mod-eat/api-types";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";


const WebSocketContext = createContext<any | undefined>(undefined);

export const WebSocketProvider = ({ children } : { children : ReactNode}) => {
    const [socket, setSocket] = useState<EdenWS<any> | null>(null);
    const [lastMessage, setLastMessage] = useState(null);

    const connecting = () =>{
      const history = JSON.parse(localStorage?.getItem('historyOrder') ?? '[]')
      const oederIds: number[] = [...new Set(history.map((item:OrderItem) => item.orderId))];
      const newSocket = api.buyer.orderTracker.subscribe({ query : { orderId : oederIds}})
      
      setSocket(newSocket);
    }

    useEffect(() => {
      connecting()

    }, [])


    return (
        <WebSocketContext.Provider value={{ connecting, socket, lastMessage }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useCartContext must be used within a MyProvider');
  }
  return context;
}