import React, { useCallback } from "react"
import { TextInput, Group, NumberInput, Divider } from "@mantine/core";
import { useForm } from "@mantine/form"
import { IconAsset, IconCodeAsterix, IconArchive, IconShoppingCart, IconPackgeImport } from "@tabler/icons";
import { closeAllModals } from "@mantine/modals"

import { useRequest, useNotification } from "../../../../hooks"
import { ModalForm } from "../../../custom_components"
import { FailedNotif } from "../../../notifications";


const ModalEditMaterialReceived = ({ data, setUpdateMaterialReceived, idDn }) => {

    const { Put } = useRequest()
    const form = useForm({
        initialValues: {
            id: data.id,
            delivery_note_material: idDn,
            material_order: data.material_order.id,
            quantity: data.quantity
        }
    })
    const { successNotif, failedNotif } = useNotification()

    const handleSubmit = useCallback(async (value) => {
        try {
            const updatedMaterialReceived = await Put(value.id, value, 'receipts/materials-received')
            setUpdateMaterialReceived(updatedMaterialReceived)
            successNotif('Edit material received success')
            closeAllModals()

        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.material_order) {
                FailedNotif(e.message.data.material_order)
            }
            failedNotif(e, 'Edit material received failed')
        }
    }, [setUpdateMaterialReceived, successNotif, failedNotif])

    return (
        <ModalForm
            formId='formEditMaterialReceived'
            onSubmit={form.onSubmit(handleSubmit)} >

            <Group grow my='lg' >
                <TextInput
                    icon={<IconAsset />}
                    label='Material'
                    radius='md'
                    variant='filled'
                    {...form.getInputProps('material_order')}
                    value={data.material_order.material.name}
                    readOnly
                />

                <TextInput
                    icon={<IconCodeAsterix />}
                    label='Purchase order number'
                    radius='md'
                    variant="filled"
                    value={data.material_order.purchase_order_material.code}
                    readOnly
                />
            </Group>

            <Group grow >
                <NumberInput
                    icon={<IconShoppingCart />}
                    hideControls
                    radius='md'
                    variant='filled'
                    label='Total quantity order'
                    value={data.material_order.ordered}
                    readOnly
                />

                <NumberInput
                    icon={<IconArchive />}
                    hideControls
                    radius='md'
                    variant='filled'
                    label='Total quantity arrived'
                    value={data.material_order.arrived}
                    readOnly
                />
            </Group>

            <Divider
                size='xs'
                variant='dashed'
                mt='lg'
                mb='xs'
            />

            <NumberInput
                icon={<IconPackgeImport />}
                hideControls
                label='Quantity'
                {...form.getInputProps('quantity')}
                radius='md'
            />

        </ModalForm>
    )
}

export default ModalEditMaterialReceived