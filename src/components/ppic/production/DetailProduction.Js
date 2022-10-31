import React, { useState, useEffect, useContext } from "react";

import { Group, TextInput, Text, NumberInput, Paper, Divider, Title, Button, Select, UnstyledButton } from "@mantine/core";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useRequest } from "../../../hooks/useRequest";
import { useForm } from "@mantine/form";
import BreadCrumb from "../../BreadCrumb";
import { sectionStyle } from "../../../styles/sectionStyle";

import { IconBarcode, IconCodeAsterix, IconTimeline, IconFileTypography, IconSortAscending2, IconBuildingFactory, IconUser, IconArchive, IconEdit, IconX, IconDownload, IconTrashX, IconAsset, } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { FailedNotif, SuccessNotif } from "../../notifications/Notifications";
import { useNavigate } from "react-router-dom";


const DetailProduction = () => {

    const auth = useContext(AuthContext)
    const params = useParams()
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

        Retrieve(params.productionId, auth.user.token, 'production-report').then(data => {
            const { operator, machine, ...restProps } = data
            const detailProductionReport = { ...restProps, machine: machine.id, operator: operator.id }

            setDetailProduction(detailProductionReport)
            form.setValues(detailProductionReport)

        })

        Get(auth.user.token, 'machine').then(data => {
            setMachineList(data)
        })

        Get(auth.user.token, 'operator').then(data => {
            setOperatorList(data)
        })

    }, [auth.user.token, params.productionId])

    const openDeleteProduction = () => openConfirmModal({
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
    })

    const handleDeleteProduction = async () => {
        try {
            await Delete(params.productionId, auth.user.token, 'production-report-management')
            SuccessNotif('Delete production report success')
            navigate('/home/ppic/production')
        } catch (e) {
            console.log(e)
            FailedNotif(e.message.data)
        }
    }

    const handleSubmit = async (data) => {
        const { process, product, ...restProps } = data

        try {
            await Put(params.productionId, { ...restProps, process: process.id, product: product.id }, auth.user.token, 'production-report-management')
            SuccessNotif('Edit data production success')
            setDetailProduction(prev => ({ ...prev, machine: data.machine, operator: data.operator, quantity: data.quantity, quantity_not_good: data.quantity_not_good }))
            form.resetDirty()
            setEditAccess(prev => !prev)

        } catch (e) {
            console.log(e)
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('Add production failed')
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

    const handleClickEditButton = () => {
        form.resetDirty()
        form.setValues(detailProduction)
        setEditAccess(prev => !prev)
    }

    const materialUsed = detailProduction.materialproductionreport_set.map(matUsed => (
        <Paper key={matUsed.id} style={{ border: `1px solid #ced4da` }} radius='md' m='xs'  >

            <Group grow m='xs' >

                <TextInput
                    radius='md'
                    label='Material name'
                    readOnly
                    value={matUsed.material.name}
                />
                <TextInput
                    label='Quantity used in production'
                    radius='md'
                    readOnly
                    value={matUsed.quantity}

                />

            </Group>

            <Group grow m='xs' >
                <TextInput
                    radius='md'
                    label='Specification material'
                    readOnly
                    value={matUsed.material.spec}
                />
                <TextInput
                    label='Weight'
                    radius='md'
                    readOnly
                    value={matUsed.material.weight}
                />
                <TextInput
                    label='Length'
                    radius='md'
                    readOnly
                    value={matUsed.material.length}
                />
                <TextInput
                    label='Width'
                    radius='md'
                    readOnly
                    value={matUsed.material.width}
                />
                <TextInput
                    label='Thickness'
                    radius='md'
                    readOnly
                    value={matUsed.material.thickness}
                />
                <TextInput
                    label='Unit of material'
                    radius='md'
                    readOnly
                    value={matUsed.material.uom.name}
                />

            </Group>


        </Paper>
    ))

    const productUsed = detailProduction.productproductionreport_set.map(prodUsed => (
        <Paper key={prodUsed.id} style={{ border: `1px solid #ced4da` }} radius='md' m='xs' >
            <TextInput
                radius='md'
                label='Product name'
                readOnly
                m='xs'
                value={prodUsed.product.name}
            />
            <TextInput
                label='Product number'
                radius='md'
                m='xs'
                readOnly
                value={prodUsed.product.code}
            />
            <TextInput
                label='Quantity used in production'
                m='xs'
                radius='md'
                readOnly
                value={prodUsed.quantity}

            />

        </Paper>
    ))


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
                variant="unstyled"
                readOnly
                m='xs'
                icon={<IconBarcode />}
                label='Product name'
                value={form.values.product.name}
            />

            <TextInput
                variant="unstyled"
                icon={<IconCodeAsterix />}
                readOnly
                m='xs'
                label='Product number'
                value={form.values.product.code}
            />

            <Group grow >

                <TextInput
                    variant="unstyled"
                    icon={<IconTimeline />}
                    readOnly
                    m='xs'
                    label='Process name'
                    value={form.values.process.process_name}
                />

                <TextInput
                    variant="unstyled"
                    icon={<IconFileTypography />}
                    readOnly
                    m='xs'
                    label='Process type'
                    value={form.values.process.process_type.name}
                />

                <TextInput
                    variant="unstyled"
                    icon={<IconSortAscending2 />}
                    readOnly
                    m='xs'
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

                <Group grow >



                    <NumberInput
                        hideControls
                        m='xs'
                        icon={<IconArchive />}
                        label='Quantity production'
                        radius='md'
                        required
                        readOnly={!editAccess}
                        placeholder="input quantity production"
                        {...form.getInputProps('quantity')}
                    />


                    <NumberInput
                        icon={<IconArchive />}
                        hideControls
                        m='xs'
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

        </>
    )
}

export default DetailProduction