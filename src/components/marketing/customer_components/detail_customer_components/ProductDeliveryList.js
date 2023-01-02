import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../../hooks";
import { useParams } from "react-router-dom";
import { BaseTableExpanded } from "../../../tables";
import { ExpandedDescriptionDelivery } from "../../../layout";

import { Badge, Group, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";




const ProductDeliverList = () => {

    const { customerId } = useParams()
    const { RetrieveWithoutExpiredTokenHandler } = useRequest()
    const [productDeliverList, setProductDeliverList] = useState([])
    const [query, setQuery] = useState('')

    const filteredProductDelivery = useMemo(() => {

        return productDeliverList.filter(pdeliver => pdeliver.product_order.product.name.toLowerCase().includes(query.toLowerCase()) || pdeliver.product_order.product.code.toLowerCase().includes(query.toLowerCase()) || pdeliver.delivery_note_customer.code.toLowerCase().includes(query.toLowerCase()) || pdeliver.delivery_note_customer.date.toLowerCase().includes(query.toLowerCase()))

    }, [query, productDeliverList])

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
            selector: row => <Badge size='sm' color={row.schedules ? row.delivery_note_customer.date > row.schedules.date ? 'red.6' : 'blue.6' : 'blue.6'} variant='filled' >{row.schedules ? row.delivery_note_customer.date > row.schedules.date ? 'Late' : 'On time' : 'Unscheduled'}</Badge>,
            style: {
                paddingLeft: 0,
                marginLeft: -30,
                marginRight: 0,
                justifyContent: 'center'
            }

        }
    ], [])

    useEffect(() => {

        RetrieveWithoutExpiredTokenHandler(customerId, 'customer-product-delivery').then(data => {
            setProductDeliverList(data)
        })

    }, [])

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

export default ProductDeliverList

