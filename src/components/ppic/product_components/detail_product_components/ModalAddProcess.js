import React, { useState, useEffect, useCallback } from "react";
import { useRequest, useNotification } from "../../../../hooks";
import { useForm } from "@mantine/form";
import { ModalForm } from "../../../custom_components";
import { IconFileTypography, IconTrash, IconPlus, IconAsset, IconBarcode, IconTransferIn, IconTransferOut, IconLayoutKanban, IconArrowsSort } from "@tabler/icons"
import { TextInput, Group, Paper, Button, Text, Divider, NumberInput, Select, Center } from "@mantine/core"
import { closeAllModals } from "@mantine/modals";


const ModalAddProcess = (
    { productId, generateDataProcess, setAddProcess }
) => {

    const { successNotif, failedNotif } = useNotification()
    const { Post, Get } = useRequest()
    const [productList, setProductList] = useState([])
    const [materialList, setMaterialList] = useState([])
    const [processTypeList, setProcessTypeList] = useState([])

    const form = useForm({
        initialValues: {
            process_name: '',
            order: '',
            process_type: null,
            product: productId,
            requirementmaterial_set: [],
            requirementproduct_set: []
        }
    })


    useEffect(() => {
        Get('materials').then(materialList => {
            setMaterialList(materialList)
        })

        Get('products').then(productList => {
            setProductList(productList)
        })

        Get('type/process').then(processType => {
            setProcessTypeList(processType)
        })

    }, [])


    const handleSubmit = useCallback(async (value) => {
        try {
            const newProcess = await Post(value, 'process/management')
            const generatedProcess = generateDataProcess(newProcess, productList, materialList, processTypeList)
            setAddProcess(generatedProcess)
            closeAllModals()
            successNotif('Add process success')
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Add process failed')
        }

    }, [generateDataProcess, productList, materialList, setAddProcess, processTypeList, successNotif, failedNotif])


    return (
        <ModalForm
            formId='formAddProcess'
            onSubmit={form.onSubmit(handleSubmit)}
        >


            <TextInput
                label='Process name'
                radius='md'
                my='xs'
                required
                icon={<IconLayoutKanban />}
                {...form.getInputProps('process_name')}
            />

            <Select
                my='xs'
                label='Process type'
                placeholder="Select process type"
                radius='md'
                required
                icon={<IconFileTypography />}
                data={processTypeList.map(type => ({ value: type.id, label: type.name }))}
                {...form.getInputProps('process_type')}
            />

            <NumberInput
                hideControls
                label='Wip'
                radius='md'
                my='xs'
                required
                icon={<IconArrowsSort />}
                {...form.getInputProps(`order`)}
            />

            <Divider mt="xl" mb='xs' size='md' label="Bill of material" />
            {form.values.requirementmaterial_set.length === 0 &&
                <Text my='md' size='sm' align="center" color='dimmed'  >
                    This process has no bill of material
                </Text>
            }
            {form.values.requirementmaterial_set.map((reqMaterial, j) => {
                const { id } = reqMaterial
                return (
                    <Paper key={`${id}${j}`} >

                        <Group grow >

                            <Select
                                required
                                m='xs'
                                radius='md'
                                label='Material'
                                icon={<IconAsset />}
                                placeholder="Select material"
                                data={materialList.map(material => ({ value: material.id, label: material.name }))}
                                {...form.getInputProps(`requirementmaterial_set.${j}.material`)}
                            />

                            <Button
                                color="red.6"
                                mt='md'
                                leftIcon={<IconTrash />}
                                onClick={() => {
                                    form.removeListItem(`requirementmaterial_set`, j)
                                }}
                                variant='outline'
                                radius='md'
                            >
                                Remove bill of material
                            </Button>

                        </Group>

                        <Group grow m='xs' >
                            <NumberInput
                                hideControls
                                required
                                radius='md'
                                placeholder="Input jumlah penggunaan material"
                                icon={<IconTransferIn />}
                                label='Jumlah penggunaan material'
                                {...form.getInputProps(`requirementmaterial_set.${j}.input`)}
                            />

                            <NumberInput
                                hideControls
                                required
                                icon={<IconTransferOut />}
                                placeholder='Input jumlah product yang dihasilkan'
                                radius='md'
                                label='Output'
                                {...form.getInputProps(`requirementmaterial_set.${j}.output`)}
                            />
                        </Group>
                    </Paper>

                )
            }
            )}
            <Center>
                <Button
                    variant='outline'
                    radius='md'
                    leftIcon={<IconPlus />}
                    color='blue.6'
                    onClick={() => {
                        form.insertListItem(`requirementmaterial_set`,
                            {
                                material: '',
                                input: '',
                                output: ''
                            }
                        )
                    }}
                >
                    Add bill of material
                </Button>
            </Center>



            <Divider mt="xl" mb='xs' size='md' label="Product assembly" />

            {form.values.requirementproduct_set.length === 0 &&
                <Text my='md' size='sm' color='dimmed' align="center"  >
                    This process has no product assembly
                </Text>
            }

            {form.values.requirementproduct_set.map((reqProduct, i) => (
                <Paper key={`${reqProduct.id}${i}`} >

                    <Group grow  >
                        <Select
                            required
                            m='xs'
                            radius='md'
                            icon={<IconBarcode />}
                            label='Product'
                            placeholder="Select product"
                            data={productList.map(product => ({ value: product.id, label: product.name }))}
                            {...form.getInputProps(`requirementproduct_set.${i}.product`)}
                        />

                        <Button
                            color="red.6"
                            onClick={() => {
                                form.removeListItem(`requirementproduct_set`, i)
                            }}
                            variant='outline'
                            radius='md'
                            mt='md'
                            leftIcon={<IconTrash />}
                        >
                            Remove product assembly
                        </Button>
                    </Group>

                    <Group grow m='xs' >
                        <NumberInput
                            hideControls
                            required
                            radius='md'
                            placeholder="Input jumlah penggunaan product assembly"
                            icon={<IconTransferIn />}
                            label='Jumlah penggunaan product assembly'
                            {...form.getInputProps(`requirementproduct_set.${i}.input`)}
                        />
                        <NumberInput
                            required
                            hideControls
                            placeholder='input jumlah product yang dihasilkan'
                            icon={<IconTransferOut />}
                            radius='md'
                            label='Jumlah product yang dihasilkan'
                            {...form.getInputProps(`requirementproduct_set.${i}.output`)}
                        />
                    </Group>
                </Paper>


            ))}
            <Center>

                <Button
                    variant='outline'
                    radius='md'
                    leftIcon={<IconPlus />}
                    color='blue.6'
                    onClick={() => {
                        form.insertListItem(`requirementproduct_set`, {
                            product: '',
                            input: '',
                            output: ''
                        })
                    }}
                >
                    Add product assembly
                </Button>
            </Center>



        </ModalForm>
    )
}

export default ModalAddProcess