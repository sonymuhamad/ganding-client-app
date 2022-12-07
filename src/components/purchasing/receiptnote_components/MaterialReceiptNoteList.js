import React, { useState, useEffect, useMemo } from "react";
import { IconDotsCircleHorizontal, IconSearch } from "@tabler/icons";
import { useRequest } from "../../../hooks";
import { Link } from "react-router-dom";

import { BaseTable } from "../../tables";
import { Group, TextInput, Button } from "@mantine/core";

const MaterialReceiptNoteList = () => {

    const { GetAndExpiredTokenHandler, Loading } = useRequest()
    const [receiptNoteList, setReceiptNoteList] = useState([])
    const [query, setQuery] = useState('')

    const filteredReceiptNoteList = useMemo(() => {

        return receiptNoteList.filter(receiptNote => receiptNote.code.toLowerCase().includes(query.toLocaleLowerCase()) || receiptNote.date.toLowerCase().includes(query.toLocaleLowerCase()) || receiptNote.supplier.name.toLowerCase().includes(query.toLowerCase()))

    }, [query, receiptNoteList])

    const columnReceiptNoteMaterial = useMemo(() => [
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
            name: 'Total material received',
            selector: row => row.materialreceipt_set.length,
        },
        {
            name: '',
            selector: row => row.detailButton
        }
    ], [])

    useEffect(() => {

        GetAndExpiredTokenHandler('delivery-note-material').then(data => {
            setReceiptNoteList(data.map(dt => ({
                ...dt, detailButton: <Button
                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.8'
                    variant='subtle'
                    radius='md'
                    component={Link}
                    to={`/home/purchasing/shipments-and-receipts/material/${dt.id}`}
                >
                    Detail
                </Button>
            })))
        })

    }, [])


    return (
        <>

            <Loading />

            <Group m='xs' position="right" >

                <TextInput
                    placeholder="Search material receipt note"
                    value={query}
                    icon={<IconSearch />}
                    radius='md'
                    onChange={e => setQuery(e.target.value)}
                />

            </Group>

            <BaseTable
                column={columnReceiptNoteMaterial}
                data={filteredReceiptNoteList}
                noData='there is no material receipt data'
            />

        </>
    )

}

export default MaterialReceiptNoteList
