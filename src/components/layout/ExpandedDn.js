import React from "react";
import { Group, TextInput, Textarea } from "@mantine/core";
import { IconNotes, IconAssembly, IconFileDollar, IconPackgeExport } from "@tabler/icons";



export default function ExpandedDn({ data }) {

    return (
        <>
            <Textarea icon={<IconNotes size={20} stroke={2} />}
                m='xs'
                radius='md'
                label='Note'
                readOnly
                value={data.note}
            />
            {data.productdelivercustomer_set.map(pdeliver => {

                return (

                    <Group
                        key={pdeliver.id}
                        m='xs'
                        style={{ backgroundColor: pdeliver.paid ? '#b2f2bb' : '#ffc9c9' }}
                        radius='md' >

                        <TextInput icon={<IconAssembly />}
                            m='xs'
                            radius='md'
                            label='Product'
                            value={pdeliver.product_order.product.name}
                            readOnly
                        />
                        <TextInput icon={<IconPackgeExport />}
                            m='xs'
                            radius='md'
                            label='Delivered'
                            readOnly
                            value={pdeliver.quantity}
                        />
                        <TextInput icon={<IconFileDollar />}
                            m='xs'
                            radius='md'
                            label='Invoice status'
                            readOnly
                            value={pdeliver.paid ? 'Finished' : 'Pending'}
                        />
                    </Group>

                )
            })}

        </>
    )

}



