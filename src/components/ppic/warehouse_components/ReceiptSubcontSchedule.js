import React, { useState, useEffect, useMemo, } from "react";

import { useRequest } from "../../../hooks";

import { BaseTableExpanded } from "../../tables";
import { Group, Paper, TextInput } from "@mantine/core";
import { IconBarcode, IconCalendarEvent, IconRegex, IconTruckDelivery, IconUserCheck } from "@tabler/icons";


const ExpandedReceiptScheduleSubcont = ({ data }) => {

    return (
        <Paper p='xs' >
            <TextInput
                variant="filled"
                label='Product receipt from'
                icon={<IconUserCheck />}
                readOnly
                radius='md'
                m='xs'
                value={data.product_subcont.deliver_note_subcont.supplier.name}
            />

            <TextInput
                variant="filled"
                readOnly
                label='Product name'
                icon={<IconBarcode />}
                radius='md'
                m='xs'
                value={data.product_subcont.product.name}
            />

            <TextInput
                variant='filled'
                label='Product number'
                m='xs'
                radius='md'
                readOnly
                icon={<IconRegex />}
                value={data.product_subcont.product.code}
            />

            <Group grow m='xs' >

                <TextInput
                    label='Date'
                    variant='filled'
                    radius='md'
                    readOnly
                    icon={<IconCalendarEvent />}
                    value={new Date(data.date).toDateString()}
                />

                <TextInput
                    label='Quantity received'
                    variant='filled'
                    radius='md'
                    readOnly
                    icon={<IconTruckDelivery />}
                    value={data.quantity}
                />

            </Group>
        </Paper>
    )
}


const ReceiptSubcontSchedule = () => {

    const { Get } = useRequest()
    const [scheduleList, setScheduleList] = useState([])

    const columnReceiptScheduleSubcont = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product_subcont.product.name
        },
        {
            name: 'Product number',
            selector: row => row.product_subcont.product.code
        },
        {
            name: 'Date',
            selector: row => row.date
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,
        },
    ], [])


    useEffect(() => {
        const fetch = async () => {
            try {
                const schedules = await Get('receipt-subcont-schedule-list')
                setScheduleList(schedules)

            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [])


    return (
        <>

            <BaseTableExpanded
                data={scheduleList}
                column={columnReceiptScheduleSubcont}
                expandComponent={ExpandedReceiptScheduleSubcont}
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


export default ReceiptSubcontSchedule