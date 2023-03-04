import React, { useState, useCallback, useEffect } from "react"
import { closeAllModals } from "@mantine/modals"
import { Select, TextInput, Textarea, NumberInput, Group, Divider } from "@mantine/core"
import { IconCodeAsterix, IconBarcode, IconCalendar, IconClipboard, IconPackgeExport, IconRegex, IconCalendarEvent } from "@tabler/icons"

import { useRequest, useNotification } from "../../../../hooks"
import { CustomSelectComponent } from "../../../layout"
import { ModalForm } from "../../../custom_components"


const ModalAddProductShipped = ({ idDeliveryNote, setAddProductShipped }) => {

    const { Post, Get } = useRequest()
    const { successNotif, failedNotif } = useNotification()

    const [quantity, setQuantity] = useState('')
    const [description, setDescription] = useState('')
    const [selectedProductOrder, setSelectedProductOrder] = useState(null)
    const [selectedSchedule, setSelectedSchedule] = useState(null)
    const [errorProductOrder, setErrorProductOrder] = useState(false)

    const [scheduleList, setScheduleList] = useState([])
    const [productOrderList, setProductOrderList] = useState([])

    const fetch = useCallback(async () => {
        try {
            const schedulelist = await Get('schedules/product-incomplete')
            const productorderList = await Get('order/product-incomplete')
            setScheduleList(schedulelist)
            setProductOrderList(productorderList)

        } catch (e) {
            console.log(e)
        }
    }, [Get])

    useEffect(() => {
        fetch()
    }, [fetch])


    const getSelectedProductOrder = useCallback((idSelectedProductOrder) => {

        return productOrderList.find(productOrder => {
            const { id } = productOrder
            return id === idSelectedProductOrder
        })

    }, [productOrderList])

    const generateDataWithSchedule = useCallback(() => {

        if (selectedSchedule === null) {
            return {
                quantity: quantity,
                product_order: selectedProductOrder,
                delivery_note_customer: idDeliveryNote,
                description: description
            }
        }

        return {
            quantity: quantity,
            product_order: selectedProductOrder,
            delivery_note_customer: idDeliveryNote,
            schedules: selectedSchedule,
            description: description
        }


    }, [quantity, selectedProductOrder, idDeliveryNote, description, selectedSchedule])

    const setDataProductShippedAfterInsert = useCallback((newProductShipped) => {
        const { product_order } = newProductShipped
        const selectedProductOrder = getSelectedProductOrder(product_order)
        return setAddProductShipped({ ...newProductShipped, product_order: selectedProductOrder })

    }, [getSelectedProductOrder, setAddProductShipped])

    const handleAddProductShipped = useCallback(async (e) => {
        e.preventDefault()
        const validated_data = generateDataWithSchedule()

        try {
            const newProductShipped = await Post(validated_data, 'deliveries/products-shipped/customer')
            setDataProductShippedAfterInsert(newProductShipped)
            successNotif('Add product shipped success')
            closeAllModals()
        } catch (e) {
            if (e.message.data.product_order) {
                setErrorProductOrder(e.message.data.product_order)
            }
            failedNotif(e, 'Add product shipped failed')
        }

    }, [generateDataWithSchedule, setDataProductShippedAfterInsert, successNotif, failedNotif])

    const handleChangeSelectSchedule = useCallback((value) => {
        const selectedSchedule = scheduleList.find(schedule => schedule.id === parseInt(value))
        setSelectedSchedule(value)

        if (value === null) {
            setQuantity(undefined)
            setSelectedSchedule(null)
            setSelectedProductOrder(null)

        } else {
            setQuantity(selectedSchedule.quantity)
            setSelectedProductOrder(selectedSchedule.product_order.id)
            setSelectedSchedule(selectedSchedule.id)

        }

    }, [scheduleList])

    return (
        <>

            <ModalForm
                formId='formAddProductShipped'
                onSubmit={handleAddProductShipped} >

                <Select
                    icon={<IconCalendarEvent />}
                    m='xs'
                    label='Schedule list'
                    placeholder="Select product from schedules"
                    radius='md'
                    value={selectedSchedule}
                    data={scheduleList.map(schedule => ({ value: schedule.id, label: schedule.product_order.product.name, date: schedule.date, quantity: schedule.quantity }))}
                    itemComponent={CustomSelectComponent}
                    clearable
                    searchable
                    nothingFound='Not found'
                    onChange={handleChangeSelectSchedule}
                />

                <Divider variant="dashed" />

                <Select
                    required
                    placeholder="Select product to send"
                    label='Product'
                    radius='md'
                    error={errorProductOrder}
                    icon={<IconBarcode />}
                    m='xs'
                    data={productOrderList.map(productOrder => ({ value: productOrder.id, label: productOrder.product.name }))}
                    value={selectedProductOrder}
                    onChange={val => {
                        setSelectedProductOrder(val)

                        if (selectedSchedule) {
                            setSelectedSchedule(null)
                        }

                    }}
                />

                <TextInput
                    icon={<IconRegex />}
                    readOnly
                    radius='md'
                    m='xs'
                    value={selectedProductOrder !== null ? productOrderList.find(productOrder => productOrder.id === parseInt(selectedProductOrder)).product.code : ''}
                    label='Product number'
                />

                <Group m='xs' grow >

                    <TextInput
                        icon={<IconCodeAsterix />}
                        readOnly
                        radius='md'
                        variant="filled"
                        value={selectedProductOrder !== null ? productOrderList.find(productOrder => productOrder.id === parseInt(selectedProductOrder)).sales_order.code : ''}
                        label='Sales order number'
                    />

                    <TextInput
                        icon={<IconCalendar />}
                        readOnly
                        radius='md'
                        variant='filled'
                        value={selectedProductOrder !== null ? new Date(productOrderList.find(productOrder => productOrder.id === parseInt(selectedProductOrder)).sales_order.date).toDateString() : ''}
                        label='Sales order date'
                    />

                    <NumberInput
                        required
                        icon={<IconPackgeExport />}
                        hideControls
                        placeholder="Input quantity product to send"
                        label='Quantity product shipped'
                        radius='md'
                        value={quantity}
                        onChange={val => setQuantity(val)}
                    />

                </Group>

                <Textarea
                    m='xs'
                    placeholder="Input keterangan"
                    label='Keterangan'
                    radius='md'
                    icon={<IconClipboard />}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

            </ModalForm>

        </>
    )
}

export default ModalAddProductShipped