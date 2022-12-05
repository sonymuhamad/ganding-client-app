import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Paper, Group, TextInput } from "@mantine/core";
import { Link } from "react-router-dom";

import { IconDotsCircleHorizontal, IconSearch, IconPlus } from "@tabler/icons";

import { BaseTable, BaseTableDefaultExpanded } from "../../tables"
import { useRequest } from "../../../hooks";



const ExpandedMaterial = ({ data }) => {

    const materials = useMemo(() => {
        return data.ppic_material_related.map(material => ({
            ...material, button: <Button
                leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                color='teal.8'
                variant='subtle'
                radius='md'
                component={Link}
                to={`${material.id}`}
            >
                Detail
            </Button>
        }))
    }, [data])

    const productColumn = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Material spec',
            selector: row => row.spec,
        },
        {
            name: 'Material type',
            selector: row => row.uom.name,

        },
        {
            name: '',
            selector: row => row.button,
            style: {
                padding: 0,
            }
        }
    ], [])


    return (
        <>
            <Paper ml='lg' mb='md' >
                <BaseTable
                    column={productColumn}
                    data={materials}
                    pagination={false}
                />

            </Paper>

        </>
    )
}

const MaterialList = () => {

    const { Loading, GetAndExpiredTokenHandler } = useRequest()
    const [supplierMaterial, setSupplierMaterial] = useState([])
    const [searchVal, setSearchVal] = useState('')

    const filteredSupplierMaterial = useMemo(() => {
        const valFiltered = searchVal.toLowerCase()

        return supplierMaterial.reduce((prev, current) => {
            const materials = current.ppic_material_related.filter(material => material.spec.toLowerCase().includes(valFiltered) || material.name.toLowerCase().includes(valFiltered) || material.uom.name.toLowerCase().includes(valFiltered))

            if (valFiltered === '') {
                return [...prev, current]
            }

            if (materials.length !== 0) {
                return [...prev, { ...current, ppic_material_related: materials }]
            } else {
                return prev
            }

        }, [])
    }, [searchVal, supplierMaterial])


    const columnSupplier = useMemo(() => [
        {
            name: 'Supplier name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Amount of material',
            selector: row => row.ppic_material_related.length
        }
    ], [])

    const fetchMaterials = useCallback(async () => {
        try {
            const supplierMaterials = await GetAndExpiredTokenHandler('supplier-material-list')

            setSupplierMaterial(supplierMaterials)

        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        // effect for supplier nested to materials
        fetchMaterials()

    }, [fetchMaterials])



    return (
        <>
            <Loading />
            <Group position="right" >
                <TextInput
                    icon={<IconSearch />}
                    placeholder='Search material'
                    radius='md'
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                />
                <Button
                    variant='outline'
                    style={{ float: 'right' }}
                    radius='md'
                    leftIcon={<IconPlus />}
                    component={Link}
                    to='new'
                >
                    Add material
                </Button>

            </Group>


            <BaseTableDefaultExpanded

                column={columnSupplier}
                data={filteredSupplierMaterial}
                expandComponent={ExpandedMaterial}
                condition={row => row.ppic_material_related.length !== 0}
            />
        </>
    )

}

export default MaterialList