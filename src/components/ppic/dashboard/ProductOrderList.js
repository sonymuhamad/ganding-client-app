import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from '../../../hooks'
import { BaseTable } from '../../tables'

const ProductOrderList = () => {

    const { Get } = useRequest()

    const [productOrder, setProductOrder] = useState([])


    const columnProductOrderList = useMemo(() => [
        {
            name: 'Customer',
            selector: row => row.customer.name
        },
        {
            name: 'Product name',
            selector: row => row.name
        },
        {
            name: 'Product number',
            selector: row => row.code
        },
        {
            name: 'Quantity',
            selector: row => `${row.rest_order} Pcs`
        }
    ], [])


    useEffect(() => {
        const fetch = async () => {
            try {
                const productOrderList = await Get('list-product-in-order')
                setProductOrder(productOrderList)

            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [])

    return (
        <>
            <BaseTable
                column={columnProductOrderList}
                data={productOrder}
                noData="No product order"
            />
        </>
    )

}

export default ProductOrderList

