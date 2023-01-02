import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useRequest } from "../../../../hooks";
import { Group, Button, TextInput, NumberInput, Text, Textarea } from "@mantine/core";

import { IconX, IconDownload, IconAt, IconMapPin, IconDeviceMobile, IconUserPlus, IconTrashX, IconEdit } from "@tabler/icons";

import { useForm } from "@mantine/form";
import { FailedNotif, SuccessNotif } from "../../../notifications";
import { openConfirmModal } from "@mantine/modals";


const ComponentDetailCustomer = () => {

    const [editAccess, setEditAccess] = useState(false)
    const navigate = useNavigate()
    const { Retrieve, Loading, Put, Delete } = useRequest()
    const { customerId } = useParams()
    const [detailCustomer, setDetailCustomer] = useState({
        id: '',
        name: '',
        address: '',
        phone: '',
        email: '',
    })
    const form = useForm({
        initialValues: {
            id: '',
            name: '',
            address: '',
            phone: '',
            email: ''
        }
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
    }, [])

    const openConfirmDeleteCustomer = useCallback(() => openConfirmModal({
        title: `Delete customer`,
        children: (
            <Text size="sm">
                Are you sure?, deleted data cannot be recovered.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteCustomer(),
    }), [handleDeleteCustomer])


    useEffect(() => {

        Retrieve(customerId, 'customer').then(data => {
            setDetailCustomer(data)
            form.setValues(data)
            form.resetDirty()
        })

    }, [])

    return (
        <>

            <Loading />


            <Group position="right" >
                <Button.Group>

                    <Button
                        size='xs'
                        radius='md'
                        color={!editAccess ? 'blue.6' : 'red.6'}
                        onClick={() => handleClickEditButton()}
                        leftIcon={!editAccess ? <IconEdit /> : <IconX />}
                    >
                        {!editAccess ? 'Edit' : 'Cancel'}
                    </Button>

                    <Button
                        form='formEditCustomer'
                        size='xs'
                        color='blue.6'
                        type='submit'
                        disabled={!form.isDirty()}
                        leftIcon={<IconDownload />} >
                        Save Changes</Button>
                    <Button
                        size='xs'
                        color='red.6'
                        disabled={editAccess}
                        radius='md'
                        onClick={openConfirmDeleteCustomer}
                        leftIcon={<IconTrashX />} >
                        Delete</Button>
                </Button.Group>
            </Group>

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