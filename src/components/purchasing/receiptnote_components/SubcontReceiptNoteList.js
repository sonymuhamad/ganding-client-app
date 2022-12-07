import React, { useMemo, useEffect, useState } from "react";

import { useRequest } from "../../../hooks";
import { Button, TextInput, Group } from "@mantine/core";
import { BaseTable } from "../../tables";
import { Link } from "react-router-dom";
import { IconSearch, IconDotsCircleHorizontal } from "@tabler/icons";


const SubcontReceiptNoteList = () => {

    const { Get } = useRequest()
    const [receiptNoteList, setReceiptNoteList] = useState([])
    const [query, setQuery] = useState('')

    const filteredReceiptNoteList = useMemo(() => {

        return receiptNoteList.filter(note => note.code.toLowerCase().includes(query.toLowerCase()) || note.supplier.name.toLowerCase().includes(query.toLowerCase()) || note.date.toLowerCase().includes(query.toLowerCase()))

    }, [query, receiptNoteList])

    const columnReceiptNoteSubcont = useMemo(() => [
        {
            name: 'Supplier',
            selector: row => row.supplier.name,
            sortable: true
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
        {
            name: 'Total product received',
            selector: row => row.subcontreceipt_set.length,
            sortable: true
        },
        {
            name: '',
            selector: row => row.detailButton
        }
    ], [])

    useEffect(() => {

        Get('receipt-note-subcont').then(data => {
            setReceiptNoteList(data.map(dt => ({
                ...dt, detailButton: <Button
                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.8'
                    variant='subtle'
                    radius='md'
                    component={Link}
                    to={`/home/purchasing/shipments-and-receipts/receipt-subcont/${dt.id}`}
                >
                    Detail
                </Button>
            })))
        })

    }, [])


    return (
        <>

            <Group
                m='xs'
                position="right"
            >

                <TextInput
                    placeholder="Search receipt note"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    icon={<IconSearch />}
                    radius='md'
                />

            </Group>

            <BaseTable
                column={columnReceiptNoteSubcont}
                data={filteredReceiptNoteList}
                noData='There is no data receipt note product subconstruction'
            />

        </>
    )
}

export default SubcontReceiptNoteList

