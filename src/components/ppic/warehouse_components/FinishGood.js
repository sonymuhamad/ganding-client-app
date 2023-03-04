import React, { useState, useEffect, useMemo, useCallback } from "react";
import { openModal } from "@mantine/modals";
import { IconEdit } from "@tabler/icons";
import { Button } from "@mantine/core";

import { useRequest, useSearch } from "../../../hooks";
import { ExpandedWarehouseFg, ModalEditStockProduct } from "../../layout";
import { BaseTableExpanded } from "../../tables";
import { SearchTextInput, HeadSection } from "../../custom_components";


const FinishGood = () => {

    const { Get } = useRequest()
    const [warehouseFg, setWarehouseFg] = useState([])
    const { query, setValueQuery, lowerCaseQuery } = useSearch()

    const filteredWarehouseFg = useMemo(() => {

        return warehouseFg.filter(wh => {
            const { product } = wh
            const { customer, name, code } = product
            return name.toLowerCase().includes(lowerCaseQuery) || code.toLowerCase().includes(lowerCaseQuery) || customer.name.toLowerCase().includes(lowerCaseQuery)
        })

    }, [warehouseFg, lowerCaseQuery])

    const setUpdateWarehouse = useCallback((updatedWarehouse) => {
        const { id, quantity } = updatedWarehouse
        setWarehouseFg(prev => prev.map(warehouse => {
            if (warehouse.id === id) {
                return { ...warehouse, quantity: quantity }
            }
            return warehouse
        }))
    }, [])

    const openEditWarehouseFg = useCallback((warehouseFg) => openModal({
        title: `Edit stock finished good ${warehouseFg.product.name}`,
        radius: 'md',
        children: <ModalEditStockProduct
            whProduct={warehouseFg}
            setUpdateWarehouse={setUpdateWarehouse}
        />
    }), [setUpdateWarehouse])

    useEffect(() => {
        // effect for fetch finished goods
        const fetchFg = async () => {
            try {
                const whTypeFg = await Get('warehouse/fg')
                setWarehouseFg(whTypeFg[0].warehouseproduct_set)
            } catch (e) {
                console.log(e)
            }
        }
        fetchFg()

    }, [])


    const columnWhFinishedGoods = useMemo(() => [
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
            selector: row => <Button
                leftIcon={<IconEdit stroke={2} size={16} />}
                color='blue.6'
                variant='subtle'
                radius='md'
                mx='xs'
                onClick={() => openEditWarehouseFg(row)}
            >
                Edit stock
            </Button>,
        }
    ], [openEditWarehouseFg])


    return (
        <>
            <HeadSection>
                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />
            </HeadSection>

            <BaseTableExpanded
                column={columnWhFinishedGoods}
                data={filteredWarehouseFg}
                dense={true}
                expandComponent={ExpandedWarehouseFg}
            />
        </>
    )
}



export default FinishGood