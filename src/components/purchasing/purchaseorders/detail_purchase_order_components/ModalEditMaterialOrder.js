import React from "react"
import { PriceTextInput, ModalForm, } from "../../../custom_components"
import { useRequest } from "../../../../hooks"
import { useForm } from "@mantine/form"
import { FailedNotif, SuccessNotif } from "../../../notifications"
import { closeAllModals } from "@mantine/modals"
import { Group, TextInput, NumberInput } from "@mantine/core"
import { IconClipboardList, IconClipboardCheck, IconCodeAsterix, IconAsset, IconBarcode } from "@tabler/icons"



const ModalEditMaterialOrder = ({ data, setEditMaterialOrder }) => {

    const { material, purchase_order_material, to_product, ...rest } = data
    const { Put } = useRequest()
    const form = useForm({
        initialValues: {
            ...rest,
            material: material.id,
            purchase_order_material: purchase_order_material.id
        }
    })

    const handleSubmit = async (value) => {
        try {
            const updatedMaterialOrder = await Put(data.id, value, 'material-order-management')
            setEditMaterialOrder(updatedMaterialOrder)
            SuccessNotif('Edit material order success')
            closeAllModals()
        } catch (e) {
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('Edit material order failed')
            }
        }
    }

    return (
        <ModalForm
            formId='formEditMaterialOrder'
            onSubmit={form.onSubmit(handleSubmit)}  >

            <TextInput
                label='Material name'
                readOnly
                variant="filled"
                radius='md'
                m='xs'
                icon={<IconAsset />}
                value={material.name}
            />

            <Group
                grow
                m='xs'
            >

                <TextInput
                    label='Pesanan untuk produksi'
                    variant='filled'
                    readOnly
                    radius='md'
                    icon={<IconBarcode />}
                    value={to_product ? to_product.name : ''}
                />


                <TextInput
                    label='Product number'
                    variant='filled'
                    readOnly
                    radius='md'
                    icon={<IconCodeAsterix />}
                    value={to_product ? to_product.code : ''}
                />

            </Group>

            <Group grow m='xs' >

                <NumberInput
                    label='Quantity order'
                    placeholder="Input quantity order"
                    radius='md'
                    hideControls
                    icon={<IconClipboardList />}
                    {...form.getInputProps('ordered')}
                />

                <TextInput
                    label='Quantity arrived'
                    radius='md'
                    variant="filled"
                    icon={<IconClipboardCheck />}
                    readOnly
                    value={form.values.arrived}
                />

                <PriceTextInput
                    label='Harga / unit'
                    placeholder="Input harga per unit"
                    {...form.getInputProps('price')}
                    required
                />

            </Group>

        </ModalForm>
    )
}

export default ModalEditMaterialOrder