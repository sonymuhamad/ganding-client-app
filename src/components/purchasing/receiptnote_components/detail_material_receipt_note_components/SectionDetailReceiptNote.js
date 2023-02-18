
import { TextInput, Group, Paper, Image, Textarea } from "@mantine/core"
import { IconUserCheck, IconCodeAsterix, IconCalendar, IconClipboardList } from "@tabler/icons"


const SectionDetailReceiptNote = (
    { supplierName, code, date, note, image }
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
                        alt='material receipt note image'
                        withPlaceholder
                    />
                </Paper>
            </Group>

        </>
    )
}

export default SectionDetailReceiptNote
