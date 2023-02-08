import * as React from 'react';
import { DataGridPro as DataGrid, GridToolbar, useGridApiRef, gridVisibleSortedRowEntriesSelector } from '@mui/x-data-grid-pro';
// import { useDemoData } from '@mui/x-data-grid-generator';
import { useEffect } from 'react';


export default function Testgrid() {

    const apiRef = useGridApiRef();
    const { data } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 100,
        maxColumns: 4,
    });


    const [selectionModel, setSelectionModel] = React.useState([]);
    const [toggleSelectedAll, setToggleSelectedAll] = React.useState(true);
    const [filtered, setFiltered] = React.useState(false);



    useEffect(() => {
        let filteredFx = gridVisibleSortedRowEntriesSelector(apiRef.current.state)
        setSelectionModel(filteredFx.map((row) => row.id));
        return () => {

        }
    }, [filtered])


    useEffect(() => {
        setSelectionModel([...data.rows])
        return () => {
        }
    }, [data])


    return (
        <div style={{ height: 700, width: '100%' }}>

        </div>
    );
}