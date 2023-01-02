import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Badge, Button, Group, Select, Textarea, TextInput } from "@mantine/core";

import { useRequest } from "../../../hooks";
import { openModal, closeAllModals } from "@mantine/modals";
import { BaseTableExpanded } from "../../tables";
import { IconClipboard, IconPlus, IconSearch, IconDotsCircleHorizontal, IconUserCheck, IconCodeAsterix, IconCalendar, IconDownload } from "@tabler/icons";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { Link } from "react-router-dom";


const ModalAddSalesOrder = () => {

    const { GetAndExpiredTokenHandler, Loading, Post } = useRequest()
    const [customerList, setCustomerList] = useState([])
    const navigate = useNavigate()

    const form = useForm({
        initialValues: {
            code: '',
            customer: null,
            date: '',
            description: '',
        }
    })

    useEffect(() => {
        GetAndExpiredTokenHandler('customer').then(data => {
            setCustomerList(data)
        })
    }, [])

    const handleSubmit = async (value) => {
        const { date, ...rest } = value
        let data
        if (date) {
            data = { ...rest, date: date.toLocaleDateString('en-CA') }
        } else {
            data = rest
        }

        try {
            const newSo = await Post(data, 'sales-order-management')
            SuccessNotif('New sales order added successfully')
            navigate(`/home/marketing/sales-order/${newSo.id}`)
            closeAllModals()
        } catch (e) {

            form.setErrors({ ...e.message.data })
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors[0])
            }
            console.log(e)
        }

    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}  >
            <Loading />

            <Select
                data={customerList.map(customer => ({ value: customer.id, label: customer.name }))}
                label='Customer'
                placeholder="Select customer"
                required
                radius='md'
                m='xs'
                {...form.getInputProps('customer')}
                icon={<IconUserCheck />}
            />

            <TextInput
                label='Sales order number'
                required
                radius='md'
                m='xs'
                placeholder="Input sales order number"
                {...form.getInputProps('code')}
                icon={<IconCodeAsterix />}
            />

            <DatePicker
                label='Sales order date'
                placeholder="Pick a date"
                required
                radius='md'
                m='xs'
                {...form.getInputProps('date')}
                icon={<IconCalendar />}
            />

            <Textarea
                label='Keterangan'
                placeholder="Input keterangan sales order"
                radius='md'
                m='xs'
                {...form.getInputProps('description')}
                icon={<IconClipboard />}
            />

            <Button
                fullWidth
                leftIcon={<IconDownload />}
                type='submit'
                radius='md'
            >
                Save
            </Button>

        </form>
    )
}

const ExpandedSalesOrder = ({ data }) => {
    const { description } = data

    return (
        <Textarea
            label='Keterangan'
            radius='md'
            m='sm'
            readOnly
            variant='filled'
            icon={<IconClipboard />}
            value={description}
        />
    )
}


const SalesOrderList = () => {

    const { Loading, GetAndExpiredTokenHandler } = useRequest()
    const [salesOrderList, setSalesOrderList] = useState([])
    const [query, setQuery] = useState('')

    const filteredSalesOrder = useMemo(() => {

        const valFiltered = query.toLowerCase()

        return salesOrderList.filter((so) => so.customer.name.toLowerCase().includes(valFiltered) || so.date.includes(valFiltered) || so.code.includes(valFiltered))

    }, [query, salesOrderList])

    const finishedSoCheck = useCallback((productorder_set = []) => {
        return !productorder_set.some(po => parseInt(po.ordered) > parseInt(po.delivered))
    }, [])

    const columnSo = useMemo(() => [
        // columns for sales order tables
        {
            name: 'Customer',
            selector: row => row.customer.name,
        },
        {
            name: 'Sales number',
            selector: row => row.code,
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Status',
            selector: row => (<Badge
                color={row.closed ? 'dark.6' : finishedSoCheck(row.productorder_set) ? 'blue.6' : row.fixed ? 'green.6' : 'yellow.6'}
            >
                {row.closed ? 'Closed' : finishedSoCheck(row.productorder_set) ? 'Finished' : row.fixed ? 'In progress' : 'Pending'}
            </Badge>),
            style: {
                paddingLeft: 0,
                marginLeft: -30,
                marginRight: 0
            }
        },
        {
            name: '',
            selector: row => <Button
                leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                color='teal.8'
                variant='subtle'
                radius='md'
                component={Link}
                to={`/home/marketing/sales-order/${row.id}`}
            >
                Detail
            </Button>,
            style: {
                paddingLeft: 0,
                marginLeft: 0,
                marginRight: 0
            }
        }

    ], [finishedSoCheck])

    const openModalAddSalesOrder = useCallback(() => openModal({
        title: 'Add sales order',
        radius: 'md',
        size: 'xl',
        children: <ModalAddSalesOrder />
    }), [])

    useEffect(() => {
        GetAndExpiredTokenHandler('sales-order-list').then(data => {
            setSalesOrderList(data)
        })
    }, [])

    return (
        <>
            <Loading />

            <Group
                position="right"
                m='xs'
            >

                <TextInput
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    radius='md'
                    placeholder="Search sales order"
                    icon={<IconSearch />}
                />

                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openModalAddSalesOrder}
                >
                    Sales order
                </Button>

            </Group>

            <BaseTableExpanded
                noData="No sales order"
                column={columnSo}
                data={filteredSalesOrder}
                expandComponent={ExpandedSalesOrder}
            />


        </>
    )
}

export default SalesOrderList