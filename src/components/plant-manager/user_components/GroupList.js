import React, { useState, useEffect, useMemo, useCallback } from "react"

import { useRequest, useNotification } from "../../../hooks"
import { BaseTableExpanded, BaseTable } from "../../tables"
import { Paper, Text } from "@mantine/core"
import { openConfirmModal } from "@mantine/modals"
import { NavigationDetailButton, ButtonDelete } from '../../custom_components'


const ExpandedGroup = ({ data }) => {

    const { Put } = useRequest()
    const { successNotif, failedNotif } = useNotification()

    const handleRemove = useCallback(async (val) => {
        const validated_data = {
            id: val.user_id,
            username: val.username,
            group: val.group_id
        }
        try {
            await Put(val.user_id, validated_data, 'user-remove-group')
            successNotif(`Remove ${val.username} from ${val.group_name} success `)
            data.handleRemove(val.group_id, val.user_id)
        } catch (e) {
            failedNotif('Remove user from division failed')
        }
    }, [data, successNotif, failedNotif])

    const openConfirmRemoveDivision = useCallback((val) => openConfirmModal({
        title: `Remove ${val.username} from ${val.group_name} `,
        children: (
            <Text size="sm">
                Are you sure?, the user will no longer have access in this division.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, remove', cancel: "No, don't remove it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleRemove(val)
    }), [handleRemove])

    const dataUser = useMemo(() => {
        return data.user_set
    }, [data.user_set])

    const columnUsers = useMemo(() => [
        {
            name: 'Username',
            selector: row => row.username,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email
        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/plant-manager/users/${row.id}`}
            />
        },
        {
            name: '',
            selector: row => {
                const { username, id } = row
                return (<ButtonDelete
                    onClick={() => openConfirmRemoveDivision({ group_id: data.id, user_id: id, group_name: data.name, username: username })}
                />)
            }
        }
    ], [data, openConfirmRemoveDivision])

    return (
        <Paper p='xs' m='xs' >

            <BaseTable
                column={columnUsers}
                data={dataUser}
            />

        </Paper>
    )
}


const GroupList = () => {

    const { Get } = useRequest()
    const [dataGroup, setDataGroup] = useState([])

    const columnGroupList = useMemo(() => [
        {
            name: 'Division',
            selector: row => row.name
        },
        {
            name: 'Number of user',
            selector: row => row.number_of_user
        }
    ], [])

    const handleRemoveUserFromGroup = useCallback((id_group, id_user) => {
        setDataGroup(groups => {
            return groups.map(group => {
                if (group.id !== id_group) {
                    return group
                }
                const user_set = group.user_set.filter(user => user.id !== id_user)
                return { ...group, number_of_user: user_set.length, user_set: user_set }
            })
        })
    }, [])

    useEffect(() => {

        Get('group').then(data => {
            setDataGroup(data.map(dt => ({ ...dt, handleRemove: handleRemoveUserFromGroup })))
        })

    }, [])

    return (
        <>

            <BaseTableExpanded
                column={columnGroupList}
                data={dataGroup}
                expandComponent={ExpandedGroup}
                pagination={false}
            />

        </>
    )
}

export default GroupList
