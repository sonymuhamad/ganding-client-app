import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

import { BaseTableExpanded } from "../../tables";
import { IconDotsCircleHorizontal, IconSearch, IconClipboardCheck, IconBarcode, IconUser, IconCodeAsterix, IconPackgeExport, IconTruck, IconPlus, IconCalendarEvent, IconDownload, IconTruckDelivery, IconUserCheck } from "@tabler/icons";

import { useRequest } from "../../../hooks";
import { openModal, closeAllModals } from "@mantine/modals";

import { Button, TextInput, Group, Paper, Textarea, Select } from "@mantine/core";
import { SuccessNotif, FailedNotif } from '../../notifications'
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";


const ExpandedDeliveryNote = ({ data }) => {
    return (
        <Paper p='sm' >

            <Textarea
                readOnly
                label='Note'
                radius='md'
                value={data.note}
                m='xs'
                icon={<IconClipboardCheck />}
            />

            <Group m='xs' grow >

                <TextInput
                    icon={<IconUser />}
                    readOnly
                    label='Driver'
                    radius='md'
                    value={data.driver.name}
                />

                <TextInput
                    icon={<IconTruck />}
                    readOnly
                    label='Vehicle number'
                    radius='md'
                    value={data.vehicle.license_part_number}
                />
            </Group>

            {data.productdelivercustomer_set.map(delivered => (
                <Paper p='xs' radius='md' key={delivered.id} m='xs' withBorder  >

                    <TextInput
                        icon={<IconBarcode />}
                        readOnly
                        radius='md'
                        label='Product name'
                        value={delivered.product_order.product.name}
                    />

                    <TextInput
                        icon={<IconCodeAsterix />}
                        readOnly
                        radius='md'
                        label='Product number'
                        value={delivered.product_order.product.code}
                    />

                    <TextInput
                        icon={<IconPackgeExport />}
                        readOnly
                        radius='md'
                        label='Quantity shipped'
                        value={delivered.quantity}
                    />

                </Paper>
            ))}

        </Paper>
    )
}

const ModalAddDeliveryNote = () => {

    const { Get, Post, Loading } = useRequest()
    const navigate = useNavigate()

    const [customerList, setCustomerList] = useState([])
    const [driverList, setDriverList] = useState([])
    const [vehicleList, setVehicleList] = useState([])

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
            customer: value => value === null ? 'Please select customer' : null,
            driver: value => value === null ? 'Please select driver' : null,
            vehicle: value => value === null ? 'Please select vehicle' : null,
            date: value => value === null ? 'Select delivery date' : null
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

    }, [Get])


    const handleSubmit = useCallback(async (data) => {

        let val
        let dateInput // set input date format to YYYY-MM-DD, so that be able to inputted to django

        if (data.note === '') {

            // if note is empty, remove it

            const { note, date, ...restProps } = data
            val = restProps
            dateInput = date.toLocaleDateString('en-CA')
        } else {
            const { date, ...restProps } = data
            val = restProps
            dateInput = date.toLocaleDateString('en-CA')
        }

        try {
            const newDeliveryNote = await Post({ ...val, date: dateInput }, 'delivery-note-management')
            SuccessNotif('Add delivery note success')
            navigate(`/home/ppic/delivery/${newDeliveryNote.id}`)
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add delivery note failed')
        }

    }, [Post, navigate])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <>
            <Loading />

            <form onSubmit={form.onSubmit(handleSubmit)}  >


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

                <Button
                    leftIcon={<IconDownload />}
                    my='md'
                    fullWidth
                    radius='md'
                    type="submit"
                >
                    Save
                </Button>

            </form>

        </>
    )
}


const DeliveryNote = () => {

    const { Get, Loading } = useRequest()
    const [deliveryNote, setDeliveryNote] = useState([])
    const [searchDeliveryNote, setSearchDeliveryNote] = useState('')

    const filteredDeliveryNote = useMemo(() => {

        return deliveryNote.filter(dn => dn.code.toLowerCase().includes(searchDeliveryNote.toLowerCase()) || dn.date.toLowerCase().includes(searchDeliveryNote.toLowerCase()) || dn.customer.name.toLowerCase().includes(searchDeliveryNote.toLowerCase()))

    }, [deliveryNote, searchDeliveryNote])


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
            selector: row => new Date(row.date).toDateString()
        },
        {
            name: 'Number of product shipped',
            selector: row => row.productdelivercustomer_set.length,
            style: {
                padding: -5,
                margin: -10,
                justifyContent: 'center'
            }
        },
        {
            name: '',
            selector: row => row.buttonDetail,
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

            setDeliveryNote(data.map(dn => ({
                ...dn, buttonDetail: <Button
                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.8'
                    variant='subtle'
                    radius='md'
                    component={Link}
                    to={`/home/ppic/delivery/${dn.id}`}
                >
                    Detail
                </Button>
            })))

        })


    }, [])

    return (
        <>
            <Loading />

            <Group m='xs' position="right" >

                <TextInput
                    icon={<IconSearch />}
                    placeholder="Search delivery note"
                    radius='md'
                    value={searchDeliveryNote}
                    onChange={e => setSearchDeliveryNote(e.target.value)}
                />

                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openModalAddDeliveryNote}
                >
                    Delivery
                </Button>

            </Group>

            <BaseTableExpanded

                column={columnDeliveryNote}
                data={filteredDeliveryNote}
                expandComponent={ExpandedDeliveryNote}

            />

        </>
    )
}

export default DeliveryNote