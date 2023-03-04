import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRequest, useNotification } from "../../../hooks";
import { useForm } from "@mantine/form";

import { SectionUserDivisions, SectionUserPermissions, SectionDetailUser } from "./detail_user_components/";
import { BaseContent } from '../../layout'


const DetailUser = () => {

    const { successNotif, failedNotif } = useNotification()
    const { userId } = useParams()
    const navigate = useNavigate()
    const { Retrieve, Delete, Put } = useRequest()
    const [editAccess, setEditAcces] = useState(false)
    const [detailUser, setDetailUser] = useState({
        id: '',
        username: '',
        last_login: null,
        email: ''
    })
    const [action, setAction] = useState(0)
    const form = useForm({
        initialValues: detailUser
    })
    const [groupList, setGroupList] = useState([])
    const [permissionList, setPermissionList] = useState([])

    const handleDeleteUser = useCallback(async () => {
        try {
            await Delete(userId, 'user-management')
            successNotif('Delete user success')
            navigate('/home/plant-manager/users', { replace: true })
        } catch (e) {
            failedNotif(e, 'Delete user failed')
        }
    }, [navigate, userId, successNotif, failedNotif])

    const handleDeleteGroup = useCallback(async (id_group) => {
        try {
            const deletedGroup = await Put(userId, { group: id_group }, 'user-remove-group')
            successNotif(`Remove division success, ${detailUser.username} no longer have access to ${deletedGroup.name}`)
            setAction(prev => prev + 1)

        } catch (e) {
            failedNotif(e, 'Remove division failed')
        }
    }, [userId, detailUser, successNotif, failedNotif])

    const handleDeletePermission = useCallback(async (id_permission) => {
        try {
            const deletedPermission = await Put(userId, { id_permission: id_permission }, 'user-remove-permission-management')
            successNotif('Remove permission success')
            setPermissionList(prev => {
                return prev.filter(permission => permission.id !== deletedPermission.id)
            })
        } catch (e) {
            failedNotif(e, 'Remove permission failed')
        }
    }, [userId, detailUser, successNotif, failedNotif])

    const setAddGroup = useCallback((newGroup) => {
        setGroupList(prev => [...prev.filter(group => group.id !== newGroup.id), newGroup])
    }, [])

    const setAddPermission = useCallback((newPermission) => {
        setPermissionList(prev => [...prev, newPermission])
    }, [])


    useEffect(() => {
        Retrieve(userId, 'user').then(data => {
            const { groups, user_permissions, ...rest } = data

            setDetailUser(rest)
            setGroupList(groups)
            setPermissionList(user_permissions)

            form.setValues(rest)
        })
    }, [action, userId])

    const handleClickEditButton = useCallback(() => {
        setEditAcces(prev => !prev)
        form.setValues(detailUser)
        form.resetDirty()

    }, [detailUser])

    const handleSubmit = async (value) => {
        try {
            const updatedUser = await Put(userId, value, 'user-management')
            successNotif('Edit user success')
            setDetailUser(updatedUser)
            form.setValues(updatedUser)
            setEditAcces(prev => !prev)
            form.resetDirty()
        } catch (e) {
            failedNotif(e, 'Edit user failed')
            form.setErrors(e.message.data)
        }
    }


    const links = useMemo(() => [
        {
            "label": 'Detail user',
            "link": 'detail-user',
            'order': 1
        },
        {
            "label": "Divisions",
            "link": "divisions",
            "order": 1
        },
        {
            "label": "Permissions",
            "link": "permissions",
            "order": 1
        },
    ], [])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/plant-manager',
            label: 'Manager'
        },
        {
            path: '/home/plant-manager/users',
            label: 'User'
        },
        {
            path: `/home/plant-manager/users/${userId}`,
            label: detailUser.username
        }
    ], [detailUser, userId])

    const contents = [
        {
            description: '',
            component: <SectionDetailUser
                editAccess={editAccess}
                form={form}
                handleDeleteUser={handleDeleteUser}
                handleClickEditButton={handleClickEditButton}
                handleSubmit={handleSubmit}
            />
        },
        {
            description: '',
            component: <SectionUserDivisions
                userId={userId}
                groupList={groupList}
                handleAddGroups={setAddGroup}
                handleDeleteGroup={handleDeleteGroup}
            />
        },
        {
            description: '',
            component: <SectionUserPermissions
                userId={userId}
                permissionList={permissionList}
                setAddPermission={setAddPermission}
                handleDeletePermission={handleDeletePermission}
            />
        }
    ]



    return (
        <BaseContent
            links={links}
            breadcrumb={breadcrumb}
            contents={contents}
        />
    )
}

export default DetailUser