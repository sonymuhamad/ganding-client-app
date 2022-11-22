import React from "react"
import { Text, Group } from "@mantine/core"

const CustomSelectComponentProduct = ({ label, code, ...others }) => {

    return (
        <div {...others} >
            <Group noWrap>
                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" color="dimmed">
                        Product number: {code}
                    </Text>
                </div>
            </Group>
        </div>
    )
}

export default CustomSelectComponentProduct