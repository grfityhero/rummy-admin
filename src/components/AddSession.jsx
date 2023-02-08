import { differenceInHours, startOfDay } from "date-fns"
import { useEffect } from "react"
import { useState } from "react"
import Modal from "react-modal/lib/components/Modal"
import { getUserAccountType, getUserEmail, getUserId } from "../actions/constant"
import { addSessionAction } from "../actions/sessionAction"
import { editSessionAction } from "../actions/sessionAction"
import { getUsersActions } from "../actions/userAction"
import { getMM, range } from "../utils/commonUtils"

export default function AddSession(props) {
  const { onClose, show, h, sessions, profile, setSessions, startDate, roomId, roomName, selSession, setH, getData } = props
  const accountType = getUserAccountType()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [users, setUsers] = useState([])
  const [durationH, setDurationH] = useState(0)
  const [durationM, setDurationM] = useState(0)
  const [m, setM] = useState("")
  const [padding, setPadding] = useState(0)
  const [userId, setUserId] = useState("")
  const [d, setD] = useState(false)

  const date = new Date(selSession.date || "2022")
  date.setMinutes(selSession.m)
  date.setHours(selSession.h)
  const dif = differenceInHours(date, new Date())

  const isAdmin = (accountType === "admin")

  useEffect(() => {
    if (isAdmin) {
      getUsers()
    }
    if (selSession) {
      setM(selSession.m)
      setPadding(selSession.padding)
      setH(selSession.h)
      setDurationH(parseInt(selSession.duration / 60))
      setDurationM(selSession.duration % 60)
      checkPadding(selSession.h, selSession.m, parseInt(selSession.duration / 60), selSession.duration % 60, selSession.padding)
      setUserId(selSession?.user?._id)
    }
  }, [])

  const checkPadding = (h, m, durationH, durationM, padding, uid) => {
    setD(false)
    const duration = (durationH || 0) * 60 + (durationM || 0)
    const list_ = selSession._id ? sessions.filter((se) => se._id !== selSession._id) : sessions
    const list = list_.map((e) => {
      return { ...e, startMin: e.h * 60 + e.m, endMin: e.h * 60 + e.m + e.duration }
    })
    const newi = {
      h: h || 0,
      m: m || 0,
      duration: duration || 0,
      padding: padding || 0,
      startMin: (h || 0) * 60 + (m || 0),
      endMin: (h || 0) * 60 + (m || 0) + duration,
    }

    if (!selSession._id) {
      if (isAdmin) {
        newi.userId = uid || userId
      } else {
        newi.userId = getUserId()
      }
    }

    let canAdds = true

    list.forEach((e) => {
      if (!canAdds) {
        return
      }
      let p = newi.padding
      if (p < e.padding) {
        p = e.padding
      }
      if (newi.userId === e.userId) {
        p = 0
      }
      if (newi.userId === e.userId && (newi.startMin === e.endMin || newi.endMin === e.startMin)) {
        canAdds = false
        setPadding(e.padding)
        setD(true)
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
    if (!isAdmin && profile.status !== "active") {
      setError("Your account is not active. Please contact to admin.")
      return
    }
    const duration = (durationH || 0) * 60 + (durationM || 0)

    if (isAdmin && !userId && !selSession._id) {
      setError("Select user")
      return
    } else if (m === "") {
      setError("דקות")
      return
    } else if (h === "") {
      setError("דקות")
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
    } else if (!isAdmin && !padding) {
      setError("נא לבחור זמן התארגנות")
      return
    } else if (h * 60 + m + duration + padding > 1440) {
      setError("הזמן שנבחר עובר על הזמן המותר")
      return
    }

    setLoading(false)
    setSuccess("")
    setError("")

    const list_ = selSession._id ? sessions.filter((se) => se._id !== selSession._id) : sessions

    const list = list_.map((e) => {
      return { ...e, startMin: e.h * 60 + e.m, endMin: e.h * 60 + e.m + e.duration }
    })

    const newi = { h: h, m: m, duration: duration, padding, startMin: h * 60 + m, endMin: h * 60 + m + duration }

    if (!selSession._id) {
      if (isAdmin) {
        newi.userId = userId
      } else {
        newi.userId = getUserId()
      }
    }

    let canAdds = true
    let canAdde = true
    let canAddp = true

    list.forEach((e) => {
      if (!canAdds || !canAdde || !canAddp) {
        return
      }

      let p = newi.padding
      if (p < e.padding) {
        p = e.padding
      }
      if (newi.userId === e.userId) {
        p = 0
      }
      if (newi.startMin >= e.startMin && newi.startMin < e.endMin) {
        canAdds = false
      }
      if (newi.startMin < e.startMin && newi.endMin > e.startMin) {
        canAdde = false
      }

      if (newi.userId !== e.userId && newi.startMin >= e.startMin && newi.startMin < e.endMin + e.padding) {
        canAdds = false
      }
      if (newi.userId !== e.userId && newi.startMin >= e.startMin && newi.startMin < e.endMin + p) {
        canAddp = false
      }
      if (newi.userId !== e.userId && newi.startMin < e.startMin && newi.endMin + p > e.startMin) {
        canAddp = false
      }
    })

    if (!isAdmin) {
      if (!canAdds) {
        setError("לא ניתן לקבוע פגישה - עקב הזמן שנבחר לתחילת הפגישה")
        return
      } else if (!canAdde) {
        setError("לא ניתן לקבוע פגישה - עקב משך שנבחר הפגישה")
        return
      } else if (!canAddp) {
        setError("מרווח שנבחר לא תקין")
        return
      }
    }

    const next = list.filter((e) => e.startMin >= newi.endMin)[0] || {}
    const difn = ((next.startMin || 0) - (next.padding || 0)) - ((newi.endMin || 0) + (newi.padding || 0))
    const pList = list.filter((e) => e.endMin <= newi.startMin)
    const previous = pList.length > 0 ? pList[pList.length - 1] || {} : {}
    const difp = ((newi.startMin || 0) - (newi.padding || 0)) - ((previous.endMin || 0) + (previous.padding || 0))

    let d = null
    if (selSession._id) {
      d = new Date(selSession.date)
    } else {
      d = startOfDay(startDate)
    }

    d.setHours(h)
    d.setMinutes(m)
    const dif_ = differenceInHours(d, new Date())

    if (!isAdmin && dif_ > 12) {
      if ((difn >= 30 && difn <= 55) || (difp >= 30 && difp <= 55)) {
        setError("You can not add session at this time. (Check your Start time) Hole time is inacturate")
        return
      }
    }
    newi.roomId = roomId
    newi.roomName = roomName
    newi.email = getUserEmail()
    newi.status = selSession.status || "active"
    setLoading(true)
    if (selSession._id) {
      newi._id = selSession._id
      newi.userId = selSession.userId
      newi.date = selSession.date
      editSessionAction(newi, ({ error }) => {
        if (!error) {
          setError("")
          setSuccess("עודכן בהצלחה!")
          getData()
          setTimeout(() => {
            setLoading(false)
            onClose()
          }, 1000)
        } else {
          setLoading(false)
          setError(error)
        }
      })
    } else {
      newi.date = startOfDay(startDate)
      addSessionAction(newi, ({ error }) => {
        if (!error) {
          setSessions((arr) => [...arr, newi])
          setSuccess("Session added successfully")
          getData()
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
  }

  const cancelSession = () => {
    if (!isAdmin && profile.status !== "active") {
      setError("Your account is not active. Please contact to admin.")
      return
    }
    if (!isAdmin && dif <= 12) {
      setError("לא ניתן לבטל")
      return
    }

    selSession.startMin = selSession.h * 60 + selSession.m;
    selSession.endMin = selSession.h * 60 + selSession.m + selSession.duration
    const newi = selSession

    const list_ = selSession._id ? sessions.filter((se) => se._id !== selSession._id) : sessions

    const list = list_.map((e) => {
      return { ...e, startMin: e.h * 60 + e.m, endMin: e.h * 60 + e.m + e.duration }
    })

    const next = list.filter((e) => e.startMin >= newi.endMin)[0] || {}
    const pList = list.filter((e) => e.endMin <= newi.startMin)
    const previous = pList.length > 0 ? pList[pList.length - 1] || {} : {}
    const difp = ((next.startMin || 0) - (next.padding || 0)) - ((previous.endMin || 0) + (previous.padding || 0))

    if (!isAdmin && (difp >= 30 && difp <= 55)) {
      setError("לא ניתן לקבוע פגישה במרווח הזמן שבחרת")
      return
    }

    selSession.status = "cancel"
    selSession.email = getUserEmail()
    selSession.roomName = roomName


    setLoading(true)
    editSessionAction(selSession, ({ error }) => {
      setLoading(false)
      if (!error) {
        setError("")
        getData()
        setSuccess("Session cancelled")
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

  const endTime = h * 60 + (m || 0) + (durationH || 0) * 60 + (durationM || 0)

  return (
    <Modal
      isOpen={show}
      onRequestClose={onClose}
      contentLabel="My dialog"
      className="mymodal address-modal"
      overlayClassName="myoverlay address-overlay"
      closeTimeoutMS={500}
      ariaHideApp={false}
    >
      <div className="custome-modal bg-white" id="addSession-modal">
        <div className=" d-flex align-items-center justify-content-between py-2 custom-modal-header mb-4">
          <div className="text-capitalize m-0 section-title">
            <p>{selSession && selSession._id ? "עריכת שעות" : "קביעת שעות"}</p>
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
              {isAdmin && (
                <div className="d-flex form-group align-items-center users">
                  <label className="input ">משתמש:</label>{" "}
                  <span>
                    {selSession && selSession._id ? (
                      <div className="s-select pl-0">{selSession.user.name}</div>
                    ) : (
                      <select
                        className="s-select"
                        name="userId"
                        onChange={(e) => {
                          setError("")
                          setUserId(e.target.value)
                          checkPadding(h, m, durationH, durationM, padding, e.target.value)
                        }}
                        value={userId}
                        disabled={users.length === 0 || selSession._id}
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
                    )}
                  </span>
                </div>
              )}
              <div className="d-flex form-group align-items-center startFrom">
                <label className="input">החל מ:</label>{" "}
                <div>
                  <select
                    className="s-select"
                    value={m}
                    onChange={(e) => {
                      setError("")
                      setM(parseInt(e.target.value))
                      checkPadding(h, parseInt(e.target.value), durationH, durationM, padding)
                    }}
                  >
                    <option value={""}>דקות</option>
                    {range(0, 55, 5).map((e) => (
                      <option value={e} key={e}>
                        {e}
                      </option>
                    ))}
                  </select>{" "}
                  M
                </div>
                <span className="mr-1">
                  <>
                    {" "}
                    <select
                      className="s-select"
                      name="duration"
                      onChange={(e) => {
                        setError("")
                        setH(parseInt(e.target.value))
                        checkPadding(parseInt(e.target.value), m, durationH, durationM, padding)
                      }}
                      value={h}
                    >
                      <option value={""}>שעות</option>
                      {range(7, 23, 1).map((e, i) => {
                        return (
                          <option value={e} key={i}>
                            {e}
                          </option>
                        )
                      })}
                    </select>{" "}
                    H
                  </>
                </span>
              </div>
              <div className="d-flex form-group align-items-center duration">
                <label className="input ">לכמה זמן:</label>
                <div className="d-flex">
                  <div className="">
                    <select
                      className="s-select"
                      name="duration"
                      onChange={(e) => {
                        setError("")
                        setDurationM(parseInt(e.target.value))
                        checkPadding(h, m, durationH, parseInt(e.target.value), padding)
                      }}
                      value={durationM}
                    >
                      <option value={""}>דקות</option>
                      {range(0, 55, 5).map((e, i) => {
                        return (
                          <option value={e} key={i}>
                            {e}
                          </option>
                        )
                      })}
                    </select>{" "}
                    M
                  </div>
                  <div className="mr-1">
                    <select
                      className="s-select"
                      name="duration"
                      onChange={(e) => {
                        setError("")
                        setDurationH(parseInt(e.target.value))
                        checkPadding(h, m, parseInt(e.target.value), durationM, padding)
                      }}
                      value={durationH}
                    >
                      <option value={""}>שעות</option>
                      {range(0, 10, 1).map((e, i) => {
                        return (
                          <option value={e} key={i}>
                            {e}
                          </option>
                        )
                      })}
                    </select>{" "}
                    H
                  </div>
                </div>
              </div>
              {!d && (
                <div className="d-flex  align-items-center padding form-group">
                  <label className="input ">זמן התארגנות:</label>
                  <select
                    className={"s-select"}
                    onChange={(e) => {
                      setError("")
                      setPadding(parseInt(e.target.value))
                      checkPadding(h, m, durationH, durationM, parseInt(e.target.value))
                    }}
                    value={padding}
                  >
                    <option value={""}> זמן התארגנות</option>
                    {range(5, 15, 5).map((e, i) => {
                      return (
                        <option value={e} key={i}>
                          {e}
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}

              {(h && m !== "" && (durationH || durationM)) ? < div className="d-flex form-group align-items-center users">
                <label className="input ">זמן שנבחר:</label>{" "}
                <div className="s-select pl-0">
                  <span>{`${parseInt(endTime / 60)}:${getMM(endTime % 60)}`}</span> <span>-</span> <span>{`${h}:${getMM(m)}`}</span>
                </div>
              </div> : ""}
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

                {selSession._id && (
                  <button type="button" className="btn-danger" disabled={loading} onClick={cancelSession}>
                    {loading ? "Cancelling" : "ביטול פגישה"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
