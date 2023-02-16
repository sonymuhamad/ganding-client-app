import React, { useState, useEffect, useMemo } from "react";

import { BaseTable } from "../../tables";
import { useRequest, useSearch } from "../../../hooks"
import { SearchTextInput, HeadSection, NavigationDetailButton } from "../../custom_components";


const DeliveryNoteList = () => {
    const [deliveryNotes, setDeliveryNotes] = useState([])
    const { GetAndExpiredTokenHandler } = useRequest()
    const { lowerCaseQuery, query, setValueQuery } = useSearch()

    const filteredDeliveryNotes = useMemo(() => {

        return deliveryNotes.filter((dn) => {
            const { customer, date, code } = dn
            const { name } = customer

            return name.toLowerCase().includes(lowerCaseQuery) || date.includes(lowerCaseQuery) || code.includes(lowerCaseQuery)
        })

    }, [deliveryNotes, lowerCaseQuery])


    const columnDeliveryNote = useMemo(() => [
        // columns for delivery notes
        {
            name: 'Customer',
            selector: row => row.customer.name
        },
        {
            name: 'Code',
            selector: row => row.code,
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Product dikirim',
            selector: row => `${row.productdelivercustomer_set.length} product`,
            sortable: true
        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/marketing/delivery-note/${row.id}`}
            />,
            style: {
                padding: 0,
            }
        }

    ], [])

    useEffect(() => {
        const fetch = async () => {
            try {
                const deliveryNotes = await GetAndExpiredTokenHandler('delivery-notes')
                setDeliveryNotes(deliveryNotes)

            } catch (e) {
                console.log(e)
            }
        }
        fetch()
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
                column={columnDeliveryNote}
                data={filteredDeliveryNotes}
                noData="No data delivery"
            />

        </>
    )
}

export default DeliveryNoteList