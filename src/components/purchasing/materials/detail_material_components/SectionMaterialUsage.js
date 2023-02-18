import React, { useMemo } from "react";
import { BaseTable } from "../../../tables";


const SectionMaterialUsage = (
    { requirementMaterialList }
) => {


    const columnRequirementMaterial = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.process.product.name,
            sortable: true
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
            name: 'Usage',
            selector: row => row.input,

        },
        {
            name: 'Output',
            selector: row => row.output,

        },
    ], [])

    return (
        <BaseTable
            column={columnRequirementMaterial}
            data={requirementMaterialList}
            noData="This material is not used at all in production"
        />
    )

}

export default SectionMaterialUsage
