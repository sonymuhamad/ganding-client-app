import { Textarea } from "@mantine/core";
import { IconClipboard } from "@tabler/icons";
import React, { useState, useEffect, useMemo } from "react";


import { useRequest } from "../../../hooks";
import { BaseTable, BaseTableExpanded } from "../../tables";
import { Badge } from "@mantine/core";
import { getScheduleState } from "../../../services";


const ExpandedReceiptNote = ({ data }) => {

    const { note, materialreceipt_set } = data
    const columnMaterialReceipt = useMemo(() => [
        {
            name: 'Material',
            selector: row => row.material_order.material.name
        },
        {
            name: 'Quantity',
            selector: row => row.quantity
        },
        {
            name: '',
            selector: row => {
                const { delivery_note_material, schedules } = row
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


    return (
        <>

            <Textarea
                label='Description'
                radius='md'
                m='sm'
                variant='filled'
                icon={<IconClipboard />}
                readOnly
                value={note}
            />


            <BaseTable
                column={columnMaterialReceipt}
                data={materialreceipt_set}
                noData="No material received"
                pagination={false}
            />


        </>
    )
}




const ReceiptNoteList = () => {

    const { Get } = useRequest()
    const [receiptNoteList, setReceiptNoteList] = useState([])

    const columnReceiptNote = useMemo(() => [
        {
            name: 'Supplier',
            selector: row => row.supplier.name
        },
        {
            name: 'Receipt number',
            selector: row => row.code
        },
        {
            name: 'Receipt date',
            selector: row => row.date,
            sortable: true
        },
    ], [])

    useEffect(() => {

        Get('report-receipt-material').then(data => {
            setReceiptNoteList(data)
        })

    }, [])


    return (
        <BaseTableExpanded
            column={columnReceiptNote}
            data={receiptNoteList}
            expandComponent={ExpandedReceiptNote}
            noData="There is no receipts this week"
        />
    )
}

export default ReceiptNoteList

