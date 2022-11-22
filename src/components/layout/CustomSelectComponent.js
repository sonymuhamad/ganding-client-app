import React from "react"
import { Text, Group } from "@mantine/core"

const CustomSelectComponent = ({ label, date, quantity, unit = 'Pcs', ...others }) => {

    return (
        <div {...others} >
            <Group noWrap>
                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" color="dimmed">
                        Date: {date}
                    </Text>
                    <Text size="xs" color="dimmed">
                        Quantity: {quantity} {unit}
                    </Text>
                </div>
            </Group>
        </div>
    )
}

export default CustomSelectComponent