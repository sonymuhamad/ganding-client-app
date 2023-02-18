import React, { useState, useEffect, useMemo, useCallback, } from "react";
import { useRequest, useSearch } from "../../../hooks";
import { BaseTable } from "../../tables";
import { TextInput, NumberInput, Textarea } from "@mantine/core";
import { IconUserCheck, IconAt, IconDeviceMobile, IconMapPins } from "@tabler/icons";

import { closeAllModals, openModal } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { SuccessNotif } from '../../notifications'

import { ModalForm, ButtonAdd, NavigationDetailButton, SearchTextInput, HeadSection } from "../../custom_components";

const ModalAddSupplier = ({ onAddSupplier }) => {

    const { Post } = useRequest()
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
            const newSupplier = await Post(value, 'supplier-management')
            onAddSupplier(newSupplier)
            closeAllModals()
            SuccessNotif('Add new supplier success')
        } catch (e) {
            form.setErrors(e.message.data)
        }
    }

    return (

        <ModalForm
            formId='formAddSupplier'
            onSubmit={form.onSubmit(handleSubmit)} >


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


        </ModalForm>
    )
}



const SupplierList = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
    const [supplierList, setSupplierList] = useState([])
    const { lowerCaseQuery, query, setValueQuery } = useSearch()

    const filteredSupplierList = useMemo(() => {

        return supplierList.filter(supplier => {
            const { name, email } = supplier
            return name.toLowerCase().includes(lowerCaseQuery) || email.toLowerCase().includes(lowerCaseQuery)
        })

    }, [lowerCaseQuery, supplierList])

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
            selector: row => <NavigationDetailButton
                url={`/home/purchasing/suppliers/${row.id}`}
            />
        }
    ], [])

    const handleAddSupplier = useCallback((newSupplier) => setSupplierList(prev => [...prev, newSupplier]),
        [])

    const openAddSupplier = useCallback(() => openModal({
        title: 'Add supplier',
        radius: 'md',
        size: 'lg',
        children: <ModalAddSupplier onAddSupplier={handleAddSupplier} />
    }), [handleAddSupplier])

    useEffect(() => {
        const fetch = async () => {
            try {
                const supplierList = await GetAndExpiredTokenHandler('supplier')

                setSupplierList(supplierList)

            } catch (e) {
                console.log(e)
            }
        }

        fetch()
    }, [])

    return (
        <>

            <HeadSection>
                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />

                <ButtonAdd
                    onClick={openAddSupplier}
                >
                    Supplier
                </ButtonAdd>

            </HeadSection>

            <BaseTable
                column={columnSupplierList}
                data={filteredSupplierList}
                noData='No supplier data'
            />


        </>
    )

}

export default SupplierList

