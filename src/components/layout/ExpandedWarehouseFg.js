import React from "react"
import { Paper, Group, TextInput } from "@mantine/core"
import { IconBarcode, IconCodeAsterix, IconTypography } from "@tabler/icons"

const ExpandedWarehouseFg = ({ data }) => {
    return (
        <Paper p='sm'  >
            <Group grow >
                <TextInput
                    icon={<IconBarcode />}
                    label='Product name'
                    value={data.product.name}
                    readOnly
                    radius='md'
                />

                <TextInput
                    icon={<IconTypography />}
                    label='Product type'
                    value={data.product.type.name}
                    readOnly
                    radius='md'
                />
            </Group>

            <Group grow my='xs' >
                <TextInput
                    icon={<IconCodeAsterix />}
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