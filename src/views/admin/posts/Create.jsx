import { Link } from 'react-router-dom'
import PostForm from './post-form'

const Create = () => {
  return (
    <>
      <div className="content__header">
        <h1>Dashboard</h1>
        <ol className="breadcrumb">
          <li className="breadcrumb__item">
            <Link to={'/dashboard'}>Home</Link>
          </li>
          <li className="breadcrumb__item">
            <Link to={'/posts'}>Posts</Link>
          </li>
          <li className="breadcrumb__item active">Create Post</li>
        </ol>
      </div>
      <div className="card">
        <div className="card__header">
          <h3>Create Post</h3>
        </div>

        <div className="card__body">
          <PostForm />
        </div>
      </div>
    </>
  )
}

export default Create
