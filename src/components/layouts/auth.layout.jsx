import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}

export default AuthLayout
