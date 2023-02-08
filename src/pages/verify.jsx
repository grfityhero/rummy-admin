import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verifyEmailAction } from "../actions/authActon";
import Header from "../components/Header";
import Loading from "../components/Loading";

export default function Verify() {
    const params = useParams()
    const token = params.id
    const [sending, setSending] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState(false);
    const [loginUser, setLoginUser] = useState(false)
    const [registerUser, setRegisterUser] = useState(false)
    const [forgetPass, setForgetPass] = useState(false)

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
            verify()
        }
    }, [token])

    const verify = () => {
        setLoading(true);
        setSuccess(false)
        setMessage(false)
        setError("")
        verifyEmailAction({ token }, ({ data, error }) => {
            if (!error) {
                setLoading(false)
                setSuccess("/")
                setSending(false)
                setError("")
                setMessage("Account confirmed successfully.")
                setTimeout(() => {
                    toggleLogin()
                }, 5000);
            } else {
                setLoading(false)
                setMessage(error)
            }
        })
    }
    return (<>
        <Header admin={true}
            loginUser={loginUser}
            registerUser={registerUser}
            setRegisterUser={registerUser}
            forgetPass={forgetPass}
            setLoginUser={setLoginUser}
            setForgetPass={setForgetPass}
            toggleLogin={toggleLogin}
            toggleRegister={toggleRegister}
            toggleForgetPass={toggleForgetPass}
        />
        <div className="placeholder"></div>
        <section id="email-verify">
            {loading ? <Loading /> : <div className="container">
                <div>
                    <div className="app-card">
                        <div className="row align-items-center">
                            <div className="col-lg-12" >
                                <div className="lk-subheading">
                                    <h2 className="text-center text-capitalize">{message}</h2>
                                    {message === "Account confirmed successfully." && <div className="login text-center"
                                        onClick={() => { toggleLogin() }}>
                                        <p to="/" className="fs-18 cursor-pointer">
                                            Login
                                        </p>
                                    </div>}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>}
        </section >
    </>
    )
}