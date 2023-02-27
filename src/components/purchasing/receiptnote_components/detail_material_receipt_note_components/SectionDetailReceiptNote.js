
import { Group, Paper, Image, Textarea } from "@mantine/core"
import { IconUserCheck, IconCodeAsterix, IconCalendar, IconClipboardList } from "@tabler/icons"
import { ReadOnlyTextInput } from "../../../custom_components"

const SectionDetailReceiptNote = (
    { supplierName, code, date, note, image }
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
                        alt='material receipt note image'
                        withPlaceholder
                    />
                </Paper>
            </Group>

        </>
    )
}

export default SectionDetailReceiptNote
