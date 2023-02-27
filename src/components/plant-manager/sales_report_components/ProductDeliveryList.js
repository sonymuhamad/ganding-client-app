import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";
import { BaseTableExpanded } from "../../tables";
import { Badge } from "@mantine/core";
import { ExpandedDescriptionDelivery } from "../../layout";
import { getScheduleState } from "../../../services";


const ProductDeliveryList = () => {

    const { Get } = useRequest()
    const [productDeliveryList, setProductDeliveryList] = useState([])

    const columnProductDelivery = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product_order.product.name
        },
        {
            name: 'Delivery date',
            selector: row => row.delivery_note_customer.date,
            sortable: true
        },
        {
            name: 'Dikirim',
            selector: row => `${row.quantity} Unit`
        },
        {
            name: '',
            selector: row => {
                const { schedules, delivery_note_customer } = row
                const { date } = delivery_note_customer
                const { color, label } = getScheduleState(schedules, date)
                return (
                    <Badge color={color} variant='filled' >
                        {label}
                    </Badge>
                )
            }
        }
    ], [])

    useEffect(() => {

        Get('product-delivery-list').then(data => {
            setProductDeliveryList(data)
        })

    }, [])

    return (
        <BaseTableExpanded
            column={columnProductDelivery}
            data={productDeliveryList}
            expandComponent={ExpandedDescriptionDelivery}
            noData="There is no product delivery data"
        />
    )
}

export default ProductDeliveryList

