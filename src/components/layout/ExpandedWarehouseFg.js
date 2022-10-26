import React from "react"
import { Paper, Group, TextInput } from "@mantine/core"

const ExpandedWarehouseFg = ({ data }) => {
    return (
        <Paper p='sm'  >
            <Group grow >
                <TextInput
                    label='Product name'
                    value={data.product.name}
                    readOnly
                    radius='md'
                />

                <TextInput
                    label='Product type'
                    value={data.product.type.name}
                    readOnly
                    radius='md'
                />
            </Group>

            <Group grow my='xs' >
                <TextInput
                    label='Product number'
                    value={data.product.code}
                    readOnly
                    radius='md'
                />
            </Group>

        </Paper>
    )
}

export default ExpandedWarehouseFg