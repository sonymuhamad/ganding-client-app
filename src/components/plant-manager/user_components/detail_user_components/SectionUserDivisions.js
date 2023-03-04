import { ButtonDelete, ButtonAdd, HeadSection, ModalForm } from "../../../custom_components"
import { useForm } from "@mantine/form"
import { Select } from "@mantine/core"
import React, { useState, useEffect, useCallback, useMemo } from "react"

import { useRequest, useConfirmDelete, useNotification } from "../../../../hooks"
import { BaseTable } from "../../../tables"
import { IconBuildingCommunity } from "@tabler/icons"
import { openModal, closeAllModals } from "@mantine/modals"



const ModalAddGroup = ({ userId, setAddGroup }) => {

    const { successNotif, failedNotif } = useNotification()
    const { Put, GetAndExpiredTokenHandler } = useRequest()
    const [groupList, setGroupList] = useState([])
    const form = useForm({
        initialValues: {
            group: null
        }
    })

    useEffect(() => {
        GetAndExpiredTokenHandler('group').then(data => {
            setGroupList(data)
        })
    }, [])

    const handleSubmit = async (value) => {
        try {
            const addedGroup = await Put(userId, value, 'user-add-group')
            setAddGroup(addedGroup)
            successNotif('Add division success')
            closeAllModals()
        } catch (e) {
            failedNotif(e, 'Add division failed')
        }
    }

    return (
        <ModalForm
            formId='formAddGroups'
            onSubmit={form.onSubmit(handleSubmit)}  >

            <Select
                label='Division'
                placeholder="Select division to add"
                radius='md'
                m='xs'
                searchable
                nothingFound="No division"
                required
                data={groupList.map(group => ({ value: group.id, label: group.name }))}
                icon={<IconBuildingCommunity />}
                {...form.getInputProps('group')}
            />

        </ModalForm>
    )
}

const SectionUserDivisions = (
    { groupList, handleAddGroups, handleDeleteGroup, userId }
) => {

    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Division' })

    const columnGroup = useMemo(() => [
        {
            name: 'Division name',
            selector: row => row.name.toUpperCase()
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteGroup(row.id))}
            />
        }
    ], [openConfirmDeleteData, handleDeleteGroup])


    const openAddGroup = useCallback(() => openModal({
        title: 'Add division',
        radius: 'md',
        size: 'lg',
        children: <ModalAddGroup userId={userId} setAddGroup={handleAddGroups} />
    }), [handleAddGroups, userId])

    return (
        <>
            <HeadSection>
                <ButtonAdd
                    onClick={openAddGroup}
                >
                    Division
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={columnGroup}
                data={groupList}
                noData="This user doesn't have any division"
            />

        </>
    )
}

export default SectionUserDivisions