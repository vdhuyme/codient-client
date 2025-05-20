import { Link } from 'react-router-dom'

const Index = () => {
  return (
    <>
      <div className="content__header">
        <h1>Dashboard</h1>
        <ol className="breadcrumb">
          <li className="breadcrumb__item">
            <Link to={'/dashboard'}>Home</Link>
          </li>
          <li className="breadcrumb__item active">Licenses</li>
        </ol>
      </div>

      <div className="card">
        <div className="card__header flex">
          <h3>Licenses</h3>
        </div>
      </div>
    </>
  )
}

export default Index
