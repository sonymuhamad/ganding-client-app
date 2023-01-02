import React, { useMemo } from "react";

import { BaseTable } from "../../../tables";

const ProductInvoiceList = ({ data }) => {

    const columnProductInvoice = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product.name,
            style: {
                paddingLeft: 0,
                marginRight: 0,
            }
        },
        {
            name: 'Product number',
            selector: row => row.product.code,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Unit',
            selector: row => row.ordered,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Harga / unit',
            selector: row => `Rp ${row.price}`,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Jumlah',
            selector: row => `Rp ${(row.price * row.ordered)}`,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
    ], [])

    return (
        <BaseTable
            column={columnProductInvoice}
            data={data}
            noData="No product"
        />
    )
}

export default ProductInvoiceList