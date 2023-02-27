import { Group } from "@mantine/core"
import { IconDialpad, IconBuildingWarehouse } from "@tabler/icons"
import React, { useCallback } from "react"
import { ReadOnlyTextInput } from "../custom_components"

const ExpandedWarehouseProduct = ({ data }) => {

    const findQuantitySubcont = useCallback((dataProduct) => {

        // prevent error occured when changing process type from subcont to non subcont
        if (dataProduct.process_type === 2) {
            return data.warehouseproduct_set.find(wh => wh.warehouse_type.id === 2).quantity
        }
        return 0

    }, [data])

    const quantitySubcont = findQuantitySubcont(data)

    return (
        <>
            <Group m='lg' grow >
                <ReadOnlyTextInput
                    label='Quantity at supplier'
                    icon={<IconDialpad />}
                    value={quantitySubcont}
                />
                <ReadOnlyTextInput
                    label='Quantity at warehouse'
                    icon={<IconBuildingWarehouse />}
                    value={data.warehouseproduct_set.find(wh => wh.warehouse_type.id !== 2).quantity}
                />
            </Group>
        </>
    )
}

export default ExpandedWarehouseProduct