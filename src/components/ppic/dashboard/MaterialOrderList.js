import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks/useRequest";
import BaseTableExpanded from "../../tables/BaseTableExpanded";
import { Paper, Group, TextInput, Text } from "@mantine/core";
import { IconAsset, IconAtom2, IconDimensions, IconPerspective, IconRuler2, IconRulerMeasure, IconScale, IconUserCheck } from "@tabler/icons";


const ExpandedMaterialList = ({ data }) => {

    return (
        <Paper m='xs' >

            <TextInput
                label='Supplier name'
                readOnly
                variant="filled"
                icon={<IconUserCheck />}
                radius='md'
                m='xs'
                value={data.supplier.name}
            />

            <TextInput
                label='Material name'
                readOnly
                variant="filled"
                icon={<IconAsset />}
                radius='md'
                m='xs'
                value={data.name}
            />

            <Group grow m='xs' >

                <TextInput
                    label='Specification material'
                    readOnly
                    variant="filled"
                    radius='md'
                    icon={<IconPerspective />}
                    value={data.spec}
                />

                <TextInput
                    label='Unit of material'
                    readOnly
                    variant="filled"
                    radius='md'
                    icon={<IconAtom2 />}
                    value={data.uom.name}
                />

            </Group>

            <Group grow m='xs' >

                <TextInput
                    label='length'
                    readOnly
                    variant="filled"
                    radius='md'
                    icon={<IconRuler2 />}
                    value={data.length}
                    rightSection={<Text size='sm' color='dimmed' >
                        mm
                    </Text>}
                />

                <TextInput
                    label='width'
                    readOnly
                    variant="filled"
                    radius='md'
                    icon={<IconDimensions />}
                    value={data.width}
                    rightSection={<Text size='sm' color='dimmed' >
                        mm
                    </Text>}
                />

                <TextInput
                    label='thickness'
                    readOnly
                    variant='filled'
                    radius='md'
                    icon={<IconRulerMeasure />}
                    value={data.thickness}
                    rightSection={<Text size='sm' color='dimmed' >
                        mm
                    </Text>}
                />

                <TextInput
                    label='weight'
                    readOnly
                    variant='filled'
                    radius='md'
                    icon={<IconScale />}
                    value={data.weight}
                    rightSection={<Text size='sm' color='dimmed' >
                        Kg
                    </Text>}
                />

            </Group>


        </Paper>
    )
}


const MaterialOrderList = () => {

    const { Get } = useRequest()
    const [materialList, setMaterialList] = useState([])


    const columnMaterialOrderList = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.name
        },
        {
            name: 'Material specification',
            selector: row => row.spec
        },
        {
            name: 'Supplier',
            selector: row => row.supplier.name
        },
        {
            name: 'Rest material arrival',
            selector: row => `${row.rest_arrival} ${row.uom.name}`
        }
    ], [])

    useEffect(() => {
        const fetch = async () => {
            try {
                const materialOrderList = await Get('list-material-in-order')

                setMaterialList(materialOrderList)

            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [])


    return (
        <>

            <BaseTableExpanded
                column={columnMaterialOrderList}
                data={materialList}
                expandComponent={ExpandedMaterialList}
                noData={'No upcoming material'}
            />

        </>
    )

}

export default MaterialOrderList
