import React, { useState, useEffect, useCallback, useMemo } from "react";

import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { TextInput, Group, NativeSelect, Title, Button, Center, Text, FileButton } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

import { IconAsset, IconAtom2, IconDimensions, IconDownload, IconPerspective, IconRuler2, IconRulerMeasure, IconScale, IconUserCheck, IconUpload, IconTrash, IconHourglassEmpty } from "@tabler/icons"
import { useRequest, useNotification } from "../../../hooks";
import BreadCrumb from "../../BreadCrumb";
import { sectionStyle } from "../../../styles";
import { DecimalInput, PriceTextInput } from "../../custom_components";



const NewMaterial = () => {

    const { classes } = sectionStyle()
    const [supplierList, setSupplierList] = useState([])
    const [uomList, setUomList] = useState([])
    const { Get, Post } = useRequest()
    const navigate = useNavigate()
    const { successNotif, failedNotif } = useNotification()

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
            berat_jenis: '',
            width: '',
            thickness: '',
            price: 0
        }
    })

    const breadcrumb = useMemo(() => [
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
    ], [])

    const handleSubmit = useCallback(async (val) => {
        let validData

        if (val.image === null) {
            const { image, ...restData } = val
            validData = restData
        } else {
            validData = val
        }

        try {
            await Post(validData, 'materials-management', 'multipart/form-data')
            successNotif('Add material success')
            navigate('/home/ppic/material')
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Add material failed')
        }
    }, [navigate, successNotif, failedNotif])

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
                const uoms = await Get('uoms')
                const suppliers = await Get('suppliers')
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
                    icon={<IconUserCheck />}
                    label='Supplier'
                    radius='md'
                    required
                    placeholder="Select supplier"
                    data={supplierList.map(supplier => ({ value: supplier.id, label: supplier.name }))}
                    {...form.getInputProps('supplier')}
                />

                <Group
                    grow
                    my='xs'
                >

                    <TextInput
                        icon={<IconAsset />}
                        label='Material name'
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

                </Group>

                <Group grow >
                    <NativeSelect
                        label='Unit of material'
                        icon={<IconAtom2 />}
                        radius='md'
                        placeholder="select unit of material"
                        data={uomList.map(uom => ({ value: uom.id, label: uom.name }))}
                        required
                        {...form.getInputProps('uom')}

                    />
                    <DecimalInput
                        icon={<IconRuler2 />}
                        rightSection={<Text size='sm' color='dimmed'  >
                            mm
                        </Text>}
                        label='Length'
                        {...form.getInputProps('length')}
                        placeholder="length of material"
                    />

                    <DecimalInput
                        icon={<IconDimensions />}
                        label='Width'
                        {...form.getInputProps('width')}
                        placeholder="width of material"
                        rightSection={<Text size='sm' color='dimmed'  >
                            mm
                        </Text>}
                    />

                </Group>

                <Group
                    grow
                    my='xs'
                >

                    <DecimalInput
                        rightSection={<Text size='sm' color='dimmed'  >
                            mm
                        </Text>}
                        label='Thickness'
                        {...form.getInputProps('thickness')}
                        placeholder="thickness of material"
                        icon={<IconRulerMeasure />}

                    />

                    <DecimalInput
                        icon={<IconHourglassEmpty />}
                        label='Berat jenis'
                        {...form.getInputProps('berat_jenis')}
                        placeholder="Input berat jenis"
                    />

                    <DecimalInput
                        icon={<IconScale />}
                        rightSection={<Text size='sm' color='dimmed'> kg </Text>}
                        label='Weight'
                        {...form.getInputProps('weight')}
                        placeholder="Input berat material"
                    />

                    <PriceTextInput
                        label='Harga / unit'
                        placeholder="Input harga per unit"
                        {...form.getInputProps('price')}
                        required
                    />

                </Group>

            </form>


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


