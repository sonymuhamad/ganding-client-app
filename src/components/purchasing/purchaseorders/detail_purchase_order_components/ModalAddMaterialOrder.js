import React, { useCallback, useState, useEffect } from "react"

import { useRequest } from "../../../../hooks"
import { ModalForm, PriceTextInput } from "../../../custom_components"
import { Select, NumberInput, Group, Divider, Text } from "@mantine/core"
import { IconClipboardList, IconAsset, IconBarcode } from "@tabler/icons"
import { SuccessNotif, FailedNotif } from "../../../notifications"
import { closeAllModals } from "@mantine/modals"
import { CustomSelectComponentMrp, CustomSelectComponentProduct } from "../../../layout"



const ModalAddMaterialOrder = ({ idSupplier, idPurchaseOrder, setAddMaterialOrder }) => {

    const { Retrieve, Post, RetrieveWithoutExpiredTokenHandler } = useRequest()

    const [materialList, setMaterialList] = useState([])
    const [dataToProductList, setDataToProductList] = useState([])

    const [selectedMaterial, setSelectedMaterial] = useState(null)
    const [ordered, setOrdered] = useState('')
    const [price, setPrice] = useState(0)
    const [mrpList, setMrpList] = useState([])
    const [selectedMrp, setSelectedMrp] = useState(null)
    const [selectedToProduct, setSelectedToProduct] = useState(null)

    useEffect(() => {
        Retrieve(idSupplier, 'supplier-material-list').then(data => {
            setMaterialList(data)
        })
        RetrieveWithoutExpiredTokenHandler(idSupplier, 'mrp').then(data => {
            setMrpList(data)
        })
    }, [idSupplier])

    const getSelectedMaterial = useCallback((idSelectedMaterial) => {
        return materialList.find(material => material.id === parseInt(idSelectedMaterial))
    }, [materialList])

    const getSelectedToProduct = useCallback((idSelectedProduct) => {
        return dataToProductList.find(product => product.id === parseInt(idSelectedProduct))
    }, [dataToProductList])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validate_data = {
            material: selectedMaterial,
            purchase_order_material: idPurchaseOrder,
            ordered: ordered,
            price: price,
            to_product: selectedToProduct
        }

        try {
            const addedMaterialOrder = await Post(validate_data, 'material-order-management')
            const onSelectedMaterial = getSelectedMaterial(selectedMaterial)
            const onSelectedToProduct = getSelectedToProduct(selectedToProduct)
            setAddMaterialOrder(onSelectedMaterial, onSelectedToProduct, addedMaterialOrder)

            closeAllModals()
            SuccessNotif('Add material order success')
        } catch (e) {

            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
                return
            }
            FailedNotif('Add material order failed')

        }
    }

    const generateToProductList = useCallback((requiredProduct) => {
        // generate data product from 2 resource (requirement material related, requirement subcont related)

        return requiredProduct.map(reqProduct => {
            const { process, product_subcont } = reqProduct
            if (process) {
                const { product } = process
                const { id, name, code } = product
                return { value: id, label: name, code: code }
            }
            const { product } = product_subcont
            const { id, name, code } = product
            return { value: id, label: name, code: code }
        })

    }, [])

    const getRequirementMaterial = useCallback((id_material) => {
        // return array of required product

        const onSelectedMaterial = getSelectedMaterial(id_material)

        if (onSelectedMaterial) {
            const { ppic_requirementmaterial_related, ppic_requirementmaterialsubcont_related } = onSelectedMaterial
            return generateToProductList([...ppic_requirementmaterial_related, ...ppic_requirementmaterialsubcont_related])
        }
        return []

    }, [getSelectedMaterial, generateToProductList])

    const setChangeDataToProduct = useCallback((value) => {
        const requirementMaterial = getRequirementMaterial(value)

        setDataToProductList(requirementMaterial)
        setSelectedToProduct(null)

    }, [getRequirementMaterial])

    const onChangeSelectedMaterial = (value) => {

        setSelectedMaterial(value)
        setChangeDataToProduct(value)
        if (selectedMrp) {
            setSelectedMrp(null)
            setOrdered(undefined)
        }

    }

    const setOnchangeSelectedMrp = (idMaterial) => {
        setSelectedMrp(idMaterial)

        if (idMaterial) {

            setSelectedMaterial(idMaterial)
            setChangeDataToProduct(idMaterial)
            return
        }

        setSelectedMaterial(null)
        setChangeDataToProduct(null)
        return
    }

    return (
        <ModalForm
            idForm='formAddMaterialOrder'
            onSubmit={handleSubmit} >

            <Select
                label='Select from request material'
                placeholder="Select material from request"
                radius='md'
                m='xs'
                icon={<IconClipboardList />}
                value={selectedMrp}
                data={mrpList.map(mrp => {
                    const { material, quantity } = mrp
                    const { name, spec, uom, id } = material

                    return { value: id, label: name, quantity: quantity, spec: spec, unit: uom }
                })}
                itemComponent={CustomSelectComponentMrp}
                onChange={setOnchangeSelectedMrp}
                clearable
                searchable
            />

            <Divider my='xs' />

            <Select
                required
                label='Material'
                placeholder="Select material"
                radius='md'
                m='xs'
                clearable
                searchable
                icon={<IconAsset />}
                data={materialList.map(material => ({ value: material.id, label: material.name }))}
                value={selectedMaterial}
                onChange={onChangeSelectedMaterial}
            />

            <Select
                label='Untuk produksi product'
                placeholder="Pilih product untuk pengalokasian material"
                value={selectedToProduct}
                clearable
                searchable
                onChange={value => setSelectedToProduct(value)}
                data={dataToProductList.map(product => {
                    const { value, label, code } = product
                    return { value: value, label: label, code: code }
                })}

                itemComponent={CustomSelectComponentProduct}
                icon={<IconBarcode />}
                radius='md'
                m='xs'
            />

            <Group
                grow
                m='xs'
            >


                <NumberInput
                    required
                    label='Quantity order'
                    placeholder="Input quantity order"
                    radius='md'
                    icon={<IconClipboardList />}
                    hideControls
                    value={ordered}
                    onChange={(value) => {
                        setOrdered(value)
                    }}
                    rightSection={<Text size='xs' color='dimmed' >
                        {selectedMaterial ? materialList.find(material => material.id === parseInt(selectedMaterial)).uom.name : ''}
                    </Text>}
                />

                <PriceTextInput
                    label='Harga / unit'
                    placeholder="Input harga per unit"
                    value={price}
                    onChange={val => {
                        setPrice(val)
                    }}
                />

            </Group>

        </ModalForm>
    )
}

export default ModalAddMaterialOrder