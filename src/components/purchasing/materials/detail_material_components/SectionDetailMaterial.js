import React from "react";
import { TextInput, Group, Image, Paper } from "@mantine/core";
import { IconUserCheck, IconAsset, IconPerspective, IconAtom2, IconRuler2, IconRulerMeasure, IconDimensions, IconBuildingWarehouse, IconScale } from "@tabler/icons";


const SectionDetailMaterial = (
    { detailMaterial }
) => {

    const { name, image, weight, width, thickness, length, uom, warehousematerial, supplier, spec } = detailMaterial


    return (
        <>

            <TextInput
                variant='filled'
                icon={<IconUserCheck />}
                label='Supplier'
                radius='md'
                readOnly
                value={supplier.name}
            />

            <TextInput
                variant='filled'
                icon={<IconAsset />}
                label='Material name'
                my='xs'
                readOnly
                placeholder="Input material name"
                radius='md'
                value={name}
            />

            <Group mb='xs' grow >
                <TextInput
                    variant='filled'
                    icon={<IconPerspective />}
                    readOnly
                    label='Material specification'
                    radius='md'
                    value={spec}
                    placeholder="Input material specification"
                />


                <TextInput
                    variant='filled'
                    icon={<IconAtom2 />}
                    label='Unit of material'
                    readOnly
                    radius='md'
                    placeholder="select an unit of material"
                    value={uom.name}
                />

                <TextInput
                    variant='filled'
                    icon={<IconBuildingWarehouse />}
                    label='Stock in warehouse'
                    radius='md'
                    value={warehousematerial.quantity}
                    readOnly
                />


            </Group>

            <Group grow >

                <TextInput
                    variant='filled'
                    icon={<IconRuler2 />}
                    value={length}
                    label='Length'
                    readOnly
                    radius='md'
                    placeholder="length of material"
                />

                <TextInput
                    variant='filled'
                    icon={<IconDimensions />}
                    label='Width'
                    readOnly
                    value={width}
                    placeholder="width of material"
                    radius='md'
                />

                <TextInput
                    variant='filled'
                    icon={<IconRulerMeasure />}
                    label='Thickness'
                    readOnly
                    value={thickness}
                    placeholder="thickness of material"
                    radius='md'
                />
                <TextInput
                    variant='filled'
                    icon={<IconScale />}
                    label='Kg/pcs'
                    readOnly
                    value={weight}
                    placeholder="weight of material"
                    radius='md'
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