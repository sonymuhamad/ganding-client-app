import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Divider, Text, Group, TextInput, Select, NumberInput } from "@mantine/core";
import { IconCalendarEvent, IconBarcode, IconTimeline, IconSortAscending2, IconPackgeImport, IconAssemblyOff } from "@tabler/icons";
import { closeAllModals } from "@mantine/modals";
import { useRequest } from "../../../../hooks";
import { ModalForm } from "../../../custom_components"
import { SuccessNotif, FailedNotif } from "../../../notifications";
import { CustomSelectComponent, CustomSelectComponentReceiptSubcont } from "../../../layout";


const ModalAddProductReceived = ({ idReceiptNoteSubcont, setAddProductReceived }) => {

    const { Get, Post } = useRequest()

    const [scheduleList, setScheduleList] = useState([])
    const [productSubcontList, setProductSubcontList] = useState([])

    const [selectedSchedule, setSelectedSchedule] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [quantity, setQuantity] = useState('')
    const [quantityNotGood, setQuantityNotGood] = useState('')

    const getSelectedSchedule = useCallback(() => {
        return scheduleList.find(({ id }) => id === parseInt(selectedSchedule))
    }, [scheduleList, selectedSchedule])

    const getSelectedProductSubcont = useCallback(() => {
        return productSubcontList.find(productSubcont => productSubcont.id === parseInt(selectedProduct))
    }, [productSubcontList, selectedProduct])

    const selectedProcessName = useMemo(() => {

        const selectedProductSubcont = getSelectedProductSubcont()
        if (selectedProductSubcont) {
            const { process } = selectedProductSubcont
            const { process_name } = process
            return process_name
        }
        return ''

    }, [getSelectedProductSubcont])

    const selectedProcessOrder = useMemo(() => {

        const selectedProductSubcont = getSelectedProductSubcont()
        if (selectedProductSubcont) {
            const { process } = selectedProductSubcont
            const { order } = process
            return `Wip${order}`
        }
        return ''

    }, [getSelectedProductSubcont])


    const fetch = useCallback(async () => {
        try {
            const productSubcontList = await Get('product-subcont-list')
            const schedules = await Get('receipt-subcont-schedule-list')

            setProductSubcontList(productSubcontList)
            setScheduleList(schedules)

        } catch (e) {
            console.log(e)
        }
    }, [Get])

    useEffect(() => {
        fetch()
    }, [fetch])

    const generateProductReceivedAfterInsert = useCallback((newProductReceived) => {
        const selectedProductSubcont = getSelectedProductSubcont()
        const selectedSchedule = getSelectedSchedule()
        setAddProductReceived({ ...newProductReceived, product_subcont: selectedProductSubcont, schedules: selectedSchedule })

    }, [getSelectedProductSubcont, getSelectedSchedule, setAddProductReceived])


    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()

        let validated_data

        validated_data = {
            quantity: quantity,
            quantity_not_good: quantityNotGood,
            product_subcont: selectedProduct,
            receipt_note: idReceiptNoteSubcont
        }

        if (selectedSchedule) {
            validated_data = { ...validated_data, schedules: selectedSchedule }
        }

        try {
            const newProductReceived = await Post(validated_data, 'product-subcont-receipt-management')
            generateProductReceivedAfterInsert(newProductReceived)
            SuccessNotif('Add product received from subconstruction success')
            closeAllModals()
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else if (e.message.data.product_subcont) {
                FailedNotif(e.message.data.product_subcont)
            } else {
                FailedNotif('Edit product received failed')
            }
        }

    }, [Post, quantity, quantityNotGood, selectedProduct, selectedSchedule, idReceiptNoteSubcont, generateProductReceivedAfterInsert])



    return (
        <ModalForm
            formId='formAddProductReceived'
            onSubmit={handleSubmit} >

            <Select
                placeholder="Select from schedule"
                label='Schedule receipt of product subconstruction'
                itemComponent={CustomSelectComponent}
                data={scheduleList.map(({ id, product_subcont, date, quantity }) => ({ value: id, label: product_subcont.product.name, date: date, quantity: quantity }))}
                radius='md'
                m='xs'
                icon={<IconCalendarEvent />}
                value={selectedSchedule}
                clearable
                searchable
                nothingFound={'No data'}
                onChange={value => {
                    setSelectedSchedule(value)
                    if (value) {
                        const schedule = scheduleList.find(sched => sched.id === parseInt(value))
                        setSelectedProduct(schedule.product_subcont.id)
                        setQuantity(schedule.quantity)
                    } else {
                        setSelectedProduct(null)
                        setQuantity(0)
                    }
                }
                }
            />


            <Divider />

            <Select
                placeholder="Select product"
                label="Product subconstruction"
                itemComponent={CustomSelectComponentReceiptSubcont}
                data={productSubcontList.map(({ id, product, process }) => ({ value: id, label: product.name, order: process.order, code: product.code }))}
                radius='md'
                m='xs'
                searchable
                clearable
                value={selectedProduct}
                onChange={value => {
                    setSelectedProduct(value)
                    if (selectedSchedule) {
                        setSelectedSchedule(null)
                        setQuantity(0)
                    }
                }
                }
                required
                icon={<IconBarcode />}
            />

            <Group grow m='xs' >

                <TextInput
                    label='Process name'
                    readOnly
                    radius='md'
                    icon={<IconTimeline />}
                    value={selectedProcessName}
                />

                <TextInput
                    label='Wip'
                    readOnly
                    radius='md'
                    icon={<IconSortAscending2 />}
                    value={selectedProcessOrder}
                />

            </Group>

            <Group grow m='xs' >

                <NumberInput
                    placeholder="Product received from subconstruction"
                    label='Quantity received'
                    radius='md'
                    value={quantity}
                    onChange={value => setQuantity(value)}
                    icon={<IconPackgeImport />}
                    hideControls
                    required
                    min={0}
                    rightSection={
                        <Text size='sm' color='dimmed' >
                            Pcs
                        </Text>}
                />

                <NumberInput
                    placeholder="Product not good from subconstruction"
                    label='Quantity product not good'
                    radius='md'
                    hideControls
                    required
                    min={0}
                    value={quantityNotGood}
                    onChange={value => setQuantityNotGood(value)}
                    icon={<IconAssemblyOff />}
                    rightSection={
                        <Text size='sm' color='dimmed' >
                            Pcs
                        </Text>}
                />


            </Group>

        </ModalForm>
    )
}

export default ModalAddProductReceived