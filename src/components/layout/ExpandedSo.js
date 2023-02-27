import React, { useMemo } from "react";
import { Group, TextInput } from "@mantine/core";

import { IconAssembly, IconChecklist, IconPackgeExport } from "@tabler/icons";

export default function ExpandedSo({ data }) {

    const salesOrderList = useMemo(() => {
        return data.productorder_set.map((product) => {

            return (

                <Group position="left" spacing='xs' grow key={product.id} >
                    <TextInput icon={<IconAssembly />}
                        m='xs'
                        radius='md'
                        label='Product name'
                        value={product.product.name}
                        readOnly
                    />
                    <TextInput icon={<IconChecklist />}
                        m='xs'
                        radius='md'
                        label='Ordered'
                        readOnly
                        value={product.ordered}
                    />
                    <TextInput icon={<IconPackgeExport />}
                        m='xs'
                        readOnly
                        radius='md'
                        label='Delivered'
                        value={product.delivered}
                    />
                </Group>
            )
        })
    }, [data.productorder_set])

    return (
        <>
            {salesOrderList}
        </>
    )

}

