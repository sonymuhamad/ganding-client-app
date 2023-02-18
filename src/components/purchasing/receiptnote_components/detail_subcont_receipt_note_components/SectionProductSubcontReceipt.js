import { useMemo } from "react"
import { BaseTable } from "../../../tables"

import { getScheduleState } from "../../../../services"
import { Badge } from "@mantine/core"


const SectionProductSubcontReceipt = (
    { actualDate, productSubcontList }
) => {


    const columnProductSubcontReceived = useMemo(() => [
        {
            name: 'Product name',
            selector: row => row.product_subcont.product.name,
            sortable: true
        },
        {
            name: 'Product number',
            selector: row => row.product_subcont.product.code,
        },
        {
            name: 'Quantity / Not good',
            selector: row => `${row.quantity} / ${row.quantity_not_good} `
        },
        {
            name: 'Receipt status',
            selector: row => {
                const { schedules } = row
                const { color, label } = getScheduleState(schedules, actualDate)
                return (<Badge
                    color={color}
                    variant='filled'
                >
                    {label}
                </Badge>)
            }
        }
    ], [actualDate])


    return (
        <>

            <BaseTable
                column={columnProductSubcontReceived}
                data={productSubcontList}
                noData='No product received'
            />

        </>
    )
}

export default SectionProductSubcontReceipt