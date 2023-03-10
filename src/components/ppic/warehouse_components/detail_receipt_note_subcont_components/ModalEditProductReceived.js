import React, { useCallback } from "react";
import { Text, Group, TextInput, NumberInput } from "@mantine/core";
import { IconBarcode, IconTimeline, IconSortAscending2, IconPackgeImport, IconAssemblyOff, IconRegex } from "@tabler/icons";
import { closeAllModals } from "@mantine/modals";
import { useRequest, useNotification } from "../../../../hooks";
import { ModalForm } from "../../../custom_components";
import { useForm } from "@mantine/form";
import { FailedNotif } from "../../../notifications";


const ModalEditProductReceived = ({ setUpdateProductReceived, data }) => {

    const { Put } = useRequest()
    const { successNotif, failedNotif } = useNotification()
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
            const updatedProductReceived = await Put(data.id, data, 'receipts/products-received')
            setUpdateProductReceived(updatedProductReceived)
            successNotif('Edit product received success')
            closeAllModals()
        } catch (e) {
            const { message } = e
            const { data } = message
            const { product_subcont } = data
            form.setErrors(data)
            if (product_subcont) {
                FailedNotif(product_subcont)
            }
            failedNotif(e, 'Edit product received failed')
        }
    }, [Put, setUpdateProductReceived, successNotif, failedNotif])

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