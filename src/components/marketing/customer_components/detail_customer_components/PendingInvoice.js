import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../../hooks";
import { useParams } from "react-router-dom";

import { BaseTable } from "../../../tables";
import { NavigationDetailButton } from "../../../custom_components";


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
            selector: row => <NavigationDetailButton
                url={`/home/marketing/invoice/${row.id}`}
            />
        }
    ], [])

    useEffect(() => {

        RetrieveWithoutExpiredTokenHandler(customerId, 'customer/pending-invoice').then(data => {
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

