
import { IconClipboardList, IconCalendar, IconUserCheck, IconCodeAsterix, } from "@tabler/icons"
import { TextInput, Textarea, Group, Image, Paper } from "@mantine/core"


const SectionDetailSubcontReceiptNote = (
    { supplierName, code, note, date, image }
) => {

    return (
        <>
            <TextInput
                label='Supplier'
                readOnly
                variant='filled'
                m='xs'
                radius='md'
                icon={<IconUserCheck />}
                value={supplierName}
            />

            <TextInput
                label='Receipt number'
                readOnly
                variant='filled'
                m='xs'
                radius='md'
                icon={<IconCodeAsterix />}
                value={code}
            />

            <TextInput
                label='Receipt date'
                readOnly
                variant='filled'
                m='xs'
                radius='md'
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