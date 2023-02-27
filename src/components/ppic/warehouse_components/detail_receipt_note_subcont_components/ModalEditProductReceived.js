import React, { useCallback } from "react";
import { Text, Group, TextInput, NumberInput } from "@mantine/core";
import { IconBarcode, IconTimeline, IconSortAscending2, IconPackgeImport, IconAssemblyOff, IconRegex } from "@tabler/icons";
import { closeAllModals } from "@mantine/modals";
import { useRequest } from "../../../../hooks";
import { ModalForm } from "../../../custom_components";
import { useForm } from "@mantine/form";

import { SuccessNotif, FailedNotif } from "../../../notifications";

const ModalEditProductReceived = ({ setUpdateProductReceived, data }) => {

    const { Put } = useRequest()

    const form = useForm({
        initialValues: {
            id: data.id,
            product_subcont: data.product_subcont.id,
            quantity: data.quantity,
            quantity_not_good: data.quantity_not_good,
            receipt_note: data.receipt_note.id,
            schedules: !data.schedules ? null : data.schedules.id
        }
    })

    const handlesubmitEditProductReceived = useCallback(async (data) => {
        try {
            const updatedProductReceived = await Put(data.id, data, 'product-subcont-receipt-management')
            setUpdateProductReceived(updatedProductReceived)
            SuccessNotif('Edit product received success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
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
    }, [Put, setUpdateProductReceived])

    const { product_subcont } = data
    const { product, process } = product_subcont
    const { name, code } = product
    const { process_name, order } = process

    return (
        <ModalForm
            formId='formEditProductReceived'
            onSubmit={form.onSubmit(handlesubmitEditProductReceived)}  >

            <TextInput
                value={name}
                label='Product'
                readOnly
                radius='md'
                m='xs'
                variant="filled"
                icon={<IconBarcode />}
            />

            <TextInput
                label='Product number'
                readOnly
                variant="filled"
                radius='md'
                m='xs'
                value={code}
                icon={<IconRegex />}
            />

            <Group grow m='xs' >
                <TextInput
                    label='Process name'
                    readOnly
                    variant="filled"
                    radius='md'
                    value={process_name}
                    icon={<IconTimeline />}
                />
                <TextInput
                    label='Wip'
                    readOnly
                    variant="filled"
                    radius='md'
                    value={`Wip${order}`}
                    icon={<IconSortAscending2 />}
                />
            </Group>


            <Group grow m='xs' >
                <NumberInput
                    label='Quantity product received'
                    {...form.getInputProps('quantity')}
                    radius='md'
                    min={0}
                    icon={<IconPackgeImport />}
                    placeholder="Input product received"
                    rightSection={<Text size='sm' color='dimmed' >
                        Pcs
                    </Text>}
                />

                <NumberInput
                    min={0}
                    label='Product not good'
                    {...form.getInputProps('quantity_not_good')}
                    icon={<IconAssemblyOff />}
                    radius='md'
                    placeholder='Input quantity product not good'
                    rightSection={<Text size='sm' color='dimmed' >
                        Pcs
                    </Text>}
                />
            </Group>

        </ModalForm>
    )
}

export default ModalEditProductReceived