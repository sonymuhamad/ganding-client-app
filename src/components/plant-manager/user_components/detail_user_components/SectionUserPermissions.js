import React, { useState, useCallback, useEffect, useMemo } from "react"
import { useForm } from "@mantine/form"
import { ModalForm, ButtonAdd, HeadSection, ButtonDelete } from "../../../custom_components"
import { SuccessNotif, FailedNotif } from "../../../notifications"
import { useRequest, useConfirmDelete } from "../../../../hooks"

import { Select } from "@mantine/core"
import { IconAccessPoint } from "@tabler/icons"
import { openModal, closeAllModals } from "@mantine/modals"
import { BaseTable } from "../../../tables"

const ModalAddPermission = ({ userId, setAddPermission }) => {

    const { Put, Retrieve } = useRequest()
    const [permissionList, setPermissionList] = useState([])
    const form = useForm({
        initialValues: {
            id_permission: null
        }
    })

    useEffect(() => {
        Retrieve(userId, 'permission-list').then(data => {
            setPermissionList(data)
        })
    }, [userId])

    const handleSubmit = async (value) => {
        try {
            const addedPermission = await Put(userId, value, 'user-add-permission-management')
            setAddPermission(addedPermission)
            SuccessNotif('Permission added success')
            closeAllModals()
        } catch (e) {
            console.log(e)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else {
                FailedNotif('Add division failed')
            }
        }
    }

    return (
        <ModalForm
            formId='formAddPermission'
            onSubmit={form.onSubmit(handleSubmit)}  >

            <Select
                label='Permission'
                placeholder="Select permission"
                radius='md'
                m='xs'
                searchable
                nothingFound="There is no permissions left to granted"
                required
                data={permissionList.map(permission => ({ value: permission.id, label: permission.name }))}
                icon={<IconAccessPoint />}
                {...form.getInputProps('id_permission')}
            />

        </ModalForm>
    )
}


const SectionUserPermissions = ({
    handleDeletePermission, setAddPermission, permissionList, userId
}) => {

    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Permission' })

    const columnPermission = useMemo(() => [
        {
            name: 'Permission name',
            selector: row => row.name
        },
        {
            name: 'Permission for division',
            selector: row => row.content_type.app_label === 'auth' ? "Manager" : row.content_type.app_label.toUpperCase()
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeletePermission(row.id))}
            />
        }
    ], [handleDeletePermission, openConfirmDeleteData])

    const openAddPermission = useCallback(() => openModal({
        title: 'Add permission',
        radius: 'md',
        size: 'lg',
        children: <ModalAddPermission userId={userId} setAddPermission={setAddPermission} />
    }), [setAddPermission, userId])



    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openAddPermission}
                >
                    Permission
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={columnPermission}
                data={permissionList}
                noData="This user doesn't have any permission to manage data"
            />

        </>
    )
}

export default SectionUserPermissions