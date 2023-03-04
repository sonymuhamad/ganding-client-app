import { ModalForm } from "../../../custom_components"
import { TextInput, Textarea, NumberInput, } from "@mantine/core"
import { useRequest, useNotification } from "../../../../hooks"
import React, { useState } from "react"
import { closeAllModals } from "@mantine/modals"
import { IconPackgeExport, IconBarcode, IconRegex, IconClipboard } from "@tabler/icons"


const ModalEditProductSubcont = ({ setUpdateProductShipped, data, deliveryNoteSubcontId }) => {

    const { successNotif, failedNotif } = useNotification()
    const { Put } = useRequest()
    const [quantity, setQuantity] = useState(() => {
        return data.quantity
    })
    const [description, setDescription] = useState(() => {
        return data.description
    })
    const { product } = data
    const { name, code } = product

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validated_data = {
            deliver_note_subcont: deliveryNoteSubcontId,
            product: data.product.id,
            process: data.process.id,
            quantity: quantity,
            description: description
        }
        try {
            const updatedProductShipped = await Put(data.id, validated_data, 'deliveries/products-shipped/subcont')
            setUpdateProductShipped(updatedProductShipped)
            closeAllModals()
            successNotif('Edit product shipped success')
        } catch (e) {
            failedNotif(e, 'Edit product shipped failed')
        }
    }


    return (
        <ModalForm
            formId='formEditProductShipped'
            onSubmit={handleSubmit} >

            <TextInput
                label='Product'
                readOnly
                value={name}
                icon={<IconBarcode />}
                variant='filled'
                radius='md'
                m='xs'
            />

            <TextInput
                label='Product number'
                readOnly
                value={code}
                icon={<IconRegex />}
                variant='filled'
                radius='md'
                m='xs'
            />

            <NumberInput
                value={quantity}
                label='Quantity of product shipped'
                m='xs'
                placeholder="Input quantity"
                radius='md'
                hideControls
                min={0}
                icon={<IconPackgeExport />}
                onChange={value => {
                    setQuantity(value)
                }}
            />

            <Textarea
                value={description}
                label='Keterangan'
                placeholder="Input keterangan"
                m='xs'
                radius='md'
                icon={<IconClipboard />}
                onChange={e => setDescription(e.target.value)}
            />

        </ModalForm >
    )
}

export default ModalEditProductSubcont