import { Button } from 'antd'
import React from 'react'

export default function DoctorCard({doctor, handleBooking=null}) {
  return (
    <div className="card text-center p-4">
        <div>{doctor.name}</div>
        <div>{doctor.email}</div>
       {
         handleBooking && (
          <Button type='primary'
          onClick={()=>handleBooking(doctor)}
        >
            Book Appointment
        </Button>
         )
       }
    </div>
  )
}
