import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
