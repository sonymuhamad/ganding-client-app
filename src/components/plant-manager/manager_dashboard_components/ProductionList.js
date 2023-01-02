import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";


const ProductionList = () => {

    const { Get } = useRequest()
    const [productionList, setProductionList] = useState([])

    const columnProduction = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product.name
        },
        {
            name: 'Process',
            selector: row => row.process.process_name
        },
        {
            name: 'Wip',
            selector: row => `Wip ${row.process.order}`
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Good product',
            selector: row => `${row.quantity} Unit`
        },
        {
            name: 'Not good product',
            selector: row => `${row.quantity_not_good} unit`
        }
    ], [])

    useEffect(() => {

        Get('report-production-weekly').then(data => {
            setProductionList(data)
        })

    }, [])


    return (
        <BaseTable
            column={columnProduction}
            data={productionList}
            noData="There is no production this week"
        />
    )
}

export default ProductionList