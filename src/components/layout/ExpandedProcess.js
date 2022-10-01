import React, { useMemo } from "react";
import { TextInput, Group, Text, Container } from "@mantine/core";
import { IconWriting, IconTransferIn, IconTransferOut, } from "@tabler/icons";
import DataTable from "react-data-table-component";


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

        <Container p='md' >


            <Text weight={700} >
                Requirement material
            </Text>

            <DataTable
                columns={columnReqMaterial}
                data={data.requirementmaterial_set}
                highlightOnHover={true}
            />

            <Text mt='md' weight={700}  >
                Requirement product
            </Text>

            <DataTable
                columns={columnReqProduct}
                data={data.requirementproduct_set}
                highlightOnHover={true}
            />
        </Container>

    )
}
