import React from "react";
import { Button, TextInput, Group, Paper, Textarea, Text, FileButton, Image } from "@mantine/core";
import { IconUpload, IconTrash, IconCalendarEvent, IconUserCheck, IconCodeAsterix, IconClipboardCheck } from "@tabler/icons";
import { DatePicker } from "@mantine/dates";

import { ActionButtons, ReadOnlyTextInput } from "../../../custom_components";


const SectionDetailReceiptNoteMaterial = (
    {
        editAccess,
        form,
        handleSubmit,
        handleClickDeletebutton,
        handleClickEditButton,
        supplierName,
    }
) => {

    return (
        <>

            <ActionButtons
                editAccess={editAccess}
                formId='formDeliveryNoteMaterial'
                formState={form.isDirty()}
                handleClickEditButton={handleClickEditButton}
                handleClickDeletebutton={handleClickDeletebutton}
            />


            <form id='formDeliveryNoteMaterial' onSubmit={form.onSubmit(handleSubmit)} >


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
                    placeholder="Select material arrival date"
                    {...form.getInputProps('date')}
                />

                <TextInput
                    icon={<IconCodeAsterix />}
                    radius='md'
                    required
                    label='Receipt number'
                    readOnly={!editAccess}
                    {...form.getInputProps('code')}
                />

                <Textarea
                    icon={<IconClipboardCheck />}
                    radius='md'
                    label='Note'
                    readOnly={!editAccess}
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

export default SectionDetailReceiptNoteMaterial