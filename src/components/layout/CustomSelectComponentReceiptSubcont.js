import React from "react"
import { Text, Group } from "@mantine/core"

const CustomSelectComponentReceiptSubcont = ({ label, code, order, ...others }) => {

    return (
        <div {...others} >
            <Group noWrap>
                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" color="dimmed">
                        Product number: {code}
                    </Text>
                    <Text size="xs" color="dimmed">
                        Wip: {`Wip${order}`}
                    </Text>
                </div>
            </Group>
        </div>
    )
}

export default CustomSelectComponentReceiptSubcont