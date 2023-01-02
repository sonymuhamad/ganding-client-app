import React, { useMemo, useState } from "react";

import { BaseTableExpanded } from "../../../tables";
import { ExpandedDescriptionDelivery } from "../../../layout";
import { Badge, Group, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";

const ReportDelivery = ({ data }) => {

    const [query, setQuery] = useState('')

    const columnProductDelivery = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product_order.product.name,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Product number',
            selector: row => row.product_order.product.code,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Delivery number',
            selector: row => row.delivery_note_customer.code,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Delivery date',
            selector: row => row.delivery_note_customer.date,
            sortable: true,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Quantity shipped',
            selector: row => `${row.quantity} Unit`,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: '',
            selector: row => <Badge color={row.schedules ? row.delivery_note_customer.date > row.schedules.date ? 'red.6' : 'blue.6' : 'blue.6'} variant='filled' >{row.schedules ? row.delivery_note_customer.date > row.schedules.date ? 'Late' : 'On time' : 'Unscheduled'}</Badge>,
            style: {
                paddingLeft: 0,
                marginLeft: -30,
                marginRight: 0,
                justifyContent: 'center'
            }

        }
    ], [])


    const filteredProductDelivery = useMemo(() => {

        return data.filter(pdeliver => pdeliver.product_order.product.name.toLowerCase().includes(query.toLowerCase()) || pdeliver.product_order.product.code.toLowerCase().includes(query.toLowerCase()) || pdeliver.delivery_note_customer.code.toLowerCase().includes(query.toLowerCase()) || pdeliver.delivery_note_customer.date.toLowerCase().includes(query.toLowerCase()))

    }, [query, data])

    return (
        <>


            <Group
                m='xs'
                position="right"
            >

                <TextInput
                    placeholder="Search"
                    icon={<IconSearch />}
                    radius='md'
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />

            </Group>

            <BaseTableExpanded
                noData="No data delivery product"
                data={filteredProductDelivery}
                column={columnProductDelivery}
                expandComponent={ExpandedDescriptionDelivery}
            />
        </>
    )
}

export default ReportDelivery
