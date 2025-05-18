import { Link } from 'react-router-dom'
import './dashboard.css'

const Index = () => {
  return (
    <>
      <div className="content__header">
        <h1>Dashboard</h1>
        <ol className="breadcrumb">
          <li className="breadcrumb__item">
            <Link to={'/dashboard'}>Home</Link>
          </li>
          <li className="breadcrumb__item active">Dashboard</li>
        </ol>
      </div>

      <div className="stats">
        <div className="stats__card">
          <div className="stats__icon stats__icon--blue">
            <i className="bx bx-user"></i>
          </div>
          <div className="stats__info">
            <h3>1,500</h3>
            <p>Total Users</p>
          </div>
          <div className="stats__progress">
            <span>+15%</span>
            <i className="bx bx-up-arrow-alt"></i>
          </div>
        </div>

        <div className="stats__card">
          <div className="stats__icon stats__icon--green">
            <i className="bx bx-shopping-bag"></i>
          </div>
          <div className="stats__info">
            <h3>$12,500</h3>
            <p>Total Sales</p>
          </div>
          <div className="stats__progress">
            <span>+8%</span>
            <i className="bx bx-up-arrow-alt"></i>
          </div>
        </div>

        <div className="stats__card">
          <div className="stats__icon stats__icon--orange">
            <i className="bx bx-cart"></i>
          </div>
          <div className="stats__info">
            <h3>450</h3>
            <p>New Orders</p>
          </div>
          <div className="stats__progress">
            <span>+5%</span>
            <i className="bx bx-up-arrow-alt"></i>
          </div>
        </div>

        <div className="stats__card">
          <div className="stats__icon stats__icon--red">
            <i className="bx bx-line-chart"></i>
          </div>
          <div className="stats__info">
            <h3>$5,200</h3>
            <p>Revenue</p>
          </div>
          <div className="stats__progress stats__progress--down">
            <span>-3%</span>
            <i className="bx bx-down-arrow-alt"></i>
          </div>
        </div>
      </div>

      <div className="charts">
        <div className="chart__card chart__card--large">
          <div className="chart__header">
            <h3>Sales Overview</h3>
            <div className="chart__actions">
              <button className="chart__btn active">Weekly</button>
              <button className="chart__btn">Monthly</button>
              <button className="chart__btn">Yearly</button>
            </div>
          </div>
          <div className="chart__body">
            <div className="chart__placeholder">
              <div className="chart__bars">
                <div className="chart__bar" style={{ height: '60%' }}></div>
                <div className="chart__bar" style={{ height: '80%' }}></div>
                <div className="chart__bar" style={{ height: '65%' }}></div>
                <div className="chart__bar" style={{ height: '90%' }}></div>
                <div className="chart__bar" style={{ height: '75%' }}></div>
                <div className="chart__bar" style={{ height: '85%' }}></div>
                <div className="chart__bar" style={{ height: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart__card">
          <div className="chart__header">
            <h3>Traffic Sources</h3>
          </div>
          <div className="chart__body">
            <div className="chart__placeholder chart__placeholder--pie">
              <div className="chart__pie">
                <div className="chart__pie-segment chart__pie-segment--blue"></div>
                <div className="chart__pie-segment chart__pie-segment--green"></div>
                <div className="chart__pie-segment chart__pie-segment--orange"></div>
              </div>
            </div>
            <div className="chart__legend">
              <div className="chart__legend-item">
                <span className="chart__legend-color chart__legend-color--blue"></span>
                <span>Direct (45%)</span>
              </div>
              <div className="chart__legend-item">
                <span className="chart__legend-color chart__legend-color--green"></span>
                <span>Social (30%)</span>
              </div>
              <div className="chart__legend-item">
                <span className="chart__legend-color chart__legend-color--orange"></span>
                <span>Referral (25%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="activity-tasks">
        <div className="activity">
          <div className="card__header">
            <h3>Recent Activity</h3>
            <a href="#" className="card__link">
              View All
            </a>
          </div>
          <div className="activity__list">
            <div className="activity__item">
              <div className="activity__icon activity__icon--blue">
                <i className="bx bx-user-plus"></i>
              </div>
              <div className="activity__info">
                <h4>New user registered</h4>
                <p>Jane Smith just created an account</p>
                <span className="activity__time">2 min ago</span>
              </div>
            </div>

            <div className="activity__item">
              <div className="activity__icon activity__icon--green">
                <i className="bx bx-cart"></i>
              </div>
              <div className="activity__info">
                <h4>New order placed</h4>
                <p>Order #45678 has been placed</p>
                <span className="activity__time">1 hour ago</span>
              </div>
            </div>

            <div className="activity__item">
              <div className="activity__icon activity__icon--orange">
                <i className="bx bx-message-alt-detail"></i>
              </div>
              <div className="activity__info">
                <h4>New comment</h4>
                <p>Robert Johnson commented on a post</p>
                <span className="activity__time">3 hours ago</span>
              </div>
            </div>

            <div className="activity__item">
              <div className="activity__icon activity__icon--red">
                <i className="bx bx-error-circle"></i>
              </div>
              <div className="activity__info">
                <h4>System alert</h4>
                <p>Server load is high (85%)</p>
                <span className="activity__time">5 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="tasks">
          <div className="card__header">
            <h3>Tasks</h3>
            <a href="#" className="card__link">
              View All
            </a>
          </div>
          <div className="tasks__list">
            <div className="tasks__item">
              <div className="checkbox">
                <label className="checkbox__label">
                  <input type="checkbox" className="checkbox__input" />
                  <span className="checkbox__custom"></span>
                  <span className="checkbox__text">Update product descriptions</span>
                </label>
              </div>
              <span className="tasks__priority tasks__priority--high">High</span>
            </div>

            <div className="tasks__item">
              <div className="checkbox">
                <label className="checkbox__label">
                  <input type="checkbox" className="checkbox__input" />
                  <span className="checkbox__custom"></span>
                  <span className="checkbox__text">Review new user applications</span>
                </label>
              </div>
              <span className="tasks__priority tasks__priority--medium">Medium</span>
            </div>

            <div className="tasks__item">
              <div className="checkbox">
                <label className="checkbox__label">
                  <input type="checkbox" className="checkbox__input" defaultChecked />
                  <span className="checkbox__custom"></span>
                  <span className="checkbox__text">Respond to customer inquiries</span>
                </label>
              </div>
              <span className="tasks__priority tasks__priority--completed">Completed</span>
            </div>

            <div className="tasks__item">
              <div className="checkbox">
                <label className="checkbox__label">
                  <input type="checkbox" className="checkbox__input" />
                  <span className="checkbox__custom"></span>
                  <span className="checkbox__text">Prepare monthly sales report</span>
                </label>
              </div>
              <span className="tasks__priority tasks__priority--low">Low</span>
            </div>

            <div className="tasks__item">
              <div className="checkbox">
                <label className="checkbox__label">
                  <input type="checkbox" className="checkbox__input" />
                  <span className="checkbox__custom"></span>
                  <span className="checkbox__text">Schedule team meeting</span>
                </label>
              </div>
              <span className="tasks__priority tasks__priority--medium">Medium</span>
            </div>
          </div>
        </div>
      </div>

      <div className="orders">
        <div className="card__header">
          <h3>Recent Orders</h3>
          <a href="#" className="card__link">
            View All
          </a>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD-0001</td>
                <td>John Doe</td>
                <td>Product A</td>
                <td>May 15, 2023</td>
                <td>$120.00</td>
                <td>
                  <span className="badge badge--success">Completed</span>
                </td>
                <td>
                  <div className="table__actions">
                    <button className="table__btn table__btn--view">
                      <i className="bx bx-show"></i>
                    </button>
                    <button className="table__btn table__btn--edit">
                      <i className="bx bx-edit"></i>
                    </button>
                    <button className="table__btn table__btn--delete">
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>#ORD-0002</td>
                <td>Jane Smith</td>
                <td>Product B</td>
                <td>May 14, 2023</td>
                <td>$85.00</td>
                <td>
                  <span className="badge badge--warning">Pending</span>
                </td>
                <td>
                  <div className="table__actions">
                    <button className="table__btn table__btn--view">
                      <i className="bx bx-show"></i>
                    </button>
                    <button className="table__btn table__btn--edit">
                      <i className="bx bx-edit"></i>
                    </button>
                    <button className="table__btn table__btn--delete">
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>#ORD-0003</td>
                <td>Robert Johnson</td>
                <td>Product C</td>
                <td>May 13, 2023</td>
                <td>$250.00</td>
                <td>
                  <span className="badge badge--info">Processing</span>
                </td>
                <td>
                  <div className="table__actions">
                    <button className="table__btn table__btn--view">
                      <i className="bx bx-show"></i>
                    </button>
                    <button className="table__btn table__btn--edit">
                      <i className="bx bx-edit"></i>
                    </button>
                    <button className="table__btn table__btn--delete">
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>#ORD-0004</td>
                <td>Emily Davis</td>
                <td>Product D</td>
                <td>May 12, 2023</td>
                <td>$75.00</td>
                <td>
                  <span className="badge badge--danger">Cancelled</span>
                </td>
                <td>
                  <div className="table__actions">
                    <button className="table__btn table__btn--view">
                      <i className="bx bx-show"></i>
                    </button>
                    <button className="table__btn table__btn--edit">
                      <i className="bx bx-edit"></i>
                    </button>
                    <button className="table__btn table__btn--delete">
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>#ORD-0005</td>
                <td>Michael Wilson</td>
                <td>Product E</td>
                <td>May 11, 2023</td>
                <td>$195.00</td>
                <td>
                  <span className="badge badge--success">Completed</span>
                </td>
                <td>
                  <div className="table__actions">
                    <button className="table__btn table__btn--view">
                      <i className="bx bx-show"></i>
                    </button>
                    <button className="table__btn table__btn--edit">
                      <i className="bx bx-edit"></i>
                    </button>
                    <button className="table__btn table__btn--delete">
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Index
