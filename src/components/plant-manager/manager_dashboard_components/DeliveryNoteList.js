import React, { useState, useEffect, useMemo } from "react";
import { useRequest } from "../../../hooks";

import { BaseTable, BaseTableExpanded } from "../../tables";
import { Badge, Textarea } from "@mantine/core";
import { IconClipboard } from "@tabler/icons";


const ExpandedDeliveryNote = ({ data }) => {

    const { note, productdelivercustomer_set } = data

    const columnProductDeliver = useMemo(() => [
        {
            name: 'Nama part',
            selector: row => row.product_order.product.name
        },
        {
            name: 'Nomor part',
            selector: row => row.product_order.product.code
        },
        {
            name: 'Quantity',
            selector: row => row.quantity
        },
        {
            name: 'Keterangan',
            selector: row => row.description
        }
    ], [])

    return (
        <>

            <Textarea
                label='Description'
                readOnly
                variant='filled'
                radius='md'
                m='sm'
                icon={<IconClipboard />}
                value={note}
            />

            <BaseTable
                noData="No product sent"
                column={columnProductDeliver}
                pagination={false}
                data={productdelivercustomer_set}
            />


        </>
    )
}


const DeliveryNoteList = () => {

    const { Get } = useRequest()
    const [deliveryNoteList, setDeliveryNoteList] = useState([])

    const columnDeliveryNote = useMemo(() => [
        {
            name: 'Customer',
            selector: row => row.customer.name
        },
        {
            name: 'Delivery number',
            selector: row => row.code
        },
        {
            name: 'Date',
            selector: row => row.date
        },
        {
            name: 'Number of product shipped',
            selector: row => row.productdelivercustomer_set.length,
            style: {
                padding: -5,
                margin: -10,
                justifyContent: 'center'
            }
        }
    ], [])

    useEffect(() => {

        Get('report-delivery-product').then(data => {
            setDeliveryNoteList(data)
        })

    }, [])

    return (
        <>

            <BaseTableExpanded
                column={columnDeliveryNote}
                data={deliveryNoteList}
                noData='There is no deliveries this week'
                expandComponent={ExpandedDeliveryNote}
            />

        </>
    )
}

export default DeliveryNoteList