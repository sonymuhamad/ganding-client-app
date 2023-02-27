import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRequest, useSearch } from "../../../hooks";
import { BaseTableExpanded } from "../../tables";
import { ModalEditStockProduct } from "../../layout";
import { openModal } from "@mantine/modals";

import { IconBarcode, IconCodeAsterix, IconEdit, IconTimeline, IconTypography } from "@tabler/icons";
import { Button, Group, Paper } from "@mantine/core";
import { HeadSection, SearchTextInput, ReadOnlyTextInput } from "../../custom_components";


const ExpandedDetailWarehouseWip = ({ data }) => {
    return (
        <Paper p='sm'  >
            <Group grow >
                <ReadOnlyTextInput
                    icon={<IconBarcode />}
                    label='Product name'
                    value={data.product.name}
                />

                <ReadOnlyTextInput
                    icon={<IconCodeAsterix />}
                    label='Product number'
                    value={data.product.code}
                />
            </Group>

            <Group grow my='xs' >
                <ReadOnlyTextInput
                    icon={<IconTypography />}
                    label='Product type'
                    value={data.product.type.name}
                />
                <ReadOnlyTextInput
                    icon={<IconTimeline />}
                    label='Process name'
                    value={data.process.process_name}
                />
            </Group>

        </Paper>
    )
}

const ExpandedWarehouseWip = ({ data }) => {

    const setUpdateWarehouse = useCallback((updatedWarehouse) => {
        data.setUpdate(data.id, updatedWarehouse)
    }, [data])

    const openEditWarehouseWip = useCallback((warehouseWip) => openModal({
        title: `Edit stock wip ${warehouseWip.product.name}`,
        radius: 'md',
        children: <ModalEditStockProduct
            whProduct={warehouseWip}
            setUpdateWarehouse={setUpdateWarehouse} />
    }), [setUpdateWarehouse])

    const columnWarehouseWip = useMemo(() => [
        {
            name: 'Customer',
            selector: row => row.product.customer.name,
            sortable: true,

        },
        {
            name: 'Product name',
            selector: row => row.product.name,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,

        },
        {
            name: '',
            selector: row =>
                <Button
                    leftIcon={<IconEdit stroke={2} size={16} />}
                    color='blue.6'
                    variant='subtle'
                    radius='md'
                    mx='xs'
                    onClick={() => openEditWarehouseWip(row)}
                >
                    Edit stock
                </Button>,
        }
    ], [openEditWarehouseWip])


    return (
        <Paper m='sm' >
            <BaseTableExpanded
                column={columnWarehouseWip}
                data={data.warehouseproduct_set}
                expandComponent={ExpandedDetailWarehouseWip}

            />
        </Paper>
    )

}


const Wip = () => {

    const { query, lowerCaseQuery, setValueQuery } = useSearch()
    const [warehouseWip, setWarehouseWip] = useState([])
    const { Get } = useRequest()

    const filteredWarehouseWip = useMemo(() => {

        return warehouseWip.reduce((prev, current) => {
            const whProduct = current.warehouseproduct_set.filter(wh => {
                const { product } = wh
                const { customer, code, name } = product

                return name.toLowerCase().includes(lowerCaseQuery) || code.toLowerCase().includes(lowerCaseQuery) || customer.name.toLowerCase().includes(lowerCaseQuery)
            })

            if (lowerCaseQuery === '') {
                return [...prev, current]
            }

            if (whProduct.length !== 0) {
                return [...prev, { ...current, warehouseproduct_set: whProduct }]
            } else {
                return prev
            }

        }, [])

    }, [lowerCaseQuery, warehouseWip])

    const setUpdateWarehouseProduct = useCallback((idWip, updatedWarehouseProduct) => {
        const { id, quantity } = updatedWarehouseProduct
        setWarehouseWip(prev => {
            return prev.map(wip => {

                if (wip.id === idWip) {
                    const { warehouseproduct_set } = wip
                    const warehouseProductSet = warehouseproduct_set.map(warehouseProduct => {

                        if (warehouseProduct.id === id) {
                            return { ...warehouseProduct, quantity: quantity }
                        }
                        return warehouseProduct
                    })

                    return { ...wip, warehouseproduct_set: warehouseProductSet }
                }

                return wip
            })
        })

    }, [])

    const columnWarehouseWip = useMemo(() => [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Amount of product',
            selector: row => row.warehouseproduct_set.length
        }
    ], [])

    useEffect(() => {
        const fetchWarehouseWip = async () => {
            try {
                const whTypeWip = await Get('warehouse-wip')
                setWarehouseWip(whTypeWip.map(whWip => ({ ...whWip, setUpdate: setUpdateWarehouseProduct })))
            } catch (e) {
                console.log(e)
            }
        }
        fetchWarehouseWip()

    }, [setUpdateWarehouseProduct])

    return (
        <>

            <HeadSection>
                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />
            </HeadSection>

            <BaseTableExpanded
                column={columnWarehouseWip}
                data={filteredWarehouseWip}
                expandComponent={ExpandedWarehouseWip}
                pagination={false}
            />
        </>
    )
}


export default Wip