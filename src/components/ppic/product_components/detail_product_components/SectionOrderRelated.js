import React, { useMemo } from "react";
import { Badge } from "@mantine/core";
import { IconChecks, IconCircleDotted } from "@tabler/icons";
import { BaseTable } from "../../../tables";


const SectionOrderRelated = (
    { productOrderList }
) => {

    const columnOrderRelated = useMemo(() => [
        {
            name: 'Order number',
            selector: row => row.sales_order.code
        },
        {
            name: 'Date',
            selector: row => row.sales_order.date,
            sortable: true,
        },
        {
            name: 'Sent/order',
            selector: row => `${row.delivered} / ${row.ordered}`
        },
        {
            name: 'Status',
            selector: row => {
                const { delivered, ordered } = row
                if (delivered >= ordered) {
                    return <Badge
                        variant="filled"
                        color='green.6'
                        leftSection={<IconChecks />}
                    >
                        Finished
                    </Badge>
                }

                return <Badge
                    variant="filled"
                    color='blue.6'
                    leftSection={<IconCircleDotted />}
                >
                    On progress
                </Badge>
            }
        }
    ], [])



    return (
        <BaseTable
            column={columnOrderRelated}
            data={productOrderList}
            noData='Product ini belum pernah dipesan'
        />
    )
}

export default SectionOrderRelated