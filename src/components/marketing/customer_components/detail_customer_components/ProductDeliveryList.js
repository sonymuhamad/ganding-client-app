import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../../hooks";
import { useParams } from "react-router-dom";
import { BaseTableExpanded } from "../../../tables";
import { ExpandedDescriptionDelivery } from "../../../layout";

import { Badge, } from "@mantine/core";
import { SearchTextInput, HeadSection } from "../../../custom_components";
import { useSearch } from "../../../../hooks";
import { getScheduleState } from "../../../../services";


const ProductDeliverList = () => {

    const { customerId } = useParams()
    const { RetrieveWithoutExpiredTokenHandler } = useRequest()
    const [productDeliverList, setProductDeliverList] = useState([])
    const { query, setValueQuery, lowerCaseQuery } = useSearch()

    const filteredProductDelivery = useMemo(() => {

        return productDeliverList.filter(pdeliver => {

            const { product_order, delivery_note_customer } = pdeliver
            const { product } = product_order
            const { name } = product
            const { date, code } = delivery_note_customer

            return name.toLowerCase().includes(lowerCaseQuery) || product.code.toLowerCase().includes(lowerCaseQuery) || code.toLowerCase().includes(lowerCaseQuery) || date.toLowerCase().includes(lowerCaseQuery)
        })

    }, [lowerCaseQuery, productDeliverList])

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
            selector: row => {
                const { schedules, delivery_note_customer } = row
                const { date } = delivery_note_customer
                const { label, color } = getScheduleState(schedules, date)

                return (
                    <Badge size='sm' color={color} variant='filled' >
                        {label}
                    </Badge>
                )
            },
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

            <HeadSection>
                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />
            </HeadSection>

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

