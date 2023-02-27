import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";



const DeliveryScheduleList = () => {

    const { Get } = useRequest()
    const [deliveryScheduleList, setDeliveryScheduleList] = useState([])

    const columnDeliverySchedule = useMemo(() => [
        {
            name: 'Part name',
            selector: row => row.product_order.product.name
        },
        {
            name: 'Part number',
            selector: row => row.product_order.product.code
        },
        {
            name: 'Customer',
            selector: row => row.product_order.sales_order.customer.name
        },
        {
            name: 'Delivery date',
            selector: row => row.date
        },
        {
            name: 'Quantity',
            selector: row => row.quantity
        }
    ], [])

    useEffect(() => {
        Get('delivery-schedule').then(data => {
            setDeliveryScheduleList(data)
        })
    }, [])


    return (
        <BaseTable
            column={columnDeliverySchedule}
            data={deliveryScheduleList}
            noData="No delivery schedule"
        />
    )
}

export default DeliveryScheduleList
