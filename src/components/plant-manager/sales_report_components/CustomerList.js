import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";

import { BaseTableExpanded } from "../../tables";
import { ExpandedCustomerList } from "../../layout";


const CustomerList = () => {

    const { Get } = useRequest()
    const [customerList, setCustomerList] = useState([])

    const columnCustomer = useMemo(() => [
        {
            name: 'Customer',
            selector: row => row.name
        },
        {
            name: 'Contact',
            selector: row => row.phone
        },
        {
            name: 'Email',
            selector: row => row.email
        },
        {
            name: 'Total product ordered',
            selector: row => `${row.customer_total_order} Unit`
        }
    ], [])

    useEffect(() => {

        Get('report-customer-product-order').then(data => {
            setCustomerList(data)
        })

    }, [])

    return (
        <>

            <BaseTableExpanded
                column={columnCustomer}
                data={customerList}
                expandComponent={ExpandedCustomerList}
                noData='No data customer'
            />

        </>
    )
}


export default CustomerList