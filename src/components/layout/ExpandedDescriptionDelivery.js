import { Paper, Textarea } from "@mantine/core"
import { IconBarcode, IconClipboard } from "@tabler/icons"
import { ReadOnlyTextInput } from "../custom_components"

const ExpandedDescriptionDelivery = ({ data }) => {

    const { description, product_order } = data
    const { product } = product_order
    const { code } = product

    return (
        <Paper
            p='xs'
        >
            <ReadOnlyTextInput
                m='xs'
                label='Product number'
                icon={<IconBarcode />}
                value={code}
            />

            <Textarea
                label='Keterangan'
                readOnly
                m='sm'
                radius='md'
                value={description}
                variant='filled'
                icon={<IconClipboard />}
            />

        </Paper>
    )

}

export default ExpandedDescriptionDelivery