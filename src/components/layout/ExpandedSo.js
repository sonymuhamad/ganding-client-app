import React from "react";
import { Group, TextInput } from "@mantine/core";

import { IconAssembly, IconChecklist, IconPackgeExport, IconCodeAsterix } from "@tabler/icons";

export default function ExpandedSo({ data }) {


    return (
        <>
            {data.productorder_set.map((product) => {

                return (

                    <Group position="left" spacing='xs' key={product.id} >
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
            })}
        </>
    )

}

