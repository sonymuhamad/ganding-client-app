import React, { useState, useEffect, useCallback, useMemo } from "react";

import { Group, TextInput, Text, NumberInput, Paper, Divider, Title, Button, Select, UnstyledButton } from "@mantine/core";
import { useParams } from "react-router-dom";

import { useRequest } from "../../../hooks/useRequest";
import BreadCrumb from "../../BreadCrumb";
import { sectionStyle } from "../../../styles/sectionStyle";

import { useForm } from "@mantine/form";
import { IconBarcode, IconCodeAsterix, IconTimeline, IconFileTypography, IconSortAscending2, IconBuildingFactory, IconUser, IconArchive, IconEdit, IconX, IconDownload, IconTrashX, IconAsset, IconSum, IconPerspective, IconScale, IconRuler2, IconDimensions, IconRulerMeasure, IconAtom2, } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { FailedNotif, SuccessNotif } from "../../notifications/Notifications";
import { useNavigate } from "react-router-dom";


const DetailProduction = () => {

    const params = useParams()
    const [action, setAction] = useState(0)
    const { Retrieve, Get, Put, Delete, Loading } = useRequest()
    const navigate = useNavigate()

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
        materialproductionreport_set: [],
        productproductionreport_set: []
    })

    const [operatorList, setOperatorList] = useState([])
    const [machineList, setMachineList] = useState([])
    const { classes } = sectionStyle()
    const [editAccess, setEditAccess] = useState(false)

    const form = useForm({
        initialValues: {
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
            last_update: ''
        }
    })

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
            path: `/home/ppic/production/${params.productionId}`,
            label: 'Detail'
        }
    ]

    useEffect(() => {

        Retrieve(params.productionId, 'production-report').then(data => {
            const { operator, machine, ...restProps } = data
            const detailProductionReport = { ...restProps, machine: machine.id, operator: operator.id }

            setDetailProduction(detailProductionReport)
            form.setValues(detailProductionReport)

        })

        Get('machine').then(data => {
            setMachineList(data)
        })

        Get('operator').then(data => {
            setOperatorList(data)
        })

    }, [params.productionId, Get, Retrieve, action])

    const handleClickEditButton = () => {

        form.resetDirty()
        form.setValues(detailProduction)
        setEditAccess(prev => !prev)
    }

    const handleDeleteProduction = useCallback(async () => {
        try {
            await Delete(params.productionId, 'production-report-management')
            SuccessNotif('Delete production report success')
            navigate('/home/ppic/production')
        } catch (e) {
            console.log(e)
            FailedNotif(e.message.data)
        }
    }, [navigate, Delete, params.productionId])

    const openDeleteProduction = useCallback(() => openConfirmModal({
        title: 'Delete production report',
        children: (
            <Text size='sm' >
                Are you sure, data changes will be deleted
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteProduction()
    }), [handleDeleteProduction])

    const handleSubmit = async (data) => {
        const { process, product, ...restProps } = data

        try {
            await Put(params.productionId, { ...restProps, process: process.id, product: product.id }, 'production-report-management')
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

                    <TextInput
                        icon={<IconAsset />}
                        radius='md'
                        label='Material name'
                        variant='filled'
                        readOnly
                        value={matUsed.material.name}
                    />
                    <TextInput
                        icon={<IconSum />}
                        variant='filled'
                        label='Quantity used in production'
                        radius='md'
                        readOnly
                        value={matUsed.quantity}
                        rightSection={<Text size='sm' color='dimmed' >
                            {matUsed.material.uom.name}
                        </Text>}
                    />

                </Group>

                <Group grow m='xs' >
                    <TextInput
                        icon={<IconPerspective />}
                        variant='filled'
                        radius='md'
                        label='Specification material'
                        readOnly
                        value={matUsed.material.spec}
                    />
                    <TextInput
                        icon={<IconScale />}
                        variant='filled'
                        label='Weight'
                        radius='md'
                        readOnly
                        value={matUsed.material.weight}
                        rightSection={<Text size='sm' color='dimmed' >
                            Kg
                        </Text>}
                    />
                    <TextInput
                        icon={<IconRuler2 />}
                        variant='filled'
                        label='Length'
                        radius='md'
                        readOnly
                        value={matUsed.material.length}
                        rightSection={<Text size='sm' color='dimmed' >
                            mm
                        </Text>}
                    />
                    <TextInput
                        icon={<IconDimensions />}
                        variant='filled'
                        label='Width'
                        radius='md'
                        readOnly
                        value={matUsed.material.width}
                        rightSection={<Text size='sm' color='dimmed' >
                            mm
                        </Text>}
                    />
                    <TextInput
                        icon={<IconRulerMeasure />}
                        variant='filled'
                        label='Thickness'
                        radius='md'
                        readOnly
                        value={matUsed.material.thickness}
                        rightSection={<Text size='sm' color='dimmed' >
                            mm
                        </Text>}
                    />
                    <TextInput
                        icon={<IconAtom2 />}
                        variant='filled'
                        label='Unit of material'
                        radius='md'
                        readOnly
                        value={matUsed.material.uom.name}
                    />

                </Group>


            </Paper>
        ))
    }, [detailProduction])

    const productUsed = useMemo(() => {
        return detailProduction.productproductionreport_set.map(prodUsed => (
            <Paper key={prodUsed.id} style={{ border: `1px solid #ced4da` }} radius='md' m='xs' >
                <TextInput
                    icon={<IconBarcode />}
                    radius='md'
                    variant="filled"
                    label='Product name'
                    readOnly
                    m='xs'
                    value={prodUsed.product.name}
                />
                <TextInput
                    icon={<IconCodeAsterix />}
                    variant='filled'
                    label='Product number'
                    radius='md'
                    m='xs'
                    readOnly
                    value={prodUsed.product.code}
                />
                <TextInput
                    icon={<IconSum />}
                    variant='filled'
                    label='Quantity used in production'
                    m='xs'
                    radius='md'
                    readOnly
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

            <Loading />


            <Group position="right" mt='md' mb='md' mr='md'   >
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
                        form="formEditProduction"
                        disabled={form.isDirty() ? false : true}
                        leftIcon={<IconDownload />} >
                        Save Changes</Button>
                    <Button
                        size='xs'
                        color='red.6'
                        disabled={!editAccess ? false : true}
                        radius='md'
                        onClick={() => openDeleteProduction()}
                        leftIcon={<IconTrashX />} >
                        Delete</Button>
                </Button.Group>
            </Group>

            <TextInput
                variant="filled"
                readOnly
                m='xs'
                icon={<IconBarcode />}
                label='Product name'
                value={form.values.product.name}
            />

            <TextInput
                variant="filled"
                icon={<IconCodeAsterix />}
                readOnly
                m='xs'
                label='Product number'
                value={form.values.product.code}
            />

            <Group grow m='xs' >

                <TextInput
                    variant="filled"
                    icon={<IconTimeline />}
                    readOnly
                    label='Process name'
                    value={form.values.process.process_name}
                />

                <TextInput
                    variant="filled"
                    icon={<IconFileTypography />}
                    readOnly
                    label='Process type'
                    value={form.values.process.process_type.name}
                />

                <TextInput
                    variant="filled"
                    icon={<IconSortAscending2 />}
                    readOnly
                    label='Wip'
                    value={`Wip${form.values.process.order}`}
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



                    <NumberInput
                        hideControls
                        icon={<IconArchive />}
                        label='Quantity production'
                        radius='md'
                        required
                        min={0}
                        readOnly={!editAccess}
                        placeholder="input quantity production"
                        {...form.getInputProps('quantity')}
                    />


                    <NumberInput
                        icon={<IconArchive />}
                        hideControls
                        min={0}
                        readOnly={!editAccess}
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