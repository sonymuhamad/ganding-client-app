import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Badge, Select, Textarea, TextInput } from "@mantine/core";

import { useRequest, useSearch, useNotification } from "../../../hooks";
import { openModal, closeAllModals } from "@mantine/modals";
import { BaseTableExpanded } from "../../tables";
import { IconClipboard, IconUserCheck, IconCodeAsterix, IconCalendar, } from "@tabler/icons";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

import { HeadSection, SearchTextInput, ButtonAdd, NavigationDetailButton, ModalForm } from "../../custom_components";

import { generateDataWithDate } from "../../../services";


const ModalAddSalesOrder = () => {

    const { successNotif, failedNotif } = useNotification()
    const { GetAndExpiredTokenHandler, Post } = useRequest()
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
        const validate_data = generateDataWithDate(date, rest)

        try {
            const newSo = await Post(validate_data, 'sales-order-management')
            successNotif('Add sales order success')
            navigate(`/home/marketing/sales-order/${newSo.id}`)
            closeAllModals()
        } catch (e) {

            form.setErrors(e.message.data)
            failedNotif(e, 'Add sales order failed')
        }

    }

    return (
        <ModalForm
            id="formAddSalesOrder"
            onSubmit={form.onSubmit(handleSubmit)}  >

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

        </ModalForm>
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

    const { GetAndExpiredTokenHandler } = useRequest()
    const [salesOrderList, setSalesOrderList] = useState([])
    const { query, setValueQuery, lowerCaseQuery } = useSearch()

    const filteredSalesOrder = useMemo(() => {

        return salesOrderList.filter((so) => {
            const { customer, date, code } = so
            const { name } = customer

            return name.toLowerCase().includes(lowerCaseQuery) || date.includes(lowerCaseQuery) || code.includes(lowerCaseQuery)
        })

    }, [lowerCaseQuery, salesOrderList])

    const finishedSoCheck = useCallback((productorder_set = []) => {
        return !productorder_set.some(po => parseInt(po.ordered) > parseInt(po.delivered))
    }, [])

    const getBadgeColor = useCallback((productorder_set, closed, fixed) => {
        // get badge color based on sales order's status

        if (closed) {
            return 'dark.6'
        }
        if (finishedSoCheck(productorder_set)) {
            return 'blue.6'
        }
        if (fixed) {
            return 'green.6'
        }
        return 'yellow.6'

    }, [finishedSoCheck])

    const getBadgeLabel = useCallback((productorder_set, closed, fixed) => {
        // get badge label based on sales order's status

        if (closed) {
            return 'Closed'
        }
        if (finishedSoCheck(productorder_set)) {
            return 'Finished'
        }
        if (fixed) {
            return 'In Progress'
        }
        return 'Pending'

    }, [finishedSoCheck])

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
            selector: row => {
                const { productorder_set, closed, fixed } = row
                const badgeColor = getBadgeColor(productorder_set, closed, fixed)
                const badgeLabel = getBadgeLabel(productorder_set, closed, fixed)

                return (<Badge
                    color={badgeColor}
                >
                    {badgeLabel}
                </Badge>
                )
            },
            style: {
                paddingLeft: 0,
                marginLeft: -30,
                marginRight: 0
            }
        },
        {
            name: '',
            selector: row => <NavigationDetailButton url={`/home/marketing/sales-order/${row.id}`} />,
            style: {
                paddingLeft: 0,
                marginLeft: 0,
                marginRight: 0
            }
        }

    ], [getBadgeLabel, getBadgeColor])

    const openModalAddSalesOrder = useCallback(() => openModal({
        title: 'Add sales order',
        radius: 'md',
        size: 'xl',
        children: <ModalAddSalesOrder />
    }), [])

    useEffect(() => {
        GetAndExpiredTokenHandler('sales-orders').then(data => {
            setSalesOrderList(data)
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
                    onClick={openModalAddSalesOrder}
                >
                    Sales Order
                </ButtonAdd>

            </HeadSection>

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