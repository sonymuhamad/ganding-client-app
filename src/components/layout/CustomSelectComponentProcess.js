import React from "react"
import { Text, Group } from "@mantine/core"

const CustomSelectComponentProcess = ({ label, order, ...others }) => {

    return (
        <div {...others} >
            <Group noWrap>
                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" color="dimmed">
                        Wip: {`Wip${order}`}
                    </Text>
                </div>
            </Group>
        </div>
    )
}

export default CustomSelectComponentProcess