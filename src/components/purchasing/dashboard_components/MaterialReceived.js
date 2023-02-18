import React, { useState, useEffect, useMemo } from "react";
import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";
import { NavigationDetailButton } from '../../custom_components'


const MaterialReceived = () => {

    const { Get } = useRequest()
    const [materialReceiptList, setMaterialReceiptList] = useState([])

    const columnMaterialReceipt = useMemo(() => [
        {
            name: 'Receipt number',
            selector: row => row.delivery_note_material.code,
            sortable: true
        },
        {
            name: 'Material',
            selector: row => row.material_order.material.name,
            sortable: true
        },
        {
            name: 'Receipt date',
            selector: row => row.delivery_note_material.date,
            sortable: true
        },
        {
            name: 'Quantity received',
            selector: row => `${row.quantity} ${row.material_order.material.uom.name} `
        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/purchasing/shipments-and-receipts/material/${row.delivery_note_material.id}#materials`}
            />
        },
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
                noData='No material receipt'
            />

        </>
    )
}

export default MaterialReceived