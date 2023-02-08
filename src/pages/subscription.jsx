import { format, startOfDay } from "date-fns"
import { addDays } from "date-fns/esm"
import { forwardRef, useEffect, useState } from "react"
import ReactDatePicker from "react-datepicker"
import { getRoomActions } from "../actions/roomAction"
import { addSubscriptionAction } from "../actions/subscriptionAction"
import { getUsersActions } from "../actions/userAction"
import { WEEKDAYS } from "../components/constant"
import Header from "../components/Header"
import DeleteSession from "../components/DeleteSession"
import CalcSession from "../components/CalcSession"
import { range, trimJSON } from "../utils/commonUtils"
import moment from "moment"

export default function Subscription() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [sending, setSending] = useState(false)
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState("")
  const [rooms, setRooms] = useState([])
  const [roomId, setRoomId] = useState("")
  const [h, setH] = useState(0)
  const [m, setM] = useState(0)
  const [padding, setPadding] = useState(0)
  const [durationH, setDurationH] = useState(0)
  const [durationM, setDurationM] = useState(0)
  const [day, setDay] = useState("")
  const [expiry, setExpiry] = useState("")
  const [from, setFrom] = useState("")
  const [isDelete, setDelete] = useState(false)
  const [calc, setCalc] = useState(false)

  useEffect(() => {
    getUsers()
    getRooms()
  }, [])

  const onSubmit = () => {
    const duration = (durationH || 0) * 60 + (durationM || 0)
    const v = {
      duration,
      roomId,
      userId,
      h,
      m,
      from,
      padding,
    }
    if (!from) {
      setError("Select Start Date")
      return
    } else if (!userId) {
      setError("Select User")
      return
    } else if (!roomId) {
      setError("Select Room")
      return
    } else if (day === "") {
      setError("Select Day")
      return
    } else if (m === "" || h === 0) {
      setError("Select Time")
      return
    } else if (!duration) {
      setError("נא לבחור לכמה זמן")
      return
    } else if (duration < 10) {
      setError("נא לבחור יותר מחמש דקות")
      return
    } else if (duration > 600) {
      setError("נא לבחור יותר מעשר דקות")
      return
    } else if (h * 60 + m + duration + padding > 1440) {
      setError("הזמן שנבחר עובר על הזמן המותר")
      return
    }

    v.date = startOfDay(addDays(new Date(), day))
    v.from = from
    v.expiryDate = expiry
    const values = trimJSON(v)
    if (values) {
      setSuccess(false)
      setError("")
      setSending(true)
      addSubscriptionAction(values, ({ error }) => {
        if (!error) {
          setSuccess("Subscription Added Successfully")
          setSending(false)
          setDurationH(0)
          setDurationM(0)
          setUserId("")
          setRoomId("")
          setPadding(0)
          setExpiry("")
          setFrom("")
          setDay("")
          setH(0)
          setM(0)
          setTimeout(() => {
            setSuccess("")
          }, 1000)
        } else {
          setError(error)
          setSending(false)
        }
      })
    }
  }

  const getUsers = () => {
    getUsersActions(({ data, error }) => {
      if (error) {
        setError(error)
      } else {
        setUsers(
          data.sort((a, b) => {
            const nameA = a.name.toUpperCase()
            const nameB = b.name.toUpperCase()
            if (nameA < nameB) {
              return -1
            }
            if (nameA > nameB) {
              return 1
            }
            return 0
          })
        )
      }
    }, "active")
  }

  const getRooms = () => {
    getRoomActions(({ data, error }) => {
      if (error) {
        setError(error)
      } else {
        setRooms(data)
      }
    }, "active")
  }

  const ExpiryCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className="s-select pl-0 text-center bg-gray border-gray" onClick={onClick} ref={ref}>
      {value || "לתמיד"}
    </div>
  ))

  const FromCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className="s-select pl-0 text-center bg-gray border-gray" onClick={onClick} ref={ref}>
      {(value && moment(value).format("DD/MM/YYYY")) || "בחירת תאריך"}
    </div>
  ))

  return (
    <>
      <Header admin={true} />
      {isDelete && (
        <DeleteSession
          onClose={(e) => {
            setDelete(false)
          }}
          show={isDelete}
        />
      )}

      {calc && (
        <CalcSession
          onClose={(e) => {
            setCalc(false)
          }}
          show={calc}
        />
      )}

      <div className="placeholder "></div>
      <section id="room">
        <div className="custome-container">
          <div className="d-flex justify-content-center">
            <div className="custome-modal bg-white mt-30" id="addSession-modal">
              <div className=" d-flex align-items-center justify-content-between py-2 custom-modal-header mb-4 mt-30">
                <div className="text-capitalize m-0 section-title">
                  <p>הוספת מנוי</p>
                </div>
              </div>
              <div className=" custom-modal-body">
                <div className="row">
                  <div className="col-lg-12 col-xl-12 col-sm-12 p-0">
                    <div className="d-flex form-group align-items-center users">
                      <label className="input ">החל מ:</label>{" "}
                      <ReactDatePicker
                        wrapperClassName="cursor-pointer"
                        onChange={(date) => {
                          setFrom(date)
                        }}
                        selected={from}
                        minDate={new Date()}
                        customInput={<FromCustomInput />}
                      />
                    </div>
                    <div className="d-flex form-group align-items-center users">
                      <label className="input ">עד:</label>{" "}
                      <ReactDatePicker
                        wrapperClassName="cursor-pointer"
                        onChange={(date) => {
                          setExpiry(date)
                        }}
                        selected={expiry}
                        minDate={new Date()}
                        customInput={<ExpiryCustomInput />}
                      />
                    </div>
                    <div className="d-flex form-group align-items-center users">
                      <label className="input ">בחירת משתמש:</label>{" "}
                      <span>
                        <select
                          className="s-select"
                          name="userId"
                          onChange={(e) => {
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
                      <label className="input ">חדר:</label>{" "}
                      <span>
                        <select
                          className="s-select"
                          name="userId"
                          onChange={(e) => {
                            setRoomId(e.target.value)
                          }}
                          value={roomId}
                          disabled={rooms.length === 0}
                        >
                          <option value={""}>בחירת חדר</option>
                          {rooms.map((e) => {
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
                      <label className="input ">יום בשבוע:</label>{" "}
                      <span>
                        <select
                          className="s-select"
                          name="userId"
                          onChange={(e) => {
                            setDay(e.target.value)
                          }}
                          value={day}
                          disabled={WEEKDAYS.length === 0}
                        >
                          <option value={""}>בחירת יום</option>
                          {range(0, 6, 1).map((e, i) => {
                            const d = addDays(new Date(), e)
                            return (
                              <option value={i} key={i}>
                                {WEEKDAYS[d.getDay()]}
                              </option>
                            )
                          })}
                        </select>
                      </span>
                    </div>

                    <div className="d-flex form-group align-items-center startFrom">
                      <label className="input">החל מ :</label>{" "}
                      <span>
                        <>
                          {" "}
                          <select
                            className="s-select"
                            name="duration"
                            onChange={(e) => {
                              setError("")
                              setH(parseInt(e.target.value))
                            }}
                            value={h}
                          >
                            <option value={""}>בחירת שעה </option>
                            {range(7, 23, 1).map((e, i) => {
                              return (
                                <option value={e} key={i}>
                                  {e}
                                </option>
                              )
                            })}
                          </select>{" "}
                          שעה
                        </>
                      </span>
                      <div>
                        <select
                          className="s-select mr-1"
                          value={m}
                          onChange={(e) => {
                            setError("")
                            setM(parseInt(e.target.value))
                          }}
                        >
                          <option value={""}>בחירת דקות </option>
                          {range(0, 55, 5).map((e) => (
                            <option value={e} key={e}>
                              {e}
                            </option>
                          ))}
                        </select>{" "}
                        דקות
                      </div>
                    </div>

                    <div className="d-flex form-group align-items-center duration">
                      <label className="input ">משך:</label>
                      <div className="d-flex">
                        <div>
                          <select
                            className="s-select"
                            name="duration"
                            onChange={(e) => {
                              setError("")
                              setDurationH(parseInt(e.target.value))
                            }}
                            value={durationH}
                          >
                            <option value={""}>Select Hour</option>
                            {range(0, 10, 1).map((e, i) => {
                              return (
                                <option value={e} key={i}>
                                  {e}
                                </option>
                              )
                            })}
                          </select>{" "}
                          שעה
                        </div>
                        <div className="mr-1">
                          <select
                            className="s-select"
                            name="duration"
                            onChange={(e) => {
                              setError("")
                              setDurationM(parseInt(e.target.value))
                            }}
                            value={durationM}
                          >
                            <option value={""}>Select Minutes</option>
                            {range(0, 55, 5).map((e, i) => {
                              return (
                                <option value={e} key={i}>
                                  {e}
                                </option>
                              )
                            })}
                          </select>{" "}
                          דקות
                        </div>
                      </div>
                    </div>
                    <div className="d-flex  align-items-center padding">
                      <label className="input ">מרווח:</label>
                      <select
                        className={"s-select"}
                        onChange={(e) => {
                          setError("")
                          setPadding(parseInt(e.target.value))
                        }}
                        value={padding}
                      >
                        <option value={""}> בחירת מרווח</option>
                        {range(5, 15, 5).map((e, i) => {
                          return (
                            <option value={e} key={i}>
                              {e}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-12">
                  {success && <div className="success-data">{success}</div>}
                  {error && <div className="error-data text-danger">{error}</div>}
                  <div className="row justify-content-center">
                    <div className="col-lg-12 col-12 p-0 text-right" style={{ marginTop: 12 }}>
                      <button type="button" className="btn-primary w-auto" disabled={sending} onClick={onSubmit}>
                        {sending ? "שומר..." : "שמירה"}
                      </button>
                    </div>
                    <div className="col-lg-12 col-12 p-0 text-right" style={{ marginTop: 12 }}>
                      <hr></hr>
                      <br></br>
                      <button
                        type="button"
                        className="btn-primary w-auto "
                        disabled={sending}
                        onClick={() => {
                          setDelete(!isDelete)
                        }}
                      >
                        מחיקת מנוי
                      </button>
                      <button
                        type="button"
                        className="btn-primary w-auto mr-1"
                        disabled={sending}
                        onClick={() => {
                          setCalc(!calc)
                        }}
                      >
                        Calculate
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
