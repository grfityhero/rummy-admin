import React, { useState, useEffect } from "react"
import { getReportsActions } from "../actions/sessionAction"
import { Link } from "react-router-dom"
import Box from "@mui/material/Box"
import { createTheme, ThemeProvider } from "@mui/material/styles"
// import { DataGridPro as DataGrid, GridToolbar, enUS, useGridApiRef } from '@mui/x-data-grid-pro';
// import { LicenseInfo } from "@mui/x-license-pro"
import { fDateTime4 } from "../components/constant"
// import { DataGridPro as DataGrid, GridToolbar, useGridApiRef, enUS, heIL, gridVisibleSortedRowEntriesSelector } from "@mui/x-data-grid-pro"
import Loading from "../components/Loading"

// LicenseInfo.setLicenseKey("61628ce74db2c1b62783a6d438593bc5Tz1NVUktRG9jLEU9MTY4MzQ0NzgyMTI4NCxTPXByZW1pdW0sTE09c3Vic2NyaXB0aW9uLEtWPTI=")

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
      secondary: { main: "#f50057" },
      error: { main: "#f44336" },
      warning: { main: "#ff9800" },
      info: { main: "#0F4360" },
      blueLight: { main: "#447FA1" },
    },
  },
  // enUS
  // hiIN
  // heIL
)

function reports() {
  const [rows, settRows] = useState([])
  const [cols, setCols] = useState([])
  const apiRef = useGridApiRef()
  const [selectionModel, setSelectionModel] = useState([])
  const [toggleSelectedAll, setToggleSelectedAll] = useState(true)
  const [filtered, setFiltered] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (apiRef.current && apiRef.current.state) {
      let filteredFx = gridVisibleSortedRowEntriesSelector(apiRef.current.state)
      setSelectionModel((ar) => [...filteredFx.map((row) => row.id)])
    }
    return () => { }
  }, [filtered])

  useEffect(() => {
    setSelectionModel((ar) => [...rows.map((row) => row.id)])
    return () => { }
  }, [rows])

  //users
  useEffect(() => {
    setCols([])
    let tmpCols = [
      {
        field: "name",
        headerName: "שם",
        width: 150,
        sortable: true,
        filterable: true,
      },
      {
        field: "email",
        headerName: "מייל",
        width: 280,
        sortable: true,
        filterable: true,
      },
      {
        field: "time",
        headerName: "בשעה",
        width: 50,
        sortable: true,
        filterable: true,
      },
      {
        headerName: "תאריך",
        width: 150,
        sortable: true,
        filterable: true,
        field: "date",
        renderCell: (params) => fDateTime4(params.value),
        type: "date",
      },
      {
        field: "room",
        headerName: "חדר",
        sortable: true,
        filterable: true,
      }, {
        field: "type",
        headerName: "Type",
        sortable: true,
        filterable: true,
      },
      {
        field: "status",
        headerName: "סטטוס",
        sortable: true,
        filterable: true,
      },
      {
        field: "duration",
        headerName: "אורך הסשן",
        sortable: true,
        filterable: true,
        type: "number"
      },
    ]
    setCols(tmpCols)
  }, [])

  //rooms
  useEffect(() => {
    console.log(":>>>")
    getSessions(0)
  }, [])

  const getSessions = (page) => {
    console.log(page)

    getReportsActions(
      2000,
      page * 2000,
      ({ data, error }) => {
        if (error) {
          // setError(error);
        } else {
          const list = data.sort((a, b) => a.h * 60 + a.m - (b.h * 60 + b.m))
          let tmpRows = []
          list?.forEach((e, i) => {
            tmpRows.push({
              ...e, ...e.user, date: new Date(e.date), room: e.room.name,
              type: !e.subscriptionId ? "Regular" : "Subscription",
              time: `${e.h}:${e.m}`, id: ((page * 2000) + i)
            })
          })

          settRows((arr) => [...arr, ...tmpRows])

          if (list.length === 2000) {
            getSessions(page + 1)
          } else {
            setLoading(false)
          }
        }
      }
    )
  }

  let subTotal = 0
  let regTotal = 0

  const list = rows.filter((e) => selectionModel.filter((s) => s === e.id).length > 0)
  if (!loading) {
    list.forEach((e) => {
      if (!e.subscriptionId) {
        regTotal = regTotal + e.duration
      } else {
        subTotal = subTotal + e.duration
      }
    })

    regTotal = `${parseInt(regTotal / 60)}:${regTotal % 60}`
    subTotal = `${parseInt(subTotal / 60)}:${subTotal % 60}`
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="right-to-left container">
          <Link to="/" className="text-decoration-underline">
            <h3>ראשי </h3>
          </Link>
          <h1>דוחות</h1>
          <Box sx={{ height: 700, width: "100%", marginTop: 5 }}>
            <div
              style={{
                position: "relative",
                left: "2%",
                textAlign: "left",
                top: "5%",
              }}
              className="app-fs-20 app-fw-500"
            >
              סה"כ: {regTotal + " -- " + subTotal} שעות
            </div>

            {loading ? <Loading /> : <div style={{ height: 700, width: "100%" }}>
              {/* <DataGrid
                apiRef={apiRef}
                onFilterModelChange={(params) => {
                  setFiltered(!filtered)
                }}
                components={{
                  Toolbar: GridToolbar,
                }}
                checkboxSelection={false}
                disableSelectionOnClick
                onSelectionModelChange={(newSelectionModel) => {
                  toggleSelectedAll ? setSelectionModel((arr) => [...rows]) : setSelectionModel([])
                  setToggleSelectedAll(!toggleSelectedAll)
                }}
                rowsPerPageOptions={[20, 50, 100, 200]}
                pagination
                selectionModel={selectionModel}
                rows={rows}
                columns={cols}
                loading={loading}
              /> */}
            </div>
            }
          </Box>
        </div>
      </ThemeProvider>
    </>
  )
}

export default reports
