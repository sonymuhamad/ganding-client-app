import React, { useMemo } from "react";
import { BaseTable } from "../tables";
import { Paper } from "@mantine/core";


export default function ExpandedPurchaseOrder({ data }) {

    const { materialorder_set } = data

    const columnMaterialOrderList = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.material.name,
            sortable: true
        },
        {
            name: 'Order',
            selector: row => `${row.ordered} ${row.material.uom.name}`
        },
        {
            name: 'Arrived',
            selector: row => `${row.arrived} ${row.material.uom.name}`
        },
    ], [])

    return (
        <Paper m='xs' p='xs' >

            <BaseTable
                column={columnMaterialOrderList}
                data={materialorder_set}
                dense={true}
                pagination={false}
            />

        </Paper>
    )
}