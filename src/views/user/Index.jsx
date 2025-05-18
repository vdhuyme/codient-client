const Index = () => {
  return (
    <>
      <div className="content__header">
        <h1>Dashboard</h1>
        <ol className="breadcrumb">
          <li className="breadcrumb__item">
            <a href="#">Home</a>
          </li>
          <li className="breadcrumb__item active">Users</li>
        </ol>
      </div>

      <div className="card">
        <div className="card__header flex">
          <h3>Users</h3>
        </div>
      </div>
    </>
  )
}

export default Index
