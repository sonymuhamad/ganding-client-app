import React, { useState, useEffect, useCallback, useMemo } from "react";

import { useRequest } from "../../../hooks";
import { SuccessNotif, FailedNotif } from "../../notifications";
import { BaseTable } from "../../tables";
import { openModal, openConfirmModal, closeAllModals } from "@mantine/modals";

import { IconEdit, IconTrash, IconPlus, IconTir, IconDownload } from "@tabler/icons";
import { Button, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";



const ModalAddVehicle = ({ setAction }) => {

    const { Post, Loading } = useRequest()

    const form = useForm({
        initialValues: {
            license_part_number: ''
        }
    })

    const handleSubmit = useCallback(async (data) => {
        try {
            await Post(data, 'vehicle-management')
            SuccessNotif('Add vehicle success')
            closeAllModals()
            setAction(prev => prev + 1)
        } catch (e) {
            FailedNotif('Add vehicle failed')
            form.setErrors(e.message.data)
        }
    }, [Post, setAction])


    return (
        <form onSubmit={form.onSubmit(handleSubmit)} >

            <Loading />

            <TextInput
                label='Vehicle number'
                placeholder="Input vehicle number"
                icon={<IconTir />}
                required
                radius='md'
                m='xs'
                variant='filled'
                {...form.getInputProps('license_part_number')}
            />

            <Button
                fullWidth
                leftIcon={<IconDownload />}
                radius='md'
                type='submit'
            >
                Save
            </Button>

        </form>
    )
}

const ModalEditVehicle = ({ data, setAction }) => {

    const { Put, Loading } = useRequest()
    const form = useForm({
        initialValues: {
            license_part_number: data.license_part_number
        }
    })

    const handleSubmit = useCallback(async (value) => {
        try {
            await Put(data.id, value, 'vehicle-management')
            SuccessNotif('Edit vehicle number success')
            closeAllModals()
            setAction(prev => prev + 1)
        } catch (e) {
            FailedNotif('Edit vehicle number failed')
            form.setErrors(e.message.data)
        }
    }, [Put, data.id, setAction])

    return (

        <form onSubmit={form.onSubmit(handleSubmit)} >

            <Loading />

            <TextInput
                label='Vehicle number'
                placeholder="Input vehicle number"
                icon={<IconTir />}
                required
                radius='md'
                m='xs'
                variant='filled'
                {...form.getInputProps('license_part_number')}
            />

            <Button
                disabled={form.values.license_part_number === data.license_part_number}
                fullWidth
                leftIcon={<IconDownload />}
                radius='md'
                type='submit'
            >
                Save
            </Button>

        </form>
    )
}


const Vehicle = () => {

    const { Get, Delete } = useRequest()
    const [vehicleList, setVehicleList] = useState([])
    const [action, setAction] = useState([])

    const columnVehicle = useMemo(() => [
        {
            name: 'License number',
            selector: row => row.license_part_number
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


    const handleDeleteVehicle = useCallback(async (id) => {
        try {
            await Delete(id, 'vehicle-management')
            SuccessNotif('Delete vehicle success')
            setAction(prev => prev + 1)
        } catch (e) {
            FailedNotif(e.message.data)
        }
    }, [])

    const openEditVehicle = useCallback((data) => openModal({
        title: 'Edit vehicle license number',
        radius: 'md',
        size: 'lg',
        children: <ModalEditVehicle data={data} setAction={setAction} />
    }), [])


    const openDeleteVehicle = useCallback((id) => openConfirmModal({
        title: 'Delete data vehicle',
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteVehicle(id)
    }), [handleDeleteVehicle])

    const openAddVehicle = useCallback(() => openModal({
        title: 'Add vehicle',
        radius: 'md',
        size: 'lg',
        children: <ModalAddVehicle setAction={setAction} />
    }), [])



    useEffect(() => {

        const fetch = async () => {
            try {
                const dataVehicle = await Get('vehicle')

                const vehicleList = dataVehicle.map(vehicle => ({
                    ...vehicle, editButton:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='blue.6'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditVehicle(vehicle)}
                        >
                            Edit
                        </Button>,
                    deleteButton: <Button
                        leftIcon={<IconTrash stroke={2} size={16} />}
                        color='red'
                        variant='subtle'
                        radius='md'
                        onClick={() => openDeleteVehicle(vehicle.id)}
                    >
                        Delete
                    </Button>
                }))

                setVehicleList(vehicleList)

            } catch (e) {

            }
        }

        fetch()

    }, [action, openDeleteVehicle, openEditVehicle])


    return (
        <>

            <Group position="right">
                <Button
                    leftIcon={<IconPlus />}
                    variant='outline'
                    radius='md'
                    onClick={openAddVehicle}
                >
                    Vehicle
                </Button>
            </Group>

            <BaseTable
                column={columnVehicle}
                data={vehicleList}
            />

        </>
    )
}


export default Vehicle

