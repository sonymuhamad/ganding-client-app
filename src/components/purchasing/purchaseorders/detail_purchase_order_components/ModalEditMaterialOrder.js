import React from "react"
import { PriceTextInput, ModalForm, ReadOnlyTextInput } from "../../../custom_components"
import { useRequest } from "../../../../hooks"
import { useForm } from "@mantine/form"
import { FailedNotif, SuccessNotif } from "../../../notifications"
import { closeAllModals } from "@mantine/modals"
import { Group, NumberInput } from "@mantine/core"
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

            <ReadOnlyTextInput
                label='Material name'
                m='xs'
                icon={<IconAsset />}
                value={material.name}
            />

            <Group
                grow
                m='xs'
            >

                <ReadOnlyTextInput
                    label='Pesanan untuk produksi'
                    icon={<IconBarcode />}
                    value={to_product ? to_product.name : ''}
                />


                <ReadOnlyTextInput
                    label='Product number'
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

                <ReadOnlyTextInput
                    label='Quantity arrived'
                    icon={<IconClipboardCheck />}
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