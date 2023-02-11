import "react-datepicker/dist/react-datepicker.css"
import { useEffect, useState, forwardRef } from "react"
import { addDays } from "date-fns"
import ReactDatePicker from "react-datepicker"
import AddSession from "../components/AddSession"
import { getMM, range } from "../utils/commonUtils"
import Header from "../components/Header"
import { fDateTime4 } from "../components/constant"
import { getSessionActions } from "../actions/sessionAction"
import { getRoomActions } from "../actions/roomAction"
import { getAccessToken, getToken, getUserAccountType, getUserId } from "../actions/constant"
import RoomDetail from "../components/RoomDetail"
import Loading from "../components/Loading"
import { createSearchParams, Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { getProfileAction } from "../actions/authActon"
import moment from "moment"

function Home() {
  let uid = getUserId()
  const accountType = getUserAccountType()
  const token = getAccessToken()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [loginUser, setLoginUser] = useState(false)
  const [registerUser, setRegisterUser] = useState(false)
  const [startDate, setStartDate] = useState(!searchParams.get("date") ? new Date() : new Date(searchParams.get("date")))
  const [rooms, setRooms] = useState([])
  const [sessions, setSessions] = useState([])
  const [roomId, setRoomId] = useState("")
  const [sessionModal, setSessionModal] = useState(false)
  const [selSession, setSelSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [array, setArray] = useState([])
  const [currentRoom, setCurrentRoom] = useState(null)
  const [openCurrentRoom, setOpenCurrentRoom] = useState(false)
  const [curUserName, setCurUserName] = useState("")
  const [h, setH] = useState("")
  const [forgetPass, setForgetPass] = useState(false)
  const [profile, setProfile] = useState({})
  const toggleLogin = () => {
    setLoginUser(!loginUser)
  }
  const toggleRegister = () => {
    setRegisterUser(!registerUser)
  }
  const toggleForgetPass = () => {
    setForgetPass(!forgetPass)
  }

  useEffect(() => {
    if (token) {
      getProfileAction(({ data, error }) => {
        if (error) {
          setError(error)
        } else {
          if (data !== null) {
            setProfile(data)
            localStorage.setItem("u_name", data.userName)
          }
        }
      })
    }

    // getRooms()
    const curUserNAme = localStorage.getItem("u_name")
    if (curUserNAme) {
      setCurUserName(curUserNAme)
    }
  }, [])

  useEffect(() => {
    // if (roomId) {
    //   getSessions(roomId, startDate)
    //   const currentRoom_ = rooms.find((e) => e._id === roomId)
    //   setCurrentRoom(currentRoom_)
    // }
  }, [roomId, startDate])

  const getRooms = () => {
    getRoomActions(({ data, error }) => {
      if (error) {
        // setError(error);
      } else {
        setRooms(data)
        if (!roomId) {
          setRoomId(data[0]?._id)
        }
      }
    }, "active")
  }

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className="calendar">
      <button onClick={onClick} ref={ref} className="">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M20 20h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm6 0h-4v4h4v-4zm-6-6h-4v4h4v-4zm16-8v22h-24v-22h3v1c0 1.103.897 2 2 2s2-.897 2-2v-1h10v1c0 1.103.897 2 2 2s2-.897 2-2v-1h3zm-2 6h-20v14h20v-14zm-2-7c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 1-1v-2zm-14 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 1 1v2z" />
        </svg>
      </button>
    </div>
  ))
  return (
    <>
      {sessionModal && (
        <AddSession
          selSession={selSession}
          roomId={roomId}
          roomName={rooms.find((e) => e._id === roomId).name}
          startDate={startDate}
          sessions={sessions}
          setSessions={setSessions}
          h={h}
          setH={setH}
          show={sessionModal}
          onClose={() => {
            setSessionModal(false)
            setSelSession(null)
          }}
          getData={() => {
            getSessions(roomId, startDate)
          }}
          profile={profile}
        />
      )}

      {currentRoom && openCurrentRoom && (
        <RoomDetail
          show={openCurrentRoom}
          room={currentRoom}
          onClose={() => {
            setOpenCurrentRoom(!openCurrentRoom)
          }}
        />
      )}

      <Header
        u_name={curUserName}
        rooms={rooms}
        roomId={roomId}
        setRoomId={setRoomId}
        loginUser={loginUser}
        setLoginUser={setLoginUser}
        registerUser={registerUser}
        setRegisterUser={registerUser}
        forgetPass={forgetPass}
        setForgetPass={setForgetPass}
        toggleLogin={toggleLogin}
        toggleRegister={toggleRegister}
        toggleForgetPass={toggleForgetPass}
        onLogin={(user) => {
          setCurUserName(user.userName)
          getRooms()
        }}
      />

      <div id="hero">
        <div className="custome-container">
          <div className="time-table">
            <div className="row " style={{ direction: "rtl" }}>
              {loading ? (
                <div width="100%">
                  <Loading />
                </div>
              ) : (
                <div>
                  <Link to="/users">Users</Link>
                  <Link to="/rooms">Rooms </Link>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Home
