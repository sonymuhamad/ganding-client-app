import React, { useState, useEffect, useContext, useMemo } from "react";

import { IconDotsCircleHorizontal, IconCodePlus, IconEdit, IconDownload, IconTrashX, IconAsterisk, IconCodeAsterix, IconCalendar, IconCalendarTime, IconCircleCheck } from "@tabler/icons";
import { useParams } from "react-router-dom";
import { useRequest } from "../../hooks/useRequest";
import { AuthContext } from "../../context/AuthContext";
import BaseTableExpanded from "../layout/BaseTableExpanded";
import { Button, Group, TextInput, Checkbox, Title, Chip, Stack, Progress, Text } from "@mantine/core";
import BreadCrumb from "../BreadCrumb";
import { DatePicker } from "@mantine/dates";
import ExpandedScheduleDelivery from "../layout/ExpandedScheduleDelivery";
import { useSection } from "../../hooks/useSection";
import { salesorderStyle } from "../../styles/salesorderStyle";
import BaseAside from "../layout/BaseAside";
import { useForm } from "@mantine/form";


const DetailSalesOrder = () => {

    const { Retrieve, Delete, Put } = useRequest()
    const params = useParams() // salesOrderId
    const [salesOrder, setSalesOrder] = useState({})
    const [productOrder, setProductOrder] = useState([])
    const auth = useContext(AuthContext)

    const { sectionRefs, activeSection } = useSection()
    const { classes } = salesorderStyle()

    const form = useForm(
        {
            initialValues: {
                code: '',
                fixed: '',
                done: '',
                date: '',
                created: '',
                presentage: '',
            }
        }
    )

    const productOrderForm = useForm({
        initialValues: {
            productorder_set: [
                {
                    name: '',
                    code: '',
                    ordered: '',
                    delivered: '',
                }
            ]
        }
    })

    const links = [
        {
            "label": "Detail Sales Order",
            "link": "#sales-order",
            "order": 1
        },
        {
            "label": "Product Order",
            "link": "#product-order",
            "order": 1
        },
        {
            "label": "Delivery Note",
            "link": "#delivery-note",
            "order": 1
        }
    ]
    console.log({ ...productOrderForm.getInputProps(`productorder_set.0.product.name`) })
    const columnProductOrder = useMemo(() => [
        // columns for sales order tables
        {
            name: 'Product Name',
            selector: row => {
                console.log({ ...productOrderForm.getInputProps(`productorder_set.0`) }, 'from rowws')
                console.log(row.index, 'from rowws')
                return (<TextInput
                    {...productOrderForm.getInputProps(`productorder_set.${row.index}.product.name`)}
                    variant='unstyled'
                />)
            },

            sortable: true,
        },
        {
            name: 'Product Code',
            selector: row =>
                <TextInput
                    {...productOrderForm.getInputProps(`productorder_set.${row.index}.product.code`)}
                    variant='unstyled'
                />,
        },
        {
            name: 'Order',
            selector: row =>
                <TextInput
                    {...productOrderForm.getInputProps(`productorder_set.${row.index}.ordered`)}
                    variant='unstyled'
                />,

        },
        {
            name: 'Delivered',
            selector: row =>
                <TextInput
                    {...productOrderForm.getInputProps(`productorder_set.${row.index}.delivered`)}
                    variant='unstyled'
                />,

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
                const salesorder = await Retrieve(params.salesOrderId, auth.user.token, 'sales-order-list')
                const po = salesorder.productorder_set.map((product, index) => {
                    return ({
                        ...product,
                        index: index,
                        button:
                            <Button
                                leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                                color='teal.8'
                                variant='subtle'
                                radius='md' >
                                Delete
                            </Button>
                    }
                    )
                })

                productOrderForm.setValues({ productorder_set: [...po] })

                const created = new Date(salesorder.created)
                setSalesOrder(
                    {
                        date: new Date(salesorder.date),
                        timeCreated: created,
                        dateCreated: created,
                        fixed: salesorder.fixed,
                        done: salesorder.done,
                        code: salesorder.code
                    }
                )

                setProductOrder([...po])
                form.setValues(
                    {
                        date: new Date(salesorder.date),
                        fixed: salesorder.fixed,
                        done: salesorder.done,
                        created: created.toString(),
                        code: salesorder.code,
                        presentage: Math.round(((salesorder.productdelivered / salesorder.productordered) * 100) * 10) / 10
                    }
                )

            } catch (e) {

            }

        }
        fetch()
    }, [])

    return (
        <>
            <BaseAside links={links} activeSection={activeSection} />

            <section id='sales-order' ref={sectionRefs[0]} className={classes.section} >

                <Title className={classes.title}>
                    <a href="#sales-order" className={classes.a_href} >
                        Detail Sales Order
                    </a>
                </Title>
                <p>
                    Sales orders cannot be deleted if there are still products ordered
                </p>

                <Group position="right" >
                    <Button.Group>

                        <Button
                            size='xs'

                            radius='md'
                            leftIcon={<IconEdit />}
                        >
                            Edit
                        </Button>

                        <Button
                            form='formEdit'
                            size='xs'
                            color='blue'
                            leftIcon={<IconDownload />} >
                            Save Changes</Button>
                        <Button
                            size='xs'
                            color='red'
                            radius='md'
                            leftIcon={<IconTrashX />} >
                            Delete</Button>
                    </Button.Group>
                </Group>


                <form>

                    <Stack spacing='xs' >

                        <TextInput
                            icon={<IconCodeAsterix />}
                            m='xs'
                            label='Sales Order Code'
                            readOnly
                            {...form.getInputProps('code')}
                        />

                        <TextInput
                            readOnly
                            icon={<IconCalendarTime />}
                            label='Created at'
                            {...form.getInputProps('created')}
                        />

                        <DatePicker
                            label="Date"
                            {...form.getInputProps('date')}
                            disabled
                            clearable={false}
                            icon={<IconCalendar />}
                        />

                        <Group mt='md' >
                            <Checkbox.Group
                                // defaultValue={form.getInputProps('fixed').value ? ['fixed'] : ['pending']}
                                label="Current status of sales order"
                                description="Set status to fixed for material requests and open access to production "
                                value={form.getInputProps('fixed').value ? ['fixed'] : ['pending']}

                            >

                                <Checkbox label='Fixed'
                                    value={'fixed'}
                                    radius='md'

                                />

                                <Checkbox label='Pending'
                                    value={'pending'}
                                    radius='md'

                                />

                            </Checkbox.Group>
                            <Button radius='md' leftIcon={<IconCircleCheck />} style={{ display: form.getInputProps('fixed').value && 'none' }} variant='outline' mt='xl' >Set to fix</Button>
                        </Group>

                        <Text size='sm' mt='md' >
                            Current progress
                        </Text>
                        <Progress
                            value={
                                form.getInputProps('presentage').value >= 100 ? 100 :
                                    form.getInputProps('presentage').value}

                            label={form.getInputProps('presentage').value >= 100 ? 'Finished 100%' :
                                `${form.getInputProps('presentage').value}%`}

                            size="xl" radius="xl" />

                    </Stack>


                </form>

            </section>


            <section id='product-order' ref={sectionRefs[1]} className={classes.section}>
                <Title className={classes.title}>
                    <a href="#product-order" className={classes.a_href} >
                        Ordered Products
                    </a>
                </Title>
                <BaseTableExpanded
                    column={columnProductOrder}
                    data={productOrderForm.values.productorder_set}
                    expandComponent={ExpandedScheduleDelivery}
                />
            </section>

            <section id='delivery-note' ref={sectionRefs[2]} className={classes.section} >


            </section>
        </>
    )

}


export default DetailSalesOrder

