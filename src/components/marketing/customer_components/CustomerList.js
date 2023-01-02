import React, { useState, useEffect, useMemo, useCallback } from "react";

///await GetAndExpiredTokenHandler('customer')
import { useRequest } from "../../../hooks";
import { BaseTableExpanded } from "../../tables";
import { Button, Group, TextInput, Textarea, NumberInput } from "@mantine/core";
import { Link } from "react-router-dom";
import { closeAllModals, openModal } from "@mantine/modals";
import { IconDownload, IconPlus, IconAt, IconMapPin, IconDeviceMobile, IconUserPlus, IconDotsCircleHorizontal } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { ExpandedCustomerList } from "../../layout";



const ModalAddCustomer = ({ handleAddCustomer }) => {

    const { Post, Loading } = useRequest()
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
            SuccessNotif('Add customer success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add customer failed')
        }
    }



    return (
        <form onSubmit={form.onSubmit(handleSubmit)} >
            <Loading />

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

            <Button
                type='submit'
                fullWidth
                leftIcon={<IconDownload />}
                radius='md'
                my='md'
            >
                Save
            </Button>

        </form>

    )
}

const CustomerList = () => {

    const [customerList, setCustomerList] = useState([])
    const { Loading, GetAndExpiredTokenHandler } = useRequest()

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
            selector: row => <Button
                leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                color='teal.8'
                variant='subtle'
                radius='md'
                component={Link}
                to={`/home/marketing/customers/${row.id}`}
            >
                Detail
            </Button>,
        }

    ], [])

    useEffect(() => {
        GetAndExpiredTokenHandler('customer').then(data => {
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
            <Loading />

            <Group
                m='xs'
                position="right"
            >
                <Button
                    onClick={openModalAddCustomer}
                    radius='md'
                    variant='outline'
                    leftIcon={<IconPlus />}
                >
                    Customer
                </Button>

            </Group>

            <BaseTableExpanded
                noData="No data customer"
                column={column}
                data={customerList}
                expandComponent={ExpandedCustomerList}
            />
        </>
    )
}

export default CustomerList