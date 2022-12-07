import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";
import { Button } from "@mantine/core";
import { IconDotsCircleHorizontal } from "@tabler/icons";


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
            selector: row => row.detailButton
        },
    ], [])

    useEffect(() => {
        Get('material-receipt-list').then(data => {

            setMaterialReceiptList(data.map(dt => ({
                ...dt, detailButton: <Button
                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.8'
                    variant='subtle'
                    radius='md'
                    component={Link}
                    to={`/home/purchasing/shipments-and-receipts/material/${dt.delivery_note_material.id}#materials`}
                >
                    Detail
                </Button>
            })))

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