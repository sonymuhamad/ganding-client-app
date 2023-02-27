import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRequest } from "../../../hooks";

import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Button, NumberInput, Select, UnstyledButton, Paper, Group, Text, ThemeIcon, Title } from "@mantine/core";

import { IconBarcode, IconAsset, IconCircleDotted, IconCircleCheck, IconXboxX, IconBuildingFactory, IconUser, IconCalendar, IconCodeAsterix, IconTimeline, IconFileTypography, IconSortAscending2, IconBuildingWarehouse, IconAssembly } from "@tabler/icons";
import { SuccessNotif, FailedNotif } from "../../notifications";
import { openConfirmModal } from "@mantine/modals";
import { sectionStyle } from "../../../styles";
import BreadCrumb from "../../BreadCrumb";
import { ReadOnlyTextInput } from "../../custom_components";
import { generateDataWithDate } from "../../../services";


const NewProductionPriority = () => {

    const { priorityId } = useParams()
    const navigate = useNavigate()
    const { Get, Post } = useRequest()
    const [operatorList, setOperatorList] = useState([])
    const [machineList, setMachineList] = useState([])
    const { classes } = sectionStyle()

    const [priority, setPriority] = useState({
        id: '',
        order: '',
        process_name: '',
        process_type: {
            id: '',
            name: ''
        },
        product: {
            id: '',
            name: '',
            code: '',
        },
        production_quantity: '',
        requirementmaterial_set: [],
        requirementproduct_set: [],
        warehouseproduct_set: []
    })

    const form = useForm({
        initialValues: {
            quantity: '',
            quantity_not_good: 0,
            machine: null,
            operator: null,
            date: null,
            process: '',
            product: ''
        },
        validate: (values) => ({
            machine: values.machine === null ? 'This field is required' : null,
            operator: values.operator === null ? 'This field is required' : null
        })
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
            path: `/home/ppic/production/new/${priorityId}`,
            label: 'New production'
        }
    ]

    const handleSubmit = useCallback(async (value) => {
        const { date, ...rest } = value
        const validate_data = generateDataWithDate(date, rest)
        try {
            await Post(validate_data, 'production-report-management')
            SuccessNotif('Add new production success')
            navigate('/home/ppic/production')
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('New production failed')
            }
        }
    }, [Post, navigate])

    const openConfirmSubmit = useCallback((data) => openConfirmModal({
        title: `Save new production`,
        children: (
            <Text size="sm">
                Make sure all the requirements to produce this product are available.
                Are you sure?, data will be saved.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmit(data)
    }), [handleSubmit])

    const findPriority = useCallback((listPriority) => {

        const priority = listPriority.find(prior => prior.id === parseInt(priorityId))

        form.setValues({
            quantity: priority.production_quantity,
            quantity_not_good: 0,
            machine: null,
            operator: null,
            process: priority.id,
            product: priority.product.id
        })

        setPriority(priority)

    }, [priorityId])

    useEffect(() => {


        Get('production-priority').then(data => {

            const listPriority = data.reduce((prev, current) => {
                const { ppic_process_related } = current

                return [...prev, ...ppic_process_related]
            }, [])

            findPriority(listPriority)

        })

        Get('machine').then(data => {
            setMachineList(data)
        })

        Get('operator').then(data => {
            setOperatorList(data)
        })

    }, [Get, findPriority])

    return (
        <>


            <BreadCrumb links={breadcrumb} />
            <Title
                className={classes.title}
            >
                New production
            </Title>

            <form onSubmit={form.onSubmit(openConfirmSubmit)} >

                <ReadOnlyTextInput
                    icon={<IconBarcode />}
                    label='Product name'
                    value={priority.product.name}
                    m='xs'
                />

                <ReadOnlyTextInput
                    icon={<IconCodeAsterix />}
                    label='Product number'
                    m='xs'
                    value={priority.product.code}
                />

                <Group grow m='xs'  >
                    <ReadOnlyTextInput
                        icon={<IconTimeline />}
                        label='Process name'
                        value={priority.process_name}
                    />

                    <ReadOnlyTextInput
                        icon={<IconFileTypography />}
                        label='Process type'
                        value={priority.process_type.name}
                    />

                    <ReadOnlyTextInput
                        icon={<IconSortAscending2 />}
                        label='Wip'
                        value={`Wip${priority.order}`}
                    />

                </Group>

                <Select
                    radius='md'
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
                    {...form.getInputProps('operator')}
                    radius='md'
                    placeholder="Select operator"
                    data={operatorList.map(operator => ({ value: operator.id, label: operator.name }))}
                    label='Operator'
                />

                <Group grow m='xs' >

                    <DatePicker
                        label='Production date'
                        placeholder="Select production date"
                        radius='md'
                        icon={<IconCalendar />}
                        {...form.getInputProps('date')}
                    />

                    <NumberInput
                        placeholder="input quantity production"
                        {...form.getInputProps('quantity')}
                        label='Quantity production'
                        radius='md'
                        hideControls
                        min={1}
                        required
                    />

                    <NumberInput
                        label='Quantity not good'
                        radius='md'
                        hideControls
                        min={0}
                        required
                        placeholder="input quantity not good of production"
                        {...form.getInputProps('quantity_not_good')}
                    />

                </Group>



                <Paper mx='md' my='xl'  >

                    <UnstyledButton>
                        <Group>
                            <IconAsset />
                            <div>
                                <Text>Material used</Text>
                            </div>
                        </Group>
                    </UnstyledButton>

                    {priority.requirementmaterial_set.map(reqMat => (
                        <Group key={reqMat.id} position="apart" >

                            <Group grow >

                                <ReadOnlyTextInput
                                    icon={<IconAsset />}
                                    label='Material name'
                                    value={reqMat.material.name}
                                />

                                <ReadOnlyTextInput
                                    icon={<IconBuildingWarehouse />}
                                    label='Stock'
                                    value={reqMat.material.warehousematerial}
                                />

                                <ReadOnlyTextInput
                                    icon={<IconAssembly />}
                                    label='Qty need'
                                    value={form.values.quantity === null || form.values.quantity === 0 || form.values.quantity === undefined ? 0 :
                                        Math.ceil(((form.values.quantity + form.values.quantity_not_good) / reqMat.output) * reqMat.input)}
                                />

                            </Group>



                            <ThemeIcon
                                radius='xl'
                                mt='md'
                                color={form.values.quantity === null || form.values.quantity === 0 || form.values.quantity === undefined ? 'blue' :
                                    Math.ceil(((form.values.quantity + form.values.quantity_not_good) / reqMat.output) * reqMat.input) > parseInt(reqMat.material.warehousematerial) ? 'red' : 'blue'}
                            >

                                {form.values.quantity === null || form.values.quantity === 0 || form.values.quantity === undefined ? <IconCircleDotted /> :
                                    Math.ceil(((form.values.quantity + form.values.quantity_not_good) / reqMat.output) * reqMat.input) > parseInt(reqMat.material.warehousematerial) ? <IconXboxX /> : <IconCircleCheck />
                                }

                            </ThemeIcon>

                        </Group>
                    ))}

                    {priority.requirementmaterial_set.length === 0 &&
                        <Text size='sm' align='center' color='dimmed' >
                            This process doesn't have requirement material
                        </Text>
                    }


                </Paper>



                <Paper mx='md' my='xl'  >
                    <UnstyledButton>
                        <Group>
                            <IconBarcode />
                            <div>
                                <Text>Product assembly used</Text>
                            </div>
                        </Group>
                    </UnstyledButton>

                    {priority.requirementproduct_set.map(reqProduct => (
                        <Group key={reqProduct.id} spacing='xs' position="apart" >

                            <Group grow >

                                <ReadOnlyTextInput
                                    icon={<IconBarcode />}
                                    label='Product name'
                                    value={reqProduct.product.name}
                                />

                                <ReadOnlyTextInput
                                    icon={<IconBuildingWarehouse />}
                                    label='Stock'
                                    value={reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity}
                                />


                                <ReadOnlyTextInput
                                    icon={<IconAssembly />}
                                    label='Qty need'
                                    value={form.values.quantity === null || form.values.quantity === 0 || form.values.quantity === undefined ? 0 :
                                        Math.ceil(((form.values.quantity + (form.values.quantity_not_good === undefined ? 0 : form.values.quantity_not_good)) / reqProduct.output) * reqProduct.input)}
                                />

                            </Group>



                            <ThemeIcon
                                radius='xl'
                                mt='md'
                                color={form.values.quantity === null || form.values.quantity === 0 || form.values.quantity === undefined ? 'blue' :
                                    Math.ceil(((form.values.quantity + (form.values.quantity_not_good === undefined ? 0 : form.values.quantity_not_good)) / reqProduct.output) * reqProduct.input) > parseInt(reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity) ? 'red' : 'blue'}
                            >

                                {form.values.quantity === null || form.values.quantity === 0 || form.values.quantity === undefined ? <IconCircleDotted /> :
                                    Math.ceil(((form.values.quantity + (form.values.quantity_not_good === undefined ? 0 : form.values.quantity_not_good)) / reqProduct.output) * reqProduct.input) > parseInt(reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity) ? <IconXboxX /> : <IconCircleCheck />
                                }

                            </ThemeIcon>

                        </Group>
                    ))}

                    {priority.requirementproduct_set.length === 0 &&
                        <Text size='sm' align='center' color='dimmed' >
                            This process doesn't have requirement product assembly
                        </Text>
                    }

                </Paper>


                <Button
                    my='lg'
                    fullWidth
                    radius='md'
                    type='submit'
                    disabled={form.values.quantity === 0 || form.values.quantity === null || form.values.quantity === undefined}
                >
                    Save
                </Button>
            </form>

        </>
    )
}

export default NewProductionPriority