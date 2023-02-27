import React, { useState, useEffect, useMemo, useCallback } from "react";
import { BaseTable } from "../../tables"
import { useRequest } from "../../../hooks"

import { TextInput } from "@mantine/core";
import { IconAt, IconUserCircle } from "@tabler/icons";
import { closeAllModals, openModal } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { ModalForm, ButtonAdd, NavigationDetailButton, HeadSection } from '../../custom_components'

const ModalAddUser = ({ setAddUser }) => {

    const { Post } = useRequest()
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
        <ModalForm
            formId='formAddUser'
            onSubmit={form.onSubmit(handleSubmit)}  >

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

        </ModalForm>
    )
}



const UserList = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
    const [dataUser, setDataUser] = useState([])

    const getMainDivision = useCallback((groups) => {
        if (groups) {
            if (groups.length > 0) {
                const firstGroup = groups[0]
                const { name } = firstGroup
                return name
            }
        }
        return 'None'
    }, [])

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
            selector: row => {
                const { groups } = row
                const mainDivision = getMainDivision(groups)
                return mainDivision
            }
        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/plant-manager/users/${row.id}`}
            />
        },
    ], [getMainDivision])

    useEffect(() => {

        GetAndExpiredTokenHandler('user').then(data => {
            setDataUser(data)
        })

    }, [])

    const setAddUserHandler = useCallback((newUser) => {

        setDataUser(prev => {
            return [...prev, newUser]
        })

    }, [])

    const openModalAddUser = useCallback(() => openModal({
        title: 'Add user',
        radius: 'md',
        size: 'xl',
        children: <ModalAddUser setAddUser={setAddUserHandler} />
    }), [setAddUserHandler])

    return (
        <>
            <HeadSection>
                <ButtonAdd
                    onClick={openModalAddUser}
                >
                    User
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={columnUser}
                data={dataUser}
                noData="No data user"
            />

        </>
    )
}


export default UserList