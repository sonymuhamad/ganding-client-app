import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";


const ProductOrderList = () => {

    const { Get } = useRequest()
    const [productOrderList, setProductOrderList] = useState([])

    const columnProductOrder = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product.name,
        },
        {
            name: 'Order date',
            selector: row => row.sales_order.date,
            sortable: true
        },
        {
            name: 'Order',
            selector: row => `${row.ordered} Unit`
        },
        {
            name: 'Dikirim',
            selector: row => `${row.delivered} Unit`
        },
        {
            name: 'Sisa order',
            selector: row => `${row.ordered > row.delivered ? row.ordered - row.delivered : 0} Unit`
        }
    ], [])

    useEffect(() => {

        Get('order/product-incomplete').then(data => {
            setProductOrderList(data)
        })

    }, [])

    return (
        <>

            <BaseTable
                column={columnProductOrder}
                data={productOrderList}
                noData="There is not order in progress"
            />

        </>
    )
}

export default ProductOrderList
