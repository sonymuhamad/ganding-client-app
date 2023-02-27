import React, { useMemo } from "react";
import { Text, Container, Paper, Divider } from "@mantine/core";
import { BaseTable } from "../tables";


export default function ExpandedProcess({ data }) {

    const columnReqMaterial = useMemo(() => [
        {
            name: 'Material',
            selector: row => row.material.name,
            sortable: true,
        },
        {
            name: 'Uom',
            selector: row => row.material.uom.name,
        },
        {
            name: 'Input qty',
            selector: row => row.input,

        },
        {
            name: 'Output qty',
            selector: row => row.output,

        },
    ], [])

    const columnReqProduct = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product.name,
            sortable: true,
        },
        {
            name: 'Code',
            selector: row => row.product.code,
        },
        {
            name: 'Input qty',
            selector: row => row.input,

        },
        {
            name: 'Output qty',
            selector: row => row.output,

        },
    ], [])

    return (

        <Paper m='xs' >

            {data.requirementmaterial_set.length > 0 &&

                <Text
                    color='dimmed'
                    align="center"
                    size='sm'
                >
                    Bill of material
                </Text>
            }

            <BaseTable
                column={columnReqMaterial}
                data={data.requirementmaterial_set}
                noData='Proses ini tidak menggunakan material'
            />

            <Divider
                my='xs'
                size='md'
            />

            {data.requirementproduct_set.length > 0 &&
                <Text
                    color='dimmed'
                    align='center'
                    size='sm'
                >
                    Product assembly
                </Text>
            }

            <BaseTable
                column={columnReqProduct}
                data={data.requirementproduct_set}
                noData='Proses ini tidak menggunakan product assembly'
            />
        </Paper>

    )
}
