import React, { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { TextInput, Group, NumberInput, NativeSelect, Title, Button, Center, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

import { IconAsset, IconAtom2, IconDimensions, IconDownload, IconPerspective, IconRuler2, IconRulerMeasure, IconScale, IconUserCheck } from "@tabler/icons";
import { SuccessNotif, FailedNotif } from '../../notifications/Notifications'
import { useRequest } from "../../../hooks/useRequest";
import BreadCrumb from "../../BreadCrumb";
import { sectionStyle } from "../../../styles/sectionStyle";



const NewMaterial = () => {

    const { classes } = sectionStyle()
    const [supplierList, setSupplierList] = useState([])
    const [uomList, setUomList] = useState([])
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

    const handleSubmit = useCallback(async (val) => {
        try {
            await Post(val, 'material', 'multipart/form-data')

            SuccessNotif('New material added successfully')
            navigate('/home/ppic/material')
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Failed to add new new material')
        }
    }, [navigate])

    const openSubmitMaterial = useCallback((val) => openConfirmModal({
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
    }), [handleSubmit])


    useEffect(() => {
        const fetch = async () => {

            try {
                const uoms = await Get('uom-list')
                const suppliers = await Get('supplier-list')
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

            <Loading />
            <form id='newMaterialForm' onSubmit={form.onSubmit(openSubmitMaterial)}  >

                <NativeSelect
                    icon={<IconUserCheck />}
                    label='Supplier'
                    radius='md'
                    required
                    placeholder="Select supplier"
                    data={supplierList.map(supplier => ({ value: supplier.id, label: supplier.name }))}
                    {...form.getInputProps('supplier')}
                />

                <TextInput
                    icon={<IconAsset />}
                    label='Material name'
                    my='xs'
                    required
                    placeholder="Input material name"
                    radius='md'
                    {...form.getInputProps('name')}
                />


                <TextInput
                    icon={<IconPerspective />}
                    label='Material specification'
                    radius='md'
                    required
                    {...form.getInputProps('spec')}
                    placeholder="Input material specification"
                />

                <Group my='xs' grow >


                    <NativeSelect
                        label='Unit of material'
                        icon={<IconAtom2 />}
                        radius='md'
                        placeholder="select unit of material"
                        data={uomList.map(uom => ({ value: uom.id, label: uom.name }))}
                        required
                        {...form.getInputProps('uom')}

                    />

                    <NumberInput
                        icon={<IconRuler2 />}
                        hideControls
                        min={0}
                        decimalSeparator=','
                        precision={2}
                        step={0.5}
                        label='Length'
                        radius='md'
                        {...form.getInputProps('length')}
                        placeholder="length of material"
                        required
                    />

                    <NumberInput
                        icon={<IconDimensions />}
                        hideControls
                        min={0}
                        decimalSeparator=','
                        precision={2}
                        step={0.5}
                        label='Width'
                        {...form.getInputProps('width')}
                        placeholder="width of material"
                        radius='md'
                        required
                    />

                    <NumberInput
                        icon={<IconRulerMeasure />}
                        hideControls
                        min={0}
                        decimalSeparator=','
                        precision={2}
                        step={0.5}
                        label='Thickness'
                        {...form.getInputProps('thickness')}
                        placeholder="thickness of material"
                        radius='md'
                        required
                    />
                    <NumberInput
                        icon={<IconScale />}
                        hideControls
                        min={0}
                        decimalSeparator=','
                        precision={2}
                        step={0.5}
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


