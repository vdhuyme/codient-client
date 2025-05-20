import React from 'react'
import { Outlet } from 'react-router-dom'

const ClientLayout = () => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}

export default ClientLayout
