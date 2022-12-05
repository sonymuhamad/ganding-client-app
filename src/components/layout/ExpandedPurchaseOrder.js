import React, { useMemo } from "react";
import { BaseTable } from "../tables";
import { Button, Paper } from "@mantine/core";
import { IconLoader, IconCheck } from "@tabler/icons";


export default function ExpandedPurchaseOrder({ data }) {


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
        {
            name: 'Status',
            selector: row => row.done ?
                <Button leftIcon={<IconCheck />} variant='subtle' size='sm' color='blue.6' >Finish</Button> : <Button variant="subtle" size='sm' color='yellow.6' leftIcon={<IconLoader />} >Incomplete</Button>
        },
    ], [])

    return (
        <Paper m='xs' p='xs' >

            <BaseTable
                column={columnMaterialOrderList}
                data={data.materialorder_set}
                dense={true}
                pagination={false}
            />

        </Paper>
    )
}