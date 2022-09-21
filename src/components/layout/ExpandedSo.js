import React from "react";
import { Group, TextInput } from "@mantine/core";

import { IconAssembly, IconChecklist, IconPackgeExport, IconCodeAsterix } from "@tabler/icons";

export default function ExpandedSo({ data }) {


    return (
        <>
            {data.productorder_set.map((product) => {

                return (

                    <Group position="left" spacing='xs' >
                        <TextInput icon={<IconAssembly size={15} stroke={2} />}
                            m='xs'
                            radius='md'
                            label='Product name'
                            value={product.product.name}
                            readOnly
                        />
                        <TextInput icon={<IconChecklist size={15} stroke={2} />}
                            m='xs'
                            radius='md'
                            label='Ordered'
                            readOnly
                            value={product.ordered}
                        />
                        <TextInput icon={<IconPackgeExport size={15} stroke={2} />}
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

