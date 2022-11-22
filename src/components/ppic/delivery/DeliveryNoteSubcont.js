import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRequest } from "../../../hooks/useRequest";

import { Button, TextInput, Group, Paper, Textarea, Select } from "@mantine/core";

import { IconDotsCircleHorizontal, IconSearch, IconClipboardCheck, IconBarcode, IconUser, IconCodeAsterix, IconPackgeExport, IconPackgeImport, IconTruck, IconPlus, IconUserCheck, IconTruckDelivery, IconCalendar, IconDownload } from "@tabler/icons";
import BaseTableExpanded from '../../tables/BaseTableExpanded'

import { openModal, closeAllModals } from "@mantine/modals";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { FailedNotif, SuccessNotif } from "../../notifications/Notifications";




const ExpandedDeliveryNoteSubcont = ({ data }) => {

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

            {data.productdeliversubcont_set.map(delivered => (
                <Paper p='xs' radius='md' key={delivered.id} m='xs' withBorder  >

                    <TextInput
                        icon={<IconBarcode />}
                        readOnly
                        radius='md'
                        label='Product name'
                        value={delivered.product.name}
                    />

                    <TextInput
                        icon={<IconCodeAsterix />}
                        readOnly
                        radius='md'
                        label='Product number'
                        value={delivered.product.code}
                    />

                    <Group grow >

                        <TextInput
                            icon={<IconPackgeExport />}
                            readOnly
                            radius='md'
                            label='Quantity shipped'
                            value={delivered.quantity}
                        />

                        <TextInput
                            icon={<IconPackgeImport />}
                            readOnly
                            radius='md'
                            label='Quantity received'
                            value={delivered.received ? delivered.received : 0}
                        />
                    </Group>

                </Paper>
            ))}

        </Paper>
    )
}

const ModalAddDeliveryNoteSubcont = () => {

    const navigate = useNavigate()
    const { Post, Get, Loading } = useRequest()
    const [driverList, setDriverList] = useState([])
    const [vehicleList, setVehicleList] = useState([])
    const [supplierList, setSupplierList] = useState([])

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
            driver: value => value === null ? 'Please select driver' : null,
            vehicle: value => value === null ? 'Please select vehicle' : null,
            supplier: value => value === null ? 'Please select supplier' : null,
            date: value => value === null ? 'Select delivery date' : null
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
    }, [Get])

    useEffect(() => {
        fetch()
    }, [fetch])

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
            const newDeliverySubcont = await Post({ ...val, date: dateInput }, 'delivery-note-subcont-management')
            closeAllModals()
            SuccessNotif('Add delivery subconstruction success')
            navigate(`/home/ppic/delivery/subcont/${newDeliverySubcont.id}`)
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add delivery subcontstruction failed')
        }
    }, [Post, navigate])


    return (
        <form onSubmit={form.onSubmit(handleSubmit)}  >
            <Loading />
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

            <Button
                fullWidth
                radius='md'
                m='xs'
                leftIcon={<IconDownload />}
                type='submit'
            >
                Save
            </Button>

        </form>
    )
}


const DeliveryNoteSubcont = () => {

    const { Get, Loading } = useRequest()
    const [dnSubcont, setDnSubcont] = useState([])
    const [searchDeliveryNote, setSearchDeliveryNote] = useState('')


    const filteredDeliveryNoteSubcont = useMemo(() => {

        return dnSubcont.filter(dn => dn.code.toLowerCase().includes(searchDeliveryNote.toLowerCase()) || dn.date.toLowerCase().includes(searchDeliveryNote.toLowerCase()) || dn.supplier.name.toLowerCase().includes(searchDeliveryNote.toLowerCase()))

    }, [dnSubcont, searchDeliveryNote])


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
            selector: row => new Date(row.date).toDateString()
        },
        {
            name: 'Number of product shipped',
            selector: row => row.productdeliversubcont_set.length,
            style: {
                padding: -5,
                margin: -10
            }
        },
        {
            name: '',
            selector: row => row.buttonDetail,
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

            setDnSubcont(data.map(dn => ({
                ...dn, buttonDetail: <Button
                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.8'
                    variant='subtle'
                    radius='md'
                    component={Link}
                    to={`/home/ppic/delivery/subcont/${dn.id}`}
                >
                    Detail
                </Button>,
            })))
        })
    }, [])

    return (
        <>
            <Loading />

            <Group position="right" m='xs' >

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
                    onClick={openModalAddDeliveryNoteSubcont}
                >
                    Delivery
                </Button>

            </Group>

            <BaseTableExpanded
                data={filteredDeliveryNoteSubcont}
                column={columnDeliveryNoteSubcont}
                expandComponent={ExpandedDeliveryNoteSubcont}
            />

        </>
    )
}

export default DeliveryNoteSubcont