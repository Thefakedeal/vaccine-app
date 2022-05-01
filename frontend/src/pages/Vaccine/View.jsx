import { Button, notification, Skeleton } from 'antd'
import React from 'react'
import { useParams } from 'react-router-dom'
import DoctorCard from '../../components/doctor/DoctorCard'
import useFetch from '../../hooks/useFetch'
import useToken from '../../hooks/useToken'
import useUser from '../../hooks/useUser'
import { doPost } from '../../utils/request'
export default function View() {
  const {id} = useParams()
  const {user} = useUser()
  const {data,error,loading} = useFetch(`vaccine-list/${id}`)
  const {data:doctors,error:doctorError,loading:doctorLoading} = useFetch(`vaccine-list/${id}/recommendations`)
  if(loading) return <Skeleton />
  if(error) return <span className="text-danger">{error.message}</span>
  return(
      <div className="container py-2">
          <h1 className='py-2'>{data.data.name}</h1>
          <h2 className='py-2'>Recommended at: {data.data.months} Month(s)</h2>
          {
            user && (user.role=="DOCTOR") && (
              <Recommended id={id}/>
            )
          }
          <p className="py-2">
                {data.data.description}
          </p>
          {
            doctorLoading && <Skeleton />
          }
          {
           doctorError && <span className='text-danger'>{doctorError.message}</span>
          }
          {
            doctors  && doctors.data && (
              <div className="py-2">
                <h2>Recommended By</h2>
               <div className="row">
               {
                  doctors.data.map(doctor=>(
                    <div className="col-md-4" key={Math.random()}>
                      <DoctorCard doctor={doctor} />
                    </div>
                  ))
                }
               </div>
              </div>
            )
          }
      </div>
  )
}


function Recommended({id}){
  const [token] = useToken()
  const {data,error,loading,refresh} = useFetch(`vaccine-list/${id}/recommended`,{},token);

  const handleReccomend = async () => {
    try {
      if (!window.confirm("Are You Sure?")) return;
      const response = await doPost({
        method: "POST",
        token: token,
        path: `vaccine-list/${id}/recommendations`,
      });
      if (response.ok) {
        notification.success({
          message: "Added To Recommendations",
        });
        return refresh();
      }
      throw new Error((await response.json()).message);
    } catch (error) {
      notification.error({
        message: error.message || "Something went wrong",
      });
    }
  };

  const handleRemoveReccomend = async () => {
    try {
      if (!window.confirm("Are You Sure?")) return;
      const response = await doPost({
        method: "DELETE",
        token: token,
        path: `vaccine-list/${id}/recommendations`,
      });
      if (response.ok) {
        notification.success({
          message: "Removed  From Recommendations",
        });
        return refresh();
      }
      throw new Error((await response.json()).message);
    } catch (error) {
      notification.error({
        message: error.message || "Something went wrong",
      });
    }
  };




  if(loading) return <Button
    loading={loading}
    disabled={loading}
    
  >
    Recommend
  </Button>

  const RecommendButton = ()=>(
    <Button
      type='primary'
      onClick={handleReccomend}
    >
      Recommend
    </Button>
  )

  const NoRecommendButton = ()=>(
    <Button
      type='primary'
      onClick={handleRemoveReccomend}
      danger
    >
      Dont Recommend
    </Button>
  )

  if(error) return null;
  return (
    (data && data.data.hasRecommended)?<NoRecommendButton />:<RecommendButton />    
  )

}