import { addDays, startOfDay } from "date-fns"
import { forwardRef, useEffect } from "react"
import { useState } from "react"
import ReactDatePicker from "react-datepicker"
import Modal from "react-modal/lib/components/Modal"
import { getUserAccountType } from "../actions/constant"
import { getSessionActions } from "../actions/sessionAction"
import { getSubscriptionsActions } from "../actions/subscriptionAction"
import { getUsersActions } from "../actions/userAction"
import { getMM, range } from "../utils/commonUtils"
import { fDateTime3, fDateTime4, WEEKDAYS } from "./constant"

export default function DeleteSession(props) {
  const { onClose, show } = props
  const accountType = getUserAccountType()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [value, setValue] = useState("")

  const [users, setUsers] = useState([])
  const [from, setFrom] = useState(new Date())
  const [userId, setUserId] = useState("")
  const [id, setId] = useState("")
  const [subscriptions, setSubscriptions] = useState([])
  const [subscription, setSubscription] = useState("")
  const [sessions, setSessions] = useState([])
  const [to, setTo] = useState(null)

  const isAdmin = (accountType === "admin")

  useEffect(() => {
    if (isAdmin) {
      getUsers()
    }

  }, [])

  const getData = (id) => {
    if (!id) {
      setError("Select user")
      return
    } else if (!to) {
      setError("Select to")
      return
    } else if (!from) {
      setError("Select from")
      return
    }

    setError("")
    setLoading(true)

    getSubscriptionsActions(id, ({ data, error }) => {
      if (error) {
        setError(error)
      } else {
        setLoading(false)
        setSubscriptions(data)
        setSubscription("")
      }
    })

    getSessionActions("", null, "active", ({ data, error }) => {
      if (error) {
        // setError(error);
      } else {
        setSessions(ar => [...data])
      }
    }, id, 0, from, to)

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


  const ExpiryCustomInput = forwardRef(({ value, onClick }, ref) => {
    return (
      <div className="s-select pl-0 text-center bg-gray border-gray" onClick={onClick} ref={ref}>
        {!value ? "Select" : fDateTime3(value)}
      </div>
    )
  })

  let allowed = 0

  if (from && to) {
    const Difference_In_Time = to.getTime() - from.getTime()
    const Difference_In_Days = parseInt((Difference_In_Time / (1000 * 3600 * 24)).toFixed()) + 1
    let sessionDays = []
    subscriptions.forEach(s => {
      sessionDays.push({ day: new Date(s.date).getDay(), duration: s.duration, _id: s._id })
    })

    let selSub = subscriptions.find(e => e._id === subscription) || {}

    range(0, Difference_In_Days, 1).forEach(d => {
      const date = addDays(from, d)
      let subs = 0
      sessionDays.filter(e => e.day === date.getDay() && (!subscription || e._id === subscription)).map(e => {
        if (subscription && e._id === subscription) {
          subs = subs + (selSub.duration || 0)
        } else {
          subs = subs + (e.duration || 0)
        }
      })

      if (subs > 0) {
        allowed = allowed + subs
      } else {
      }
    })

  }

  let allSessions = 0
  let subscriptionSessions = 0
  let manualSessions = 0

  sessions.forEach(el => {
    if (!el.subscriptionId) {
      manualSessions = manualSessions + el.duration
      allSessions = allSessions + el.duration
    } else if (el.subscriptionId === subscription || !subscription) {
      subscriptionSessions = subscriptionSessions + el.duration
      allSessions = allSessions + el.duration
    }
  });


  let diffrence = (allSessions / 60) - (value || (allowed / 60))

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
                <label className="input ">from:</label>{" "}
                <ReactDatePicker
                  wrapperClassName="cursor-pointer"
                  onChange={(date) => {
                    setFrom(date)
                    setTo(null)
                  }}
                  selected={from}
                  customInput={<ExpiryCustomInput />}
                />

              </div>
              <div className="d-flex form-group align-items-center users">
                <label className="input ">to:</label>{" "}
                <ReactDatePicker
                  wrapperClassName="cursor-pointer"
                  onChange={(date) => {
                    setTo(date)
                  }}
                  selected={to}
                  minDate={from}
                  customInput={<ExpiryCustomInput />}
                />

              </div>
            </div>
            <div className="col-lg-12 col-xl-12 col-sm-12 p-0">
              {error && <div className="error-data text-danger">{error}</div>}

              <button type="button" className="btn-primary w-auto ml-1 mb-8 mt-12"
                onClick={() => {
                  getData(userId)
                }}
                disabled={loading}
              >
                {!loading ? "Calculate" : "Calculating"}
              </button>
            </div>
          </div>
          <hr />
          <div className="row mb-8">
            <div className="col-lg-12 col-xl-12 col-sm-12 p-0 mb-8">
              Subscriptions:
            </div>
            {subscriptions.length === 0 ? " No Subscriptions" : subscriptions.map((e, i) => {
              const endTime = e.h * 60 + (e.m || 0) + (e.duration || 0)

              return (<div key={i} className={`col-lg-2 col-xl-2 col-sm-4 text-center mb-8 s-card ${e._id === subscription ? "s-card-s" : ""}`}
                onClick={() => {
                  if (subscription === e._id) {
                    setSubscription("")
                  } else {
                    setSubscription(e._id)
                  }
                }}>
                {`${WEEKDAYS[new Date(e.date).getDay()]}`}
                <div>{`${parseInt(endTime / 60)}:${getMM(endTime % 60)} - ${e.h}:${getMM(e.m)} `}</div>
              </div>)
            }
            )}
          </div>

          <div>All Sessions: {allSessions / 60} Hours</div>
          <div>Subscription Sessions: {subscriptionSessions / 60} Hours</div>
          <div>Manual Sessions: {manualSessions / 60} Hours</div>
          <div>What he desrve: {allowed / 60} Hours</div>
          <div>What he desrve (Custom):
            <input type="number" style={{
              width: 100, padding: 4, lineHeight: 1, backgroundColor: "#fff",
            }}
              value={value}
              onChange={(e) => { setValue(e.target.value) }}
            /> Hours</div>
          <hr />
          <div>Diffrence: {diffrence} Hours</div>
          <hr />

        </div>
      </div>
    </Modal >
  )
}
