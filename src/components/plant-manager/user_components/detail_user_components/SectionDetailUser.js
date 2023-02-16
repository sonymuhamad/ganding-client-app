
import React from "react"
import { ActionButtons } from "../../../custom_components"
import { useConfirmDelete } from "../../../../hooks"
import { TextInput } from "@mantine/core"
import { IconUserCircle, IconAt, IconLogin } from "@tabler/icons"


const SectionDetailUser = (
    { editAccess, form, handleDeleteUser, handleClickEditButton, handleSubmit }
) => {

    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'User' })

    return (
        <>
            <ActionButtons
                editAccess={editAccess}
                formId='formEditUser'
                formState={form.isDirty()}
                handleClickEditButton={handleClickEditButton}
                handleClickDeleteButton={() => openConfirmDeleteData(handleDeleteUser)}
            />

            <form id='formEditUser' onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    radius='md'
                    m='xs'
                    label='Username'
                    placeholder="Input username"
                    readOnly={!editAccess}
                    icon={<IconUserCircle />}
                    {...form.getInputProps('username')}
                />

                <TextInput
                    radius='md'
                    m='xs'
                    label='Email'
                    readOnly={!editAccess}
                    placeholder="Input user email"
                    icon={<IconAt />}
                    {...form.getInputProps('email')}
                />

                <TextInput
                    radius='md'
                    m='xs'
                    label='Last login'
                    icon={<IconLogin />}
                    variant='filled'
                    readOnly
                    value={form.values.last_login ? new Date(form.values.last_login).toDateString() : ''}
                />


            </form>

        </>
    )
}

export default SectionDetailUser
