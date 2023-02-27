import React, { useState, useEffect, useMemo, useCallback } from "react";
import { IconEdit, IconBuildingWarehouse } from "@tabler/icons";
import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals";
import { Paper, Button, Text } from "@mantine/core";

import { SuccessNotif, FailedNotif } from "../../notifications";
import { useRequest, useSearch } from "../../../hooks";
import { BaseTableExpanded } from "../../tables";
import { HeadSection, SearchTextInput, ModalForm, DecimalInput } from "../../custom_components";
import { ExpandedMaterial } from '../../layout'



const ModalEditStockMaterial = ({ material, setUpdateWarehouseMaterial }) => {

    const [quantity, setQuantity] = useState('')
    const { Put } = useRequest()

    const handleSubmit = useCallback(async () => {
        try {
            const updatedWarehouseMaterial = await Put(material.warehousematerial.id, { quantity: quantity }, 'warehouse-management-material')
            setUpdateWarehouseMaterial(updatedWarehouseMaterial)
            closeAllModals()
            SuccessNotif('Edit stock material success')
        } catch (e) {
            FailedNotif('Edit stock material failed')
        }
    }, [setUpdateWarehouseMaterial, quantity, material.warehousematerial.id])


    const openConfirmSubmit = useCallback(() => openConfirmModal({
        title: `Edit stock material`,
        children: (
            <Text size="sm">
                Are you sure?, you will change the stock in the warehouse directly.
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

        <ModalForm
            formId='formEditWarehouseMaterial'
            onSubmit={(e) => {
                e.preventDefault()
                openConfirmSubmit()
            }}  >

            <DecimalInput
                icon={<IconBuildingWarehouse />}
                value={quantity}
                label='Quantity'
                required
                onChange={(e) => {

                    if (e === undefined) {
                        setQuantity(0)
                    } else {
                        setQuantity(e)
                    }
                }}
            />

        </ModalForm>
    )

}


const ExpandedMaterialWarehouse = ({ data }) => {

    const setUpdateWarehouseMaterial = useCallback((updatedWarehouseMaterial) => {
        data.setUpdate(data.id, updatedWarehouseMaterial)
    }, [data])

    const openEditStockWarehouseMaterial = useCallback((material) => openModal({
        title: `Edit stock material`,
        radius: 'md',
        children: <ModalEditStockMaterial
            material={material}
            setUpdateWarehouseMaterial={setUpdateWarehouseMaterial}
        />
    }), [setUpdateWarehouseMaterial])

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
            selector: row => <Button
                leftIcon={<IconEdit stroke={2} size={16} />}
                color='blue.6'
                variant='subtle'
                radius='md'
                onClick={() => {
                    openEditStockWarehouseMaterial(row)
                }}
            >
                Edit stock
            </Button>,
            style: {
                padding: 0,
                margin: 0
            }
        },
    ], [openEditStockWarehouseMaterial])

    return (
        <Paper m='sm'  >
            <BaseTableExpanded
                column={columnMaterial}
                data={data.material_set}
                expandComponent={ExpandedMaterial}
            />
        </Paper>
    )
}



const RawMaterial = () => {

    const { query, lowerCaseQuery, setValueQuery } = useSearch()
    const [uom, setUom] = useState([])
    const { GetAndExpiredTokenHandler } = useRequest()

    const filteredUom = useMemo(() => {

        return uom.reduce((prev, current) => {
            const materials = current.material_set.filter(material => {
                const { spec, name, supplier } = material
                return spec.toLowerCase().includes(lowerCaseQuery) || name.toLowerCase().includes(lowerCaseQuery) || supplier.name.toLowerCase().includes(lowerCaseQuery)
            })

            if (lowerCaseQuery === '') {
                return [...prev, current]
            }

            if (materials.length !== 0) {
                return [...prev, { ...current, material_set: materials }]
            } else {
                return prev
            }

        }, [])
    }, [lowerCaseQuery, uom])

    const setUpdateWarehouseMaterial = useCallback((idUpdatedUom, updatedWarehouseMaterial) => {
        const { material, quantity } = updatedWarehouseMaterial

        setUom(prev => {

            return prev.map((uom) => {

                if (uom.id === idUpdatedUom) {
                    // get updated uom of material
                    const { material_set } = uom
                    const materialSet = material_set.map(eachMaterial => {

                        if (eachMaterial.id === material) {
                            /// get updated material
                            const { warehousematerial } = eachMaterial
                            return { ...eachMaterial, warehousematerial: { ...warehousematerial, quantity: quantity } }
                        }

                        return eachMaterial
                    })

                    return { ...uom, material_set: materialSet }
                }

                return uom
            })
        })

    }, [])

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
                setUom(uomMaterial.map(uom => ({ ...uom, setUpdate: setUpdateWarehouseMaterial })))
            } catch (e) {
                console.log(e)
            }
        }
        fetchUomMaterial()

    }, [setUpdateWarehouseMaterial])

    return (
        <>

            <HeadSection>
                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />
            </HeadSection>

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
