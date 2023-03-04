import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";

const MaterialOrderList = () => {

    const { Get } = useRequest()
    const [materialOrderList, setMaterialOrderList] = useState([])

    const columnMaterialOrder = useMemo(() => [
        {
            name: 'Material',
            selector: row => row.material.name
        },
        {
            name: 'Specification',
            selector: row => row.material.spec
        },
        {
            name: 'Order date',
            selector: row => row.purchase_order_material.date,
            sortable: true
        },
        {
            name: 'Order',
            selector: row => `${row.ordered} ${row.material.uom.name}`
        },
        {
            name: 'Received',
            selector: row => `${row.arrived} ${row.material.uom.name}`
        },
        {
            name: 'Upcomings',
            selector: row => row.ordered > row.arrived ? `${row.ordered - row.arrived} ${row.material.uom.name}` : 0
        }
    ], [])

    useEffect(() => {

        Get('order/material-incomplete').then(data => {
            setMaterialOrderList(data)
        })

    }, [])

    return (
        <>

            <BaseTable
                column={columnMaterialOrder}
                data={materialOrderList}
                noData='No upcoming materials'
            />

        </>
    )
}

export default MaterialOrderList

