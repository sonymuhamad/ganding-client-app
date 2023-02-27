import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";
import { Badge } from "@mantine/core";
import { getScheduleState } from "../../../services";

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
            name: 'Diterima',
            selector: row => `${row.quantity} ${row.material_order.material.uom.name}`
        },
        {
            name: '',
            selector: row => {
                const { schedules, delivery_note_material } = row
                const { date } = delivery_note_material
                const { color, label } = getScheduleState(schedules, date)

                return (
                    <Badge color={color} variant='filled' >
                        {label}
                    </Badge>
                )
            }
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

