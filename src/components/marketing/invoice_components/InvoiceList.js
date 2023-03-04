import React, { useState, useEffect, useMemo, useCallback } from "react"

import { BaseTable } from "../../tables"
import { useRequest, useSearch, useNotification } from "../../../hooks"

import { Badge, Group, TextInput, Select, NumberInput, Text } from "@mantine/core"
import { IconClipboardCheck, IconCodeAsterix, IconDiscount2, IconReceiptTax, IconCalendar } from "@tabler/icons"
import { openModal, closeAllModals } from "@mantine/modals"
import { CustomSelectComponentSalesOrder } from "../../layout"

import { useForm } from "@mantine/form"
import { DatePicker } from "@mantine/dates"
import { ButtonAdd, SearchTextInput, NavigationDetailButton, HeadSection, ModalForm } from "../../custom_components"
import { generateDataWithDate } from "../../../services"



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
    const { GetAndExpiredTokenHandler, Post } = useRequest()
    const [closedSalesOrder, setClosedSalesOrder] = useState([])
    const { successNotif, failedNotif } = useNotification()

    useEffect(() => {
        GetAndExpiredTokenHandler('closed-sales-order-list').then(data => {
            setClosedSalesOrder(data)
        })
    }, [])

    const getSelectedSalesOrder = useCallback((id) => {
        return closedSalesOrder.find(salesOrder => salesOrder.id === parseInt(id))
    }, [closedSalesOrder])

    const generateData = useCallback((value) => {
        const { date, ...rest } = value

        const validate_data = generateDataWithDate(date, rest)

        const { sales_order } = validate_data
        const selectedSalesOrder = getSelectedSalesOrder(sales_order)

        return [validate_data, selectedSalesOrder]

    }, [getSelectedSalesOrder])

    const handleSubmit = async (value) => {

        const [validate_data, selectedSalesOrder] = generateData(value)

        try {
            const newInvoice = await Post(validate_data, 'invoice-management')
            handleAddInvoice({ ...newInvoice, sales_order: selectedSalesOrder })
            successNotif('Add invoice success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Add invoice failed')
        }
    }


    return (
        <ModalForm
            id="formAddInvoice"
            onSubmit={form.onSubmit(handleSubmit)}  >

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

        </ModalForm>
    )
}



const InvoiceList = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
    const [invoiceList, setInvoiceList] = useState([])
    const { lowerCaseQuery, query, setValueQuery } = useSearch()

    const filteredInvoice = useMemo(() => {

        return invoiceList.filter(invoice => {
            const { code, date, sales_order } = invoice

            const { customer } = sales_order
            const { name } = customer

            return code.toLowerCase().includes(lowerCaseQuery) || date.toLowerCase().includes(lowerCaseQuery) || sales_order.code.toLowerCase().includes(lowerCaseQuery) || name.toLowerCase().includes(lowerCaseQuery)
        })

    }, [lowerCaseQuery, invoiceList])

    const getBadgeColor = useCallback((closed, done) => {
        if (closed) {
            return 'dark.6'
        }
        if (done) {
            return 'blue.6'
        }
        return 'yellow.6'
    }, [])

    const getBadgeLabel = useCallback((closed, done) => {
        if (closed) {
            return 'Closed'
        }
        if (done) {
            return 'Finished'
        }
        return 'Pending'
    }, [])


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
            selector: row => {
                const { closed, done } = row
                const badgeColor = getBadgeColor(closed, done)
                const badgeLabel = getBadgeLabel(closed, done)
                return (<Badge
                    color={badgeColor}
                >
                    {badgeLabel}
                </Badge>)
            }
        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/marketing/invoice/${row.id}`}
            />
        }

    ], [getBadgeColor, getBadgeLabel])


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

            <HeadSection>

                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />

                <ButtonAdd
                    onClick={openModalAddInvoice}
                >
                    Invoice
                </ButtonAdd>

            </HeadSection>

            <BaseTable
                noData="No data invoice"
                data={filteredInvoice}
                column={columnInvoice}
            />

        </>
    )
}

export default InvoiceList