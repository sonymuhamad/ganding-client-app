import React, { useState, useEffect, useMemo, useCallback } from "react";
import { TextInput, Group, Textarea, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { IconClipboardCheck, IconUser, IconCodeAsterix, IconUserCheck, IconTruckDelivery, IconCalendar } from "@tabler/icons";
import { openModal, closeAllModals } from "@mantine/modals";
import { useNavigate } from "react-router-dom";

import { BaseTable } from "../../tables";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { ModalForm, NavigationDetailButton, SearchTextInput, ButtonAdd, HeadSection } from "../../custom_components";
import { generateDataWithDate } from "../../../services";
import { useRequest, useSearch } from "../../../hooks";


const ModalAddDeliveryNoteSubcont = () => {

    const navigate = useNavigate()
    const { Post, Get } = useRequest()
    const [driverList, setDriverList] = useState([])
    const [vehicleList, setVehicleList] = useState([])
    const [supplierList, setSupplierList] = useState([])


    const validate = useCallback((value, entity) => {
        if (value === null) {
            return `Please select a ${entity}`
        }
        return null
    }, [])

    const form = useForm({
        initialValues: {
            code: '',
            note: '',
            driver: null,
            vehicle: null,
            supplier: null,
            date: null
        },
        validate: {
            supplier: value => validate(value, 'Sustomer'),
            driver: value => validate(value, 'Driver'),
            vehicle: value => validate(value, 'Vehicle'),
            date: value => validate(value, 'Date')
        }
    })

    const fetch = useCallback(async () => {
        try {
            const driver = await Get('driver')
            const vehicle = await Get('vehicle')
            const supplier = await Get('supplier-list')

            setDriverList(driver)
            setVehicleList(vehicle)
            setSupplierList(supplier)

        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        fetch()
    }, [fetch])

    const validateNote = useCallback((data) => {
        if (data.note === '') {
            const { note, ...rest } = data
            return rest
        }
        return data

    }, [])


    const handleSubmit = useCallback(async (data) => {

        const validateDataWithNote = validateNote(data)
        const { date, ...rest } = validateDataWithNote
        const validate_data = generateDataWithDate(date, rest)

        try {
            const newDeliverySubcont = await Post(validate_data, 'delivery-note-subcont-management')
            closeAllModals()
            SuccessNotif('Add delivery subconstruction success')
            navigate(`/home/ppic/delivery/subcont/${newDeliverySubcont.id}`)
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add delivery subcontstruction failed')
        }
    }, [navigate, validateNote])


    return (
        <ModalForm
            formId='formAddProductSubcont'
            onSubmit={form.onSubmit(handleSubmit)}  >

            <Select
                label='Supplier'
                placeholder="Select supplier"
                required
                icon={<IconUserCheck />}
                data={supplierList.map(supplier => ({ value: supplier.id, label: supplier.name }))}
                {...form.getInputProps('supplier')}
                radius='md'
                m='xs'
            />

            <TextInput
                label='Delivery subconstruction number'
                placeholder="Input delivery number"
                {...form.getInputProps('code')}
                required
                icon={<IconCodeAsterix />}
                radius='md'
                m='xs'
            />

            <DatePicker
                icon={<IconCalendar />}
                required
                radius='md'
                m='xs'
                {...form.getInputProps('date')}
                label='Delivery date'
                placeholder="Pick delivery date"
            />

            <Group grow m='xs' >

                <Select
                    label='Driver'
                    placeholder="Select driver"
                    required
                    {...form.getInputProps('driver')}
                    icon={<IconUser />}
                    data={driverList.map(driver => ({ value: driver.id, label: driver.name }))}
                    radius='md'
                />

                <Select
                    placeholder="Select vehicle number"
                    label="Vehicle"
                    required
                    data={vehicleList.map(vehicle => ({ value: vehicle.id, label: vehicle.license_part_number }))}
                    radius='md'
                    {...form.getInputProps('vehicle')}
                    icon={<IconTruckDelivery />}
                />

            </Group>

            <Textarea
                label='Description'
                radius='md'
                mx='xs'
                placeholder="Input delivery description"
                icon={<IconClipboardCheck />}
                {...form.getInputProps('note')}
            />

        </ModalForm>
    )
}


const DeliveryNoteSubcont = () => {

    const { Get } = useRequest()
    const [dnSubcont, setDnSubcont] = useState([])
    const { query, lowerCaseQuery, setValueQuery } = useSearch()

    const filteredDeliveryNoteSubcont = useMemo(() => {

        return dnSubcont.filter(dn => {
            const { code, date, supplier } = dn
            const { name } = supplier

            return code.toLowerCase().includes(lowerCaseQuery) || date.toLowerCase().includes(lowerCaseQuery) || name.toLowerCase().includes(lowerCaseQuery)
        })

    }, [dnSubcont, lowerCaseQuery])


    const columnDeliveryNoteSubcont = useMemo(() => [
        {
            name: 'Supplier',
            selector: row => row.supplier.name
        },
        {
            name: 'Delivery number',
            selector: row => row.code
        },
        {
            name: 'Date',
            selector: row => row.date
        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/ppic/delivery/subcont/${row.id}`}
            />,
            style: {
                padding: -5,
                margin: -10
            }

        }
    ], [])

    const openModalAddDeliveryNoteSubcont = useCallback(() => openModal({
        title: 'New delivery subconstruction',
        radius: 'md',
        size: 'xl',
        children: <ModalAddDeliveryNoteSubcont />
    }), [])

    useEffect(() => {

        Get('delivery-note-subcont').then(data => {
            setDnSubcont(data)
        })

    }, [])

    return (
        <>

            <HeadSection>
                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />
                <ButtonAdd
                    onClick={openModalAddDeliveryNoteSubcont}
                >
                    Delivery subcont
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                data={filteredDeliveryNoteSubcont}
                column={columnDeliveryNoteSubcont}
                noData='Tidak ada data pengiriman product subcont'
            />

        </>
    )
}

export default DeliveryNoteSubcont