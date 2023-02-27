import React from "react"
import { Text, Group } from "@mantine/core"

const CustomSelectComponentDetailMrp = ({ label, process, order, ...others }) => {

    return (
        <div {...others} >
            <Group noWrap>
                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" color="dimmed">
                        Process: {process}
                    </Text>
                    <Text size="xs" color="dimmed">
                        Wip: {`Wip${order}`}
                    </Text>
                </div>
            </Group>
        </div>
    )
}

export default CustomSelectComponentDetailMrp