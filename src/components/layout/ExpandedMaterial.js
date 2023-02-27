import { Paper, Group, Text } from "@mantine/core"
import { IconScale, IconRuler2, IconDimensions, IconRulerMeasure } from "@tabler/icons"
import { ReadOnlyTextInput } from "../custom_components"

const ExpandedMaterial = ({ data }) => {

    const { weight, length, width, thickness } = data

    return (
        <Paper m='xs' >
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

export default ExpandedMaterial