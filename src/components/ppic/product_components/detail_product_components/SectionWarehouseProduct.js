import React, { useMemo } from "react";
import { BaseTableDisableExpanded } from "../../../tables";
import { ExpandedWarehouseProduct } from "../../../layout";


const SectionWarehouseProduct = (
    { processList }
) => {

    const columnProcess = useMemo(() => [
        {
            name: 'Process name',
            selector: row => row.process_name,
            sortable: true,
        },
        {
            name: 'Process type',
            selector: row => row.process_type.name,
        },
        {
            name: 'Wip',
            selector: row => `Process ${row.order}`,
        },
        {
            name: 'Stock',
            selector: row => row.warehouseproduct_set.find(wh => wh.warehouse_type.id !== 2).quantity,
        },
        {
            name: 'Warehouse',
            selector: row => row.warehouseproduct_set.find(wh => wh.warehouse_type.id !== 2).warehouse_type.name,
        },
    ], [])

    return (
        <BaseTableDisableExpanded
            column={columnProcess}
            data={processList}
            expandComponent={ExpandedWarehouseProduct}
            condition={row => row.process_type.id === 2}
            disabled={row => row.process_type.id !== 2}
            pagination={false}
        />
    )
}

export default SectionWarehouseProduct