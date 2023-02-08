import { startOfDay } from "date-fns"
import { forwardRef, useEffect } from "react"
import { useState } from "react"
import ReactDatePicker from "react-datepicker"
import Modal from "react-modal/lib/components/Modal"
import { getUserAccountType } from "../actions/constant"
import { deleteSubscriptionAction, getSubscriptionsActions } from "../actions/subscriptionAction"
import { getUsersActions } from "../actions/userAction"
import { fDateTime3, WEEKDAYS } from "./constant"

export default function DeleteSession(props) {
  const { onClose, show } = props
  const accountType = getUserAccountType()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [users, setUsers] = useState([])
  const [from, setFrom] = useState(new Date())
  const [userId, setUserId] = useState("")
  const [id, setId] = useState("")
  const [subscriptions, setSubscriptions] = useState([])

  const isAdmin = (accountType === "admin")

  useEffect(() => {
    if (isAdmin) {
      getUsers()
    }

  }, [])

  const getSubscriptions = (id) => {
    getSubscriptionsActions(id, ({ data, error }) => {
      if (error) {
        setError(error)
      } else {
        setSubscriptions(data)
      }
    })
  }

  const getUsers = () => {
    getUsersActions(({ data, error }) => {
      if (error) {
        setError(error)
      } else {
        setUsers(data.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }))
      }
    })
  }

  const save = () => {
    if (isAdmin && !userId) {
      setError("Select user")
      return
    } else if (!id) {
      setError("Select Subscription")
      return
    } else if (!from) {
      setError("Select from")
      return
    }

    setLoading(false)
    setSuccess("")
    setError("")

    setLoading(true)
    deleteSubscriptionAction(id, userId, startOfDay(from), ({ error }) => {
      if (!error) {
        setError("")
        setSuccess("עודכן בהצלחה!")
        setTimeout(() => {
          setLoading(false)
          onClose()
        }, 1000)
      } else {
        setLoading(false)
        setError(error)
      }
    })
  }


  const ExpiryCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className="s-select pl-0 text-center bg-gray border-gray" onClick={onClick} ref={ref}>
      {!value ? "For Lifetime" : fDateTime3(value)}
    </div>
  ))
  return (
    <Modal
      isOpen={show}
      onRequestClose={onClose}
      contentLabel="My dialog"
      className="mymodal address-modal delete-session"
      overlayClassName="myoverlay address-overlay"
      closeTimeoutMS={500}
      ariaHideApp={false}
    >
      <div className="custome-modal bg-white" id="addSession-modal">
        <div className=" d-flex align-items-center justify-content-between py-2 custom-modal-header mb-4">
          <div className="text-capitalize m-0 section-title">
            <p>מחיקת מנוי</p>
          </div>
          <div className="app-fs-20 app-fw-600 text-right cursor-pointer " onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="close-btn" width="16" height="16" viewBox="0 0 24 24">
              <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z" />
            </svg>
          </div>
        </div>
        <div className=" custom-modal-body">
          <div className="row">
            <div className="col-lg-12 col-xl-12 col-sm-12 p-0">
              <div className="d-flex form-group align-items-center users">
                <label className="input ">משתמש:</label>{" "}
                <span>
                  <select
                    className="s-select"
                    name="userId"
                    onChange={(e) => {
                      setError("")
                      setUserId(e.target.value)
                      getSubscriptions(e.target.value)
                    }}
                    value={userId}
                    disabled={users.length === 0}
                  >
                    <option value={""}>בחירת משתמש</option>
                    {users.map((e) => {
                      return (
                        <option value={e._id} key={e._id}>
                          {e.name}
                        </option>
                      )
                    })}
                  </select>
                </span>
              </div>
              <div className="d-flex form-group align-items-center users">
                <label className="input ">משתמש:</label>{" "}
                <span>
                  <select
                    className="s-select"
                    name="sId"
                    onChange={(e) => {
                      setError("")
                      setId(e.target.value)
                    }}
                    value={id}
                    disabled={subscriptions.length === 0}
                  >
                    <option value={""}>בחירת משתמש</option>
                    {subscriptions.map((e) => {
                      return (
                        <option value={e._id} key={e._id}>
                          {`${e.h}:${e.m} ${WEEKDAYS[new Date(e.date).getDay()]}`}
                        </option>
                      )
                    })}
                  </select>
                </span>
              </div>
              <div className="d-flex form-group align-items-center users">
                <label className="input ">החל מ:</label>{" "}
                <ReactDatePicker
                  wrapperClassName="cursor-pointer"
                  onChange={(date) => {
                    setFrom(date)
                  }}
                  selected={from}
                  minDate={new Date()}
                  customInput={<ExpiryCustomInput />}
                />

              </div>
            </div>
          </div>
          <div className="mt-12">
            {success && <div className="success-data">{success}</div>}
            {error && <div className="error-data text-danger">{error}</div>}
            <div className="row justify-content-center">
              <div className="col-lg-12 col-12 p-0" style={{ marginTop: 12 }}>
                <button type="button" className="btn-primary w-auto ml-1" disabled={loading} onClick={save}>
                  {loading ? "שומר..." : "שמירה"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
