import React, { useState, useEffect } from "react"
import { closeAllModals, openConfirmModal } from "@mantine/modals"
import { NumberInput, Text } from "@mantine/core"

import { useRequest, useNotification } from "../../hooks"
import { ModalForm } from "../custom_components"
import { IconBuildingWarehouse } from "@tabler/icons"


const ModalEditStockProduct = ({ whProduct, setUpdateWarehouse }) => {

    const { successNotif, failedNotif } = useNotification()
    const [quantity, setQuantity] = useState('')
    const { Put } = useRequest()

    const handleSubmit = async () => {
        try {
            const updatedWarehouse = await Put(whProduct.id, { quantity: quantity }, 'warehouse/product-management')
            closeAllModals()
            setUpdateWarehouse(updatedWarehouse)
            successNotif('Edit stock warehouse success')
        } catch (e) {
            failedNotif(e, 'Edit stock warehouse failed')
        }
    }


    const openConfirmSubmit = () => openConfirmModal({
        title: `Edit stock product`,
        children: (
            <Text size="sm">
                Are you sure?, you will change stock in the warehouse directly.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmit()
    })

    useEffect(() => {

        if (whProduct.quantity) {
            setQuantity(whProduct.quantity)
        }

    }, [whProduct])

    return (

        <ModalForm
            formId='formEditStockWarehouseProduct'
            onSubmit={(e) => {
                e.preventDefault()
                openConfirmSubmit()
            }}  >

            <NumberInput
                radius='md'
                label='Quantity'
                hideControls
                icon={<IconBuildingWarehouse />}
                required
                min={0}
                value={quantity}
                onChange={(e) => {

                    if (e === undefined) {
                        setQuantity(0)
                    } else {
                        setQuantity(e)
                    }

                }}
            />

        </ModalForm>
    )
}

export default ModalEditStockProduct