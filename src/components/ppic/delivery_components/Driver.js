import React, { useEffect, useState, useMemo, useCallback } from "react";

import { IconSignature } from "@tabler/icons";
import { useRequest, useConfirmDelete } from "../../../hooks";
import { BaseTable } from "../../tables";
import { openModal, closeAllModals } from "@mantine/modals";
import { TextInput } from "@mantine/core";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { useForm } from "@mantine/form";
import { ModalForm, ButtonAdd, ButtonDelete, ButtonEdit, HeadSection } from "../../custom_components";



const ModalAddDriver = ({ setAddDriver }) => {

    const { Post } = useRequest()
    const form = useForm({
        initialValues: {
            name: ''
        }
    })

    const handleSubmit = useCallback(async (data) => {
        try {
            const newDriver = await Post(data, 'driver-management')
            SuccessNotif('Add driver success')
            closeAllModals()
            setAddDriver(newDriver)
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add driver failed')
        }
    }, [Post, setAddDriver])

    return (
        <ModalForm
            formId='formAddDriver'
            onSubmit={form.onSubmit(handleSubmit)} >

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

        </ModalForm>
    )
}

const ModalEditDriver = ({ data, setUpdateDriver }) => {

    const { Put } = useRequest()

    const form = useForm({
        initialValues: {
            name: data.name
        }
    })

    const handleSubmit = async (value) => {
        try {
            const updatedDriver = await Put(data.id, value, 'driver-management')
            SuccessNotif('Edit driver success')
            setUpdateDriver(updatedDriver)
            closeAllModals()
        } catch (e) {
            FailedNotif('Edit driver failed')
            form.setErrors(e.message.data)
        }
    }

    return (
        <ModalForm
            formId='formEditDriver'
            onSubmit={form.onSubmit(handleSubmit)} >

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

        </ModalForm>
    )
}


const Driver = () => {

    const { Get, Delete } = useRequest()
    const [driverList, setDriverList] = useState([])
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Driver' })

    const setAddDriver = useCallback((newDriver) => {
        setDriverList(prev => [...prev, newDriver])
    }, [])

    const setUpdateDriver = useCallback((updatedDriver) => {
        const { id, name } = updatedDriver

        setDriverList(prev => {
            return prev.map(driver => {
                if (driver.id === id) {
                    return { ...driver, name: name }
                }

                return driver
            })
        })

    }, [])

    const setDeleteDriver = useCallback((idDeletedDriver) => {
        setDriverList(prev => prev.filter(driver => driver.id !== idDeletedDriver))
    }, [])

    const handleDeleteDriver = useCallback(async (id) => {
        try {
            await Delete(id, 'driver-management')
            SuccessNotif('Delete driver success')
            setDeleteDriver(id)
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }, [setDeleteDriver])

    const openEditDriver = useCallback((data) => openModal({
        title: 'Edit driver name',
        radius: 'md',
        size: 'lg',
        children: <ModalEditDriver data={data} setUpdateDriver={setUpdateDriver} />
    }), [setUpdateDriver])

    const openAddDriver = useCallback(() => openModal({
        title: 'Add driver',
        radius: 'md',
        size: 'lg',
        children: <ModalAddDriver setAddDriver={setAddDriver} />
    }), [setAddDriver])


    useEffect(() => {
        const fetch = async () => {
            try {
                const dataDriver = await Get('driver')
                setDriverList(dataDriver)
            } catch (e) {
                console.log(e)
            }
        }
        fetch()

    }, [])

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
            selector: row => <ButtonEdit
                onClick={() => openEditDriver(row)}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteDriver(row.id))}
            />
        }
    ], [openEditDriver, openConfirmDeleteData, handleDeleteDriver])


    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openAddDriver}
                >
                    Driver
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={columnDriver}
                data={driverList}
            />

        </>
    )

}

export default Driver

