import React, { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { TextInput, Group, NumberInput, NativeSelect, Title, Button, Center, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

import { IconDownload } from "@tabler/icons";
import { SuccessNotif, FailedNotif } from '../notifications/Notifications'
import { useRequest } from "../../hooks/useRequest";
import { AuthContext } from "../../context/AuthContext";
import BreadCrumb from "../BreadCrumb";
import { sectionStyle } from "../../styles/sectionStyle";



const NewMaterial = () => {

    const { classes } = sectionStyle()
    const [supplierList, setSupplierList] = useState([])
    const [uomList, setUomList] = useState([])
    const auth = useContext(AuthContext)
    const { Get, Post, Loading } = useRequest()
    const navigate = useNavigate()

    const form = useForm({
        initialValues: {
            id: '',
            image: null,
            length: '',
            supplier: '',
            name: '',
            spec: '',
            uom: '',
            weight: '',
            width: '',
            thickness: ''
        }
    })

    const breadcrumb = [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/material',
            label: 'Material'
        },
        {
            path: `/home/ppic/material/new`,
            label: 'Add material'
        }
    ]

    const handleSubmit = async (val) => {
        try {
            await Post(val, auth.user.token, 'material', 'multipart/form-data')

            SuccessNotif('New material added successfully')
            navigate('/home/ppic/material')
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Failed to add new new material')
        }
    }

    const openSubmitMaterial = (val) => openConfirmModal({
        title: `Save new material`,
        children: (
            <Text size="sm">
                Are you sure?, data will be saved.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmit(val)
    })


    useEffect(() => {
        const fetch = async () => {

            try {
                const uoms = await Get(auth.user.token, 'uom-list')
                const suppliers = await Get(auth.user.token, 'supplier-list')
                setUomList(uoms)
                setSupplierList(suppliers)

            } catch (e) {
                console.log(e)
            }

        }

        fetch()

    }, [])


    return (
        <>

            <BreadCrumb links={breadcrumb} />
            <Title className={classes.title} >
                Add new material
            </Title>


            <form id='newMaterialForm' onSubmit={form.onSubmit(openSubmitMaterial)}  >

                <NativeSelect
                    label='Supplier'
                    radius='md'
                    required
                    placeholder="Select supplier"
                    data={supplierList.map(supplier => ({ value: supplier.id, label: supplier.name }))}
                    {...form.getInputProps('supplier')}
                />

                <TextInput
                    label='Material name'
                    my='xs'
                    required
                    placeholder="Input material name"
                    radius='md'
                    {...form.getInputProps('name')}
                />


                <TextInput
                    label='Material specification'
                    radius='md'
                    required
                    {...form.getInputProps('spec')}
                    placeholder="Input material specification"
                />

                <Group my='xs' >


                    <NativeSelect
                        label='Unit of material'

                        radius='md'
                        placeholder="select unit of material"
                        data={uomList.map(uom => ({ value: uom.id, label: uom.name }))}
                        required
                        {...form.getInputProps('uom')}

                    />

                    <NumberInput
                        label='Length'
                        radius='md'
                        {...form.getInputProps('length')}
                        placeholder="length of material"
                        required
                    />

                    <NumberInput
                        label='Width'
                        {...form.getInputProps('width')}
                        placeholder="width of material"
                        radius='md'
                        required
                    />

                    <TextInput
                        label='Thickness'
                        {...form.getInputProps('thickness')}
                        placeholder="thickness of material"
                        radius='md'
                        required
                    />
                    <TextInput
                        label='Kg/pcs'
                        {...form.getInputProps('weight')}
                        placeholder="weight of material"
                        radius='md'
                        required
                    />
                </Group>
            </form>



            <Center my='md' >
                <Button
                    leftIcon={<IconDownload />}
                    form='newMaterialForm'
                    type="submit"
                    radius='md'>
                    Save
                </Button>
            </Center>

        </>
    )

}

export default NewMaterial


