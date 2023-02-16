import { useEffect, useState } from "react"
import { getRoomActions } from "../actions/roomAction"
import { getUsersActions } from "../actions/userAction"
import Header from "../components/Header"
import Loading from "../components/Loading"
import { DataGridPro as DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid-pro"
import { isMobile } from "react-device-detect"

export default function AllReports() {
  const apiRef = useGridApiRef()
  const [reports, setReports] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])

  useEffect(() => {
    getReports()
    getUsers()
  }, [])

  const getReports = () => {
    getRoomActions(({ data, error }) => {
      setLoading(false)
      if (error) {
        setError(error)
      } else {
        setReports(data)
      }
    })
  }
  const getUsers = () => {
    getUsersActions(({ data, error }) => {
      if (error) {
        setError(error)
      } else {
        data.sort((a, b) => a.userName.localeCompare(b.userName))
        setUsers(data)
      }
    })
  }

  const rows = reports.map((e) => ({
    ...e, id: e._id,
  }))
  console.log(rows)
  let columns = [
    {
      field: "code",
      headerName: "Code",
      sortable: true,
      flex: 1,
      mFlex: 11,
      filterable: true,
    },
    {
      field: "roomCost",
      headerName: "Room Cost",
      sortable: true,
      flex: 1,
      mFlex: 11,
      filterable: true,
    },
    {
      field: "playersNum",
      headerName: "Players NUm",
      sortable: false,
      flex: 1,
      mFlex: 11,
      filterable: true,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      flex: 1,
      mFlex: 11,
      filterable: true,
    },
    {
      field: "type",
      headerName: "Type",
      sortable: true,
      flex: 1,
      mFlex: 11,
      filterable: true,
    },
    {
      field: "players",
      headerName: "Players",
      sortable: false,
      flex: 1,
      mFlex: 15,
    },
    {
      field: "winner",
      headerName: "Winner",
      sortable: true,
      flex: 1,
      mFlex: 11,
      filterable: true,
    },
  ]

  if (isMobile) {
    columns = columns.map(e => {
      if (e.mFlex) {
        e.flex = e.mFlex
      }
      return e
    })
  }
  return (
    <>
      <Header />
      <div className="placeholder"></div>
      <section id="room">
        <div className="custome-container">
          <div className="text-right add-btn">
            <div className="section-title">
              Reports
              {/* ניהול חדרים */}
            </div>
            {/* <div className="d-flex form-group align-items-center users" style={{ gap: 8 }}>
              <span>
                <select className="text-capitalize">
                  <option value="">Select Status</option>
                  {STATUS.map((e, i) => {
                    return (<option className="text-capitalize" value={e} key={i}>
                      {e}
                    </option>
                    )
                  })}
                </select>
              </span>
              <span>
                <select disabled={!users || users.length === 0} className="text-capitalize">
                  <option value="">Select User</option>
                  {users.map((e, i) => {
                    return (<option className="text-capitalize" value={e} key={i}>
                      {e.userName}
                    </option>
                    )
                  })}
                </select>
              </span>
            </div> */}
          </div>
          {loading ? (
            <Loading />
          ) : (room && room.length === 0) || error ? (
            <div className="text-center my-6">{error || "No Data"}</div>
          ) : (<div style={{ height: 700, width: "100%" }}>
            <DataGrid
              apiRef={apiRef}
              onFilterModelChange={(params) => {
                // setFiltered(!filtered)
              }}
              components={{
                Toolbar: GridToolbar,
              }}
              checkboxSelection={false}
              disableSelectionOnClick
              rowsPerPageOptions={[20, 50, 100, 200]}
              pagination
              rows={rows}
              columns={columns}
              loading={loading}
            />
          </div>
          )}
        </div>
      </section>
    </>
  )
}
