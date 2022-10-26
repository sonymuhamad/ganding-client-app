import React, { useState, useEffect, useContext } from "react";
import { useForm } from "@mantine/form";
import { TextInput, NumberInput, ActionIcon, NativeSelect, Group, Title, Button, FileButton, Text, Divider, UnstyledButton, Paper, Center } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

import { IconWriting, IconFileTypography, IconTag, IconCodeAsterix, IconBarbell, IconTrashX, IconDownload, IconUser, IconTrash, IconPlus, IconAsset, IconBarcode, IconTransferIn, IconTransferOut, IconTimeline, IconLayoutKanban, IconUpload } from "@tabler/icons";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import BreadCrumb from "../BreadCrumb";
import { useRequest } from "../../hooks/useRequest";
import { sectionStyle } from "../../styles/sectionStyle";
import { FailedNotif, SuccessNotif } from "../notifications/Notifications";



const NewProduct = () => {

    const { classes } = sectionStyle()
    const auth = useContext(AuthContext)
    const { Get, Post, Loading } = useRequest()
    const [processType, setProcessType] = useState([])
    const [productType, setProductType] = useState([])
    const [productAssemblyList, setProductAssemblyList] = useState([])
    const [materialList, setMaterialList] = useState([])
    const [customerList, setCustomerList] = useState([])
    const navigate = useNavigate()

    const form = useForm({
        initialValues: {
            code: '',
            image: null,
            name: '',
            customer: '',
            weight: '',
            price: 0,
            type: '',
            ppic_process_related: [],
        }
    })

    const links = [
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
    ]

    useEffect(() => {
        const fetch = async () => {
            const productType = await Get(auth.user.token, 'product-type')
            const processType = await Get(auth.user.token, 'process-type')
            const productLists = await Get(auth.user.token, 'product-lists')
            const materialLists = await Get(auth.user.token, 'material-lists')
            const customerLists = await Get(auth.user.token, 'customer-lists')

            setProcessType(processType)
            setProductType(productType)
            setMaterialList(materialLists)
            setProductAssemblyList(productLists)
            setCustomerList(customerLists)

        }
        fetch()
    }, [auth.user.token])

    const openSubmitModal = (val) => openConfirmModal({
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
    })

    const handleSubmitNewProduct = async (val) => {


        try {
            let dataProduct
            if (val.image === null) {
                const { image, ...restData } = val
                dataProduct = restData
            } else {
                dataProduct = val
            }


            await Post(dataProduct, auth.user.token, 'product-management', 'multipart/form-data')
            navigate('/home/ppic/product')

            SuccessNotif('New product added successfully')
        } catch (e) {
            if (e.message.data.ppic_process_related) {
                FailedNotif(e.message.data.ppic_process_related)
            }

        }
    }




    const processFields =

        <>
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

                    <Divider mt="xl" mb='xs' size='md' label="Bill of material" />
                    {form.values.ppic_process_related[index].requirementmaterial_set.length === 0 &&
                        <Text my='md' >
                            This process has no bill of material
                        </Text>
                    }
                    {form.values.ppic_process_related[index].requirementmaterial_set.map((reqMaterial, j) => (
                        <Paper ml='lg' mb='xs' key={`${reqMaterial.id}${j}`} >
                            <Group my='xs' >

                                <NativeSelect
                                    radius='md'
                                    label='Material'
                                    required
                                    icon={<IconAsset />}
                                    placeholder="Select material"
                                    data={materialList.map(material => ({ value: material.id, label: material.name }))}
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementmaterial_set.${j}.material`)}

                                />

                                <ActionIcon
                                    color="red"
                                    mt='lg'
                                    onClick={() => {
                                        form.removeListItem(`ppic_process_related.${index}.requirementmaterial_set`, j)
                                    }}
                                >
                                    <IconTrash />
                                </ActionIcon>

                            </Group>

                            <Group>

                                <NumberInput
                                    hideControls
                                    radius='md'
                                    required
                                    placeholder="input quantity of consumption bill of material"
                                    icon={<IconTransferIn />}
                                    label='Consumption'
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementmaterial_set.${j}.input`)}
                                />

                                <NumberInput
                                    hideControls
                                    required
                                    icon={<IconTransferOut />}
                                    placeholder='input quantity output product'
                                    radius='md'
                                    label='Output'
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementmaterial_set.${j}.output`)}
                                />
                            </Group>


                        </Paper>

                    ))}
                    <Button
                        radius='md'
                        leftIcon={<IconPlus />}
                        color='cyan.5'
                        onClick={() => {
                            form.insertListItem(`ppic_process_related.${index}.requirementmaterial_set`, { material: '', input: '', output: '' })
                        }}
                    >
                        Add material
                    </Button>

                    <Divider mt="xl" mb='xs' size='md' label="Product assembly" />

                    {form.values.ppic_process_related[index].requirementproduct_set.length === 0 &&
                        <Text my='md' >
                            This process has no product assembly
                        </Text>
                    }
                    {form.values.ppic_process_related[index].requirementproduct_set.map((reqProduct, i) => (
                        <Paper ml='lg' mb='xs' key={`${reqProduct.id}${i}`} >

                            <Group >

                                <NativeSelect
                                    radius='md'
                                    required
                                    icon={<IconBarcode />}
                                    label='Product'
                                    placeholder="Select product"
                                    data={productAssemblyList.map(product => ({ value: product.id, label: product.name }))}
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementproduct_set.${i}.product`)}

                                />

                                <ActionIcon
                                    color="red"
                                    mt='lg'
                                    onClick={() => {
                                        form.removeListItem(`ppic_process_related.${index}.requirementproduct_set`, i)
                                    }}
                                >
                                    <IconTrash />
                                </ActionIcon>

                            </Group>
                            <Group>

                                <NumberInput
                                    required
                                    hideControls
                                    radius='md'
                                    placeholder="input quantity consumption product assembly"
                                    icon={<IconTransferIn />}
                                    label='Consumption'
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementproduct_set.${i}.input`)}
                                />
                                <NumberInput
                                    hideControls
                                    required
                                    placeholder='input quantity output product'
                                    icon={<IconTransferOut />}
                                    radius='md'
                                    label='Output'
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementproduct_set.${i}.output`)}
                                />
                            </Group>

                        </Paper>


                    ))}
                    <Button
                        radius='md'
                        leftIcon={<IconPlus />}
                        color='cyan.5'
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

            <Center>
                <Button
                    radius='md'
                    leftIcon={<IconPlus />}
                    color='cyan.5'
                    onClick={() => {
                        form.insertListItem(`ppic_process_related`, {
                            process_name: '',
                            process_type: '',
                            requirementmaterial_set: [],
                            requirementproduct_set: []
                        })

                    }}
                >
                    Add process
                </Button>
            </Center>
        </>



    return (
        <>

            <BreadCrumb links={links} />
            <Loading />

            <Title className={classes.title} >
                Add new product
            </Title>

            <form id='formNewProduct' onSubmit={form.onSubmit(openSubmitModal)}   >

                <Group>
                    <NativeSelect
                        radius='md'
                        placeholder="Select a customer"
                        icon={<IconUser />}
                        label='Customer'
                        required
                        {...form.getInputProps('customer')}
                        data={customerList.map(customer => ({ value: customer.id, label: customer.name }))}
                    />

                    <NativeSelect
                        radius='md'
                        required
                        placeholder="Select product type"
                        icon={<IconFileTypography />}
                        label='Product type'
                        {...form.getInputProps('type')}
                        data={productType.map(type => ({ value: type.id, label: type.name }))}
                    />


                    <TextInput
                        radius='md'
                        required
                        {...form.getInputProps('name')}
                        icon={<IconWriting />}
                        label='Product name'
                    />

                    <TextInput
                        required
                        radius='md'
                        {...form.getInputProps('code')}
                        icon={<IconCodeAsterix />}
                        label='Product number'
                    />
                    <TextInput
                        required
                        {...form.getInputProps('price')}
                        radius='md'
                        icon={<IconTag />}
                        label='Price'

                    />
                    <TextInput
                        required
                        radius='md'
                        {...form.getInputProps('weight')}
                        icon={<IconBarbell />}
                        label='Kg/pcs'
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

                {processFields}


            </form>

            <Button
                radius='md'
                leftIcon={<IconDownload />}
                my='md'
                type="submit"
                form='formNewProduct'
            >
                Save
            </Button>


        </>
    )

}

export default NewProduct

