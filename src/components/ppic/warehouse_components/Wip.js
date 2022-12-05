import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRequest } from "../../../hooks";
import { BaseTableExpanded } from "../../tables";
import { ModalEditStockProduct } from "../../layout";
import { openModal } from "@mantine/modals";

import { IconBarcode, IconCodeAsterix, IconEdit, IconTimeline, IconTypography } from "@tabler/icons";
import { TextInput, Button, Group, Paper } from "@mantine/core";


const ExpandedDetailWarehouseWip = ({ data }) => {
    return (
        <Paper p='sm'  >
            <Group grow >
                <TextInput
                    icon={<IconBarcode />}
                    label='Product name'
                    value={data.product.name}
                    readOnly
                    radius='md'
                />

                <TextInput
                    icon={<IconCodeAsterix />}
                    label='Product number'
                    value={data.product.code}
                    readOnly
                    radius='md'
                />
            </Group>

            <Group grow my='xs' >
                <TextInput
                    icon={<IconTypography />}
                    label='Product type'
                    value={data.product.type.name}
                    readOnly
                    radius='md'
                />
                <TextInput
                    icon={<IconTimeline />}
                    label='Process name'
                    value={data.process.process_name}
                    readOnly
                    radius='md'
                />
            </Group>

        </Paper>
    )
}

const ExpandedWarehouseWip = ({ data }) => {

    const columnWarehouseWip = useMemo(() => [
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


    return (
        <Paper m='sm' >
            <BaseTableExpanded
                column={columnWarehouseWip}
                data={data.warehouseproduct_set}
                dense={true}
                expandComponent={ExpandedDetailWarehouseWip}

            />
        </Paper>
    )

}


const Wip = () => {

    const [searchProductWip, setSearchProductWip] = useState('')
    const [warehouseWip, setWarehouseWip] = useState([])
    const [actionWarehouseWip, setActionWarehouseWip] = useState(0)
    const { Get } = useRequest()

    const filteredWarehouseWip = useMemo(() => {

        const valFiltered = searchProductWip.toLowerCase()

        return warehouseWip.reduce((prev, current) => {
            const whProduct = current.warehouseproduct_set.filter(wh => wh.product.name.toLowerCase().includes(valFiltered) || wh.product.code.toLowerCase().includes(valFiltered) || wh.product.customer.name.toLowerCase().includes(valFiltered))

            if (valFiltered === '') {
                return [...prev, current]
            }

            if (whProduct.length !== 0) {
                return [...prev, { ...current, warehouseproduct_set: whProduct }]
            } else {
                return prev
            }

        }, [])

    }, [searchProductWip, warehouseWip])


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


    const openEditWarehouseWip = useCallback((warehouseWip) => openModal({
        title: `Edit stock wip ${warehouseWip.product.name}`,
        radius: 'md',
        children: <ModalEditStockProduct whProduct={warehouseWip} setaction={setActionWarehouseWip} />
    }), [])


    useEffect(() => {
        // effect for product warehouse work in process

        const fetchWarehouseWip = async () => {
            try {
                const whTypeWip = await Get('warehouse-wip')
                const whWip = whTypeWip.map(whType => ({
                    ...whType, warehouseproduct_set: whType.warehouseproduct_set.map(wh => ({
                        ...wh, buttonEdit:

                            <Button
                                leftIcon={<IconEdit stroke={2} size={16} />}
                                color='blue.6'
                                variant='subtle'
                                radius='md'
                                mx='xs'
                                onClick={() => openEditWarehouseWip(wh)}
                            >
                                Edit
                            </Button>
                    }))
                }))

                setWarehouseWip(whWip)
            } catch (e) {

            }
        }

        fetchWarehouseWip()

    }, [actionWarehouseWip, openEditWarehouseWip])

    return (
        <>

            <Group position="right" >
                <TextInput
                    placeholder="Search product"
                    value={searchProductWip}
                    radius='md'
                    onChange={e => setSearchProductWip(e.target.value)}
                />
            </Group>

            <BaseTableExpanded
                column={columnWarehouseWip}
                data={filteredWarehouseWip}
                dense={true}
                expandComponent={ExpandedWarehouseWip}
                pagination={false}
            />
        </>
    )
}


export default Wip