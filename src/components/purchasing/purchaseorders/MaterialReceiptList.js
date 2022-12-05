import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";

const MaterialReceiptList = ({ purchaseOrderId }) => {

    const { RetrieveWithoutExpiredTokenHandler } = useRequest()
    const [materialReceiptList, setMaterialReceiptList] = useState([])

    const columnMaterialReceipt = useMemo(() => [
        {
            name: 'Material',
            selector: row => row.material_order.material.name,
            sortable: true,
        },
        {
            name: 'Receipt number',
            selector: row => row.delivery_note_material.code,
            sortable: true,
            style: {
                justifyContent: 'flex-start'
            }
        },
        {
            name: 'Date',
            selector: row => new Date(row.delivery_note_material.date).toDateString(),
        },
        {
            name: 'Quantity received',
            selector: row => `${row.quantity} ${row.material_order.material.uom.name}`
        }
    ], [])

    useEffect(() => {

        RetrieveWithoutExpiredTokenHandler(purchaseOrderId, 'material-receipt-list').then(data => {
            setMaterialReceiptList(data)
        })

    }, [])

    return (
        <>

            <BaseTable
                column={columnMaterialReceipt}
                data={materialReceiptList}
                noData="No material receipt"
            />

        </>
    )
}

export default MaterialReceiptList


