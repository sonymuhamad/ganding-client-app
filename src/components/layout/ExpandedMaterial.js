import { Paper, TextInput, Group } from "@mantine/core"
import { IconScale, IconRuler2, IconDimensions, IconRulerMeasure } from "@tabler/icons"

const ExpandedMaterial = ({ data }) => {

    return (
        <Paper m='xs' >
            <Group m='xs' grow >

                <TextInput
                    icon={<IconScale />}
                    label='Weight'
                    readOnly
                    radius='md'
                    variant='filled'
                    value={data.weight}
                />
                <TextInput
                    label='Length'
                    readOnly
                    icon={<IconRuler2 />}
                    value={data.length}
                    variant='filled'
                    radius='md'
                />
                <TextInput
                    label='Width'
                    readOnly
                    radius='md'
                    icon={<IconDimensions />}
                    variant='filled'
                    value={data.width}
                />
                <TextInput
                    readOnly
                    radius='md'
                    label='Thickness'
                    variant='filled'
                    icon={<IconRulerMeasure />}
                    value={data.thickness}
                />
            </Group>

        </Paper>
    )
}

export default ExpandedMaterial