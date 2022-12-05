import React, { useState, useEffect, useMemo, useCallback, } from "react";
import { Link } from "react-router-dom";
import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";
import { Button, TextInput, Group, NumberInput, Textarea } from "@mantine/core";
import { IconSearch, IconDotsCircleHorizontal, IconPlus, IconUserCheck, IconAt, IconDeviceMobile, IconMapPins, IconDownload } from "@tabler/icons";

import { closeAllModals, openModal } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { SuccessNotif } from '../../notifications'


const ModalAddSupplier = ({ onAddSupplier }) => {

    const { Post, Loading } = useRequest()
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            address: '',
            phone: ''
        }
    })

    const handleSubmit = async (value) => {
        try {
            await Post(value, 'supplier')
            onAddSupplier()
            closeAllModals()
            SuccessNotif('Add new supplier success')
        } catch (e) {
            form.setErrors(e.message.data)
            console.log(e)
        }
    }

    return (

        <form onSubmit={form.onSubmit(handleSubmit)} >
            <Loading />

            <TextInput
                label='Name'
                placeholder="Input supplier name"
                radius='md'
                required
                m='xs'
                icon={<IconUserCheck />}
                {...form.getInputProps('name')}
            />

            <TextInput
                label='Email'
                placeholder="Input supplier email"
                radius='md'
                m='xs'
                required
                icon={<IconAt />}
                {...form.getInputProps('email')}
            />

            <NumberInput
                min={0}
                label='Phone'
                placeholder="Input supplier phone number"
                radius='md'
                m='xs'
                required
                hideControls
                icon={<IconDeviceMobile />}
                {...form.getInputProps('phone')}
            />

            <Textarea
                label='Address'
                placeholder="Supplier address"
                radius='md'
                m='xs'
                required
                icon={<IconMapPins />}
                {...form.getInputProps('address')}
            />

            <Button
                radius='md'
                fullWidth
                leftIcon={<IconDownload />}
                type='submit'
            >
                Save
            </Button>

        </form>
    )
}



const SupplierList = () => {

    const { GetAndExpiredTokenHandler, Loading } = useRequest()
    const [supplierList, setSupplierList] = useState([])
    const [query, setQuery] = useState('')
    const [action, setAction] = useState(0)

    const filteredSupplierList = useMemo(() => {
        return supplierList.filter(supplier => supplier.name.toLowerCase().includes(query.toLowerCase()) || supplier.email.toLowerCase().includes(query.toLowerCase()))
    }, [query, supplierList])

    const columnSupplierList = useMemo(() => [
        {
            name: 'Supplier name',
            selector: row => row.name
        },
        {
            name: 'Email',
            selector: row => row.email
        },
        {
            name: 'Number of material',
            selector: row => row.number_of_material
        },
        {
            name: 'Total purchase order',
            selector: row => row.number_of_purchase_order
        },
        {
            name: '',
            selector: row => row.detailButton
        }
    ], [])

    const handleAddSupplier = useCallback(() => setAction(prev => prev + 1),
        [])

    const openAddSupplier = useCallback(() => openModal({
        title: 'Add supplier',
        radius: 'md',
        size: 'lg',
        children: <ModalAddSupplier onAddSupplier={handleAddSupplier} />
    }), [])

    useEffect(() => {
        const fetch = async () => {
            try {
                const supplierList = await GetAndExpiredTokenHandler('supplier')

                setSupplierList(supplierList.map(supplier => ({
                    ...supplier, detailButton: <Button
                        leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                        color='teal.8'
                        variant='subtle'
                        radius='md'
                        component={Link}
                        to={`/home/purchasing/suppliers/${supplier.id}`}
                    >
                        Detail
                    </Button>
                })))

            } catch (e) {
                console.log(e)
            }
        }

        fetch()
    }, [action])

    return (
        <>

            <Loading />

            <Group position="right" m='xs' >

                <TextInput
                    placeholder="Search supplier"
                    icon={<IconSearch />}
                    radius='md'
                    onChange={(e) => setQuery(e.target.value)}
                />

                <Button
                    variant='outline'
                    radius='md'
                    leftIcon={<IconPlus />}
                    onClick={openAddSupplier}
                >
                    Supplier
                </Button>

            </Group>

            <BaseTable
                column={columnSupplierList}
                data={filteredSupplierList}
                noData='No supplier data'
            />


        </>
    )

}

export default SupplierList

