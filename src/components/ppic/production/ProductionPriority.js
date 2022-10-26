import React, { useState, useEffect, useContext, useMemo } from "react";

import { Button, TextInput, NumberInput, NativeSelect, Group, Text, UnstyledButton, Paper, ThemeIcon } from "@mantine/core";
import { AuthContext } from "../../../context/AuthContext";
import { useRequest } from "../../../hooks/useRequest";
import BaseTable from "../../tables/BaseTable";
import { IconAffiliate, IconAsset, IconBarcode, IconCircleCheck, IconCircleDotted, IconXboxX } from "@tabler/icons";

import { openModal, openConfirmModal, closeAllModals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { SuccessNotif, FailedNotif } from "../../notifications/Notifications";



const ModalAddProduction = ({ data, setaction, setActionProductionReport }) => {

    const auth = useContext(AuthContext)
    const { Get, Loading, Post } = useRequest()
    const [machineList, setMachineList] = useState([])
    const [operatorList, setOperatorList] = useState([])


    const form = useForm({
        initialValues: {
            quantity: data.production_quantity,
            quantity_not_good: 0,
            machine: null,
            operator: null,
            process: data.id,
            product: data.product.id
        }
    })

    const handleSubmit = async (data) => {
        try {
            await Post(data, auth.user.token, 'production-report-management')
            setaction(prev => prev + 1)
            setActionProductionReport(prev => prev + 1)
            SuccessNotif('Add new production success')
            closeAllModals()
        } catch (e) {
            console.log(e)
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('New production failed')
            }
        }
    }

    const openConfirmSubmit = (data) => openConfirmModal({
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
    })

    useEffect(() => {

        Get(auth.user.token, 'machine').then(data => {
            setMachineList(data)
        })

        Get(auth.user.token, 'operator').then(data => {
            setOperatorList(data)
        })

    }, [])



    return (
        <>
            <Loading />
            <form onSubmit={form.onSubmit(openConfirmSubmit)}  >

                <Group grow my='xs'  >
                    <TextInput
                        label='Product name'
                        readOnly
                        value={data.product.name}
                        radius='md'
                    />

                    <TextInput
                        label='Product number'
                        radius='md'
                        readOnly
                        value={data.product.code}
                    />
                </Group>

                <Group grow  >
                    <TextInput
                        label='Process name'
                        radius='md'
                        readOnly
                        value={data.process_name}
                    />

                    <TextInput
                        label='Process type'
                        readOnly
                        value={data.process_type.name}
                        radius='md'
                    />

                    <TextInput
                        label='Wip'
                        readOnly
                        radius='md'
                        value={`Wip${data.order}`}
                    />

                </Group>

                <Group grow my='xs'>
                    <NativeSelect
                        placeholder="Select machine"
                        label='Machine'
                        radius='md'
                        required
                        data={machineList.map(mc => ({ value: mc.id, label: mc.name }))}
                        {...form.getInputProps('machine')}
                    />

                    <NativeSelect
                        placeholder="Select operator"
                        label='Operator'
                        radius='md'
                        required
                        data={operatorList.map(op => ({ value: op.id, label: op.name }))}
                        {...form.getInputProps('operator')}
                    />
                </Group>

                <Group grow mb='md' >

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

                    {data.requirementmaterial_set.map(reqMat => (
                        <Group key={reqMat.id} position="apart" >

                            <Group grow >

                                <TextInput
                                    radius='md'
                                    label='Material name'
                                    readOnly
                                    value={reqMat.material.name}
                                />

                                <TextInput
                                    radius='md'
                                    label='Stock'
                                    readOnly
                                    value={reqMat.material.warehousematerial}
                                />

                                <TextInput
                                    radius='md'
                                    label='Qty need'
                                    readOnly
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

                    {data.requirementmaterial_set.length === 0 &&
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

                    {data.requirementproduct_set.map(reqProduct => (
                        <Group key={reqProduct.id} spacing='xs' position="apart" >

                            <Group grow >

                                <TextInput
                                    radius='md'
                                    label='Product name'
                                    readOnly
                                    value={reqProduct.product.name}
                                />

                                <TextInput
                                    radius='md'
                                    label='Stock'
                                    readOnly
                                    value={reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity}
                                />


                                <TextInput
                                    radius='md'
                                    label='Qty need'
                                    readOnly
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

                    {data.requirementproduct_set.length === 0 &&
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


const ProductionPriority = ({ setaction }) => {

    const auth = useContext(AuthContext)
    const { Get, Post, Loading } = useRequest()
    const [dataPriority, setDataPriority] = useState([])
    const [action, setAction] = useState(0)

    const columnProductionPriority = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product.name
        },
        {
            name: 'Process',
            selector: row => row.process_name
        },
        {
            name: 'Quantity to produce',
            selector: row => `${row.production_quantity} pcs`
        },
        {
            name: 'Wip',
            selector: row => `Wip${row.order}`
        },
        {
            name: '',
            selector: row => row.button
        }
    ], [])

    const openModalAddProduction = (data) => openModal({
        title: 'New production',
        radius: 'md',
        size: '70%',
        children: <ModalAddProduction data={data} setActionProductionReport={setaction} setaction={setAction} />
    })

    useEffect(() => {
        Get(auth.user.token, 'production-priority').then(data => {

            const priority = data.reduce((prev, current) => {
                const { ppic_process_related } = current

                const many_process = ppic_process_related.map(pros => ({
                    ...pros, button: <Button
                        leftIcon={<IconAffiliate stroke={2} size={16} />}
                        color='blue.6'
                        variant='subtle'
                        radius='md'
                        mx='xs'
                        onClick={
                            () => openModalAddProduction(pros)
                        }
                    >
                        Produce
                    </Button>
                }))

                return [...prev, ...many_process]
            }, [])

            setDataPriority(priority)

        })
    }, [auth.user.token, action])

    return (
        <>
            <BaseTable
                column={columnProductionPriority}
                data={dataPriority}
            />
        </>
    )

}

export default ProductionPriority
