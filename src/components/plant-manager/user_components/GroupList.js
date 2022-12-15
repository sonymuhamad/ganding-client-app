import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useRequest } from "../../../hooks";
import { BaseTableExpanded, BaseTable } from "../../tables";
import { Paper, Button, Text } from "@mantine/core";
import { IconDotsCircleHorizontal, IconTrash } from "@tabler/icons";

import { Link } from "react-router-dom";
import { openConfirmModal } from "@mantine/modals";
import { FailedNotif, SuccessNotif } from "../../notifications";


const ExpandedGroup = ({ data }) => {

    const { Put } = useRequest()

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
    }), [])

    const handleRemove = useCallback(async (val) => {
        const validated_data = {
            id: val.user_id,
            username: val.username,
            group: val.group_id
        }
        try {
            await Put(val.user_id, validated_data, 'user-remove-group')
            SuccessNotif(`Remove ${val.username} from ${val.group_name} success `)
            data.handleRemove(val.group_id, val.user_id)
        } catch (e) {
            console.log(e)
            FailedNotif('Remove user from division failed')
        }
    }, [])


    const dataUser = useMemo(() => {
        return data.user_set.map(user => ({
            ...user, detailButton: <Button
                leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                color='teal.8'
                variant='subtle'
                radius='md'
                component={Link}
                to={`/home/plant-manager/users/${user.id}`}
            >
                Detail
            </Button>, removeButton: <Button
                leftIcon={<IconTrash stroke={2} size={16} />}
                color='red.6'
                variant='subtle'
                radius='md'
                onClick={() => openConfirmRemoveDivision({ group_id: data.id, user_id: user.id, group_name: data.name, username: user.username })}
            >
                Remove
            </Button>
        }))
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
            selector: row => row.detailButton
        },
        {
            name: '',
            selector: row => row.removeButton
        }
    ], [])

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
