import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { BaseTable } from "../../tables";
import { IconClipboardCheck, IconUser, IconCodeAsterix, IconCalendarEvent, IconTruckDelivery, IconUserCheck } from "@tabler/icons";

import { useRequest, useSearch } from "../../../hooks";
import { openModal, closeAllModals } from "@mantine/modals";

import { TextInput, Group, Textarea, Select } from "@mantine/core";
import { SuccessNotif, FailedNotif } from '../../notifications'
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { generateDataWithDate } from "../../../services";

import { ModalForm, SearchTextInput, NavigationDetailButton, ButtonAdd, HeadSection } from '../../custom_components'


const ModalAddDeliveryNote = () => {

    const { Get, Post } = useRequest()
    const navigate = useNavigate()

    const [customerList, setCustomerList] = useState([])
    const [driverList, setDriverList] = useState([])
    const [vehicleList, setVehicleList] = useState([])

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
            customer: null,
            driver: null,
            vehicle: null,
            date: null
        },
        validate: {
            customer: value => validate(value, 'Customer'),
            driver: value => validate(value, 'Driver'),
            vehicle: value => validate(value, 'Vehicle'),
            date: value => validate(value, 'Date')
        }
    })

    const fetchData = useCallback(async () => {

        try {
            const customerList = await Get('customer-lists')
            const driverList = await Get('driver')
            const vehicleList = await Get('vehicle')

            setCustomerList(customerList)
            setDriverList(driverList)
            setVehicleList(vehicleList)

        } catch (e) {
            console.log(e)
        }

    }, [])

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
            const newDeliveryNote = await Post(validate_data, 'delivery-note-management')
            SuccessNotif('Add delivery note success')
            navigate(`/home/ppic/delivery/${newDeliveryNote.id}`)
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add delivery note failed')
        }

    }, [navigate, validateNote])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <>

            <ModalForm
                formId='formAddDeliveryNote'
                onSubmit={form.onSubmit(handleSubmit)}  >


                <Select
                    icon={<IconUserCheck />}
                    m='xs'
                    placeholder="Select customer"
                    radius='md'
                    data={customerList.map(customer => ({ value: customer.id, label: customer.name }))}
                    {...form.getInputProps('customer')}
                    label='Customer'
                    required
                />

                <TextInput
                    icon={<IconCodeAsterix />}
                    m='xs'
                    placeholder="Input delivery number"
                    radius='md'
                    {...form.getInputProps('code')}
                    label='Delivery number'
                    required
                />

                <DatePicker
                    icon={<IconCalendarEvent />}
                    required
                    label='Delivery date'
                    placeholder="Pick a date"

                    {...form.getInputProps('date')}
                    radius='md'
                    m='xs'
                />

                <Group grow m='xs' >

                    <Select
                        icon={<IconUser />}
                        placeholder="Select Driver"
                        label='Driver name'
                        radius='md'
                        data={driverList.map(driver => ({ value: driver.id, label: driver.name }))}
                        {...form.getInputProps('driver')}
                        required
                    />

                    <Select
                        icon={<IconTruckDelivery />}
                        placeholder="Select vehicle number"
                        label='Vehicle number'
                        radius='md'
                        data={vehicleList.map(vehicle => ({ value: vehicle.id, label: vehicle.license_part_number }))}
                        {...form.getInputProps('vehicle')}
                        required
                    />

                </Group>

                <Textarea
                    icon={<IconClipboardCheck />}
                    m='xs'
                    placeholder="Input description notes"
                    label='Description notes'
                    radius='md'
                    {...form.getInputProps('note')}
                />

            </ModalForm>

        </>
    )
}


const DeliveryNote = () => {

    const { Get } = useRequest()
    const [deliveryNote, setDeliveryNote] = useState([])
    const { query, lowerCaseQuery, setValueQuery } = useSearch()

    const filteredDeliveryNote = useMemo(() => {

        return deliveryNote.filter(dn => {
            const { code, date, customer } = dn
            const { name } = customer

            return code.toLowerCase().includes(lowerCaseQuery) || date.toLowerCase().includes(lowerCaseQuery) || name.toLowerCase().includes(lowerCaseQuery)
        })

    }, [deliveryNote, lowerCaseQuery])


    const columnDeliveryNote = useMemo(() => [
        {
            name: 'Customer',
            selector: row => row.customer.name
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
                url={`/home/ppic/delivery/${row.id}`}
            />,
        }
    ], [])

    const openModalAddDeliveryNote = useCallback(() => openModal({
        title: 'Add delivery note',
        radius: 'md',
        size: 'xl',
        children: <ModalAddDeliveryNote />
    }), [])

    useEffect(() => {

        Get('delivery-note').then(data => {
            setDeliveryNote(data)
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
                    onClick={openModalAddDeliveryNote}
                >
                    Delivery
                </ButtonAdd>

            </HeadSection>

            <BaseTable
                column={columnDeliveryNote}
                data={filteredDeliveryNote}
                noData='Tidak ada data pengiriman product finished goods'
            />

        </>
    )
}

export default DeliveryNote