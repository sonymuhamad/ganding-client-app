import React, { useMemo } from "react";
import { BaseTable } from "../../../tables";

const SectionProductDeliverySubcont = ({
    productSubcontList
}) => {


    const columnProductSubcont = useMemo(() => [
        {
            name: 'Product name',
            selector: row => row.product.name,
            sortable: true
        },
        {
            name: 'Product number',
            selector: row => row.product.code
        },
        {
            name: 'Process name',
            selector: row => row.process.process_name
        },
        {
            name: 'Wip',
            selector: row => `Wip ${row.process.order}`
        },
        {
            name: 'Quantity sent',
            selector: row => `${row.quantity} Pcs`
        }
    ], [])


    return (
        <BaseTable
            column={columnProductSubcont}
            data={productSubcontList}
            noData="This delivery note doesn't have products sent "
        />

    )
}

export default SectionProductDeliverySubcont