import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useRequest, useConfirmDelete } from "../../../../hooks";
import { TextInput, NumberInput, Textarea } from "@mantine/core";

import { IconAt, IconMapPin, IconDeviceMobile, IconUserPlus } from "@tabler/icons";

import { useForm } from "@mantine/form";
import { FailedNotif, SuccessNotif } from "../../../notifications";
import { ActionButtons } from "../../../custom_components";


const ComponentDetailCustomer = () => {

    const [editAccess, setEditAccess] = useState(false)
    const navigate = useNavigate()
    const { Retrieve, Put, Delete } = useRequest()
    const { customerId } = useParams()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Customer' })
    const [detailCustomer, setDetailCustomer] = useState({
        id: '',
        name: '',
        address: '',
        phone: '',
        email: '',
    })
    const form = useForm({
        initialValues: detailCustomer
    })

    const handleClickEditButton = useCallback((updatedCustomer = null) => {

        setEditAccess(prev => {
            if (prev && updatedCustomer) {
                form.setValues(updatedCustomer)
                return !prev
            }
            form.setValues(detailCustomer)
            return !prev
        })

        form.resetDirty()

    }, [detailCustomer, form])

    const handleChangeDetailCustomer = (updatedCustomer) => {
        setDetailCustomer(updatedCustomer)
        handleClickEditButton(updatedCustomer)
    }

    const handleSubmit = async (value) => {
        try {
            const updatedCustomer = await Put(customerId, value, 'customer-management')
            SuccessNotif('Edit customer success')
            handleChangeDetailCustomer(updatedCustomer)
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Edit customer failed')
        }
    }

    const handleDeleteCustomer = useCallback(async () => {
        try {
            await Delete(customerId, 'customer-management')
            SuccessNotif('Delete customer success')
            navigate('/home/marketing/customers')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Delete customer failed')
        }
    }, [navigate, customerId])

    const handleClickDeleteButton = () => openConfirmDeleteData(handleDeleteCustomer)

    useEffect(() => {

        Retrieve(customerId, 'customer').then(data => {
            setDetailCustomer(data)
            form.setValues(data)
            form.resetDirty()
        })

    }, [customerId])

    return (
        <>

            <ActionButtons
                editAccess={editAccess}
                handleClickEditButton={handleClickEditButton}
                formState={form.isDirty()}
                handleClickDeleteButton={handleClickDeleteButton}
                formId='formEditCustomer'
            />

            <form id="formEditCustomer" onSubmit={form.onSubmit(handleSubmit)} >


                <TextInput
                    icon={<IconUserPlus />}
                    placeholder='Input name'
                    label='Name'
                    m='xs'
                    radius='md'
                    required
                    readOnly={!editAccess}
                    {...form.getInputProps('name')}

                />

                <TextInput
                    icon={<IconAt />}
                    m='xs'
                    radius='md'
                    placeholder='Input email'
                    label='Email'
                    required
                    readOnly={!editAccess}
                    {...form.getInputProps('email')}
                />

                <NumberInput
                    icon={<IconDeviceMobile />}
                    m='xs'
                    radius='md'
                    placeholder='Input phone number'
                    label='Phone'
                    hideControls
                    readOnly={!editAccess}
                    {...form.getInputProps('phone')}
                    required
                />

                <Textarea
                    icon={<IconMapPin />}
                    m='xs'
                    radius='md'
                    readOnly={!editAccess}
                    placeholder="Input address"
                    label='Address'
                    {...form.getInputProps('address')}
                    required
                />

            </form>

        </>
    )
}

export default ComponentDetailCustomer