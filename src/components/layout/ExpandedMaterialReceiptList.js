import { Paper, Group, Text } from "@mantine/core"
import { IconScale, IconRuler2, IconDimensions, IconRulerMeasure, IconCodeAsterix, IconCalendar } from "@tabler/icons"
import { ReadOnlyTextInput } from "../custom_components"

const ExpandedMaterialReceiptList = ({ data }) => {
    const { material_order } = data
    const { material, purchase_order_material } = material_order
    const { weight, length, width, thickness } = material
    const { code, date } = purchase_order_material

    return (
        <Paper m='xs' >

            <Group
                grow
                m='xs'
            >
                <ReadOnlyTextInput
                    label='Purchase order number'
                    icon={<IconCodeAsterix />}
                    value={code}
                />

                <ReadOnlyTextInput
                    value={date}
                    label='Purchase order date'
                    icon={<IconCalendar />}
                />

            </Group>

            <Group m='xs' grow >

                <ReadOnlyTextInput
                    icon={<IconScale />}
                    label='Weight'
                    value={weight}
                    rightSection={<Text
                        color='dimmed'
                        size='sm'
                    >
                        mm
                    </Text>}
                />

                <ReadOnlyTextInput
                    label='Length'
                    rightSection={<Text
                        color='dimmed'
                        size='sm'
                    >
                        mm
                    </Text>}
                    icon={<IconRuler2 />}
                    value={length}
                />
                <ReadOnlyTextInput
                    label='Width'
                    rightSection={<Text
                        color='dimmed'
                        size='sm'
                    >
                        mm
                    </Text>}
                    icon={<IconDimensions />}
                    value={width}
                />
                <ReadOnlyTextInput
                    rightSection={<Text
                        color='dimmed'
                        size='sm'
                    >
                        mm
                    </Text>}
                    label='Thickness'
                    icon={<IconRulerMeasure />}
                    value={thickness}
                />
            </Group>
        </Paper>
    )
}

export default ExpandedMaterialReceiptList