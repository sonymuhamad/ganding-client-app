import React from "react"
import { Text, Group } from "@mantine/core"

const CustomSelectComponentMrp = ({ label, quantity, unit, spec, ...others }) => {

    return (
        <div {...others} >
            <Group noWrap>
                <div>
                    <Text size="sm">{label}</Text>
                    <Text size='xs' color='dimmed' >{spec}</Text>
                    <Text size="xs" color="dimmed">
                        Quantity : {`${quantity}  ${unit.name}`}
                    </Text>
                </div>
            </Group>
        </div>
    )
}

export default CustomSelectComponentMrp