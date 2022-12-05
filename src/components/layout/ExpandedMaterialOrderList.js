import React from "react";
import { Paper, Group, TextInput } from "@mantine/core";
import { IconDimensions, IconScale, IconRuler2, IconRulerMeasure, IconAsset, IconPerspective } from "@tabler/icons";


export default function ExpandedMaterialOrderList({ data }) {

    return (
        <Paper m='xs' >

            <Group m='xs' grow >

                <TextInput
                    readOnly
                    radius='md'
                    variant="filled"
                    icon={<IconAsset />}
                    label='Material name'
                    value={data.material.name}
                />

                <TextInput
                    readOnly
                    radius='md'
                    variant="filled"
                    icon={<IconPerspective />}
                    label='Specifications'
                    value={data.material.spec}
                />

            </Group>

            <Group m='xs' grow >

                <TextInput
                    icon={<IconScale />}
                    label='Weight'
                    readOnly
                    radius='md'
                    variant='filled'
                    value={data.material.weight}
                />
                <TextInput
                    label='Length'
                    readOnly
                    icon={<IconRuler2 />}
                    value={data.material.length}
                    variant='filled'
                    radius='md'
                />
                <TextInput
                    label='Width'
                    readOnly
                    radius='md'
                    icon={<IconDimensions />}
                    variant='filled'
                    value={data.material.width}
                />
                <TextInput
                    readOnly
                    radius='md'
                    label='Thickness'
                    variant='filled'
                    icon={<IconRulerMeasure />}
                    value={data.material.thickness}
                />
            </Group>

        </Paper>
    )
}