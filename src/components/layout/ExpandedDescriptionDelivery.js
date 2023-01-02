import { Textarea } from "@mantine/core"
import { IconClipboard } from "@tabler/icons"

const ExpandedDescriptionDelivery = ({ data }) => {

    const { description } = data

    return (
        <Textarea
            label='Keterangan'
            readOnly
            m='sm'
            radius='md'
            value={description}
            variant='filled'
            icon={<IconClipboard />}
        />
    )

}

export default ExpandedDescriptionDelivery