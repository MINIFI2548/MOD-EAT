import { api } from "@mod-eat/api-types"
import { useEffect, useState } from "react"

function App() {
  const [state, setState] = useState({});
  const callAPI = async () => { 
    console.log('Called api')
    const { data, error } = await api.get();
    if (data) {
      setState(data)
      console.log(data)
    }
  }
  useEffect(()=>{callAPI()}, [])
  return <>
    {state}
  </>
}

export default App
