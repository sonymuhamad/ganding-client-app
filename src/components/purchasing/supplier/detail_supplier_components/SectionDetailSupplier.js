
import { ActionButtons } from "../../../custom_components"
import { IconUserCheck, IconMapPins, IconDeviceMobile, IconAt } from "@tabler/icons";
import { TextInput, Textarea, NumberInput } from "@mantine/core";


const SectionDetailSupplier = (
    { form, editAccess, handleClickEditButton, handleClickDeleteButton, handleEdit }
) => {

    return (
        <>

            <ActionButtons
                editAccess={editAccess}
                formId='formEditSupplier'
                handleClickEditButton={handleClickEditButton}
                handleClickDeleteButton={handleClickDeleteButton}
                formState={form.isDirty()}
            />

            <form id="formEditSupplier" onSubmit={form.onSubmit(handleEdit)} >

                <TextInput
                    label='Name'
                    placeholder="Input supplier name"
                    radius='md'
                    required
                    readOnly={!editAccess}
                    m='xs'
                    icon={<IconUserCheck />}
                    {...form.getInputProps('name')}
                />

                <TextInput
                    readOnly={!editAccess}
                    label='Email'
                    placeholder="Input supplier email"
                    radius='md'
                    m='xs'
                    required
                    icon={<IconAt />}
                    {...form.getInputProps('email')}
                />

                <NumberInput
                    disabled={!editAccess}
                    min={0}
                    label='Phone'
                    placeholder="Input supplier phone number"
                    radius='md'
                    m='xs'
                    required
                    hideControls
                    icon={<IconDeviceMobile />}
                    {...form.getInputProps('phone')}
                />

                <Textarea
                    readOnly={!editAccess}
                    label='Address'
                    placeholder="Supplier address"
                    radius='md'
                    m='xs'
                    required
                    icon={<IconMapPins />}
                    {...form.getInputProps('address')}
                />

            </form>


        </>
    )

}

export default SectionDetailSupplier