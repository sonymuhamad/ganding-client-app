import React, { useEffect, useState, useContext, useMemo } from "react";

import { IconEdit, IconTrash, IconPlus } from "@tabler/icons";
import { Button, Group, TextInput, Text } from "@mantine/core";
import { useRequest } from "../../../hooks/useRequest";
import { AuthContext } from "../../../context/AuthContext";
import BaseTable from "../../tables/BaseTable";
import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals";
import { SuccessNotif, FailedNotif } from "../../notifications/Notifications";


const ModalEditMachine = ({ data, action }) => {

    const [name, setName] = useState('')
    const auth = useContext(AuthContext)
    const { Put, Loading } = useRequest()

    const handleSubmit = async (data) => {
        try {
            await Put(data.id, { name: name }, auth.user.token, 'machine')
            closeAllModals()
            action(prev => prev + 1)
            SuccessNotif('Edit machine name success')
        } catch (e) {
            console.log(e)
            FailedNotif('Edit machine name failed')
        }
    }

    useEffect(() => {
        setName(data.name)
    }, [])

    return (
        <>
            <Loading />
            <form onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(data)
            }}  >

                <TextInput
                    radius='md'
                    label='Machine name'
                    required
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />

                <Button
                    my='md'
                    radius='md'
                    fullWidth
                    type='submit'
                >
                    Save
                </Button>
            </form>
        </>
    )
}

const ModalAddMachine = ({ action }) => {

    const [name, setName] = useState('')
    const auth = useContext(AuthContext)
    const { Post, Loading } = useRequest()

    const handleSubmit = async () => {
        try {
            await Post({ name: name }, auth.user.token, 'machine')
            closeAllModals()
            action(prev => prev + 1)
            SuccessNotif('Add new machine success')
        } catch (e) {
            console.log(e)
            FailedNotif('Add machine failed')
        }
    }

    return (
        <>
            <Loading />
            <form onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
            }}  >

                <TextInput
                    radius='md'
                    label='Machine name'
                    required
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />

                <Button
                    my='md'
                    radius='md'
                    fullWidth
                    type='submit'
                >
                    Save
                </Button>
            </form>
        </>
    )
}



const Machine = () => {

    const [machine, setMachine] = useState([])
    const [action, setAction] = useState(0)
    const auth = useContext(AuthContext)
    const { Get, Delete } = useRequest()


    const columnMachine = useMemo(() => [
        {
            name: 'Machine name',
            selector: row => row.name
        },
        {
            name: '',
            selector: row => row.buttonEdit
        },
        {
            name: '',
            selector: row => row.buttonDelete
        },
        // {
        //     name: 'jumlah barang yang diproduksi',
        //     selector: row => row.buttonDelete
        // },
        // {
        //     name: 'berapa kali digunakan',
        //     selector: row => row.buttonDelete
        // },
    ], [])



    const openEditMachine = (machine) => openModal({
        title: 'Edit machine name',
        radius: 'md',
        children: <ModalEditMachine data={machine} action={setAction} />
    })

    const openAddMachine = () => openModal({
        title: 'Add new machine',
        radius: 'md',
        children: <ModalAddMachine action={setAction} />
    })

    const openDeleteMachine = (id) => openConfirmModal({
        title: 'Delete machine',
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteMachine(id)
    })

    const handleDeleteMachine = async (id) => {
        try {
            await Delete(id, auth.user.token, 'machine')
            SuccessNotif('delete data machine success')
            setAction(prev => prev + 1)
        } catch (e) {
            console.log(e)
            FailedNotif(e.message.data)
        }
    }


    useEffect(() => {
        // effect for fetch machine

        const fetchMachine = async () => {
            try {
                const machines = await Get(auth.user.token, 'machine')
                const machine = machines.map(mesin => ({
                    ...mesin, buttonEdit:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='blue.6'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditMachine(mesin)}
                        >
                            Edit
                        </Button>,
                    buttonDelete: <Button
                        leftIcon={<IconTrash stroke={2} size={16} />}
                        color='red'
                        variant='subtle'
                        radius='md'
                        onClick={() => openDeleteMachine(mesin.id)}
                    >
                        Delete
                    </Button>
                }))

                setMachine(machine)
            } catch (e) {
                console.log(e)
            }
        }

        fetchMachine()

    }, [auth.user.token, action])


    return (
        <>

            <Group position="right" >
                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openAddMachine}
                >
                    Machine
                </Button>
            </Group>
            <BaseTable
                column={columnMachine}
                data={machine}

            />
        </>
    )

}

export default Machine


