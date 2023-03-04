import React, { useState, useEffect, useCallback } from "react"
import { useRequest, useNotification } from "../../../../hooks"
import { ModalForm } from "../../../custom_components"
import { Text, Select, TextInput, Group, NumberInput, Textarea, UnstyledButton, ThemeIcon, Paper } from "@mantine/core"

import { IconBarcode, IconSortAscending2, IconTimeline, IconAsset, IconXboxX, IconCircleCheck, IconCircleDotted, IconClipboard } from "@tabler/icons";
import { closeAllModals } from "@mantine/modals";
import { CustomSelectComponentProcess, CustomSelectComponentProduct } from "../../../layout";



const ModalAddProductSubcont = ({ setAddProductShipped, deliveryNoteSubcontId }) => {

    const { successNotif, failedNotif } = useNotification()
    const { Get, Post } = useRequest()
    const [productList, setProductList] = useState([])
    const [processList, setProcessList] = useState([])

    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedProcess, setSelectedProcess] = useState(null)
    const [quantity, setQuantity] = useState('')
    const [description, setDescription] = useState('')

    const [errorProduct, setErrorProduct] = useState(false)
    const [errorProcess, setErrorProcess] = useState(false)
    const [errorQuantity, setErrorQuantity] = useState(false)

    const fetch = useCallback(async () => {
        try {
            const productList = await Get('products-subcont')
            setProductList(productList)
        } catch (e) {
            console.log(e)
        }
    }, [Get])

    useEffect(() => {
        fetch()
    }, [fetch])

    const getSelectedProcess = useCallback((idSelectedProcess) => {
        return processList.find(process => process.id === idSelectedProcess)
    }, [processList])

    const getSelectedProduct = useCallback((idSelectedProduct) => {
        return productList.find(product => product.id === idSelectedProduct)
    }, [productList])


    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            deliver_note_subcont: deliveryNoteSubcontId,
            product: selectedProduct,
            process: selectedProcess,
            quantity: quantity,
            description: description
        }

        const objSelectedProduct = getSelectedProduct(selectedProduct)
        const objSelectedProcess = getSelectedProcess(selectedProcess)

        try {
            const newProductShipped = await Post(data, 'deliveries/products-shipped/subcont')
            setAddProductShipped({ ...newProductShipped, product: objSelectedProduct, process: objSelectedProcess })
            successNotif('Add product shipped success')
            closeAllModals()
        } catch (e) {
            if (e.message.data) {
                const { message } = e
                const { data } = message
                const { product, process, quantity } = data
                if (product) {
                    setErrorProduct(product)
                }

                if (process) {
                    setErrorProcess(process)
                }

                if (quantity) {
                    setErrorQuantity(quantity)
                }
            }
            failedNotif(e, 'Add product shipped failed')

        }
    }


    return (
        <ModalForm
            formId='formAddProductSubcont'
            onSubmit={handleSubmit} >


            <Select
                m='xs'
                icon={<IconBarcode />}
                label='Product'
                placeholder="Pick a product"
                searchable
                nothingFound="No products"
                radius='md'
                clearable
                error={errorProduct}
                itemComponent={CustomSelectComponentProduct}
                data={productList.map(product => ({ value: product.id, label: product.name, code: product.code, group: product.customer.name }))}
                required
                value={selectedProduct}
                onChange={value => {
                    setSelectedProduct(value)

                    if (value === null) {
                        setProcessList([])
                    } else {
                        const productSelected = productList.find(product => product.id === parseInt(value))
                        const processList = productSelected.ppic_process_related
                        setProcessList(processList)
                    }

                    setSelectedProcess(null)
                }}
            />

            <Select
                m='xs'
                icon={<IconTimeline />}
                label='Process'
                placeholder="Pick a process subcont"
                searchable
                nothingFound=" This product doesn't have process subconstruction "
                radius='md'
                itemComponent={CustomSelectComponentProcess}
                data={processList.map(process => ({ value: process.id, label: process.process_name, order: process.order }))}
                required
                error={errorProcess}
                value={selectedProcess}
                onChange={value => {
                    setSelectedProcess(value)
                }}
            />
            <Group grow m='xs' >

                <TextInput
                    label='Wip'
                    readOnly
                    variant="filled"
                    radius='md'
                    icon={<IconSortAscending2 />}
                    value={selectedProduct !== null & selectedProcess !== null ? processList.find(process => process.id === parseInt(selectedProcess)).order : ''}
                />

                <NumberInput
                    required
                    min={1}
                    error={errorQuantity}
                    hideControls
                    radius='md'
                    label='Quantity shipped'
                    placeholder="Input quantity of product to be sent"
                    value={quantity}
                    onChange={value => {
                        setQuantity(value)
                    }}
                />
            </Group>

            <Textarea
                label='Keterangan'
                placeholder="Input keterangan"
                radius='md'
                m='xs'
                icon={<IconClipboard />}
                value={description}
                onChange={e => setDescription(e.target.value)}
            />


            {selectedProcess !== null &&
                <Paper m='xl'  >

                    <UnstyledButton>
                        <Group>
                            <IconAsset />
                            <div>
                                <Text size='sm' color='dimmed' >Material used in subconstruction</Text>
                            </div>
                        </Group>
                    </UnstyledButton>

                    {processList.find(pros => pros.id === parseInt(selectedProcess)).requirementmaterial_set.map(reqMat => (
                        <Group key={reqMat.id} position="apart" >

                            <Group grow my='xs' >

                                <TextInput
                                    radius='md'
                                    variant="filled"
                                    label='Material name'
                                    readOnly
                                    value={reqMat.material.name}
                                />

                                <TextInput
                                    radius='md'
                                    variant="filled"
                                    label='Stock'
                                    readOnly
                                    value={reqMat.material.warehousematerial.quantity}
                                />

                                <TextInput
                                    radius='md'
                                    variant="filled"
                                    label='Number of needs'
                                    readOnly
                                    value={quantity === '' || quantity === 0 || quantity === undefined ? 0 :
                                        Math.ceil((quantity / reqMat.output) * reqMat.input)}
                                />

                            </Group>



                            <ThemeIcon
                                radius='xl'
                                mt='md'
                                color={quantity === '' || quantity === 0 || quantity === undefined ? 'blue' :
                                    Math.ceil((quantity / reqMat.output) * reqMat.input) > parseInt(reqMat.material.warehousematerial) ? 'red' : 'blue'}
                            >

                                {quantity === '' || quantity === 0 || quantity === undefined ? <IconCircleDotted /> :
                                    Math.ceil((quantity / reqMat.output) * reqMat.input) > parseInt(reqMat.material.warehousematerial) ? <IconXboxX /> : <IconCircleCheck />
                                }

                            </ThemeIcon>

                        </Group>
                    ))}

                    {processList.find(pros => pros.id === parseInt(selectedProcess)).requirementmaterial_set.length === 0 &&
                        <Text size='sm' align='center' color='dimmed' >
                            This process doesn't have requirement material
                        </Text>
                    }


                </Paper>


            }

            {selectedProcess !== null &&
                <Paper m='xl'  >
                    <UnstyledButton>
                        <Group>
                            <IconBarcode />
                            <div>
                                <Text size='sm' color='dimmed' >Product assembly used</Text>
                            </div>
                        </Group>
                    </UnstyledButton>

                    {processList.find(pros => pros.id === parseInt(selectedProcess)).requirementproduct_set.map(reqProduct => (
                        <Group key={reqProduct.id} spacing='xs' position="apart" >

                            <Group grow my='xs' >

                                <TextInput
                                    radius='md'
                                    label='Product name'
                                    readOnly
                                    value={reqProduct.product.name}
                                />

                                <TextInput
                                    radius='md'
                                    label='Stock'
                                    readOnly
                                    value={reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity}
                                />


                                <TextInput
                                    radius='md'
                                    label='Number of needs'
                                    readOnly
                                    value={quantity === '' || quantity === 0 || quantity === undefined ? 0 :
                                        Math.ceil((quantity / reqProduct.output) * reqProduct.input)}
                                />

                            </Group>



                            <ThemeIcon
                                radius='xl'
                                mt='md'
                                color={quantity === '' || quantity === 0 || quantity === undefined ? 'blue' :
                                    Math.ceil((quantity / reqProduct.output) * reqProduct.input) > parseInt(reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity) ? 'red' : 'blue'}
                            >

                                {quantity === '' || quantity === 0 || quantity === undefined ? <IconCircleDotted /> :
                                    Math.ceil((quantity / reqProduct.output) * reqProduct.input) > parseInt(reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity) ? <IconXboxX /> : <IconCircleCheck />
                                }

                            </ThemeIcon>

                        </Group>
                    ))}

                    {processList.find(pros => pros.id === parseInt(selectedProcess)).requirementproduct_set.length === 0 &&
                        <Text size='sm' align='center' color='dimmed' >
                            This process doesn't have requirement product assembly
                        </Text>
                    }

                </Paper>


            }

        </ModalForm>
    )
}

export default ModalAddProductSubcont