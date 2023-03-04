import React from "react";
import { Group, Image, Paper } from "@mantine/core";
import { IconUserCheck, IconAsset, IconPerspective, IconAtom2, IconRuler2, IconRulerMeasure, IconDimensions, IconBuildingWarehouse, IconScale } from "@tabler/icons";

import { ReadOnlyTextInput } from "../../../custom_components";

const SectionDetailMaterial = (
    { detailMaterial }
) => {

    const { name, image, weight, width, thickness, length, uom, warehousematerial, supplier, spec } = detailMaterial


    return (
        <>

            <ReadOnlyTextInput
                icon={<IconUserCheck />}
                label='Supplier'
                value={supplier.name}
            />

            <ReadOnlyTextInput
                icon={<IconAsset />}
                label='Material name'
                my='xs'
                placeholder="Input material name"
                value={name}
            />

            <Group mb='xs' grow >
                <ReadOnlyTextInput
                    icon={<IconPerspective />}
                    label='Material specification'
                    value={spec}
                    placeholder="Input material specification"
                />


                <ReadOnlyTextInput
                    icon={<IconAtom2 />}
                    label='Unit of material'
                    placeholder="select an unit of material"
                    value={uom.name}
                />

                <ReadOnlyTextInput
                    icon={<IconBuildingWarehouse />}
                    label='Stock in warehouse'
                    value={warehousematerial.quantity}
                />


            </Group>

            <Group grow >

                <ReadOnlyTextInput
                    icon={<IconRuler2 />}
                    value={length}
                    label='Length'
                    placeholder="length of material"
                />

                <ReadOnlyTextInput
                    icon={<IconDimensions />}
                    label='Width'
                    value={width}
                    placeholder="width of material"
                />

                <ReadOnlyTextInput
                    icon={<IconRulerMeasure />}
                    label='Thickness'
                    value={thickness}
                    placeholder="thickness of material"
                />
                <ReadOnlyTextInput
                    icon={<IconScale />}
                    label='Kg/pcs'
                    value={weight}
                    placeholder="weight of material"
                />
            </Group>


            <Group my='lg' >
                <Paper>
                    <Image
                        radius='md'
                        src={image}
                        alt='product image'
                        withPlaceholder
                    />
                </Paper>

            </Group>
        </>
    )

}

export default SectionDetailMaterial