import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { TextInput, NumberInput, NativeSelect, Group, Title, Button, FileButton, Text, Divider, UnstyledButton, Paper, Center } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

import { IconWriting, IconFileTypography, IconCodeAsterix, IconScale, IconTrashX, IconDownload, IconUser, IconTrash, IconPlus, IconAsset, IconBarcode, IconTransferIn, IconTransferOut, IconTimeline, IconLayoutKanban, IconUpload } from "@tabler/icons";

import BreadCrumb from "../../BreadCrumb";
import { useRequest, useNotification } from "../../../hooks";
import { sectionStyle } from "../../../styles";
import { DecimalInput, PriceTextInput } from '../../custom_components'


const NewProduct = () => {

    const { classes } = sectionStyle()
    const { Get, Post } = useRequest()
    const [processType, setProcessType] = useState([])
    const [productType, setProductType] = useState([])
    const [productAssemblyList, setProductAssemblyList] = useState([])
    const [materialList, setMaterialList] = useState([])
    const [customerList, setCustomerList] = useState([])
    const navigate = useNavigate()
    const { successNotif, failedNotif } = useNotification()

    const form = useForm({
        initialValues: {
            code: '',
            image: null,
            name: '',
            customer: '',
            weight: '',
            type: '',
            price: 0,
            ppic_process_related: [],
        }
    })

    const links = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/product',
            label: 'Product'
        },
        {
            path: `/home/ppic/product/new`,
            label: `New product`
        }
    ], [])

    useEffect(() => {
        const fetch = async () => {
            const productType = await Get('type/product')
            const processType = await Get('type/process')
            const productLists = await Get('products')
            const materialLists = await Get('materials')
            const customerLists = await Get('customers')

            setProcessType(processType)
            setProductType(productType)
            setMaterialList(materialLists)
            setProductAssemblyList(productLists)
            setCustomerList(customerLists)

        }
        fetch()
    }, [])


    const handleSubmitNewProduct = useCallback(async (val) => {

        let dataProduct
        if (val.image === null) {
            const { image, ...restData } = val
            dataProduct = restData
        } else {
            dataProduct = val
        }

        try {
            await Post(dataProduct, 'products-management', 'multipart/form-data')
            navigate('/home/ppic/product')
            successNotif('Add new product success')
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Add new product failed')
        }
    }, [navigate, failedNotif, successNotif])

    const openSubmitModal = useCallback((val) => openConfirmModal({
        title: `Add new product`,
        children: (
            <Text size="sm">
                Are you sure?, data will be saved.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmitNewProduct(val)
    }), [handleSubmitNewProduct])

    const processFields = useMemo(() => {
        return <>
            {form.values.ppic_process_related.map((process, index) => (

                <Paper style={{ border: `1px solid #ced4da` }} radius='md' shadow='xs' p='xs' key={`${process.id}${index}`} mt='lg' mb='sm'  >

                    <UnstyledButton>
                        <Group>
                            <IconTimeline />
                            <div>
                                <Text>Process {index + 1}</Text>
                            </div>
                        </Group>
                    </UnstyledButton>

                    <Group position="right"   >

                        <Button
                            size='xs'
                            color='red.6'
                            radius='md'
                            onClick={() => {
                                form.removeListItem(`ppic_process_related`, index)
                            }}
                            leftIcon={<IconTrashX />} >
                            Delete</Button>
                    </Group>

                    <TextInput
                        label='Process name'
                        radius='md'
                        required
                        icon={<IconLayoutKanban />}
                        {...form.getInputProps(`ppic_process_related.${index}.process_name`)}
                    />

                    <NativeSelect
                        label='Process type'
                        placeholder="Select process type"
                        radius='md'
                        required
                        icon={<IconFileTypography />}
                        data={processType.map(type => ({ value: type.id, label: type.name }))}
                        {...form.getInputProps(`ppic_process_related.${index}.process_type`)}
                        key={`${process.id}${index}`}
                    />

                    <Divider mt='md' size='sm' label="Bill of material" />
                    {form.values.ppic_process_related[index].requirementmaterial_set.length === 0 &&
                        <Text my='md' align="center" size='sm' color='dimmed' >
                            This process has no bill of material
                        </Text>
                    }
                    {form.values.ppic_process_related[index].requirementmaterial_set.map((reqMaterial, j) => (

                        <Paper
                            p='xs'
                            radius='md'
                            m='xs'
                            withBorder
                            key={`${reqMaterial.id}${j}`} >
                            <Group grow >
                                <NativeSelect
                                    m='xs'
                                    radius='md'
                                    label='Material'
                                    required
                                    icon={<IconAsset />}
                                    placeholder="Select material"
                                    data={materialList.map(material => ({ value: material.id, label: material.name }))}
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementmaterial_set.${j}.material`)}
                                />

                                <Button
                                    mt='sm'
                                    radius='md'
                                    color="red"
                                    onClick={() => {
                                        form.removeListItem(`ppic_process_related.${index}.requirementmaterial_set`, j)
                                    }}
                                    variant='outline'
                                    leftIcon={<IconTrash />}
                                >
                                    Remove bill of material
                                </Button>

                            </Group>

                            <Group grow m='xs' >

                                <NumberInput
                                    hideControls
                                    radius='md'
                                    required
                                    placeholder="Input jumlah penggunaan material"
                                    icon={<IconTransferIn />}
                                    label='Material input'
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementmaterial_set.${j}.input`)}
                                />

                                <NumberInput
                                    hideControls
                                    required
                                    icon={<IconTransferOut />}
                                    placeholder='Input jumlah product yang dihasilkan'
                                    radius='md'
                                    label='Output product'
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementmaterial_set.${j}.output`)}
                                />
                            </Group>
                        </Paper>

                    ))}
                    <Button
                        radius='md'
                        fullWidth
                        leftIcon={<IconPlus />}
                        color='cyan.5'
                        variant='outline'
                        onClick={() => {
                            form.insertListItem(`ppic_process_related.${index}.requirementmaterial_set`, { material: '', input: '', output: '' })
                        }}
                    >
                        Add bill of material
                    </Button>

                    <Divider mt="xl" size='sm' label="Product assembly" />

                    {form.values.ppic_process_related[index].requirementproduct_set.length === 0 &&
                        <Text my='md' align="center" size='sm' color='dimmed' >
                            This process has no product assembly
                        </Text>
                    }
                    {form.values.ppic_process_related[index].requirementproduct_set.map((reqProduct, i) => (

                        <Paper
                            p='xs'
                            radius='md'
                            m='xs'
                            withBorder
                            key={`${reqProduct.id}${i}`} >
                            <Group grow>

                                <NativeSelect
                                    m='xs'
                                    radius='md'
                                    required
                                    icon={<IconBarcode />}
                                    label='Product'
                                    placeholder="Select product"
                                    data={productAssemblyList.map(product => ({ value: product.id, label: product.name }))}
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementproduct_set.${i}.product`)}

                                />

                                <Button
                                    color="red"
                                    onClick={() => {
                                        form.removeListItem(`ppic_process_related.${index}.requirementproduct_set`, i)
                                    }}
                                    variant='outline'
                                    leftIcon={<IconTrash />}
                                    mt='md'
                                    radius='md'
                                >
                                    Remove product assembly
                                </Button>

                            </Group>

                            <Group grow m='xs' >

                                <NumberInput
                                    required
                                    hideControls
                                    radius='md'
                                    placeholder="Input jumlah penggunaan product assembly"
                                    icon={<IconTransferIn />}
                                    label='Product input'
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementproduct_set.${i}.input`)}
                                />
                                <NumberInput
                                    hideControls
                                    required
                                    placeholder='Input jumlah product yang dihasilkan'
                                    icon={<IconTransferOut />}
                                    radius='md'
                                    label='Product output'
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementproduct_set.${i}.output`)}
                                />
                            </Group>
                        </Paper>
                    ))}

                    <Button
                        radius='md'
                        fullWidth
                        mb='sm'
                        leftIcon={<IconPlus />}
                        color='cyan.5'
                        variant='outline'
                        onClick={() => {
                            form.insertListItem(`ppic_process_related.${index}.requirementproduct_set`, {
                                product: '',
                                input: '',
                                output: ''
                            })
                        }}
                    >
                        Add product assembly
                    </Button>
                </Paper>
            ))}


            {form.values.ppic_process_related.length === 0 &&
                <Text my='md' align="center" size='sm' color='dimmed' >
                    This product does not have a manufacturing process
                </Text>
            }

            <Center>
                <Button
                    radius='md'
                    leftIcon={<IconPlus />}
                    color='cyan.5'
                    variant='outline'
                    onClick={() => {
                        form.insertListItem(`ppic_process_related`, {
                            process_name: '',
                            process_type: '',
                            requirementmaterial_set: [],
                            requirementproduct_set: []
                        })

                    }}
                >
                    Add manufacturing process
                </Button>
            </Center>
        </>
    }, [form.values.ppic_process_related, materialList, processType, productAssemblyList])



    return (
        <>

            <BreadCrumb links={links} />
            <Title className={classes.title} >
                Add new product
            </Title>

            <form id='formNewProduct' onSubmit={form.onSubmit(openSubmitModal)}   >


                <NativeSelect
                    m='xs'
                    radius='md'
                    placeholder="Select a customer"
                    icon={<IconUser />}
                    label='Customer'
                    required
                    {...form.getInputProps('customer')}
                    data={customerList.map(customer => ({ value: customer.id, label: customer.name }))}
                />

                <TextInput
                    m='xs'
                    radius='md'
                    required
                    {...form.getInputProps('name')}
                    icon={<IconWriting />}
                    label='Product name'
                />

                <TextInput
                    m='xs'
                    required
                    radius='md'
                    {...form.getInputProps('code')}
                    icon={<IconCodeAsterix />}
                    label='Product number'
                />

                <Group grow m='xs' >

                    <NativeSelect
                        radius='md'
                        required
                        placeholder="Select product type"
                        icon={<IconFileTypography />}
                        label='Product type'
                        {...form.getInputProps('type')}
                        data={productType.map(type => ({ value: type.id, label: type.name }))}
                    />

                    <DecimalInput
                        required
                        {...form.getInputProps('weight')}
                        rightSection={<Text size='sm' color='dimmed'  >
                            Kg
                        </Text>}
                        icon={<IconScale />}
                        label='Weight / unit'

                    />

                    <PriceTextInput
                        label='Harga / unit'
                        placeholder="Input harga per unit"
                        {...form.getInputProps('price')}
                        required
                    />

                </Group>


                <Group my='md' >

                    <FileButton
                        radius='md'
                        leftIcon={<IconUpload />}
                        style={{ display: form.values.image === null ? '' : 'none' }}
                        {...form.getInputProps('image')}
                        accept="image/png,image/jpeg" >
                        {(props) => <Button   {...props}>Upload image</Button>}
                    </FileButton>


                    <Button
                        radius='md'
                        leftIcon={<IconTrash />}
                        color='red.7'
                        onClick={() => {
                            form.setFieldValue('image', null)
                        }}
                        style={{ display: form.values.image !== null ? '' : 'none' }} >
                        Delete image
                    </Button>

                    {form.values.image && (
                        <Text size="sm" color='dimmed' align="center" mt="sm">
                            {form.values.image.name}
                        </Text>
                    )}
                </Group>

                <Divider my='md' size='sm' />

                {processFields}


            </form>

            <Button
                radius='md'
                leftIcon={<IconDownload />}
                my='md'
                type="submit"
                form='formNewProduct'
                fullWidth
            >
                Save
            </Button>


        </>
    )

}

export default NewProduct

