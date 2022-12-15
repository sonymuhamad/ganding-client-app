import React, { useState, useEffect, useMemo, useCallback } from "react";
import { BaseTable } from "../../tables";
import { useRequest } from "../../../hooks";
import { Link } from "react-router-dom";

import { Button, Group, TextInput, Paper, Select, ActionIcon } from "@mantine/core";
import { IconAt, IconDeviceDesktopAnalytics, IconDotsCircleHorizontal, IconDownload, IconPlus, IconTrash, IconUserCircle } from "@tabler/icons";
import { closeAllModals, openModal } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { FailedNotif, SuccessNotif } from "../../notifications";


const ModalAddUser = ({ setAddUser }) => {

    const { Post, Loading } = useRequest()
    const form = useForm({
        initialValues: {
            username: '',
            email: '',
            groups: []
        }
    })

    const handleSubmit = async (value) => {
        try {
            const newUser = await Post(value, 'user-management')
            setAddUser(newUser)
            SuccessNotif('Add user success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Add user failed')
        }
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}  >

            <Loading />

            <TextInput
                label='Username'
                placeholder="Input username"
                icon={<IconUserCircle />}
                radius='md'
                m='xs'
                required
                {...form.getInputProps('username')}
            />

            <TextInput
                label='Email'
                placeholder="Input user email"
                icon={<IconAt />}
                radius='md'
                required
                m='xs'
                {...form.getInputProps('email')}
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



const UserList = () => {

    const { GetAndExpiredTokenHandler, Loading } = useRequest()
    const [dataUser, setDataUser] = useState([])

    const columnUser = useMemo(() => [
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
            name: 'Main division',
            selector: row => row.groups.length > 0 ? row.groups[0].name : 'None'
        },
        {
            name: '',
            selector: row => row.detailButton
        },
    ], [])

    useEffect(() => {

        GetAndExpiredTokenHandler('user').then(data => {

            setDataUser(data.map(dt => ({
                ...dt, detailButton: <Button
                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.8'
                    variant='subtle'
                    radius='md'
                    component={Link}
                    to={`${dt.id}`}
                >
                    Detail
                </Button>
            })))

        })

    }, [])

    const setAddUserHandler = useCallback((newUser) => {

        setDataUser(prev => {
            return [...prev, {
                ...newUser, detailButton: <Button
                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.8'
                    variant='subtle'
                    radius='md'
                    component={Link}
                    to={`${newUser.id}`}
                >
                    Detail
                </Button>
            }]
        })

    }, [])

    const openModalAddUser = useCallback(() => openModal({
        title: 'Add user',
        radius: 'md',
        size: 'xl',
        children: <ModalAddUser setAddUser={setAddUserHandler} />
    }), [])

    return (
        <>

            <Loading />

            <Group
                m='xs'
                position="right"
            >

                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openModalAddUser}
                >
                    User
                </Button>

            </Group>

            <BaseTable
                column={columnUser}
                data={dataUser}
                noData="No data user"
            />

        </>
    )
}


export default UserList