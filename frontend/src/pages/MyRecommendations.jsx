import { Skeleton } from 'antd'
import React from 'react'
import VaccineCard from '../components/vaccines/VaccineCard'
import useFetch from '../hooks/useFetch'
import useToken from '../hooks/useToken'

export default function MyRecommendations() {
    const [token] = useToken()
    const {data,error,loading,refresh} = useFetch(`doctors/recommendations`,{},token)
    if(loading)  return <Skeleton />
    if(error) return <span className="text-danger">{error.message}</span>
    return (
    <div className="container">
        <h2>My Recommendations</h2>
        <div className="row">
            {
                data.data.map(vaccine=>(
                    <div className="col-md-4 gx-4 gy-4" key={Math.random()}>
                        <VaccineCard 
                        handleDelete={()=>{}}
                        handleEdit={()=>{}}
                        isAdmin={false}
                        vaccine={vaccine}
                        />
                    </div>
                ))
            }
        </div>
    </div>
  )
}
