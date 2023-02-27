import React from "react"
import { Text, Group } from "@mantine/core"

const CustomSelectComponentSalesOrder = ({ label, customerName, salesOrderDate, ...others }) => {

    return (
        <div {...others} >
            <Group noWrap>
                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" color="dimmed">
                        Customer name: {customerName}
                    </Text>
                    <Text size="xs" color="dimmed">
                        Sales order date: {salesOrderDate}
                    </Text>
                </div>
            </Group>
        </div>
    )
}

export default CustomSelectComponentSalesOrder