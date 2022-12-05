import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useRequest } from "../../../hooks";
import { Button, Group, TextInput, Text } from "@mantine/core";

import { BaseTable } from "../../tables";
import { IconPlus, IconTrash, IconEdit, IconDownload, IconSignature } from "@tabler/icons";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { openConfirmModal, closeAllModals, openModal } from "@mantine/modals";
import { useForm } from "@mantine/form";


const AddProcessType = ({ setaction }) => {

    const { Post, Loading } = useRequest()
    const form = useForm({
        initialValues: {
            name: ''
        }
    })

    const handleSubmit = useCallback(async (value) => {
        try {
            await Post(value, 'process-type')
            closeAllModals()
            setaction(prev => prev + 1)
            SuccessNotif('Add process type success')
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add process type failed')
        }
    }, [Post, setaction])

    return (
        <>
            <Loading />
            <form onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    icon={<IconSignature />}
                    radius='md'
                    {...form.getInputProps('name')}
                    required
                    label='Type name'
                    placeholder="Input name of new type"
                />

                <Button
                    my='md'
                    radius='md'
                    type="submit"
                    fullWidth
                    leftIcon={<IconDownload />}
                >
                    Save
                </Button>
            </form>
        </>
    )
}


const EditProcessType = ({ setaction, data }) => {


    const { Put, Loading } = useRequest()
    const form = useForm({
        initialValues: {
            name: data.name
        }
    })


    const handleSubmit = useCallback(async (value) => {
        try {
            await Put(data.id, value, 'process-type')
            closeAllModals()
            setaction(prev => prev + 1)
            SuccessNotif('Edit process type success')
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Edit process type failed')
        }
    }, [setaction, Put, data.id])

    return (
        <>
            <Loading />
            <form onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    icon={<IconSignature />}
                    radius='md'
                    label='Type'
                    placeholder="Input type of process"
                    required
                    {...form.getInputProps('name')}
                />

                <Button
                    my='md'
                    radius='md'
                    fullWidth
                    type="submit"
                    disabled={data.name === form.values.name}
                    leftIcon={<IconDownload />}
                >
                    Save
                </Button>
            </form>
        </>
    )

}



const ProcessType = () => {

    const { Get, Delete } = useRequest()
    const [processType, setProcessType] = useState([])
    const [actionProcessType, setActionProcessType] = useState(0)



    const columnProcessType = useMemo(() => [
        {
            name: 'Type',
            selector: row => row.name
        },
        {
            name: 'Amount of process',
            selector: row => row.amount_of_process
        },
        {
            name: '',
            selector: row => row.buttonEdit
        },
        {
            name: '',
            selector: row => row.buttonDelete
        }

    ], [])

    const openAddProcessType = useCallback(() => openModal({
        title: `Add process type`,
        radius: 'md',
        children: <AddProcessType setaction={setActionProcessType} />,
    }), [])

    const openEditProcessType = useCallback((data) => openModal({
        title: `Edit process type`,
        radius: 'md',
        children: <EditProcessType data={data} setaction={setActionProcessType} />
    }), [])

    const handleDeleteProcessType = useCallback(async (id) => {
        try {
            await Delete(id, 'process-type')
            setActionProcessType(prev => prev + 1)
            SuccessNotif('Delete process type success')
        } catch (e) {
            console.log(e)
            FailedNotif('Delete process type failed')
            FailedNotif(e.message.data)
        }
    }, [])


    const openDeleteProcessTypeModal = useCallback((id) => openConfirmModal({
        title: 'Delete process type',
        children: (
            <Text size="sm">
                Are you sure?, this process type will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteProcessType(id)
    }), [handleDeleteProcessType])

    useEffect(() => {
        // effect for process type

        const fetchProcessType = async () => {
            try {
                const process_type = await Get('process-type')
                const types = process_type.map(type => ({
                    ...type, buttonEdit:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='teal.8'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditProcessType(type)}
                        >
                            Edit
                        </Button>,
                    buttonDelete: <Button
                        leftIcon={<IconTrash stroke={2} size={16} />}
                        color='red'
                        variant='subtle'
                        radius='md'
                        onClick={() => openDeleteProcessTypeModal(type.id)}
                    >
                        Delete
                    </Button>
                }))

                setProcessType(types)
            } catch (e) {
                console.log(e)
            }
        }

        fetchProcessType()

    }, [actionProcessType, openEditProcessType, openDeleteProcessTypeModal])


    return (
        <>

            <Group position="right" >
                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openAddProcessType}
                >
                    Process type
                </Button>
            </Group>

            <BaseTable
                column={columnProcessType}
                data={processType}

            />

        </>
    )
}

export default ProcessType