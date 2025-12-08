import React, {createContext, useState, useContext} from "react";

interface RestaurantContextType {
  id: number
  setId: React.Dispatch<React.SetStateAction<number>>
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
}

const RestaurantContext = createContext<RestaurantContextType | null>(null)

export const RestaurantProvider = ({ children } : any) => {
    const [id, setId] = useState(0)
    const [name, setName] = useState('')

    const contextValue = { 
        id, 
        setId,
        name,
        setName
    }

    return (
        <RestaurantContext.Provider value={contextValue}>
            {children}
        </RestaurantContext.Provider>
    )
}

export const useRestaurantContext = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useCartContext must be used within a MyProvider');
  }
  return context;
};