import React, { useState, useEffect, useMemo, useCallback } from "react";
import { SuccessNotif, FailedNotif } from "../../notifications/Notifications";
import { useRequest } from "../../../hooks/useRequest";
import BaseTableExpanded from "../../tables/BaseTableExpanded";
import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals";

import { IconSearch, IconEdit, IconPerspective, IconRuler2, IconScale, IconDimensions, IconRulerMeasure } from "@tabler/icons";

import { TextInput, NumberInput, Group, Paper, Button, Text } from "@mantine/core";



const ExpandedDetailWarehouseMaterial = ({ data }) => {

    return (
        <Paper p='sm'  >
            <Group grow >
                <TextInput
                    icon={<IconPerspective />}
                    label='Specification'
                    value={data.spec}
                    readOnly
                    radius='md'
                />

                <TextInput
                    icon={<IconRulerMeasure />}
                    label='Thickness'
                    value={data.thickness}
                    readOnly
                    radius='md'
                />
            </Group>

            <Group grow my='xs' >
                <TextInput
                    icon={<IconRuler2 />}
                    label='Length'
                    value={data.length}
                    readOnly
                    radius='md'
                />

                <TextInput
                    icon={<IconScale />}
                    label='Weight'
                    value={data.weight}
                    readOnly
                    radius='md'
                />

                <TextInput
                    icon={<IconDimensions />}
                    label='Width'
                    readOnly
                    value={data.width}
                    radius='md'
                />
            </Group>

        </Paper>
    )
}

const ExpandedMaterialWarehouse = ({ data }) => {

    const openEditStockWarehouseMaterial = useCallback((material) => openModal({
        title: `Edit stock material`,
        radius: 'md',
        children: <ModalEditStockMaterial material={material} />
    }), [])

    const dataMaterial = useMemo(() => {

        return data.material_set.map(material => ({
            ...material, button: <Button
                leftIcon={<IconEdit stroke={2} size={16} />}
                color='blue.6'
                variant='subtle'
                radius='md'
                onClick={() => {
                    openEditStockWarehouseMaterial(material)
                }}
            >
                Edit stock
            </Button>
        }))
    }, [data.material_set, openEditStockWarehouseMaterial])



    const columnMaterial = useMemo(() => [
        {
            name: 'Supplier',
            selector: row => row.supplier.name
        },
        {
            name: 'Material',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Stock',
            selector: row => row.warehousematerial.quantity
        },
        {
            name: '',
            selector: row => row.button,
            style: {
                padding: 0,
                margin: 0
            }
        },

    ], [])

    return (
        <Paper m='sm'  >
            <BaseTableExpanded
                column={columnMaterial}
                data={dataMaterial}
                dense={true}
                expandComponent={ExpandedDetailWarehouseMaterial}
            />
        </Paper>
    )
}

const ModalEditStockMaterial = ({ material }) => {

    const [quantity, setQuantity] = useState('')
    const { Put } = useRequest()

    const handleSubmit = useCallback(async () => {
        try {
            await Put(material.warehousematerial.id, { quantity: quantity }, 'warehouse-management-material')
            closeAllModals()
            material.action(prev => prev + 1)
            SuccessNotif('Edit stock material success')
        } catch (e) {
            console.log(e)
            FailedNotif('Edit stock material failed')
        }
    }, [material, Put, quantity])


    const openConfirmSubmit = useCallback(() => openConfirmModal({
        title: `Edit stock material`,
        children: (
            <Text size="sm">
                Are you sure?, you will change the stock in the warehouse directly.
                <br />
                this action will impact a lack of data on changes in stock material, use purchase order material instead.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmit()
    }), [handleSubmit])

    useEffect(() => {
        setQuantity(material.warehousematerial.quantity)
    }, [material.warehousematerial.quantity])

    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault()
                openConfirmSubmit()
            }}  >

                <NumberInput
                    radius='md'
                    label='Quantity'
                    hideControls
                    required
                    value={quantity}
                    onChange={(e) => {

                        if (e === undefined) {
                            setQuantity(0)
                        } else {
                            setQuantity(e)
                        }

                    }}
                />

                <Button
                    my='md'
                    radius='md'
                    fullWidth
                    type='submit'
                    disabled={quantity === material.warehousematerial.quantity}
                >
                    Save
                </Button>
            </form>
        </>
    )

}




const RawMaterial = ({ actions }) => {

    const [searchVal, setSearchVal] = useState('')
    const [uom, setUom] = useState([])
    const [actionWhMaterial, setActionWhMaterial] = useState(0)
    const { Loading, GetAndExpiredTokenHandler } = useRequest()

    const filteredUom = useMemo(() => {

        const valFiltered = searchVal.toLowerCase()

        return uom.reduce((prev, current) => {
            const materials = current.material_set.filter(material => material.spec.toLowerCase().includes(valFiltered) || material.name.toLowerCase().includes(valFiltered) || material.supplier.name.toLowerCase().includes(valFiltered))

            if (valFiltered === '') {
                return [...prev, current]
            }

            if (materials.length !== 0) {
                return [...prev, { ...current, material_set: materials }]
            } else {
                return prev
            }

        }, [])

    }, [searchVal, uom])

    const columnUoms = useMemo(() => [
        {
            name: 'Unit of material',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Amount of material',
            selector: row => row.amount_of_material
        },

    ], [])


    useEffect(() => {

        const fetchUomMaterial = async () => {

            try {
                const uomMaterial = await GetAndExpiredTokenHandler('warehouse-material')

                const dataUomMaterial = uomMaterial.map(uom => ({ ...uom, material_set: uom.material_set.map(material => ({ ...material, action: setActionWhMaterial })) }))

                setUom(dataUomMaterial)
            } catch (e) {
                console.log(e)
            }

        }

        fetchUomMaterial()


    }, [actionWhMaterial, actions])

    return (
        <>
            <Loading />
            <Group position="right"  >
                <TextInput
                    radius='md'
                    icon={<IconSearch />}
                    placeholder="Search material"
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                />


            </Group>

            <BaseTableExpanded

                column={columnUoms}
                data={filteredUom}
                condition
                expandComponent={ExpandedMaterialWarehouse}
                pagination={false}
            />
        </>
    )
}

export default RawMaterial
