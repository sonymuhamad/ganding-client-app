import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRequest } from "../../../hooks";
import { ExpandedWarehouseFg, ModalEditStockProduct } from "../../layout";
import { BaseTableExpanded } from "../../tables";
import { openModal } from "@mantine/modals";

import { Button, TextInput, Group } from "@mantine/core";
import { IconEdit, IconSearch } from "@tabler/icons";




const FinishGood = () => {

    const { Get } = useRequest()
    const [searchProductFg, setSearchProductFg] = useState('')
    const [warehouseFg, setWarehouseFg] = useState([])
    const [actionWarehouseFg, setActionWarehouseFg] = useState(0)

    const filteredWarehouseFg = useMemo(() => {

        const valFiltered = searchProductFg.toLowerCase()

        return warehouseFg.filter(wh => wh.product.name.toLowerCase().includes(valFiltered) || wh.product.code.toLowerCase().includes(valFiltered) || wh.product.customer.name.toLowerCase().includes(valFiltered))

    }, [warehouseFg, searchProductFg])

    const columnWhFinishedGoods = useMemo(() => [
        {
            name: 'Customer',
            selector: row => row.product.customer.name,
            sortable: true,

        },
        {
            name: 'Product',
            selector: row => row.product.name,
            sortable: true,

        },
        {
            name: 'Quantity',
            selector: row => row.quantity,

        },
        {
            name: '',
            selector: row => row.buttonEdit,
            style: {
                padding: 0,
                margin: 0
            }
        }
    ], [])

    const openEditWarehouseFg = useCallback((warehouseFg) => openModal({
        title: `Edit stock finished good ${warehouseFg.product.name}`,
        radius: 'md',
        children: <ModalEditStockProduct whProduct={warehouseFg} setaction={setActionWarehouseFg} />
    }), [])

    useEffect(() => {
        // effect for fetch finished goods

        const fetchFg = async () => {
            try {
                const whTypeFg = await Get('warehouse-fg')
                const warehouseFg = whTypeFg.find(whType => whType.id === 1).warehouseproduct_set.map(wh => ({
                    ...wh, buttonEdit:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='blue.6'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditWarehouseFg(wh)}
                        >
                            Edit
                        </Button>
                }))

                setWarehouseFg(warehouseFg)

            } catch (e) {
                console.log(e)
            }
        }
        fetchFg()

    }, [actionWarehouseFg, openEditWarehouseFg])


    return (
        <>
            <Group position="right" >
                <TextInput
                    icon={<IconSearch />}
                    radius='md'
                    value={searchProductFg}
                    onChange={e => setSearchProductFg(e.target.value)}
                    placeholder="Search product"
                />
            </Group>

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