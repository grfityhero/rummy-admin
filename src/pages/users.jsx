import { useEffect, useState } from "react"
import { editUserAction, getUsersActions } from "../actions/userAction"
import AddUser from "../components/auth/AddUser"
import Header from "../components/Header"
import Loading from "../components/Loading"

const User = ({ e, i, getUsers, edit }) => {
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState(e.status)

  const onSubmit = (user, s) => {
    user.status = s
    if (user._id) {
      setSending(true)
      editUserAction(user, ({ error }) => {
        if (!error) {
          setSending(false)
          getUsers()
        } else {
          setSending(false)
        }
      })
    }
  }

  return (<div className="room-card" key={i}>
    <div className="room-header">
      <h2 className="room-heading">{e.userName} {"(" + e.accountType + ")"}</h2>
      <div className="d-flex flex-column action-btn">
        <button className="edit-btn mb-8"
          disabled={sending}
          onClick={() => {
            edit(e)
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M18.308 0l-16.87 16.873-1.436 7.127 7.125-1.437 16.872-16.875-5.691-5.688zm-15.751 21.444l.723-3.585 12.239-12.241 2.861 2.862-12.239 12.241-3.584.723zm17.237-14.378l-2.861-2.862 1.377-1.377 2.861 2.861-1.377 1.378z" />
          </svg>
        </button>
        <button
          className={`dlt-btn ${status === "active" ? "block" : "activate"}`}
          disabled={sending}
          onClick={() => {
            if (!status || status === "active") {
              setStatus("inactive")
              onSubmit(e, "inactive")
            } else if (status === "inactive") {
              setStatus("active")
              onSubmit(e, "active")
            }
          }}>
          {/* {sending ? "Updating" : status === "active" ? "Block" : "Activate"} */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-1.35-.438-2.6T18.3 7.1L7.1 18.3q1.05.825 2.3 1.263T12 20Zm-6.3-3.1L16.9 5.7q-1.05-.825-2.3-1.262T12 4Q8.65 4 6.325 6.325T4 12q0 1.35.437 2.6T5.7 16.9Z" /></svg>{" "}
        </button>
      </div>
    </div>

    {/* <p className={`mb-0 text-capitalize mt-0 ${e.status === "active" ? "app-badge-active" : "app-badge-inactive"}`}>{e.status === "active" ? "active" : "block"}</p> */}
    {e.email && <div><span className="data-heading">Email:</span><span className="data-desc">{e.email}</span></div>}
    <div><span className="data-heading">Phone:</span><span className="data-desc">{e.phone}</span></div>
    <div><span className="data-heading">Points:</span><span className="data-desc"> {e.points}</span></div>
    <div><span className="data-heading">Status:</span> <span className="data-desc">{e.status}</span></div>
    {/* <div className="d-flex room-btns">
      <button
        className="btn-primary w-auto"
        disabled={sending}
        onClick={() => {
          edit(e)
        }}>edit</button>

      <button
        className="btn-cancel w-auto"
        disabled={sending}
        onClick={() => {
          if (!status || status === "active") {
            setStatus("inactive")
            onSubmit(e, "inactive")
          } else if (status === "inactive") {
            setStatus("active")
            onSubmit(e, "active")
          }
        }}>{sending ? "Updating" : status === "active" ? "Block" : "Activate"}
      </button>
    </div> */}
  </div>
  )
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")
  const [add, setAdd] = useState(false)
  const [user, setSelUser] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = () => {
    getUsersActions(({ data, error }) => {
      setLoading(false)
      if (error) {
        setError(error)
      } else {
        data.sort((a, b) => a.userName.localeCompare(b.userName))
        // console.log(data)
        setUsers(data)
      }
    })
  }
  const addFun = () => {
    setAdd(!add)
    setSelUser(null)
  }

  return (
    <>
      {add && <AddUser isOpen={add} toggleRegister={addFun}
        onAdd={() => {
          getUsers()
          addFun()
        }}
        user={user}
      />}

      <Header />
      <div className="placeholder"></div>
      <section id="room">
        <div className="custome-container mt-20">
          <div className="text-right add-btn">
            <div className="section-title">
              Users
              {/* ניהול חדרים */}
            </div>
            <button
              className="btn-primary"
              onClick={addFun}>
              Add
              {/* הוספת חדר */}
            </button>
          </div>
          {loading ? (
            <Loading />
          ) : (users && users.length === 0) || error ? (
            <div className="text-center my-6">{error || "No Data"}</div>
          ) : (
            <div className="all-rooms">
              {users.map((e, i) => {
                return <User key={i} e={e} i={i} getUsers={getUsers}
                  edit={(u => {
                    setSelUser(u)
                    setAdd(true)
                  })} />
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
