import React, { useEffect, useState, useMemo, useCallback } from "react";

import { IconEdit, IconTrash, IconPlus, IconEngine, IconDownload } from "@tabler/icons";
import { Button, Group, TextInput, Text } from "@mantine/core";
import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";
import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals";
import { SuccessNotif, FailedNotif } from "../../notifications";
import { useForm } from "@mantine/form";


const ModalEditMachine = ({ data, action }) => {

    const form = useForm({
        initialValues: {
            name: data.name
        }
    })
    const { Put, Loading } = useRequest()

    const handleSubmit = useCallback(async (value) => {

        try {
            await Put(data.id, value, 'machine')
            closeAllModals()
            action(prev => prev + 1)
            SuccessNotif('Edit machine name success')
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Edit machine name failed')
        }
    }, [Put, action, data.id])

    return (
        <>
            <Loading />
            <form onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    radius='md'
                    label='Machine name'
                    required
                    m='xs'
                    icon={<IconEngine />}
                    {...form.getInputProps('name')}
                />

                <Button
                    leftIcon={<IconDownload />}
                    my='md'
                    radius='md'
                    fullWidth
                    type='submit'
                    disabled={data.name === form.values.name}
                >
                    Save
                </Button>
            </form>
        </>
    )
}

const ModalAddMachine = ({ action }) => {

    const form = useForm({
        initialValues: {
            name: ''
        }
    })
    const { Post, Loading } = useRequest()

    const handleSubmit = async (value) => {

        try {
            await Post(value, 'machine')
            closeAllModals()
            action(prev => prev + 1)
            SuccessNotif('Add new machine success')
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add machine failed')
        }
    }

    return (
        <>
            <Loading />
            <form onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    radius='md'
                    label='Machine name'
                    required
                    m='xs'
                    icon={<IconEngine />}
                    {...form.getInputProps('name')}
                />

                <Button
                    my='md'
                    radius='md'
                    fullWidth
                    type='submit'
                    leftIcon={<IconDownload />}
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
    const { Get, Delete } = useRequest()


    const columnMachine = useMemo(() => [
        {
            name: 'Machine name',
            selector: row => row.name
        },
        {
            name: 'Times used',
            selector: row => `${row.numbers_of_production} times`
        },
        {
            name: '',
            selector: row => row.buttonEdit
        },
        {
            name: '',
            selector: row => row.buttonDelete
        },
    ], [])



    const openEditMachine = useCallback((machine) => openModal({
        title: 'Edit machine name',
        radius: 'md',
        children: <ModalEditMachine data={machine} action={setAction} />
    }), [])

    const openAddMachine = useCallback(() => openModal({
        title: 'Add new machine',
        radius: 'md',
        children: <ModalAddMachine action={setAction} />
    }), [])

    const handleDeleteMachine = useCallback(async (id) => {
        try {
            await Delete(id, 'machine')
            SuccessNotif('delete data machine success')
            setAction(prev => prev + 1)
        } catch (e) {
            console.log(e)
            FailedNotif(e.message.data)
        }
    }, [])

    const openDeleteMachine = useCallback((id) => {

        return openConfirmModal({
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
    }, [handleDeleteMachine])


    const fetchMachine = useCallback(async () => {
        try {
            const dataMachine = await Get('machine')

            const machineList = dataMachine.map(mesin => ({
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

            setMachine(machineList)
        } catch (e) {
            console.log(e)
        }
    }, [openDeleteMachine, openEditMachine])

    useEffect(() => {
        // effect for fetch machine
        fetchMachine()

    }, [action, fetchMachine])


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


