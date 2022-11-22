import React, { useMemo } from "react";
import { Group, TextInput, } from "@mantine/core";

import { IconBuildingFactory, IconFileTypography, IconBuildingWarehouse } from "@tabler/icons";

export default function ExpandedProduct({ data }) {

    const processList = useMemo(() => {
        return data.ppic_process_related.map(process => {

            const stock = process.warehouseproduct_set.filter((whproduct) => whproduct.warehouse_type.id !== 2)

            return (

                <Group position="left" spacing='xs' key={process.id} grow >
                    <TextInput icon={<IconBuildingFactory />}
                        m='xs'
                        radius='md'
                        label='Process name'
                        value={process.process_name}
                        readOnly
                    />
                    <TextInput icon={<IconFileTypography />}
                        m='xs'
                        radius='md'
                        label='Process Type'
                        readOnly
                        value={process.process_type.name}
                    />

                    <TextInput icon={<IconBuildingWarehouse />}
                        m='xs'
                        radius='md'
                        label={stock[0].warehouse_type.name}
                        readOnly
                        value={stock[0].quantity}
                    />

                </Group>

            )
        })
    }, [data.ppic_process_related])

    return (
        <>
            {processList}
        </>
    )


}
