import { Button } from "@mantine/core";
import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../../hooks";
import { Link, useParams } from "react-router-dom";

import { BaseTable } from "../../../tables";
import { IconDotsCircleHorizontal } from "@tabler/icons";



const PendingInvoice = () => {

    const [invoiceList, setInvoiceList] = useState([])
    const { customerId } = useParams()
    const { RetrieveWithoutExpiredTokenHandler } = useRequest()

    const columnInvoice = useMemo(() => [
        {
            name: 'Invoice number',
            selector: row => row.code
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Sales order number',
            selector: row => row.sales_order.code
        },
        {
            name: '',
            selector: row => <Button
                leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                color='teal.8'
                variant='subtle'
                radius='md'
                component={Link}
                to={`/home/marketing/customers/${row.id}`}
            >
                Detail
            </Button>
        }
    ], [])

    useEffect(() => {

        RetrieveWithoutExpiredTokenHandler(customerId, 'customer-pending-invoice').then(data => {
            setInvoiceList(data)
        })

    }, [])

    return (
        <>

            <BaseTable
                column={columnInvoice}
                data={invoiceList}
                noData="Semua invoice sudah selesai"
            />

        </>
    )
}

export default PendingInvoice

