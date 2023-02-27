import React, { useState, useEffect, useCallback } from "react"
import { TextInput, NumberInput, Textarea, Group } from "@mantine/core"
import { IconRegex, IconBarcode, IconCalendar, IconCodeAsterix, IconPackgeExport, IconClipboard } from "@tabler/icons"

import { useRequest } from "../../../../hooks"
import { ModalForm } from "../../../custom_components"
import { SuccessNotif, FailedNotif } from "../../../notifications"
import { closeAllModals } from "@mantine/modals"



const ModalEditProductShipped = ({ data, idDeliveryNote, setEditProductShipped }) => {

    const { Put } = useRequest()
    const [quantity, setQuantity] = useState('')
    const [description, setDescription] = useState('')
    const [errorQuantity, setErrorQuantity] = useState(false)

    const { product_order } = data
    const { product, sales_order } = product_order
    const { name, code } = product
    const { date } = sales_order

    useEffect(() => {
        setQuantity(data.quantity)
        setDescription(data.description)
    }, [data.quantity, data.description])

    const handleSubmitEditProductShipped = useCallback(async (e) => {

        e.preventDefault()

        const dataSubmitted = {
            delivery_note_customer: idDeliveryNote,
            quantity: quantity,
            product_order: product_order.id,
            description: description
        }

        try {
            const updatedProductShipped = await Put(data.id, dataSubmitted, 'product-delivery')
            setEditProductShipped(updatedProductShipped)
            SuccessNotif('Edit product shipped success')
            closeAllModals()
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('Edit product shipped failed')
            }
            if (e.message.data.quantity) {
                setErrorQuantity(e.message.data.quantity)
            }
        }

    }, [quantity, idDeliveryNote, data, description, product_order.id, setEditProductShipped])

    return (
        <>

            <ModalForm
                formId='formEditProductShipped'
                onSubmit={handleSubmitEditProductShipped} >

                <TextInput
                    label='Product name'
                    m='xs'
                    variant='filled'
                    readOnly
                    radius='md'
                    value={name}
                    icon={<IconBarcode />}
                />

                <TextInput
                    icon={<IconRegex />}
                    readOnly
                    radius='md'
                    m='xs'
                    variant='filled'
                    value={code}
                    label='Product number'
                />

                <Group m='xs' grow >

                    <TextInput
                        icon={<IconCodeAsterix />}
                        readOnly
                        radius='md'
                        variant='filled'
                        value={sales_order.code}
                        label='Sales order number'
                    />

                    <TextInput
                        icon={<IconCalendar />}
                        readOnly
                        variant='filled'
                        radius='md'
                        value={new Date(date).toDateString()}
                        label='Sales order date'
                    />


                    <NumberInput
                        required
                        icon={<IconPackgeExport />}
                        min={0}
                        error={errorQuantity}
                        placeholder='Input quantity product to send'
                        label='Quantity product shipped'
                        radius='md'
                        value={quantity}
                        onChange={val => setQuantity(val)}
                    />

                </Group>

                <Textarea
                    m='xs'
                    radius='md'
                    placeholder="Input keterangan"
                    label='Keterangan'
                    icon={<IconClipboard />}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

            </ModalForm>


        </>
    )
}

export default ModalEditProductShipped