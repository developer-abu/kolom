import React from 'react'
import { Navigate } from 'react-router-dom'
const ProfileProtected = ({children}) => {
  const token = localStorage.getItem('token')
    if(token){
        return <Navigate to='/self-profile' replace />
    }
    return children
}

export default ProfileProtected
