import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";
import { Badge } from "@mantine/core";


const MaterialReceiptList = () => {

    const { Get } = useRequest()
    const [materialReceiptList, setMaterialReceiptList] = useState([])

    const columnMaterialReceipt = useMemo(() => [
        {
            name: 'Material',
            selector: row => row.material_order.material.name
        },
        {
            name: 'Specification',
            selector: row => row.material_order.material.spec
        },
        {
            name: 'Receipt date',
            selector: row => row.delivery_note_material.date,
            sortable: true
        },
        {
            name: 'Quantity received',
            selector: row => `${row.quantity} ${row.material_order.material.uom.name}`
        },
        {
            name: '',
            selector: row => <Badge color={row.schedules ? row.delivery_note_material.date > row.schedules.date ? 'red.6' : 'blue.6' : 'blue.6'} variant='filled' >{row.schedules ? row.delivery_note_material.date > row.schedules.date ? 'Late' : 'On time' : 'Unscheduled'}</Badge>
        }
    ], [])

    useEffect(() => {

        Get('material-receipt-list').then(data => {
            setMaterialReceiptList(data)
        })

    }, [])

    return (
        <>

            <BaseTable
                column={columnMaterialReceipt}
                data={materialReceiptList}
                noData="No material receipt data"
            />

        </>
    )
}

export default MaterialReceiptList

