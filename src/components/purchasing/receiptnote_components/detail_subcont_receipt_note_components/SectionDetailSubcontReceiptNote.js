import { IconClipboardList, IconCalendar, IconUserCheck, IconCodeAsterix, } from "@tabler/icons"
import { Textarea, Group, Image, Paper } from "@mantine/core"
import { ReadOnlyTextInput } from "../../../custom_components"

const SectionDetailSubcontReceiptNote = (
    { supplierName, code, note, date, image }
) => {

    return (
        <>
            <ReadOnlyTextInput
                label='Supplier'
                m='xs'
                icon={<IconUserCheck />}
                value={supplierName}
            />

            <ReadOnlyTextInput
                label='Receipt number'
                m='xs'
                icon={<IconCodeAsterix />}
                value={code}
            />

            <ReadOnlyTextInput
                label='Receipt date'
                m='xs'
                icon={<IconCalendar />}
                value={new Date(date).toDateString()}
            />

            <Textarea
                label='Receipt descriptions'
                readOnly
                variant='filled'
                m='xs'
                radius='md'
                icon={<IconClipboardList />}
                value={note}
            />



            <Group my='lg' >
                <Paper>
                    <Image
                        radius='md'
                        src={image}
                        alt='product subconstruction image'
                        withPlaceholder
                    />
                </Paper>
            </Group>

        </>
    )
}

export default SectionDetailSubcontReceiptNote