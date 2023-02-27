import React, { useMemo } from "react";

import { BaseTableExpanded } from "../../../tables";
import { ExpandedDescriptionDelivery } from "../../../layout";
import { Badge } from "@mantine/core";
import { getScheduleState } from "../../../../services";

const ProductDeliveryList = ({ data }) => {

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
                const { color, label } = getScheduleState(schedules, date)
                return (<Badge size='sm' color={color} variant='filled' >
                    {label}
                </Badge>)

            },
            style: {
                paddingLeft: 0,
                marginLeft: -30,
                marginRight: 0,
                justifyContent: 'center'
            }

        }

    ], [])


    return (
        <>
            <BaseTableExpanded
                noData="No data delivery product"
                data={data}
                column={columnProductDelivery}
                expandComponent={ExpandedDescriptionDelivery}
            />
        </>
    )
}

export default ProductDeliveryList