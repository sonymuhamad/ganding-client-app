import React, { useState, useEffect, useCallback, useMemo } from "react";

import { openModal, closeAllModals } from "@mantine/modals";
import { IconTir } from "@tabler/icons";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { BaseTable } from "../../tables";
import { useRequest, useConfirmDelete } from "../../../hooks";
import { SuccessNotif, FailedNotif } from "../../notifications";
import { ModalForm, ButtonAdd, ButtonDelete, ButtonEdit, HeadSection } from "../../custom_components";




const ModalAddVehicle = ({ setAddVehicle }) => {

    const { Post } = useRequest()

    const form = useForm({
        initialValues: {
            license_part_number: ''
        }
    })

    const handleSubmit = useCallback(async (data) => {
        try {
            const newVehicle = await Post(data, 'vehicle-management')
            SuccessNotif('Add vehicle success')
            closeAllModals()
            setAddVehicle(newVehicle)
        } catch (e) {
            FailedNotif('Add vehicle failed')
            form.setErrors(e.message.data)
        }
    }, [Post, setAddVehicle])


    return (
        <ModalForm
            formId='formAddVehicle'
            onSubmit={form.onSubmit(handleSubmit)} >

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

        </ModalForm>
    )
}

const ModalEditVehicle = ({ data, setUpdateVehicle }) => {

    const { Put } = useRequest()
    const form = useForm({
        initialValues: {
            license_part_number: data.license_part_number
        }
    })

    const handleSubmit = useCallback(async (value) => {
        try {
            const updatedVehicle = await Put(data.id, value, 'vehicle-management')
            setUpdateVehicle(updatedVehicle)
            SuccessNotif('Edit vehicle number success')
            closeAllModals()
        } catch (e) {
            FailedNotif('Edit vehicle number failed')
            form.setErrors(e.message.data)
        }
    }, [Put, data.id, setUpdateVehicle])

    return (

        <ModalForm
            formId='formEditVehicle'
            onSubmit={form.onSubmit(handleSubmit)} >

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

        </ModalForm>
    )
}


const Vehicle = () => {

    const { Get, Delete } = useRequest()
    const [vehicleList, setVehicleList] = useState([])
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Vehicle' })


    const setDeleteVehicle = useCallback((idDeletedVehicle) => {
        setVehicleList(prev => prev.filter(vehicle => vehicle.id !== idDeletedVehicle))
    }, [])

    const setAddVehicle = useCallback((newVehicle) => {
        setVehicleList(prev => [...prev, newVehicle])
    }, [])

    const setUpdateVehicle = useCallback((updatedVehicle) => {
        const { id, license_part_number } = updatedVehicle
        setVehicleList(prev => {
            return prev.map(vehicle => {

                if (vehicle.id === id) {
                    return { ...vehicle, license_part_number: license_part_number }
                }
                return vehicle
            })

        })

    }, [])

    const handleDeleteVehicle = useCallback(async (id) => {
        try {
            await Delete(id, 'vehicle-management')
            setDeleteVehicle(id)
            SuccessNotif('Delete vehicle success')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }, [setDeleteVehicle])

    const openEditVehicle = useCallback((data) => openModal({
        title: 'Edit vehicle license number',
        radius: 'md',
        size: 'lg',
        children: <ModalEditVehicle data={data} setUpdateVehicle={setUpdateVehicle} />
    }), [setUpdateVehicle])

    const openAddVehicle = useCallback(() => openModal({
        title: 'Add vehicle',
        radius: 'md',
        size: 'lg',
        children: <ModalAddVehicle setAddVehicle={setAddVehicle} />
    }), [setAddVehicle])



    useEffect(() => {

        const fetch = async () => {
            try {
                const dataVehicle = await Get('vehicle')
                setVehicleList(dataVehicle)
            } catch (e) {
                console.log(e)
            }
        }
        fetch()

    }, [])

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
            selector: row => <ButtonEdit
                onClick={() => openEditVehicle(row)}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteVehicle(row.id))}
            />
        }
    ], [openEditVehicle, openConfirmDeleteData, handleDeleteVehicle])


    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openAddVehicle}
                >
                    Vehicle
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={columnVehicle}
                data={vehicleList}
            />

        </>
    )
}


export default Vehicle

