import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import useScrollSpy from 'react-use-scrollspy'
import { useParams, useNavigate, Link } from "react-router-dom";

import { useRequest } from "../../../hooks";
import BreadCrumb from "../../BreadCrumb";
import { BaseAside } from "../../layout";
import { sectionStyle } from "../../../styles";
import { BaseTableExpanded } from "../../tables";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { ExpandedPurchaseOrder } from "../../layout"

import { Title, Divider, Button, TextInput, Textarea, NumberInput, Group, Paper, Text } from "@mantine/core";
import { useForm } from "@mantine/form";

import { IconTrashX, IconX, IconEdit, IconDotsCircleHorizontal, IconDownload, IconUserCheck, IconMapPins, IconDeviceMobile, IconAt, IconScale, IconRuler2, IconDimensions, IconRulerMeasure } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";



const ExpandedMaterialList = ({ data }) => {

    return (
        <Paper m='xs' >
            <Group m='xs' grow >

                <TextInput
                    icon={<IconScale />}
                    label='Weight'
                    readOnly
                    radius='md'
                    variant='filled'
                    value={data.weight}
                />
                <TextInput
                    label='Length'
                    readOnly
                    icon={<IconRuler2 />}
                    value={data.length}
                    variant='filled'
                    radius='md'
                />
                <TextInput
                    label='Width'
                    readOnly
                    radius='md'
                    icon={<IconDimensions />}
                    variant='filled'
                    value={data.width}
                />
                <TextInput
                    readOnly
                    radius='md'
                    label='Thickness'
                    variant='filled'
                    icon={<IconRulerMeasure />}
                    value={data.thickness}
                />
            </Group>

        </Paper>
    )
}



const DetailSupplier = () => {

    const { classes } = sectionStyle()
    const { supplierId } = useParams()
    const navigate = useNavigate()
    const { Retrieve, Loading, Put, Delete } = useRequest()
    const [detailSupplier, setDetailSupplier] = useState({
        id: '',
        name: '',
        address: '',
        phone: '',
        email: '',
    })

    const [materialList, setMaterialList] = useState([])
    const [purchaseOrderList, setPurchaseOrderList] = useState([])
    const [editAccess, setEditAccess] = useState(false)

    const form = useForm({
        initialValues: {
            id: '',
            name: '',
            address: '',
            phone: '',
            email: '',
        }
    })
    const links = useMemo(() => [
        {
            "label": 'Detail supplier',
            "link": '#detail',
            'order': 1
        },
        {
            "label": 'Materials',
            "link": '#material',
            'order': 1
        },
        {
            "label": 'Purchase orders',
            "link": '#purchase-order',
            'order': 1
        },
    ], [])

    const sectionRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
    ]

    const activeSection = useScrollSpy({
        sectionElementRefs: sectionRefs,
        offsetPx: -80
    })

    const breadcrumb = useMemo(() => [
        {
            path: '/home/purchasing',
            label: 'Purchasing'
        },
        {
            path: '/home/ppic/suppliers',
            label: 'Suppliers'
        },
        {
            path: `/home/ppic/suppliers/${supplierId}`,
            label: `${detailSupplier.name}`
        },
    ], [detailSupplier])



    const columnMaterialList = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Specification',
            selector: row => row.spec
        },
        {
            name: 'Stock',
            selector: row => `${row.warehousematerial} ${row.uom.name}`
        },
        {
            name: '',
            selector: row => row.detailButton
        }
    ], [])

    const columnPurchaseOrderList = useMemo(() => [
        {
            name: 'Po number',
            selector: row => row.code,
            sortable: true
        },
        {
            name: 'Date',
            selector: row => new Date(row.date).toDateString(),
            sortable: true
        },
        {
            name: 'Total ordered material',
            selector: row => row.materialorder_set.length
        }
    ], [])


    useEffect(() => {

        const fetch = async () => {
            try {
                const detailSupplier = await Retrieve(supplierId, 'supplier-detail')

                const { ppic_material_related, purchasing_purchaseordermaterial_related, ...restProps } = detailSupplier

                setDetailSupplier(restProps)
                form.setValues(restProps)

                setMaterialList(ppic_material_related.map(material => ({
                    ...material, detailButton: <Button
                        leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                        color='teal.6'
                        variant='subtle'
                        radius='md'
                        component={Link}
                        to={`/home/purchasing/material/${material.id}`}
                    >
                        Detail
                    </Button>
                })))

                setPurchaseOrderList(purchasing_purchaseordermaterial_related)

            } catch (e) {
                console.log(e)
            }
        }

        fetch()

    }, [])

    const handleDeleteSupplier = useCallback(async (id) => {
        try {
            await Delete(id, 'supplier-management')
            navigate('/home/purchasing/suppliers')
            SuccessNotif('Delete supplier success')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }, [navigate])

    const openConfirmDeleteSupplier = useCallback((id) => openConfirmModal({
        title: 'Delete Supplier',
        children: (
            <Text size='sm' >
                Are you sure, data will be delete
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteSupplier(id)
    }), [handleDeleteSupplier])


    const handleEditSupplier = useCallback(async (value) => {
        try {
            await Put(value.id, value, 'supplier-management')
            SuccessNotif('Edit supplier success')
            setDetailSupplier(value)
            form.setValues(value)
            form.resetDirty()
            setEditAccess(prev => !prev)
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Edit supplier failed')
        }
    }, [])

    const openConfirmEditSupplier = useCallback((value) => openConfirmModal({
        title: 'Edit Supplier',
        children: (
            <Text size='sm' >
                Are you sure, data changes will be saved
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleEditSupplier(value)
    }), [handleEditSupplier])



    return (
        <>
            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />
            <Loading />

            <section id='detail' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#detail" className={classes.a_href} >
                        Detail supplier
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <form id="formEditSupplier" onSubmit={form.onSubmit(openConfirmEditSupplier)} >

                    <Group position="right" mt='md' mb='md'  >
                        <Button.Group>

                            <Button
                                size='xs'
                                radius='md'
                                onClick={() => {
                                    setEditAccess(prev => !prev)
                                    form.setValues(detailSupplier)
                                    form.resetDirty()
                                }}
                                color={!editAccess ? 'blue.6' : 'red.6'}
                                leftIcon={!editAccess ? <IconEdit /> : <IconX />}
                            >
                                {!editAccess ? 'Edit' : 'Cancel'}
                            </Button>

                            <Button
                                type="submit"
                                size='xs'
                                color='blue.6'
                                form="formEditSupplier"
                                disabled={form.isDirty() ? false : true}
                                leftIcon={<IconDownload />} >
                                Save Changes</Button>
                            <Button
                                size='xs'
                                color='red.6'
                                onClick={() => openConfirmDeleteSupplier(supplierId)}
                                disabled={!editAccess ? false : true}
                                radius='md'
                                leftIcon={<IconTrashX />} >
                                Delete</Button>
                        </Button.Group>
                    </Group>


                    <TextInput
                        label='Name'
                        placeholder="Input supplier name"
                        radius='md'
                        required
                        readOnly={!editAccess}
                        m='xs'
                        icon={<IconUserCheck />}
                        {...form.getInputProps('name')}
                    />

                    <TextInput
                        readOnly={!editAccess}
                        label='Email'
                        placeholder="Input supplier email"
                        radius='md'
                        m='xs'
                        required
                        icon={<IconAt />}
                        {...form.getInputProps('email')}
                    />

                    <NumberInput
                        disabled={!editAccess}
                        min={0}
                        label='Phone'
                        placeholder="Input supplier phone number"
                        radius='md'
                        m='xs'
                        required
                        hideControls
                        icon={<IconDeviceMobile />}
                        {...form.getInputProps('phone')}
                    />

                    <Textarea
                        readOnly={!editAccess}
                        label='Address'
                        placeholder="Supplier address"
                        radius='md'
                        m='xs'
                        required
                        icon={<IconMapPins />}
                        {...form.getInputProps('address')}
                    />

                </form>


            </section>

            <section id='material' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#material" className={classes.a_href} >
                        Materials
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <BaseTableExpanded
                    noData="This supplier doesn't have any material"
                    column={columnMaterialList}
                    data={materialList}
                    expandComponent={ExpandedMaterialList}
                />

            </section>

            <section id='purchase-order' className={classes.section} ref={sectionRefs[2]} >
                <Title className={classes.title} >
                    <a href="#purchase-order" className={classes.a_href} >
                        Purchase orders
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <BaseTableExpanded
                    noData="This supplier doesn't have any purchase order"
                    column={columnPurchaseOrderList}
                    data={purchaseOrderList}
                    expandComponent={ExpandedPurchaseOrder}
                />

            </section>

        </>
    )
}

export default DetailSupplier


