import React, { useEffect, useState, useMemo, useCallback } from "react";

import { IconDownload, IconEdit, IconPlus, IconSignature, IconTrash } from "@tabler/icons";
import { useRequest } from "../../../hooks/useRequest";
import BaseTable from "../../tables/BaseTable";
import { openModal, openConfirmModal, closeAllModals } from "@mantine/modals";
import { Button, Group, Text, TextInput } from "@mantine/core";
import { FailedNotif, SuccessNotif } from "../../notifications/Notifications";
import { useForm } from "@mantine/form";

const ModalAddDriver = ({ setAction }) => {

    const { Post, Loading } = useRequest()
    const form = useForm({
        initialValues: {
            name: ''
        }
    })

    const handleSubmit = useCallback(async (data) => {
        try {
            await Post(data, 'driver')
            SuccessNotif('Add driver success')
            closeAllModals()
            setAction(prev => prev + 1)
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add driver failed')
        }
    }, [Post, setAction])

    return (
        <form onSubmit={form.onSubmit(handleSubmit)} >
            <Loading />
            <TextInput
                icon={<IconSignature />}
                label='Driver name'
                placeholder="Input driver name"
                required
                radius='md'
                variant="filled"
                m='xs'
                {...form.getInputProps('name')}
            />

            <Button
                radius='md'
                fullWidth
                type="submit"
                leftIcon={<IconDownload />}
            >
                Save
            </Button>
        </form>
    )
}

const ModalEditDriver = ({ data, setAction }) => {

    const { Put, Loading } = useRequest()

    const form = useForm({
        initialValues: {
            name: data.name
        }
    })

    const handleSubmit = async (value) => {
        try {
            await Put(data.id, value, 'driver')
            SuccessNotif('Edit driver success')
            setAction(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            FailedNotif('Edit driver failed')
            form.setErrors(e.message.data)
        }
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)} >
            <Loading />
            <TextInput
                icon={<IconSignature />}
                label='Driver name'
                placeholder="Input driver name"
                required
                radius='md'
                variant="filled"
                m='xs'
                {...form.getInputProps('name')}
            />

            <Button
                radius='md'
                fullWidth
                type="submit"
                disabled={form.values.name === data.name}
                leftIcon={<IconDownload />}
            >
                Save
            </Button>
        </form>
    )
}


const Driver = () => {

    const { Get, Delete, Loading } = useRequest()
    const [driverList, setDriverList] = useState([])
    const [action, setAction] = useState([])

    const columnDriver = useMemo(() => [
        {
            name: 'Driver name',
            selector: row => row.name
        },
        {
            name: 'Total delivery',
            selector: row => row.numbers_of_delivery_customer + row.numbers_of_delivery_subcont
        },
        {
            name: '',
            selector: row => row.editButton
        },
        {
            name: '',
            selector: row => row.deleteButton
        }
    ], [])

    const handleDeleteDriver = useCallback(async (id) => {
        try {
            await Delete(id, 'driver')
            SuccessNotif('Delete driver success')
            setAction(prev => prev + 1)
        } catch (e) {
            FailedNotif(e.message.data)
        }
    }, [])

    const openEditDriver = useCallback((data) => openModal({
        title: 'Edit driver name',
        radius: 'md',
        size: 'lg',
        children: <ModalEditDriver data={data} setAction={setAction} />
    }), [])

    const openDeleteDriver = useCallback((id) => openConfirmModal({
        title: 'Delete driver',
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteDriver(id)
    }), [handleDeleteDriver])

    const openAddDriver = useCallback(() => openModal({
        title: 'Add driver',
        radius: 'md',
        size: 'lg',
        children: <ModalAddDriver setAction={setAction} />
    }), [])


    useEffect(() => {

        const fetch = async () => {
            try {
                const dataDriver = await Get('driver')

                const driver = dataDriver.map(driver => ({
                    ...driver, editButton:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='blue.6'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditDriver(driver)}
                        >
                            Edit
                        </Button>,
                    deleteButton: <Button
                        leftIcon={<IconTrash stroke={2} size={16} />}
                        color='red'
                        variant='subtle'
                        radius='md'
                        onClick={() => openDeleteDriver(driver.id)}
                    >
                        Delete
                    </Button>
                }))

                setDriverList(driver)

            } catch (e) {
                console.log(e)
            }
        }

        fetch()

    }, [action, openEditDriver, openDeleteDriver])

    return (
        <>

            <Loading />

            <Group position="right" >
                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant="outline"
                    onClick={openAddDriver}
                >
                    Driver
                </Button>
            </Group>

            <BaseTable
                column={columnDriver}
                data={driverList}
            />

        </>
    )

}

export default Driver

