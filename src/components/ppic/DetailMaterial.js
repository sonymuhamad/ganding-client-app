import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { Title, TextInput, Group, Button, Paper, NumberInput, NativeSelect, Text, Image, FileButton } from "@mantine/core";
import useScrollSpy from 'react-use-scrollspy'

import { IconTrashX, IconDownload, IconEdit, IconX, IconUpload, IconTrash, IconDotsCircleHorizontal } from "@tabler/icons";

import { openConfirmModal } from "@mantine/modals";

import { useRequest } from "../../hooks/useRequest";
import { useForm } from "@mantine/form";
import BreadCrumb from "../BreadCrumb";
import BaseAside from "../layout/BaseAside";
import BaseTable from "../tables/BaseTable";
import { sectionStyle } from "../../styles/sectionStyle";
import { FailedNotif, SuccessNotif } from "../notifications/Notifications";



const DetailMaterial = () => {

    const params = useParams() // materialId
    const auth = useContext(AuthContext)
    const { Retrieve, Get, Loading, Put, Delete } = useRequest()
    const [breadcrumb, setBreadcrumb] = useState([])
    const { classes } = sectionStyle()
    const [uom, setUom] = useState([])
    const [editAccess, setEditAccess] = useState(false)
    const [action, setAction] = useState(0)
    const [reqMaterialRelated, setReqMaterialRelated] = useState([])
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

    const [detailMaterial, setDetailMaterial] = useState({
        id: '',
        image: null,
        length: '',
        name: '',
        spec: '',
        supplier: {
            name: ''
        },
        uom: '',
        warehousematerial: {
            id: '',
            quantity: ''
        },
        weight: '',
        width: '',
        thickness: '',
        ppic_requirementmaterial_related: []

    })


    const sectionRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ]

    const activeSection = useScrollSpy({
        sectionElementRefs: sectionRefs,
        offsetPx: -80
    })

    const links = [
        {
            "label": "Detail material",
            "link": "#detail-material",
            "order": 1
        },
        {
            "label": 'Production requirement',
            "link": '#production-requirement',
            'order': 1
        },
    ]

    const materialRequirementColumn = useMemo(() => [
        {
            name: 'Process name',
            selector: row => row.process.process_name,
            sortable: true,
        },
        {
            name: 'Product',
            selector: row => row.process.product.name,
        },
        {
            name: 'Process type',
            selector: row => row.process.process_type.name,

        },
        {
            name: '',
            selector: row => row.button,
            style: {
                padding: 0,
            }
        }
    ], [])



    useEffect(() => {

        const fetch = async () => {
            try {
                const material = await Retrieve(params.materialId, auth.user.token, 'material-detail')
                const uoms = await Get(auth.user.token, 'uom-list')
                const { warehousematerial, ppic_requirementmaterial_related, ...restDataMaterial } = material

                const reqMaterial = material.ppic_requirementmaterial_related.map(req => ({
                    ...req, button:
                        <Button
                            leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                            color='teal.8'
                            variant='subtle'
                            radius='md'
                            component={Link}
                            to={`/home/ppic/product/${req.process.product.id}`}
                        >
                            Detail
                        </Button>
                }))

                setBreadcrumb([
                    {
                        path: '/home/ppic',
                        label: 'Ppic'
                    },
                    {
                        path: '/home/ppic/material',
                        label: 'Material'
                    },
                    {
                        path: `/home/ppic/material/${material.id}`,
                        label: material.name
                    }
                ])
                setUom(uoms)
                setDetailMaterial(material)
                form.setValues(restDataMaterial)
                setReqMaterialRelated(reqMaterial)

            } catch (e) {

            }
        }

        fetch()

    }, [auth.user.token, params.materialId, action])

    const handleDelete = async (id) => {
        try {
            await Delete(id, auth.user.token, 'material')
            SuccessNotif('Delete material success')
            navigate('/home/ppic/material')
        } catch (e) {
            FailedNotif(e.message.data)
        }
    }

    const handleSubmitEditMaterial = async (val) => {
        const data = { ...val, supplier: val.supplier.id }
        let validData

        if (typeof data.image === "string") {
            const { image, ...restData } = data
            validData = restData
        } else {
            validData = data
        }



        try {
            await Put(params.materialId, validData, auth.user.token, 'material', 'multipart/form-data')
            SuccessNotif('Edit data material success')
            setAction(prev => prev + 1)
            setEditAccess(prev => !prev)
            form.resetDirty()
        } catch (e) {
            FailedNotif('Edit material failed')
            handleClickEditButton()
            console.log(e)
        }

    }

    const handleClickEditButton = () => {
        setEditAccess(prev => !prev)
        form.resetDirty()
        const { warehousematerial, ppic_requirementmaterial_related, ...restDataMaterial } = detailMaterial
        form.setValues(restDataMaterial)
    }



    const openSubmitEditMaterial = (val) => openConfirmModal({
        title: 'Edit material',
        children: (
            <Text size='sm' >
                Are you sure, data changes will be saved
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onCancel: () => handleClickEditButton(),
        onConfirm: () => handleSubmitEditMaterial(val)
    })

    const openDeleteMaterial = (id) => openConfirmModal({
        title: `Delete material`,
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDelete(id)
    })


    return (
        <>

            <BreadCrumb links={breadcrumb} />
            <BaseAside activeSection={activeSection} links={links} />
            <Loading />
            <section id='detail-material' className={classes.section} ref={sectionRefs[0]}  >
                <Title className={classes.title} >
                    <a href="#detail-material" className={classes.a_href} >
                        Detail material
                    </a>
                </Title>

                <Group position="right" mt='md' mb='md'  >
                    <Button.Group>

                        <Button
                            size='xs'
                            radius='md'
                            color={!editAccess ? 'blue.6' : 'red.6'}
                            onClick={handleClickEditButton}
                            leftIcon={!editAccess ? <IconEdit /> : <IconX />}
                        >
                            {!editAccess ? 'Edit' : 'Cancel'}
                        </Button>

                        <Button
                            type="submit"
                            size='xs'
                            color='blue.6'
                            form="formEditMaterial"
                            disabled={form.isDirty() ? false : true}
                            leftIcon={<IconDownload />} >
                            Save Changes</Button>
                        <Button
                            size='xs'
                            color='red.6'
                            disabled={!editAccess ? false : true}
                            radius='md'
                            onClick={() => openDeleteMaterial(params.materialId)}
                            leftIcon={<IconTrashX />} >
                            Delete</Button>
                    </Button.Group>
                </Group>

                <form id='formEditMaterial' onSubmit={form.onSubmit(openSubmitEditMaterial)}  >

                    <TextInput
                        label='Supplier'
                        radius='md'
                        readOnly
                        defaultValue={detailMaterial.supplier.name}
                    />

                    <TextInput
                        label='Material name'
                        my='xs'
                        readOnly={!editAccess}
                        placeholder="Input material name"
                        radius='md'
                        {...form.getInputProps('name')}
                    />

                    <Group mb='xs' grow >
                        <TextInput
                            readOnly={!editAccess}
                            label='Material specification'
                            radius='md'
                            {...form.getInputProps('spec')}
                            placeholder="Input material specification"
                        />


                        <NativeSelect
                            label='Unit of material'
                            disabled={!editAccess}
                            radius='md'
                            placeholder="select an unit of material"
                            data={uom.map(unit => ({ value: unit.id, label: unit.name }))}
                            {...form.getInputProps('uom')}

                        />

                        <NumberInput
                            hideControls
                            label='Stock in warehouse'
                            radius='md'
                            value={detailMaterial.warehousematerial.quantity}
                            readOnly={!editAccess}
                        />


                    </Group>

                    <Group>

                        <NumberInput
                            hideControls
                            label='Length'
                            readOnly={!editAccess}
                            radius='md'
                            {...form.getInputProps('length')}
                            placeholder="length of material"
                        />

                        <NumberInput
                            hideControls
                            label='Width'
                            readOnly={!editAccess}
                            {...form.getInputProps('width')}
                            placeholder="width of material"
                            radius='md'
                        />

                        <TextInput
                            label='Thickness'
                            readOnly={!editAccess}
                            {...form.getInputProps('thickness')}
                            placeholder="thickness of material"
                            radius='md'
                        />
                        <TextInput
                            label='Kg/pcs'
                            readOnly={!editAccess}
                            {...form.getInputProps('weight')}
                            placeholder="weight of material"
                            radius='md'
                        />
                    </Group>
                </form>

                <Group my='lg' >
                    <Paper>
                        <Image
                            radius='md'
                            src={form.values.image}
                            alt='product image'
                            withPlaceholder
                        />
                    </Paper>

                    <FileButton
                        radius='md'
                        leftIcon={<IconUpload />}
                        style={{ display: !editAccess ? 'none' : form.values.image === null ? '' : 'none' }}
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
                            form.setDirty('image')
                        }}
                        style={{ display: !editAccess ? 'none' : form.values.image !== null ? '' : 'none' }} >
                        Delete image
                    </Button>

                    {form.values.image && (
                        <Text size="sm" color='dimmed' align="center" mt="sm">
                            {form.values.image.name}
                        </Text>
                    )}
                </Group>

            </section>


            <section id='production-requirement' className={classes.section} ref={sectionRefs[1]}  >
                <Title className={classes.title} >
                    <a href="#production-requirement" className={classes.a_href} >
                        Production requirement
                    </a>
                </Title>
                <p>
                    this section contains information about the allocation of production process using this material
                </p>

                <BaseTable
                    column={materialRequirementColumn}
                    data={reqMaterialRelated}
                />

            </section>
        </>
    )

}

export default DetailMaterial


