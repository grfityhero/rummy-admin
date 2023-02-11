import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { getToken, getUserAccountType, getUserName, logout } from "../actions/constant"
import ForgotPassword from "./auth/Forgot-Password"
import Login from "./auth/Login"
import Register from "./auth/Register"

export default function Header(props) {
  const { admin, roomId, setRoomId, rooms, onLogin, loginUser, setLoginUser, registerUser, setRegisterUser, toggleLogin, toggleRegister,
    toggleForgetPass, setForgetPass, forgetPass, u_name
  } = props
  const navigate = useNavigate()
  const token = getToken()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const loc = useLocation()

  return (
    <>
      {loginUser && (
        <Login
          isOpen={loginUser}
          toggleForgetPass={toggleForgetPass}
          openL={loginUser}
          toggleLogin={toggleLogin}
          toggleRegister={toggleRegister}
          onLogin={onLogin}
        />
      )}
      {registerUser && <Register isOpen={registerUser} openL={registerUser} toggleLogin={toggleLogin} toggleRegister={toggleRegister} onLogin={onLogin} />}
      {forgetPass && <ForgotPassword isOpen={forgetPass} openL={forgetPass} toggleForgetPass={toggleForgetPass} />}

      <div className="header">
        <div className="header-border custome-container">
          <div className="d-flex">
            {getUserAccountType() === "admin" && (
              <div className="menu-items">

                <div
                // className="green"
                >
                  <a href="/rooms" className={loc.pathname === "/rooms" ? "active" : ""}>
                    Rooms
                    {/* ניהול חדרים  */}
                  </a>
                  <a href="/users" className={loc.pathname === "/users" ? "active" : ""}>
                    Users
                    {/* ניהול משתמשים  */}
                  </a>
                  {/* <a href="/reports"> דוחות </a> */}
                  {/* <a href="/subscriptions"> מנויים </a> */}
                </div>
              </div>
            )}
            {/* {admin === true
              ? ""
              : rooms.length > 0 && (
                <div className="menu-items">
                  <>
                    {" "}
                    {rooms.map((e, index) => {
                      return (
                        <span
                          key={index}
                          className={roomId === e._id ? "active" : ""}
                          onClick={() => {
                            setRoomId(e._id)
                            // getSessions(e._id)
                          }}
                        >
                          {e.name}
                        </span>
                      )
                    })}
                  </>
                </div>
              )} */}

            {token ? (
              <span onClick={() => {
                navigate("/")
                logout()
              }} className="logout">
                Logout
                {/* יציאה  */}
                <span className="ml-2">{getUserName()}</span>
              </span>
            ) : (
              <span className="logout" onClick={() => toggleLogin()}>
                {" "}Login
                {/* כניסה למערכת{" "} */}
              </span>
            )}
          </div>
          <div className="app-title">
            <Link to="/">
              Rummy Admin
              {/* <img src="/images/logo.jpeg" alt="Rummy Admin" height="auto" width="150" /> */}
            </Link>
          </div>
        </div>
      </div>
      <header className="navigation-wrapper" id="header-mobile">
        <div className="navigation-header">
          <div className="d-flex align-items-center">
            {getUserAccountType() === "admin" && (
              <span className="navigation-links">
                <button
                  aria-label="Toggle Mobile Menu Button"
                  className={`mobile-menu ${mobileNavOpen === true ? "open" : ""}`}
                  onClick={() => {
                    setMobileNavOpen(!mobileNavOpen)
                  }}
                >
                  <span className="bar-one" />
                  <span className="bar-two" />
                  <span className="bar-three" />
                </button>
              </span>
            )}
            <h1 className="m-0 navigation-names">
              <Link to="/" className="d-flex align-items-center">
                Rummy Admin
                {/* <img src="/images/logo.jpeg" alt="Rummy Admin" height="50%" width="50%" /> */}
              </Link>
            </h1>
          </div>
          {token ? (
            <div className="d-flex align-items-center"
              onClick={() => {
                navigate("/")
                logout()
              }}>
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                <path d="M24 22h-20v-7h2v5h16v-16h-16v5h-2v-7h20v20zm-13-11v-4l6 5-6 5v-4h-11v-2h11z" />
              </svg>
            </div>
          ) : (
            <div onClick={() => toggleLogin()} className="text-secondary app-fs-14 app-fw-600">
              Login
            </div>
          )}
        </div>
      </header>
      <nav aria-label="mobile navigation" className={`mobile-nav-wrapper ${mobileNavOpen === true ? "open" : ""}`}>
        {getUserAccountType() === "admin" && (
          <>
            {getUserAccountType() === "admin" && (<>
              <a href="/rooms" className="mobile-link">
                Rooms
                {/* ניהול כל החדרים */}
              </a>

              <a href="/users" className="mobile-link">
                Users
                {/* ניהול כל החדרים */}
              </a></>
            )}

            {/* {rooms.map((e, i) => {
              return (
                <span
                  className="mobile-link"
                  key={i}
                  onClick={() => {
                    setMobileNavOpen(false)
                    setRoomId(e._id)
                  }}
                >
                  {" "}
                  {e.name}
                </span>
              )
            })} */}
          </>
        )}
      </nav>
    </>
  )
}
