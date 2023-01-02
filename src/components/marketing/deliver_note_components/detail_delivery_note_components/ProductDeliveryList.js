import React, { useMemo } from "react";

import { BaseTableExpanded } from "../../../tables";
import { ExpandedDescriptionDelivery } from "../../../layout";
import { Badge } from "@mantine/core";

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
            name: 'Product number',
            selector: row => row.product_order.product.code,
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