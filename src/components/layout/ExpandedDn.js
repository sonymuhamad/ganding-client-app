import React from "react";
import { Group, Text, TextInput, Textarea } from "@mantine/core";
import { IconNotes, IconAssembly, IconFileDollar, IconPackgeExport } from "@tabler/icons";



export default function ExpandedDn({ data }) {


    return (
        <>
            <Textarea icon={<IconNotes size={20} stroke={2} />}
                m='xs'
                radius='md'
                label='Note'
                readOnly
            />
            {data.productdelivercustomer_set.map(pdeliver => {

                return (

                    <Group
                        key={pdeliver.id}
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
                            label='Paid Status'
                            readOnly
                            value={pdeliver.paid ? 'Finished' : 'Pending'}
                        />
                    </Group>

                )
            })}

        </>
    )

}



