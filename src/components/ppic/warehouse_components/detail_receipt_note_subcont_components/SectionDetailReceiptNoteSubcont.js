import React from "react";
import { Button, Text, Group, TextInput, Textarea, FileButton, Paper, Image, } from "@mantine/core";
import { IconTrash, IconUpload, IconUserCheck, IconClipboardCheck, IconCodeAsterix, IconCalendarEvent, } from "@tabler/icons";
import { DatePicker } from "@mantine/dates";

import { ActionButtons, ReadOnlyTextInput } from "../../../custom_components";


const SectionDetailReceiptNoteSubcont = ({
    form,
    editAccess,
    handleClickEditButton,
    handleClickDeleteButton,
    handleSubmit,
    supplierName,
}) => {

    return (
        <>

            <ActionButtons
                formId='formReceiptNoteSubcont'
                formState={form.isDirty()}
                editAccess={editAccess}
                handleClickDeleteButton={handleClickDeleteButton}
                handleClickEditButton={handleClickEditButton}
            />

            <form id='formReceiptNoteSubcont' onSubmit={form.onSubmit(handleSubmit)} >

                <ReadOnlyTextInput
                    icon={<IconUserCheck />}
                    label='Supplier'
                    value={supplierName}
                />

                <DatePicker
                    icon={<IconCalendarEvent />}
                    radius='md'
                    label='Date'
                    disabled={!editAccess}
                    required
                    placeholder="Select arrival date"
                    {...form.getInputProps('date')}
                />

                <TextInput
                    icon={<IconCodeAsterix />}
                    radius='md'
                    required
                    placeholder="Input receipt number"
                    label='Receipt number'
                    readOnly={!editAccess}
                    {...form.getInputProps('code')}
                />

                <Textarea
                    icon={<IconClipboardCheck />}
                    radius='md'
                    label='Receipt description'
                    readOnly={!editAccess}
                    placeholder='Input receipt informations'
                    {...form.getInputProps('note')}

                />

            </form>

            <Group my='lg' >
                <Paper>
                    <Image
                        radius='md'
                        src={form.values.image}
                        alt='product image'
                        withPlaceholder
                    />
                </Paper>

                <FileButton
                    radius='md'
                    leftIcon={<IconUpload />}
                    style={{ display: !editAccess ? 'none' : form.values.image === null ? '' : 'none' }}
                    {...form.getInputProps('image')}
                    accept="image/png,image/jpeg" >
                    {(props) => <Button   {...props}>Upload image</Button>}
                </FileButton>

                <Button
                    radius='md'
                    leftIcon={<IconTrash />}
                    color='red.7'
                    onClick={() => {
                        form.setFieldValue('image', null)
                        form.setDirty('image')
                    }}
                    style={{ display: !editAccess ? 'none' : form.values.image !== null ? '' : 'none' }} >
                    Delete image
                </Button>

                {form.values.image && (
                    <Text size="sm" color='dimmed' align="center" mt="sm">
                        {form.values.image.name}
                    </Text>
                )}
            </Group>




        </>
    )
}

export default SectionDetailReceiptNoteSubcont