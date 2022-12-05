import React, { useEffect, useState, useMemo, useCallback } from "react";

import { IconEdit, IconTrash, IconPlus, IconId, IconDownload } from "@tabler/icons";
import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals";
import { Button, Group, TextInput, Text } from "@mantine/core";
import { useRequest } from "../../../hooks";
import { BaseTable } from '../../tables'
import { FailedNotif, SuccessNotif } from "../../notifications";
import { useForm } from "@mantine/form";



const ModalEditOperator = ({ data, action }) => {

    const form = useForm({
        initialValues: {
            name: data.name
        }
    })
    const { Put, Loading } = useRequest()

    const handleSubmit = useCallback(async (value) => {
        try {
            await Put(data.id, value, 'operator')
            closeAllModals()
            action(prev => prev + 1)
            SuccessNotif('Edit operator name success')
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Edit operator name failed')
        }
    }, [Put, action, data.id])


    return (
        <>
            <Loading />
            <form onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    icon={<IconId />}
                    radius='md'
                    m='xs'
                    label='Operator name'
                    required
                    {...form.getInputProps('name')}
                />

                <Button
                    my='md'
                    radius='md'
                    fullWidth
                    leftIcon={<IconDownload />}
                    type='submit'
                    disabled={data.name === form.values.name}
                >
                    Save
                </Button>
            </form>
        </>
    )
}

const ModalAddOperator = ({ action }) => {
    const form = useForm({
        initialValues: {
            name: ''
        }
    })
    const { Post, Loading } = useRequest()

    const handleSubmit = async (value) => {
        try {
            await Post(value, 'operator')
            closeAllModals()
            action(prev => prev + 1)
            SuccessNotif('Add new operator success')
        } catch (e) {
            form.setErrors(e.message.data)
            console.log(e)
            FailedNotif('Add operator failed')
        }
    }

    return (
        <>
            <Loading />
            <form onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    radius='md'
                    label='Operator name'
                    required
                    m='xs'
                    icon={<IconId />}
                    {...form.getInputProps('name')}
                />

                <Button
                    leftIcon={<IconDownload />}
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



const Operator = () => {

    const [operator, setOperator] = useState([])
    const [action, setAction] = useState([])
    const { Get, Delete } = useRequest()

    const columnOperator = useMemo(() => [
        {
            name: 'Operator name',
            selector: row => row.name
        },
        {
            name: 'Total production',
            selector: row => `${row.numbers_of_production} times production`
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



    const openEditOperator = useCallback((operator) => openModal({
        title: 'Edit operator name',
        radius: 'md',
        children: <ModalEditOperator data={operator} action={setAction} />
    }), [])


    const openAddOperator = useCallback(() => openModal({
        title: 'Add new operator',
        radius: 'md',
        children: <ModalAddOperator action={setAction} />
    }), [])

    const handleDeleteOperator = useCallback(async (id) => {
        try {
            await Delete(id, 'operator')
            SuccessNotif('delete data operator success')
            setAction(prev => prev + 1)
        } catch (e) {
            console.log(e)
            FailedNotif(e.message.data)
        }
    }, [])

    const openDeleteOperator = useCallback((id) => openConfirmModal({
        title: 'Delete operator',
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteOperator(id)
    }), [handleDeleteOperator])



    const fetchOperator = useCallback(async () => {
        try {
            const dataOperator = await Get('operator')

            const operatorList = dataOperator.map(op => ({
                ...op, buttonEdit:

                    <Button
                        leftIcon={<IconEdit stroke={2} size={16} />}
                        color='blue.6'
                        variant='subtle'
                        radius='md'
                        mx='xs'
                        onClick={() => openEditOperator(op)}
                    >
                        Edit
                    </Button>,
                buttonDelete: <Button
                    leftIcon={<IconTrash stroke={2} size={16} />}
                    color='red'
                    variant='subtle'
                    radius='md'
                    onClick={() => openDeleteOperator(op.id)}
                >
                    Delete
                </Button>
            }))

            setOperator(operatorList)
        } catch (e) {
            console.log(e)
        }
    }, [openDeleteOperator, openEditOperator])

    useEffect(() => {
        // effect for fetch operator

        fetchOperator()

    }, [action, fetchOperator])


    return (
        <>

            <Group position="right" >
                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openAddOperator}
                >
                    Operator
                </Button>
            </Group>
            <BaseTable
                column={columnOperator}
                data={operator}

            />
        </>
    )

}

export default Operator


