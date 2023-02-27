import { BaseTable } from "../../../tables"
import { NavigationDetailButton } from "../../../custom_components"
import React, { useMemo } from "react"


const SectionProductionRequirement = (
    { requirementMaterialList }
) => {


    const materialRequirementColumn = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.process.product.name,
        },
        {
            name: 'Process name',
            selector: row => row.process.process_name,
            sortable: true,
        },
        {
            name: 'Process type',
            selector: row => row.process.process_type.name,

        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/ppic/product/${row.process.product.name}`}
            />,
        }
    ], [])

    return (

        <BaseTable
            column={materialRequirementColumn}
            data={requirementMaterialList}
            noData='Material ini tidak digunakan dalam proses manufaktur'
        />

    )
}

export default SectionProductionRequirement