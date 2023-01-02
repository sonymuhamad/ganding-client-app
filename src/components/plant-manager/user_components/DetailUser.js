import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRequest, useSection } from "../../../hooks";
import { BaseAside } from "../../layout";
import BreadCrumb from "../../BreadCrumb";
import { Title, Divider, Button, Group, TextInput, Text, Select } from "@mantine/core";
import { IconEdit, IconX, IconTrashX, IconDownload, IconUserCircle, IconAt, IconLogin, IconPlus, IconBuildingCommunity, IconAccessPoint } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { openModal, openConfirmModal, closeAllModals } from "@mantine/modals";
import { FailedNotif, SuccessNotif } from "../../notifications";

import { BaseTable } from "../../tables";


const ModalAddGroup = ({ userId, setAddGroup }) => {

    const { Put, Loading, GetAndExpiredTokenHandler } = useRequest()
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
            SuccessNotif('Division added success')
            closeAllModals()
        } catch (e) {
            FailedNotif('Add division failed')
        }
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}  >

            <Loading />

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

            <Button
                radius='md'
                fullWidth
                leftIcon={<IconDownload />}
                type='submit'
            >
                Save
            </Button>

        </form>
    )
}

const ModalAddPermission = ({ userId, setAddPermission }) => {

    const { Put, Loading, Retrieve } = useRequest()
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
    }, [])

    const handleSubmit = async (value) => {
        try {
            const addedPermission = await Put(userId, value, 'user-add-permission-management')
            setAddPermission(addedPermission)
            SuccessNotif('Permission added success')
            closeAllModals()
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else {
                FailedNotif('Add division failed')
            }
        }
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}  >

            <Loading />

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

            <Button
                radius='md'
                fullWidth
                leftIcon={<IconDownload />}
                type='submit'
            >
                Save
            </Button>

        </form>
    )
}



const DetailUser = () => {

    const { userId } = useParams()

    const { classes, activeSection, sectionRefs } = useSection()

    const links = useMemo(() => [
        {
            "label": 'Detail user',
            "link": '#detail-user',
            'order': 1
        },
        {
            "label": "Divisions",
            "link": "#divisions",
            "order": 1
        },
        {
            "label": "Permissions",
            "link": "#permissions",
            "order": 1
        },
    ], [])

    const initialData = useMemo(() => {
        return {
            id: '',
            username: '',
            last_login: null,
            email: ''
        }
    }, [])
    const navigate = useNavigate()
    const { Retrieve, Loading, Delete, Put } = useRequest()
    const [editAccess, setEditAcces] = useState(false)
    const [detailUser, setDetailUser] = useState(initialData)
    const [action, setAction] = useState(0)
    const form = useForm({
        initialValues: initialData
    })
    const [groupList, setGroupList] = useState([])
    const [permissionList, setPermissionList] = useState([])


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
    ], [detailUser])

    const columnGroup = useMemo(() => [
        {
            name: 'Division name',
            selector: row => row.name.toUpperCase()
        },
        {
            name: '',
            selector: row => row.deleteButton
        }
    ], [])

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
            selector: row => row.deleteButton
        }
    ], [])

    const handleDeleteUser = useCallback(async () => {
        try {
            await Delete(userId, 'user-management')
            SuccessNotif('Delete user success')
            navigate('/home/plant-manager/users', { replace: true })
        } catch (e) {
            FailedNotif(e.message.data)
        }
    }, [navigate])

    const openConfirmDeleteUser = useCallback(() => openConfirmModal({
        title: `Delete user`,
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteUser()
    }), [handleDeleteUser])

    const handleDeleteGroup = useCallback(async (id_group) => {
        try {
            const deletedGroup = await Put(userId, { group: id_group }, 'user-remove-group')
            SuccessNotif(`Remove division success, ${detailUser.username} no longer have access to ${deletedGroup.name}`)
            setAction(prev => prev + 1)

        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else {
                FailedNotif()
            }
        }
    }, [])

    const openConfirmDeleteGroup = useCallback((id_group) => openConfirmModal({
        title: `Remove group`,
        children: (
            <Text size="sm">
                Are you sure?, group will be removed.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, remove', cancel: "No, don't remove it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteGroup(id_group)
    }), [handleDeleteGroup])

    const handleDeletePermission = useCallback(async (id_permission) => {
        try {
            const deletedPermission = await Put(userId, { id_permission: id_permission }, 'user-remove-permission-management')
            SuccessNotif(`Remove permission success, ${detailUser.username} no longer ${deletedPermission.name}`)
            setPermissionList(prev => {
                return prev.filter(permission => permission.id !== deletedPermission.id)
            })
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else {
                FailedNotif('Delete permission failed')
            }
        }
    }, [])

    const openConfirmDeletePermission = useCallback((id_permission) => openConfirmModal({
        title: `Remove permission`,
        children: (
            <Text size="sm">
                Are you sure?, permission will be removed.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, remove', cancel: "No, don't remove it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeletePermission(id_permission)
    }), [handleDeletePermission])

    const setAddGroup = useCallback((newGroup) => {
        setGroupList(prev => [...prev.filter(group => group.id !== newGroup.id), {
            ...newGroup, deleteButton: <Button
                leftIcon={<IconTrashX stroke={2} size={16} />}
                color='red.6'
                variant='subtle'
                radius='md'
                onClick={() => openConfirmDeleteGroup(newGroup.id)}
            >
                Remove
            </Button>
        }])

    }, [])

    const setAddPermission = useCallback((newPermission) => {
        setPermissionList(prev => [...prev, {
            ...newPermission, deleteButton: <Button
                leftIcon={<IconTrashX stroke={2} size={16} />}
                color='red.6'
                variant='subtle'
                radius='md'
                onClick={() => openConfirmDeletePermission(newPermission.id)}
            >
                Remove
            </Button>
        }])
    }, [])

    const openAddGroup = useCallback(() => openModal({
        title: 'Add division',
        radius: 'md',
        size: 'lg',
        children: <ModalAddGroup userId={userId} setAddGroup={setAddGroup} />
    }), [setAddGroup])

    const openAddPermission = useCallback(() => openModal({
        title: 'Add permission',
        radius: 'md',
        size: 'lg',
        children: <ModalAddPermission userId={userId} setAddPermission={setAddPermission} />
    }), [setAddPermission])



    useEffect(() => {
        Retrieve(userId, 'user').then(data => {
            const { groups, user_permissions, ...rest } = data
            setDetailUser(rest)
            setGroupList(groups.map(group => ({
                ...group, deleteButton: <Button
                    leftIcon={<IconTrashX stroke={2} size={16} />}
                    color='red.6'
                    variant='subtle'
                    radius='md'
                    onClick={() => openConfirmDeleteGroup(group.id)}
                >
                    Remove
                </Button>
            })))
            setPermissionList(user_permissions.map(permission => ({
                ...permission, deleteButton: <Button
                    leftIcon={<IconTrashX stroke={2} size={16} />}
                    color='red.6'
                    variant='subtle'
                    radius='md'
                    onClick={() => openConfirmDeletePermission(permission.id)}
                >
                    Remove
                </Button>
            })))
            form.setValues(rest)
        })
    }, [openConfirmDeleteGroup, openConfirmDeletePermission, action])


    const handleSubmit = async (value) => {
        try {
            const updatedUser = await Put(userId, value, 'user-management')
            SuccessNotif('Edit user success')
            setDetailUser(updatedUser)
            form.setValues(updatedUser)
            setEditAcces(prev => !prev)
            form.resetDirty()
        } catch (e) {
            FailedNotif('Edit user failed')
            form.setErrors(e.message.data)
        }
    }


    return (
        <>

            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />
            <Loading />

            <section id='detail-user' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#detail-user" className={classes.a_href} >
                        Detail user
                    </a>
                </Title>

                <Divider my='md'></Divider>



                <Group position="right" mt='md' mb='md'  >
                    <Button.Group>

                        <Button
                            size='xs'
                            radius='md'
                            color={!editAccess ? 'blue.6' : 'red.6'}
                            onClick={() => {
                                setEditAcces(prev => !prev)
                                form.setValues(detailUser)
                                form.resetDirty()
                            }}
                            leftIcon={!editAccess ? <IconEdit /> : <IconX />}
                        >
                            {!editAccess ? 'Edit' : 'Cancel'}
                        </Button>

                        <Button
                            type="submit"
                            form='formEditUser'
                            size='xs'
                            color='blue.6'
                            disabled={!editAccess ? true : form.isDirty() ? false : true}
                            leftIcon={<IconDownload />} >
                            Save Changes</Button>
                        <Button
                            size='xs'
                            color='red.6'
                            onClick={openConfirmDeleteUser}
                            radius='md'
                            disabled={!editAccess ? false : true}
                            leftIcon={<IconTrashX />} >
                            Delete</Button>
                    </Button.Group>
                </Group>

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
                        value={detailUser.last_login ? new Date(detailUser.last_login).toDateString() : ''}
                    />


                </form>

            </section>
            <section id='divisions' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#divisions" className={classes.a_href} >
                        User divisions
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <Group
                    position="right"
                    m='xs'
                >
                    <Button
                        variant='outline'
                        leftIcon={<IconPlus />}
                        radius='md'
                        onClick={openAddGroup}
                    >
                        Division
                    </Button>

                </Group>

                <BaseTable
                    column={columnGroup}
                    data={groupList}
                    noData="This user doesn't have any division"
                />

            </section>
            <section id='permissions' className={classes.section} ref={sectionRefs[2]} >
                <Title className={classes.title} >
                    <a href="#permissions" className={classes.a_href} >
                        User permission
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <Group
                    position='right'
                    m='xs'
                >
                    <Button
                        leftIcon={<IconPlus />}
                        radius='md'
                        variant="outline"
                        onClick={openAddPermission}
                    >
                        Permission
                    </Button>
                </Group>

                <BaseTable
                    column={columnPermission}
                    data={permissionList}
                    noData="This user doesn't have any permission to manage data"
                />

            </section>

        </>
    )
}

export default DetailUser