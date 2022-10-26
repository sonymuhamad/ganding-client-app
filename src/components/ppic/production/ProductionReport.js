import React, { useState, useEffect, useContext, useMemo } from "react";

import { IconEdit, IconPlus, IconSearch, IconDotsCircleHorizontal, IconSortAscending2, IconBarcode, IconFileTypography, IconBuildingFactory, IconUser, IconCodeAsterix, IconTimeline, IconArchive, IconDownload, IconAsset, IconAssembly, IconCircleDotted, IconCircleCheck, IconXboxX } from "@tabler/icons";

import { useForm } from "@mantine/form";
import { Button, Divider, Group, TextInput, Text, NumberInput, NativeSelect, Select, UnstyledButton, ThemeIcon, Paper } from "@mantine/core";
import { AuthContext } from "../../../context/AuthContext";
import { useRequest } from "../../../hooks/useRequest";
import BaseTable from "../../tables/BaseTable";

import { closeAllModals, openModal, openConfirmModal } from "@mantine/modals";
import { FailedNotif, SuccessNotif } from "../../notifications/Notifications";



const DetailProductionReport = ({ data }) => {

    const columnUsedMaterial = useMemo(() => [
        {
            name: 'material',
            selector: row => row.material.name
        },
        {
            name: 'quantity',
            selector: row => row.quantity
        }
    ], [])

    const columnUsedProduct = useMemo(() => [
        {
            name: 'product',
            selector: row => row.product.name
        },
        {
            name: 'quantity',
            selector: row => row.quantity
        }
    ], [])

    return (
        <>
            <Group grow >
                <TextInput
                    readOnly
                    icon={<IconBarcode />}
                    radius='md'
                    label='product name'
                    value={data.product.name}
                />

                <TextInput
                    icon={<IconCodeAsterix />}
                    readOnly
                    radius='md'
                    label='product number'
                    value={data.product.code}
                />
            </Group>

            <Group my='sm' grow >
                <TextInput
                    icon={<IconTimeline />}
                    readOnly
                    label='process name'
                    radius='md'
                    value={data.process.process_name}
                />
                <TextInput
                    icon={<IconFileTypography />}
                    readOnly
                    label='process type'
                    radius='md'
                    value={data.process.process_type.name}
                />
                <TextInput
                    readOnly
                    icon={<IconSortAscending2 />}
                    radius='md'
                    label='wip'
                    value={`Wip${data.process.order}`}
                />
            </Group>

            <Group grow >
                <TextInput
                    icon={<IconBuildingFactory />}
                    readOnly
                    radius='md'
                    label='Machine'
                    value={data.machine.name}
                />
                <TextInput
                    icon={<IconUser />}
                    readOnly
                    radius='md'
                    label='Operator'
                    value={data.operator.name}
                />
                <TextInput
                    icon={<IconArchive />}
                    readOnly
                    radius='md'
                    label='Quantity production / not good'
                    value={`${data.quantity} / ${data.quantity_not_good}`}
                    rightSection={<Text size='xs' color='dimmed' >Pcs</Text>}
                />
            </Group>

            <Divider my='xs'></Divider>

            <Paper px='md'  >
                <UnstyledButton>
                    <Group>
                        <IconAsset />
                        <div>
                            <Text>Material used</Text>
                        </div>
                    </Group>
                </UnstyledButton>

                <BaseTable
                    column={columnUsedMaterial}
                    data={data.materialproductionreport_set}
                    dense={true}
                    pagination={false}
                />
            </Paper>

            <Divider my='xs'></Divider>

            <Paper px='md' >


                <UnstyledButton>
                    <Group>
                        <IconBarcode />
                        <div>
                            <Text>Product assembly used</Text>
                        </div>
                    </Group>
                </UnstyledButton>

                <BaseTable
                    column={columnUsedProduct}
                    dense={true}
                    pagination={false}
                    data={data.productproductionreport_set}
                />
            </Paper>


        </>
    )
}

const ModalEditReport = ({ data, action }) => {

    const [machine, setMachine] = useState([])
    const [operator, setOperator] = useState([])

    const auth = useContext(AuthContext)
    const { Get, Put, Loading } = useRequest()

    const form = useForm({
        initialValues: {
            quantity: data.quantity,
            quantity_not_good: data.quantity_not_good,
            machine: data.machine.id,
            operator: data.operator.id,
            process: data.process.id,
            product: data.product.id
        }
    })

    const handleSubmit = async (value) => {
        try {
            await Put(data.id, value, auth.user.token, 'production-report-management')
            SuccessNotif('Edit production report success')
            action(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            console.log(e)
            FailedNotif('Edit production report failed')
            FailedNotif(e.message.data.non_field_errors)
        }
    }

    useEffect(() => {
        const fetch = async () => {
            try {
                const machines = await Get(auth.user.token, 'machine')
                const operators = await Get(auth.user.token, 'operator')
                setMachine(machines)
                setOperator(operators)

            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [])

    return (
        <>
            <Loading />
            <form onSubmit={form.onSubmit(handleSubmit)}  >

                <Group grow >
                    <TextInput
                        readOnly
                        icon={<IconBarcode />}
                        radius='md'
                        label='product name'
                        value={data.product.name}
                    />

                    <TextInput
                        icon={<IconCodeAsterix />}
                        readOnly
                        radius='md'
                        label='product number'
                        value={data.product.code}
                    />
                </Group>

                <Group my='sm' grow >
                    <TextInput
                        icon={<IconTimeline />}
                        readOnly
                        label='process name'
                        radius='md'
                        value={data.process.process_name}
                    />
                    <TextInput
                        icon={<IconFileTypography />}
                        readOnly
                        label='process type'
                        radius='md'
                        value={data.process.process_type.name}
                    />
                    <TextInput
                        readOnly
                        icon={<IconSortAscending2 />}
                        radius='md'
                        label='wip'
                        value={`Wip${data.process.order}`}
                    />
                </Group>

                <Divider mt='lg' mb='xs' label='editable ' variant='dashed' labelPosition="center" />

                <Group grow my='xs' >
                    <NativeSelect
                        icon={<IconBuildingFactory />}
                        data={machine.map(m => ({ value: m.id, label: m.name }))}
                        radius='md'
                        label='Machine'
                        {...form.getInputProps('machine')}
                    />
                    <NativeSelect
                        icon={<IconUser />}
                        data={operator.map(op => ({ value: op.id, label: op.name }))}
                        radius='md'
                        label='Operator'
                        {...form.getInputProps('operator')}
                    />
                </Group>
                <Group grow mb='lg' >

                    <NumberInput
                        hideControls
                        icon={<IconArchive />}
                        {...form.getInputProps('quantity')}
                        radius='md'
                        label='Quantity production'
                        rightSection={<Text size='xs' color='dimmed' >Pcs</Text>}
                    />
                    <NumberInput
                        hideControls
                        icon={<IconArchive />}
                        {...form.getInputProps('quantity_not_good')}
                        radius='md'
                        label='Quantity not good'
                        rightSection={<Text size='xs' color='dimmed' >Pcs</Text>}
                    />
                </Group>

                <Button
                    type="submit"
                    leftIcon={<IconDownload />}
                    radius='md'
                    fullWidth
                    my='lg'
                    disabled={!form.isDirty()}
                >
                    Save
                </Button>
            </form>

        </>
    )
}

const ModalAddReport = ({ action, machineList, customerProduct, operatorList }) => {

    const auth = useContext(AuthContext)
    const { Post, Loading } = useRequest()
    const [processList, setProcessList] = useState([])

    const [product, setProduct] = useState('')
    const [process, setProcess] = useState('')
    const [quantity, setQuantity] = useState(null)
    const [quantityNotGood, setQuantityNotGood] = useState(0)
    const [machine, setMachine] = useState('')
    const [operator, setOperator] = useState('')

    const handleSubmit = async () => {

        try {
            await Post({ product: product, quantity: quantity, quantity_not_good: quantityNotGood, machine: machine, operator: operator, process: process }, auth.user.token, 'production-report-management')
            SuccessNotif('Add production success')
            action(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            FailedNotif('Add production failed')
            FailedNotif(e.message.data.non_field_errors)
            console.log(e)
        }
    }

    const openConfirmSubmit = (e) => {
        e.preventDefault()

        return openConfirmModal({
            title: `Save new production`,
            children: (
                <Text size="sm">
                    Make sure all the requirements to produce this product are available.
                    are you sure?, data will be saved.
                </Text>
            ),
            radius: 'md',
            labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
            cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
            confirmProps: { radius: 'md' },
            onConfirm: () => handleSubmit()
        })
    }

    useEffect(() => {

    }, [auth.user.token])

    return (
        <>
            <Loading />
            <form onSubmit={openConfirmSubmit}  >

                <Group grow >

                    <Select
                        icon={<IconBarcode />}
                        label='Product'
                        placeholder="Pick a product"
                        searchable
                        nothingFound="No products"
                        radius='md'
                        data={customerProduct.map(data => ({ value: data.id, label: data.name, group: data.group }))}
                        value={product}
                        required
                        onChange={(value) => {
                            setProduct(value)
                            const process = customerProduct.find(product => product.id === parseInt(value)).ppic_process_related
                            setProcessList(process)
                            setProcess('')
                        }}

                    />

                    <TextInput
                        radius='md'
                        label='Product number'
                        icon={<IconCodeAsterix />}
                        value={product !== '' ? customerProduct.find(prod => prod.id === parseInt(product)).code : ''}
                        readOnly
                    />

                </Group>
                <Group grow my='xs' >

                    <NativeSelect
                        placeholder="Pick process"
                        label='Process'
                        required
                        radius='md'
                        icon={<IconTimeline />}
                        data={processList.map(process => ({ value: process.id, label: process.process_name }))}
                        value={process}
                        onChange={(e) => {
                            setProcess(e.target.value)
                        }}
                    />

                    <TextInput
                        radius='md'
                        label='Process type'
                        icon={<IconFileTypography />}
                        readOnly
                        value={process !== '' ? processList.find(pros => pros.id === parseInt(process)).process_type.name : ''}
                    />

                    <TextInput
                        icon={<IconSortAscending2 />}
                        radius='md'
                        label='wip'
                        readOnly
                        value={process !== '' ? processList.find(pros => pros.id === parseInt(process)).order : ''}
                    />


                </Group>

                <Group mt='xs' mb='lg' >

                    <NativeSelect
                        radius='md'
                        label='Machine'
                        required
                        placeholder="Pick machine name"
                        icon={<IconBuildingFactory />}
                        data={machineList.map(machine => ({ value: machine.id, label: machine.name }))}
                        value={machine}
                        onChange={(e) => {
                            setMachine(e.target.value)
                        }}
                    />

                    <NativeSelect
                        radius='md'
                        label='Operator'
                        placeholder="Pick operator name"
                        required
                        icon={<IconUser />}
                        data={operatorList.map(op => ({ value: op.id, label: op.name }))}
                        value={operator}
                        onChange={(e) => {
                            setOperator(e.target.value)
                        }}

                    />

                    <NumberInput
                        radius='md'
                        hideControls
                        required
                        icon={<IconArchive />}
                        label='Quantity production'
                        value={quantity}
                        min={0}
                        onChange={e => {
                            setQuantity(e)
                        }}
                        rightSection={<Text size='xs' color='dimmed' >Pcs</Text>}

                    />

                    <NumberInput
                        radius='md'
                        required
                        hideControls
                        label='Quantity not good'
                        icon={<IconArchive />}
                        value={quantityNotGood}
                        min={0}
                        rightSection={<Text size='xs' color='dimmed' >Pcs</Text>}
                        onChange={e => {
                            if (e === undefined) {
                                setQuantityNotGood(0)
                            } else {
                                setQuantityNotGood(e)
                            }
                        }}
                    />


                </Group>

                {process !== '' &&
                    <Paper m='xl'  >

                        <UnstyledButton>
                            <Group>
                                <IconAsset />
                                <div>
                                    <Text>Material used</Text>
                                </div>
                            </Group>
                        </UnstyledButton>

                        {processList.find(pros => pros.id === parseInt(process)).requirementmaterial_set.map(reqMat => (
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
                                        value={quantity === null || quantity === 0 || quantity === undefined ? 0 :
                                            Math.ceil(((quantity + quantityNotGood) / reqMat.output) * reqMat.input)}
                                    />

                                </Group>



                                <ThemeIcon
                                    radius='xl'
                                    mt='md'
                                    color={quantity === null || quantity === 0 || quantity === undefined ? 'blue' :
                                        Math.ceil(((quantity + quantityNotGood) / reqMat.output) * reqMat.input) > parseInt(reqMat.material.warehousematerial) ? 'red' : 'blue'}
                                >

                                    {quantity === null || quantity === 0 || quantity === undefined ? <IconCircleDotted /> :
                                        Math.ceil(((quantity + quantityNotGood) / reqMat.output) * reqMat.input) > parseInt(reqMat.material.warehousematerial) ? <IconXboxX /> : <IconCircleCheck />
                                    }

                                </ThemeIcon>

                            </Group>
                        ))}

                        {processList.find(pros => pros.id === parseInt(process)).requirementmaterial_set.length === 0 &&
                            <Text size='sm' align='center' color='dimmed' >
                                This process doesn't have requirement material
                            </Text>
                        }


                    </Paper>


                }

                {process !== '' &&
                    <Paper m='xl'  >
                        <UnstyledButton>
                            <Group>
                                <IconBarcode />
                                <div>
                                    <Text>Product assembly used</Text>
                                </div>
                            </Group>
                        </UnstyledButton>

                        {processList.find(pros => pros.id === parseInt(process)).requirementproduct_set.map(reqProduct => (
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
                                        value={quantity === null || quantity === 0 || quantity === undefined ? 0 :
                                            Math.ceil(((quantity + quantityNotGood) / reqProduct.output) * reqProduct.input)}
                                    />

                                </Group>



                                <ThemeIcon
                                    radius='xl'
                                    mt='md'
                                    color={quantity === null || quantity === 0 || quantity === undefined ? 'blue' :
                                        Math.ceil(((quantity + quantityNotGood) / reqProduct.output) * reqProduct.input) > parseInt(reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity) ? 'red' : 'blue'}
                                >

                                    {quantity === null || quantity === 0 || quantity === undefined ? <IconCircleDotted /> :
                                        Math.ceil(((quantity + quantityNotGood) / reqProduct.output) * reqProduct.input) > parseInt(reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity) ? <IconXboxX /> : <IconCircleCheck />
                                    }

                                </ThemeIcon>

                            </Group>
                        ))}

                        {processList.find(pros => pros.id === parseInt(process)).requirementproduct_set.length === 0 &&
                            <Text size='sm' align='center' color='dimmed' >
                                This process doesn't have requirement product assembly
                            </Text>
                        }

                    </Paper>


                }

                <Button
                    my='lg'
                    radius='md'
                    fullWidth
                    type="submit"
                    disabled={parseInt(quantity) === 0 || quantity === null || quantity === undefined}
                >
                    Save
                </Button>
            </form>

        </>
    )
}


const ProductionReport = ({ machine, operator, products, action, setaction }) => {

    const auth = useContext(AuthContext)
    const { Get } = useRequest()
    const [reports, setReports] = useState([])
    const [searchReport, setSearchReport] = useState([])


    const filteredReports = useMemo(() => {

        const filteringVal = searchReport.toLowerCase()


        return reports.filter(report => report.product.name.toLowerCase().includes(filteringVal) || report.process.process_name.toLowerCase().includes(filteringVal) || report.created.toLowerCase().includes(filteringVal))

    }, [searchReport, reports])


    const ColumnProductionReport = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product.name
        },
        {
            name: 'Process',
            selector: row => row.process.process_name
        },
        {
            name: 'Date',
            selector: row => new Date(row.created).toDateString()
        },
        {
            name: '',
            selector: row => row.buttonEdit
        },
        {
            name: '',
            selector: row => row.buttonDetail
        },
    ], [])


    const openDetailProductionReportModal = (report) => openModal({
        title: 'Detail production report',
        radius: 'md',
        size: 'xl',
        children: <DetailProductionReport data={report} />
    })

    const openEditProductionReport = (report) => openModal({
        title: 'Edit production report',
        radius: 'md',
        size: 'xl',
        children: <ModalEditReport data={report} action={setaction} />
    })

    const openAddProductionReport = () => openModal({
        title: 'New production',
        radius: 'md',
        size: 'xxl',
        closeOnClickOutside: false,
        children: <ModalAddReport action={setaction} machineList={machine} operatorList={operator} customerProduct={products} />

    })



    useEffect(() => {
        const fetchProductionReport = async () => {
            try {
                const reports = await Get(auth.user.token, 'production-report')
                const productionReport = reports.map(report => ({
                    ...report, buttonEdit:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='blue.6'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditProductionReport(report)}

                        >
                            Edit
                        </Button>,
                    buttonDetail:
                        <Button
                            leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                            color='teal.8'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openDetailProductionReportModal(report)}
                        >
                            Detail
                        </Button>,

                }))

                setReports(productionReport)
            } catch (e) {
                console.log(e)
            }
        }
        fetchProductionReport()
    }, [auth.user.token, action])

    return (
        <>
            <Group position="right" >

                <TextInput
                    icon={<IconSearch />}
                    radius='md'
                    value={searchReport}
                    onChange={e => setSearchReport(e.target.value)}
                    placeholder="Search report"
                />

                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openAddProductionReport}
                >
                    Production
                </Button>
            </Group>

            <BaseTable
                column={ColumnProductionReport}
                data={filteredReports}
            />
        </>
    )
}


export default ProductionReport

