import React, { useMemo, useEffect, useState } from "react";

import { useRequest, useSearch } from "../../../hooks";
import { BaseTable } from "../../tables";
import { NavigationDetailButton, HeadSection, SearchTextInput } from "../../custom_components";


const SubcontReceiptNoteList = () => {

    const { Get } = useRequest()
    const [receiptNoteList, setReceiptNoteList] = useState([])
    const { query, lowerCaseQuery, setValueQuery } = useSearch()

    const filteredReceiptNoteList = useMemo(() => {

        return receiptNoteList.filter(note => {
            const { code, supplier, date } = note
            const { name } = supplier

            return code.toLowerCase().includes(lowerCaseQuery) || name.toLowerCase().includes(lowerCaseQuery) || date.toLowerCase().includes(lowerCaseQuery)
        })

    }, [lowerCaseQuery, receiptNoteList])

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
            selector: row => <NavigationDetailButton
                url={`/home/purchasing/shipments-and-receipts/receipt-subcont/${row.id}`}
            />
        }
    ], [])

    useEffect(() => {

        Get('receipt-note-subcont').then(data => {
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
                column={columnReceiptNoteSubcont}
                data={filteredReceiptNoteList}
                noData='There is no data receipt note product subconstruction'
            />

        </>
    )
}

export default SubcontReceiptNoteList

