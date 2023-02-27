import React, { useState, useEffect, useMemo } from "react";
import { useRequest } from "../../../hooks";

import { BaseTable } from "../../tables";
import { Group, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";


const DeliverySchedule = () => {

    const { Get } = useRequest()

    const [deliverySchedule, setDeliverySchedule] = useState([])
    const [searchSchedule, setSearchSchedule] = useState('')

    const filteredDeliverySchedule = useMemo(() => {

        return deliverySchedule.filter(schedule => schedule.date.toLowerCase().includes(searchSchedule.toLowerCase()) ||
            schedule.product_order.product.name.toLowerCase().includes(searchSchedule.toLowerCase()) ||
            schedule.product_order.sales_order.customer.name.toLowerCase().includes(searchSchedule.toLowerCase()) ||
            schedule.product_order.sales_order.code.toLowerCase().includes(searchSchedule.toLowerCase()))

    }, [deliverySchedule, searchSchedule])

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
            selector: row => new Date(row.date).toDateString()
        },
        {
            name: 'Delivery quantity',
            selector: row => row.quantity
        },

    ], [])

    useEffect(() => {
        Get('delivery-schedule').then(data => {
            setDeliverySchedule(data)
        })

    }, [])

    return (
        <>

            <Group position="right" m='xs' >
                <TextInput
                    icon={<IconSearch />}
                    placeholder='Search schedule'
                    value={searchSchedule}
                    onChange={e => setSearchSchedule(e.target.value)}
                    radius='md'
                />
            </Group>

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
