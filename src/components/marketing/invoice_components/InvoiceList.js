import React, { useState, useEffect, useMemo, useCallback } from "react";

import { BaseTable } from "../../tables";
import { useRequest } from "../../../hooks";

import { Badge, Button, Group, TextInput, Select, NumberInput, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconClipboardCheck, IconCodeAsterix, IconDotsCircleHorizontal, IconDownload, IconPlus, IconSearch, IconDiscount2, IconReceiptTax, IconCalendar } from "@tabler/icons";
import { openModal, closeAllModals } from "@mantine/modals";
import { CustomSelectComponentSalesOrder } from "../../layout";

import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { FailedNotif, SuccessNotif } from "../../notifications";




const ModalAddInvoice = ({ handleAddInvoice }) => {

    const form = useForm({
        initialValues: {
            code: '',
            date: null,
            discout: '',
            tax: '',
            sales_order: null,
        }
    })
    const { GetAndExpiredTokenHandler, Loading, Post } = useRequest()
    const [closedSalesOrder, setClosedSalesOrder] = useState([])

    useEffect(() => {
        GetAndExpiredTokenHandler('closed-sales-order-list').then(data => {
            setClosedSalesOrder(data)
        })
    }, [])

    const generateDate = useCallback((date, data) => {
        if (date) {
            return { ...data, date: date.toLocaleDateString('en-CA') }
        }
        return data
    }, [])

    const getSelectedSalesOrder = useCallback((id) => {
        return closedSalesOrder.find(salesOrder => salesOrder.id === parseInt(id))
    }, [closedSalesOrder])

    const generateData = useCallback((value) => {
        const { date, ...rest } = value

        const validate_data = generateDate(date, rest)

        const { sales_order } = validate_data
        const selectedSalesOrder = getSelectedSalesOrder(sales_order)

        return [validate_data, selectedSalesOrder]

    }, [getSelectedSalesOrder, generateDate])

    const handleSubmit = async (value) => {

        const [validate_data, selectedSalesOrder] = generateData(value)

        try {
            const newInvoice = await Post(validate_data, 'invoice-management')
            handleAddInvoice({ ...newInvoice, sales_order: selectedSalesOrder })
            SuccessNotif('Add invoice success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Add invoice failed')
        }
    }


    return (
        <form onSubmit={form.onSubmit(handleSubmit)}  >

            <Loading />

            <Select
                label='Sales order'
                placeholder="Pilih sales order yang ingin dibuatkan invoice"
                radius='md'
                required
                clearable
                m='xs'
                searchable
                nothingFound="Tidak ada sales order yang telah selesai"
                icon={<IconClipboardCheck />}
                itemComponent={CustomSelectComponentSalesOrder}
                data={closedSalesOrder.map(salesOrder => {
                    const { date, code, customer, id } = salesOrder
                    const { name } = customer
                    return { label: code, value: id, customerName: name, salesOrderDate: date }
                })}
                {...form.getInputProps('sales_order')}
            />

            <TextInput
                {...form.getInputProps('code')}
                label='Invoice number'
                placeholder="Input invoice number"
                radius='md'
                required
                m='xs'
                icon={<IconCodeAsterix />}
            />


            <DatePicker
                label='Date'
                m='xs'
                required
                placeholder="Pick invoice date"
                radius='md'
                icon={<IconCalendar />}
                {...form.getInputProps('date')}
            />

            <Group
                grow
                m='xs'
            >

                <NumberInput
                    label='Ppn'
                    placeholder="Input ppn dalam persen"
                    radius='md'
                    required
                    min={0}
                    hideControls
                    rightSection={<Text size='sm' color='dimmed' >
                        %
                    </Text>}
                    icon={<IconReceiptTax />}
                    {...form.getInputProps('tax')}
                />

                <NumberInput
                    label='Discount'
                    placeholder="Input discount dalam persen"
                    radius='md'
                    min={0}
                    required
                    hideControls
                    rightSection={<Text size='sm' color='dimmed' >
                        %
                    </Text>}
                    icon={<IconDiscount2 />}
                    {...form.getInputProps('discount')}
                />

            </Group>


            <Button
                type="submit"
                fullWidth
                radius='md'
                leftIcon={<IconDownload />}
            >
                Save
            </Button>

        </form>
    )
}



const InvoiceList = () => {

    const { Loading, GetAndExpiredTokenHandler } = useRequest()
    const [invoiceList, setInvoiceList] = useState([])
    const [query, setQuery] = useState('')

    const filteredInvoice = useMemo(() => {

        const searchVal = query.toLowerCase()

        return invoiceList.filter(invoice => {
            const { code, date, sales_order } = invoice

            const { customer } = sales_order
            const { name } = customer

            return code.toLowerCase().includes(searchVal) || date.toLowerCase().includes(searchVal) || sales_order.code.toLowerCase().includes(searchVal) || name.toLowerCase().includes(searchVal)
        })

    }, [query, invoiceList])


    const columnInvoice = useMemo(() => [
        {
            name: 'Customer',
            selector: row => row.sales_order.customer.name
        },
        {
            name: 'Invoice number',
            selector: row => row.code
        },
        {
            name: 'Invoice date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => (<Badge
                color={row.closed ? 'dark.6' : row.done ? 'blue.6' : 'yellow.6'}
            >
                {row.closed ? 'Closed' : row.done ? 'Finished' : 'Pending'}
            </Badge>)
        },
        {
            name: '',
            selector: row => <Button
                leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                color='teal.8'
                variant='subtle'
                radius='md'
                component={Link}
                to={`/home/marketing/invoice/${row.id}`}
            >
                Detail
            </Button>
        }
    ], [])


    const handleAddInvoice = useCallback((newInvoice) => {

        setInvoiceList(prev => {
            return [...prev, newInvoice]
        })

    }, [])


    const openModalAddInvoice = () => openModal({
        title: 'Add invoice',
        size: 'xl',
        radius: 'md',
        children: <ModalAddInvoice handleAddInvoice={handleAddInvoice} />
    })


    useEffect(() => {

        GetAndExpiredTokenHandler('invoice').then(data => {
            setInvoiceList(data)
        })

    }, [])

    return (
        <>

            <Loading />

            <Group
                m='xs'
                position="right"
            >

                <TextInput
                    placeholder="Search"
                    icon={<IconSearch />}
                    radius='md'
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />

                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openModalAddInvoice}
                >
                    Invoice
                </Button>

            </Group>

            <BaseTable
                noData="No data invoice"
                data={filteredInvoice}
                column={columnInvoice}
            />

        </>
    )
}

export default InvoiceList