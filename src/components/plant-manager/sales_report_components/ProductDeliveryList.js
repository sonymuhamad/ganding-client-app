import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";
import { Badge } from "@mantine/core";


const ProductDeliveryList = () => {

    const { Get } = useRequest()
    const [productDeliveryList, setProductDeliveryList] = useState([])

    const columnProductDelivery = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product_order.product.name
        },
        {
            name: 'Product number',
            selector: row => row.product_order.product.code
        },
        {
            name: 'Delivery date',
            selector: row => row.delivery_note_customer.date,
            sortable: true
        },
        {
            name: 'Quantity shipped',
            selector: row => `${row.quantity} Unit`
        },
        {
            name: '',
            selector: row => <Badge color={row.schedules ? row.delivery_note_customer.date > row.schedules.date ? 'red.6' : 'blue.6' : 'blue.6'} variant='filled' >{row.schedules ? row.delivery_note_customer.date > row.schedules.date ? 'Late' : 'On time' : 'Unscheduled'}</Badge>

        }
    ], [])

    useEffect(() => {

        Get('product-delivery-list').then(data => {
            setProductDeliveryList(data)
        })

    }, [])

    return (
        <BaseTable
            column={columnProductDelivery}
            data={productDeliveryList}
            noData="There is no product delivery data"
        />
    )
}

export default ProductDeliveryList

