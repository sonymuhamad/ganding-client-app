import React from "react"
import { Paper, Group } from "@mantine/core"
import { IconBarcode, IconCodeAsterix, IconTypography } from "@tabler/icons"
import { ReadOnlyTextInput } from "../custom_components"

const ExpandedWarehouseFg = ({ data }) => {
    return (
        <Paper p='sm'  >
            <Group grow >
                <ReadOnlyTextInput
                    icon={<IconBarcode />}
                    label='Product name'
                    value={data.product.name}
                />

                <ReadOnlyTextInput
                    icon={<IconTypography />}
                    label='Product type'
                    value={data.product.type.name}
                />
            </Group>

            <Group grow my='xs' >
                <ReadOnlyTextInput
                    icon={<IconCodeAsterix />}
                    label='Product number'
                    value={data.product.code}
                />
            </Group>

        </Paper>
    )
}

export default ExpandedWarehouseFg