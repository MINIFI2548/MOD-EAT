import { useState, useEffect } from 'react'
import { api } from '@mod-eat/api-types'
import RestaurantCard from '../component/RestaurantCard'
export default function SelectRestaurantPage() { 
    const [restaurants, setRestaurants] = useState([])

    const callAPI = async () => { 
        api.buyer.restaurants.get()
        .then((res) => { 
            setRestaurants(res.data)
        })
    }
    useEffect(() => {
        callAPI()
    }, [])
    useEffect(() => {
        console.log(restaurants)
    }, [restaurants])
    
    return ( 
        <> 
            <div className="bg-orange-50 min-h-screen flex flex-col">
                <div className="w-full h-30 bg-orange-400 mb-2"></div>
                <div className="RestList flex flex-col w-full gap-1">
                    {restaurants.map((restaurant, index) => (
                        <RestaurantCard key= {index} restaurant={restaurant} />
                    ))}
                </div>
            </div>
        </>
    )
}