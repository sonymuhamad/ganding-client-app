import React, { useMemo, useEffect, useState } from "react";

import { useRequest, useSearch } from "../../../hooks";
import { BaseTable } from "../../tables"
import { NavigationDetailButton, HeadSection, SearchTextInput } from "../../custom_components";


const DeliveryNoteSubcontList = () => {

    const { Get } = useRequest()
    const [deliveryNoteSubcontList, setDeliveryNoteSubcontList] = useState([])
    const { query, lowerCaseQuery, setValueQuery } = useSearch()

    const filteredDeliveryNoteSubcont = useMemo(() => {

        return deliveryNoteSubcontList.filter(dn => {
            const { code, supplier, date } = dn
            const { name } = supplier
            return code.toLowerCase().includes(lowerCaseQuery) || name.toLocaleLowerCase().includes(lowerCaseQuery) || date.toLocaleLowerCase().includes(lowerCaseQuery)
        })

    }, [lowerCaseQuery, deliveryNoteSubcontList])

    const columnDeliveryNoteSubcont = useMemo(() => [
        {
            name: 'Supplier',
            selector: row => row.supplier.name,
            sortable: true
        },
        {
            name: 'Delivery number',
            selector: row => row.code
        },
        {
            name: 'Delivery date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Total product sent',
            selector: row => row.productdeliversubcont_set.length,
        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/purchasing/shipments-and-receipts/shipment-subcont/${row.id}`}
            />
        }
    ], [])

    useEffect(() => {

        Get('delivery-note-subcont').then(data => {
            setDeliveryNoteSubcontList(data)
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
                column={columnDeliveryNoteSubcont}
                data={filteredDeliveryNoteSubcont}
                noData='There is no data delivery product subconstruction'
            />

        </>
    )
}

export default DeliveryNoteSubcontList