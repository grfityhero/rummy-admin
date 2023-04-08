import "react-datepicker/dist/react-datepicker.css"
import { useEffect, useState } from "react"
import Header from "../components/Header"
import { getPercentageActions, updatePerAction } from "../actions/authActon"
import Loading from "../components/Loading"

export default function Settings() {
    const [percentage, setPercentage] = useState(0)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        getPercentage()
    }, [])

    const getPercentage = () => {
        setLoading(true)
        getPercentageActions(({ data, error }) => {
            setLoading(false)
            if (error) {
                setError(error)
            } else {
                setPercentage(data.percentage)
            }
        })
    }

    const update = () => {
        if (!percentage) {
            setError("Required")
            return
        } else if (percentage <= 0 || percentage >= 100) {
            setError("Percentage should be 1 to 99")
            return
        }
        setError("")
        setSending(true)
        updatePerAction({ percentage }, ({ error }) => {
            if (!error) {
                setError('');
                setSending(false);
                setSuccess('Updated Successfully');
                setTimeout(() => {
                    setSuccess("")
                    setError("")
                }, 1000);
            } else {
                setSending(false);
                setError(error);
            }
        });
    }

    return (
        <>
            <Header />

            <div id="hero">
                <div className="placeholder" />
                <div className="custome-container" id="room">
                    {loading ? <Loading /> : <div className="time-table d-flex  justify-content-center" >
                        <div className="row justify-content-center" style={{ direction: "ltr" }}>
                            <div className="col-lg-6  col-12 p-0">
                                <div className="form-group mt-3">
                                    <label className="input">
                                        <span className="input__label">Percentage
                                            {/* תאור */}
                                        </span>
                                        <input className="input__field"
                                            type="number"
                                            placeholder="Standby Time"//"תאור"
                                            value={percentage}
                                            onChange={(e) => {
                                                setPercentage(e.target.value || 0)
                                                setError("")
                                            }}
                                        />

                                    </label>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 p-0">
                                        {error && <div className="app-fs-14 text-left mb-8 error-data py-2 rounded">{error}</div>}
                                        {success && <div className="app-fs-14 text-left mb-8 success-data py-2 rounded">{success}</div>}
                                    </div>
                                    <div className="col-lg-12 p-0 text-center">
                                        <button className="btn-primary mt-3 mb-2 py-2 w-100"
                                            disabled={sending}
                                            type="button"
                                            onClick={() => { update() }}>{sending ? "submitting" : "submit"}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </>
    )
}
