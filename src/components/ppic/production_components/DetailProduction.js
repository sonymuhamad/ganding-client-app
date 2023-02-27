import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Group, TextInput, Text, NumberInput, Paper, Divider, Title, Select, UnstyledButton } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { IconBarcode, IconCodeAsterix, IconTimeline, IconFileTypography, IconSortAscending2, IconBuildingFactory, IconUser, IconArchive, IconAsset, IconSum, IconPerspective, IconScale, IconRuler2, IconDimensions, IconRulerMeasure, IconAtom2, IconCalendar, } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals"
import { DatePicker } from "@mantine/dates";

import { useRequest, useConfirmDelete } from "../../../hooks";
import BreadCrumb from "../../BreadCrumb";
import { sectionStyle } from "../../../styles";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { ActionButtons, ReadOnlyTextInput } from "../../custom_components";
import { generateDataWithDate } from "../../../services";

const DetailProduction = () => {

    const { productionId } = useParams()
    const [action, setAction] = useState(0)
    const { Retrieve, Get, Put, Delete } = useRequest()
    const navigate = useNavigate()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Production report' })
    const [detailProduction, setDetailProduction] = useState({
        quantity: '',
        created: '',
        quantity_not_good: '',
        machine: '',
        operator: '',
        process: {
            id: '',
            process_name: '',
            order: '',
            process_type: {
                id: '',
                name: ''
            },
        },
        product: {
            id: '',
            name: '',
            code: '',
        },
        last_update: '',
        date: '',
        materialproductionreport_set: [],
        productproductionreport_set: []
    })

    const [operatorList, setOperatorList] = useState([])
    const [machineList, setMachineList] = useState([])
    const { classes } = sectionStyle()
    const [editAccess, setEditAccess] = useState(false)

    const form = useForm({
        initialValues: detailProduction
    })
    const { values } = form
    const { product, process } = values
    const { code, name } = product
    const { process_name, order, process_type } = process

    const breadcrumb = [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/production',
            label: 'Production'
        },
        {
            path: `/home/ppic/production/${productionId}`,
            label: 'Detail'
        }
    ]

    useEffect(() => {

        Retrieve(productionId, 'production-report').then(data => {
            const { operator, machine, date, ...restProps } = data
            const detailProductionReport = { ...restProps, machine: machine.id, operator: operator.id, date: new Date(date) }

            setDetailProduction(detailProductionReport)
            form.setValues(detailProductionReport)

        })

        Get('machine').then(data => {
            setMachineList(data)
        })

        Get('operator').then(data => {
            setOperatorList(data)
        })

    }, [productionId, action])

    const handleClickEditButton = () => {

        form.resetDirty()
        form.setValues(detailProduction)
        setEditAccess(prev => !prev)
    }

    const handleDeleteProduction = useCallback(async () => {
        try {
            await Delete(productionId, 'production-report-management')
            SuccessNotif('Delete production report success')
            navigate('/home/ppic/production')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }, [navigate, productionId])

    const handleSubmit = async (data) => {

        const { process, product, date, ...restProps } = data
        const tempData = { ...restProps, process: process.id, product: product.id }

        const validate_data = generateDataWithDate(date, tempData)

        try {
            await Put(productionId, validate_data, 'production-report-management')
            setAction(prev => prev + 1)
            SuccessNotif('Edit data production success')
            setDetailProduction(prev => ({ ...prev, machine: data.machine, operator: data.operator, quantity: data.quantity, quantity_not_good: data.quantity_not_good }))
            form.resetDirty()
            setEditAccess(prev => !prev)

        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('Edit production failed')
            }
            handleClickEditButton()
        }

    }

    const openConfirmSubmit = (data) => openConfirmModal({
        title: 'Edit production report',
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
        onConfirm: () => handleSubmit(data)
    })



    const materialUsed = useMemo(() => {
        return detailProduction.materialproductionreport_set.map(matUsed => (
            <Paper key={matUsed.id} style={{ border: `1px solid #ced4da` }} radius='md' m='xs'  >

                <Group grow m='xs' >
                    <ReadOnlyTextInput
                        icon={<IconAsset />}
                        label='Material name'
                        value={matUsed.material.name}
                    />
                    <ReadOnlyTextInput
                        icon={<IconSum />}
                        label='Quantity used in production'
                        value={matUsed.quantity}
                        rightSection={<Text size='sm' color='dimmed' >
                            {matUsed.material.uom.name}
                        </Text>}
                    />

                </Group>

                <Group grow m='xs' >
                    <ReadOnlyTextInput
                        icon={<IconPerspective />}
                        label='Specification material'
                        value={matUsed.material.spec}
                    />
                    <ReadOnlyTextInput
                        icon={<IconScale />}
                        label='Weight'
                        value={matUsed.material.weight}
                        rightSection={<Text size='sm' color='dimmed' >
                            Kg
                        </Text>}
                    />
                    <ReadOnlyTextInput
                        icon={<IconRuler2 />}
                        label='Length'
                        value={matUsed.material.length}
                        rightSection={<Text size='sm' color='dimmed' >
                            mm
                        </Text>}
                    />
                    <ReadOnlyTextInput
                        icon={<IconDimensions />}
                        label='Width'
                        value={matUsed.material.width}
                        rightSection={<Text size='sm' color='dimmed' >
                            mm
                        </Text>}
                    />
                    <ReadOnlyTextInput
                        icon={<IconRulerMeasure />}
                        label='Thickness'
                        value={matUsed.material.thickness}
                        rightSection={<Text size='sm' color='dimmed' >
                            mm
                        </Text>}
                    />
                    <ReadOnlyTextInput
                        icon={<IconAtom2 />}
                        label='Unit of material'
                        value={matUsed.material.uom.name}
                    />

                </Group>
            </Paper>
        ))
    }, [detailProduction])

    const productUsed = useMemo(() => {
        return detailProduction.productproductionreport_set.map(prodUsed => (
            <Paper key={prodUsed.id} style={{ border: `1px solid #ced4da` }} radius='md' m='xs' >
                <ReadOnlyTextInput
                    icon={<IconBarcode />}
                    label='Product name'
                    m='xs'
                    value={prodUsed.product.name}
                />
                <ReadOnlyTextInput
                    icon={<IconCodeAsterix />}
                    label='Product number'
                    m='xs'
                    value={prodUsed.product.code}
                />
                <ReadOnlyTextInput
                    icon={<IconSum />}
                    label='Quantity used in production'
                    m='xs'
                    value={prodUsed.quantity}

                />

            </Paper>
        ))
    }, [detailProduction])


    return (
        <>

            <BreadCrumb links={breadcrumb} />
            <Title
                className={classes.title}
            >
                Detail production report
            </Title>

            <ActionButtons
                editAccess={editAccess}
                handleClickEditButton={handleClickEditButton}
                handleClickDeleteButton={() => openConfirmDeleteData(handleDeleteProduction)}
                formState={form.isDirty()}
                formId='formEditProduction'
            />

            <ReadOnlyTextInput
                m='xs'
                icon={<IconBarcode />}
                label='Product name'
                value={name}
            />

            <ReadOnlyTextInput
                icon={<IconCodeAsterix />}
                m='xs'
                label='Product number'
                value={code}
            />

            <Group grow m='xs' >

                <ReadOnlyTextInput
                    icon={<IconTimeline />}
                    label='Process name'
                    value={process_name}
                />

                <ReadOnlyTextInput
                    icon={<IconFileTypography />}
                    label='Process type'
                    value={process_type.name}
                />

                <ReadOnlyTextInput
                    icon={<IconSortAscending2 />}
                    label='Wip'
                    value={`Wip${order}`}
                />

            </Group>

            <form id='formEditProduction' onSubmit={form.onSubmit(openConfirmSubmit)} >

                <Select
                    radius='md'
                    readOnly={!editAccess}
                    placeholder="Select machine"
                    data={machineList.map(machine => ({ value: machine.id, label: machine.name }))}
                    {...form.getInputProps('machine')}
                    label='Machine'
                    m='xs'
                    icon={<IconBuildingFactory />}
                    required
                />

                <Select
                    m='xs'
                    icon={<IconUser />}
                    required
                    radius='md'
                    readOnly={!editAccess}
                    placeholder="Select operator"
                    data={operatorList.map(operator => ({ value: operator.id, label: operator.name }))}
                    {...form.getInputProps('operator')}
                    label='Operator'
                />

                <Group grow m='xs' >

                    <DatePicker
                        label='Production date'
                        placeholder="Select production date"
                        {...form.getInputProps('date')}
                        radius='md'
                        icon={<IconCalendar />}
                        disabled={!editAccess}
                    />


                    <NumberInput
                        hideControls
                        icon={<IconArchive />}
                        label='Quantity production'
                        radius='md'
                        required
                        min={0}
                        disabled={!editAccess}
                        placeholder="input quantity production"
                        {...form.getInputProps('quantity')}
                    />


                    <NumberInput
                        icon={<IconArchive />}
                        hideControls
                        min={0}
                        disabled={!editAccess}
                        label='Quantity not good'
                        required
                        radius='md'
                        placeholder="input quantity not good of production"
                        {...form.getInputProps('quantity_not_good')}
                    />
                </Group>

            </form>

            <Divider my='md' />

            <UnstyledButton>
                <Group>
                    <IconAsset />
                    <div>
                        <Text>Material used</Text>
                    </div>
                </Group>
            </UnstyledButton>

            {materialUsed}

            {materialUsed.length === 0 && <Text my='md' size='sm' align="center" color='dimmed'  >
                This production does not use material
            </Text>}

            <Divider my='md' />
            <UnstyledButton>
                <Group>
                    <IconBarcode />
                    <div>
                        <Text>Product assembly used</Text>
                    </div>
                </Group>
            </UnstyledButton>

            {productUsed}

            {productUsed.length === 0 &&
                <Text my='md' size='sm' align="center" color='dimmed'  >
                    This production does not use product assembly
                </Text>}

        </>
    )
}

export default DetailProduction