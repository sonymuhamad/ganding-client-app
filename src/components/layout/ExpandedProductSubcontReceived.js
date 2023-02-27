import { Paper, Group, Text } from "@mantine/core"
import { IconBarcode, IconRegex, IconAssemblyOff, IconPackgeImport, IconTimeline, IconSortAscending2 } from "@tabler/icons"
import { ReadOnlyTextInput } from "../custom_components"

const ExpandedProductSubcontReceived = ({ data }) => {

    const { product_subcont, quantity, quantity_not_good } = data
    const { product, process } = product_subcont
    const { name, code } = product
    const { process_name, order } = process

    return (
        <Paper p='xs' >

            <ReadOnlyTextInput
                m='xs'
                label='Product name'
                value={name}
                icon={<IconBarcode />}
            />

            <ReadOnlyTextInput
                m='xs'

                label='Product number'
                value={code}
                icon={<IconRegex />}
            />

            <Group m='xs' grow >

                <ReadOnlyTextInput
                    label='Process name'
                    value={process_name}
                    icon={<IconTimeline />}
                />

                <ReadOnlyTextInput
                    label='Wip'
                    value={`Wip${order}`}
                    icon={<IconSortAscending2 />}
                />

            </Group>


            <Group grow m='xs'>
                <ReadOnlyTextInput
                    label='Quantity received'
                    value={quantity}
                    icon={<IconPackgeImport />}
                    rightSection={<Text size='sm' color='dimmed' >
                        Pcs
                    </Text>}
                />

                <ReadOnlyTextInput
                    label='Product not good'
                    rightSection={<Text size='sm' color='dimmed' >
                        Pcs
                    </Text>}
                    icon={<IconAssemblyOff />}
                    value={quantity_not_good}

                />
            </Group>
        </Paper>
    )
}

export default ExpandedProductSubcontReceived