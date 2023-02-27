import React from "react";
import { Paper, Textarea } from "@mantine/core";
import { IconClipboard } from "@tabler/icons";


export default function ExpandedPurchaseOrder({ data }) {

    const { description } = data


    return (
        <Paper
            m='xs'
        >
            <Textarea
                readOnly
                label='Keterangan'
                variant='filled'
                radius='md'
                icon={<IconClipboard />}
                value={description}
            />
        </Paper>
    )
}