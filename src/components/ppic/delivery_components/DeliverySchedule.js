import React, { useState, useEffect, useMemo } from "react";
import { useRequest, useSearch } from "../../../hooks";

import { BaseTable } from "../../tables";
import { HeadSection, SearchTextInput } from "../../custom_components";


const DeliverySchedule = () => {

    const { Get } = useRequest()
    const [deliverySchedule, setDeliverySchedule] = useState([])
    const { query, lowerCaseQuery, setValueQuery } = useSearch()

    const filteredDeliverySchedule = useMemo(() => {

        return deliverySchedule.filter(schedule => {
            const { date, product_order } = schedule
            const { sales_order, product } = product_order
            const { name } = product
            const { code, customer } = sales_order

            return date.toLowerCase().includes(lowerCaseQuery) || name.toLowerCase().includes(lowerCaseQuery) || customer.name.toLowerCase().includes(lowerCaseQuery) || code.toLowerCase().includes(lowerCaseQuery)

        })

    }, [deliverySchedule, lowerCaseQuery])

    const columnDeliverySchedule = useMemo(() => [
        {
            name: 'Customer',
            selector: row => row.product_order.product.customer.name
        },
        {
            name: 'So number',
            selector: row => row.product_order.sales_order.code
        },
        {
            name: 'Product',
            selector: row => row.product_order.product.name
        },

        {
            name: 'Date',
            selector: row => row.date
        },
        {
            name: 'Delivery quantity',
            selector: row => row.quantity
        },

    ], [])

    useEffect(() => {
        Get('schedules/product-incomplete').then(data => {
            setDeliverySchedule(data)
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

                data={filteredDeliverySchedule}
                column={columnDeliverySchedule}


                conditionalRowStyle={
                    [
                        {
                            when: row => new Date() > new Date(row.date),
                            style: {
                                backgroundColor: '#ffc9c9',
                                color: 'white',
                            },
                        },
                        {
                            when: row => Math.ceil((new Date(row.date) - new Date()) / (1000 * 3600 * 24)) <= 7 && Math.ceil((new Date(row.date) - new Date()) / (1000 * 3600 * 24)) > 0,
                            style: {
                                backgroundColor: '#fff3bf',
                                color: 'white',
                            },
                        }
                    ]
                }
            />

        </>
    )
}

export default DeliverySchedule
