import React, { useMemo } from "react"
import { ExpandedMaterial } from "../../../layout"
import { BaseTableExpanded } from "../../../tables"
import { NavigationDetailButton } from '../../../custom_components'

const SectionMaterialList = (
    { materialList }
) => {


    const columnMaterialList = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Specification',
            selector: row => row.spec
        },
        {
            name: 'Stock',
            selector: row => `${row.warehousematerial} ${row.uom.name}`
        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/purchasing/material/${row.id}`}
            />
        }
    ], [])

    return (
        <>

            <BaseTableExpanded
                noData="This supplier doesn't have any material"
                column={columnMaterialList}
                data={materialList}
                expandComponent={ExpandedMaterial}
            />

        </>
    )
}

export default SectionMaterialList