import React, { useState, useEffect, useMemo } from "react"
import { useRequest, useSearch } from "../../../hooks";

import { BaseTable } from "../../tables";
import { NavigationDetailButton, HeadSection, SearchTextInput } from "../../custom_components";


const MaterialReceiptNoteList = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
    const [receiptNoteList, setReceiptNoteList] = useState([])
    const { lowerCaseQuery, query, setValueQuery } = useSearch()

    const filteredReceiptNoteList = useMemo(() => {

        return receiptNoteList.filter(receiptNote => {
            const { code, date, supplier } = receiptNote
            const { name } = supplier

            return code.toLowerCase().includes(lowerCaseQuery) || date.toLowerCase().includes(lowerCaseQuery) || name.toLowerCase().includes(lowerCaseQuery)
        })

    }, [lowerCaseQuery, receiptNoteList])

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
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/purchasing/shipments-and-receipts/material/${row.id}`}
            />
        }
    ], [])

    useEffect(() => {

        GetAndExpiredTokenHandler('delivery-note-material').then(data => {
            setReceiptNoteList(data)
        })

    }, [])


    return (
        <>

            <HeadSection>
                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />
            </HeadSection>

            <BaseTable
                column={columnReceiptNoteMaterial}
                data={filteredReceiptNoteList}
                noData='there is no material receipt data'
            />

        </>
    )

}

export default MaterialReceiptNoteList
