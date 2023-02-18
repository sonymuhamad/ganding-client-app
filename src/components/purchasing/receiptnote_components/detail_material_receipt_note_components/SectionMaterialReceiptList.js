import { useMemo } from "react"
import { BaseTable } from "../../../tables"
import { getScheduleState } from "../../../../services"
import { Badge } from "@mantine/core"


const SectionMaterialReceiptList = (
    { actualDate, materialReceivedList }
) => {

    const columnMaterialReceived = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.material_order.material.name,
            sortable: true
        },
        {
            name: 'Material specifications',
            selector: row => row.material_order.material.spec
        },
        {
            name: 'Quantity received',
            selector: row => `${row.quantity} ${row.material_order.material.uom.name} `
        },
        {
            name: 'Receipt status',
            selector: row => {
                const { schedules } = row
                const { color, label } = getScheduleState(schedules, actualDate)

                return (
                    <Badge color={color} variant='filled' >
                        {label}
                    </Badge>)
            }
        }

    ], [actualDate])



    return (
        <>

            <BaseTable
                column={columnMaterialReceived}
                data={materialReceivedList}
                noData='There is no material received'
            />

        </>
    )
}

export default SectionMaterialReceiptList