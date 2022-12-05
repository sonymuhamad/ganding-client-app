import React, { useState, useEffect } from "react"

import { useRequest } from "../../hooks"
import { closeAllModals, openConfirmModal } from "@mantine/modals"
import { SuccessNotif, FailedNotif } from "../notifications"
import { Button, NumberInput, Text } from "@mantine/core"


const ModalEditStockProduct = ({ whProduct, setaction }) => {

    const [quantity, setQuantity] = useState('')
    const { Put } = useRequest()

    const handleSubmit = async () => {
        try {
            await Put(whProduct.id, { quantity: quantity }, 'warehouse-management-product')
            closeAllModals()
            setaction(prev => prev + 1)
            SuccessNotif('Edit stock success')
        } catch (e) {
            console.log(e)
            FailedNotif('Edit stock failed')
        }
    }


    const openConfirmSubmit = () => openConfirmModal({
        title: `Edit stock product`,
        children: (
            <Text size="sm">
                Are you sure?, you will change stock in the warehouse directly.
                <br />
                this action will impact a lack of data on changes of stock product, use production instead.
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
        <>
            <form onSubmit={(e) => {
                e.preventDefault()
                openConfirmSubmit()
            }}  >

                <NumberInput
                    radius='md'
                    label='Quantity'
                    hideControls
                    required
                    value={quantity}
                    onChange={(e) => {

                        if (e === undefined) {
                            setQuantity(0)
                        } else {
                            setQuantity(e)
                        }

                    }}
                />

                <Button
                    my='md'
                    radius='md'
                    fullWidth
                    type='submit'
                    disabled={quantity === whProduct.quantity}
                >
                    Save
                </Button>
            </form>
        </>
    )
}

export default ModalEditStockProduct