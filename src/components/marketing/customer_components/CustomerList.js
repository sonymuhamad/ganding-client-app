import React, { useState, useEffect, useMemo, useCallback } from "react"

import { useRequest, useNotification } from "../../../hooks"
import { BaseTable } from "../../tables"
import { TextInput, Textarea, NumberInput } from "@mantine/core"
import { closeAllModals, openModal } from "@mantine/modals"
import { IconAt, IconMapPin, IconDeviceMobile, IconUserPlus } from "@tabler/icons"
import { useForm } from "@mantine/form"
import { ButtonAdd, HeadSection, NavigationDetailButton, ModalForm } from '../../custom_components'


const ModalAddCustomer = ({ handleAddCustomer }) => {

    const { successNotif, failedNotif } = useNotification()
    const { Post } = useRequest()
    const form = useForm({
        initialValues: {
            name: '',
            address: '',
            phone: '',
            email: ''
        }
    })

    const handleSubmit = async (value) => {
        try {
            const newCustomer = await Post(value, 'customer-management')
            handleAddCustomer(newCustomer)
            successNotif('Add customer success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Add customer failed')
        }
    }



    return (
        <ModalForm
            id="formAddCustomer"
            onSubmit={form.onSubmit(handleSubmit)} >

            <TextInput
                icon={<IconUserPlus />}
                placeholder='Input name'
                label='Name'
                m='xs'
                radius='md'
                required
                {...form.getInputProps('name')}

            />

            <TextInput
                icon={<IconAt />}
                m='xs'
                radius='md'
                placeholder='Input email'
                label='Email'
                required
                {...form.getInputProps('email')}
            />

            <NumberInput
                icon={<IconDeviceMobile />}
                m='xs'
                radius='md'
                placeholder='Input phone number'
                label='Phone'
                hideControls
                {...form.getInputProps('phone')}
                required
            />

            <Textarea
                icon={<IconMapPin />}
                m='xs'
                radius='md'
                placeholder="Input address"
                label='Address'
                {...form.getInputProps('address')}
                required
            />

        </ModalForm>

    )
}

const CustomerList = () => {

    const [customerList, setCustomerList] = useState([])
    const { GetAndExpiredTokenHandler } = useRequest()

    const column = useMemo(() => [
        {
            name: 'Name',
            selector: row => row.name,
        },
        {
            name: 'Email',
            selector: row => row.email,

        },
        {
            name: 'Jumlah product',
            selector: row => row.total_product,

        },
        {
            name: 'Total sales order',
            selector: row => row.total_sales_order,

        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/marketing/customers/${row.id}`}
            />,
        }

    ], [])

    useEffect(() => {
        GetAndExpiredTokenHandler('customers').then(data => {
            setCustomerList(data)
        })
    }, [])


    const handleAddCustomer = useCallback((newCustomer) => {

        setCustomerList(prev => {
            return [...prev, newCustomer]
        })

    }, [])

    const openModalAddCustomer = useCallback(() => openModal({
        title: 'Add customer',
        size: 'xl',
        radius: 'md',
        children: <ModalAddCustomer handleAddCustomer={handleAddCustomer} />
    }), [handleAddCustomer])


    return (
        <>
            <HeadSection>

                <ButtonAdd
                    onClick={openModalAddCustomer}
                >
                    Customer
                </ButtonAdd>

            </HeadSection>

            <BaseTable
                noData="No data customer"
                column={column}
                data={customerList}
            />
        </>
    )
}

export default CustomerList