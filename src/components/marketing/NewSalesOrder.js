import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "@mantine/form";
import { Title, TextInput, NumberInput, NativeSelect, Stack, Button, Center, Paper, ActionIcon, Group, Text } from "@mantine/core";
import { customStyle } from '../../styles'
import { DatePicker } from "@mantine/dates";
import { IconUser, IconCodeAsterix, IconCalendar, IconTrash, IconCalendarPlus, IconDownload, IconClipboardPlus } from "@tabler/icons";
import { SuccessNotif, FailedNotif } from "../notifications";
import { useNavigate } from "react-router-dom";
import { useRequest } from "../../hooks";
import { openConfirmModal } from "@mantine/modals";
import BreadCrumb from "../BreadCrumb";

const NewSalesOrder = () => {

    const { classes } = customStyle()
    const [customer, setCustomer] = useState([])
    const { Post, Loading, GetAndExpiredTokenHandler } = useRequest()
    const navigate = useNavigate()

    const form = useForm({
        initialValues: {
            code: '',
            customer: '',
            fixed: false,
            done: false,
            date: '',
            productorder_set: [
                {
                    ordered: 0,
                    delivered: 0,
                    product: '',
                    done: false,
                    deliveryschedule_set: [
                        {
                            quantity: 0,
                            date: ''
                        }
                    ]
                }

            ]
        },
        validate: {
            code: (value) => (value === '' ? 'this field is required' : null),
            customer: (value) => (value === '' ? 'this field is required' : null),
            date: (value) => (value === '' ? 'this field is required' : null),
            productorder_set: {
                ordered: (value) => (value === undefined ? 'this field is required' : value === 0 ? 'this field cannot be filled with zero ' : null),
                product: (value) => (value === '' ? 'this field is required' : null),
                deliveryschedule_set: {
                    date: (value) => (value === '' ? 'This fields is required' : null),
                    quantity: (value) => (value === undefined ? 'This fields is required' : value === 0 ? 'this fields cannot be filled with zero' : null),

                }
            }
        }

    })

    const breadcrumb = [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/sales-order',
            label: 'Sales order'
        },
        {
            path: `/home/marketing/sales-order/new`,
            label: 'Create'
        }
    ]


    useEffect(() => {

        const fetch = async () => {
            try {
                const customer = await GetAndExpiredTokenHandler('product-customer')
                setCustomer(customer)

            } catch (e) {

            }
        }

        fetch()
    }, [])


    const handleSubmit = useCallback(async (data) => {
        let validateData = data
        validateData.date = data.date.toLocaleDateString('en-CA')

        validateData.productorder_set.map(porder => {
            porder.deliveryschedule_set.map(schedule => {
                schedule.date = schedule.date.toLocaleDateString('en-CA')
                return schedule
            })
            return porder
        })

        try {
            await Post(validateData, 'sales-order-management')
            SuccessNotif('New sales order added successfully')
            navigate('/home/marketing/sales-order')
        } catch (e) {

            form.setErrors({ ...e.message.data })
            if (e.message.data.productorder_set) {
                FailedNotif(e.message.data.productorder_set[0])
            }
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors[0])
            }
            console.log(e)
        }
    }, [Post, navigate])

    const openModal = useCallback((data) => openConfirmModal({
        title: `Add new sales order`,
        children: (
            <Text size="sm">
                Make sure the data is correct.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmit(data),
    }), [handleSubmit])

    const formFields = useMemo(() => {
        return form.values.productorder_set.map((item, index) => (

            <Paper style={{ border: `1px solid #ced4da` }} p='xs' m='lg' key={index} >

                <Text mb='md' >
                    {`Product ${index + 1}`}
                </Text>


                <Group>
                    <NativeSelect
                        radius='md'
                        icon={<IconUser />}
                        label='Name'
                        placeholder="Select product name"
                        data={form.values.customer !== '' ? customer.filter(cust => cust.id === parseInt(form.values.customer))[0].ppic_product_related.map(product => ({ value: product.id, label: product.name })) : []}

                        {...form.getInputProps(`productorder_set.${index}.product`)}
                    />
                    <TextInput
                        label='Code'
                        radius='md'
                        value={
                            form.values.productorder_set[index].product !== '' ?
                                customer.find(cust => cust.id === parseInt(form.values.customer)).ppic_product_related.find((product) => product.id === parseInt(form.values.productorder_set[index].product)) !== undefined ?
                                    customer.find(cust => cust.id === parseInt(form.values.customer)).ppic_product_related.find((product) => product.id === parseInt(form.values.productorder_set[index].product)).code
                                    : ''
                                : ''
                        }
                        readOnly
                    />

                    <NumberInput
                        radius='md'
                        hideControls
                        icon={<IconCodeAsterix />}
                        label='Quantity order'
                        placeholder="Input quantity"
                        {...form.getInputProps(`productorder_set.${index}.ordered`)}
                    />

                    <ActionIcon color="red" onClick={() => form.removeListItem('productorder_set', index)}>
                        <IconTrash />
                    </ActionIcon>

                </Group>

                <Paper m='lg' >
                    <Text mb='md' >
                        Delivery schedule
                    </Text>
                    {form.values.productorder_set[index].deliveryschedule_set.map((schedule, i) => (
                        <Group key={`${i}${i}`}  >
                            <NumberInput
                                radius='md'
                                hideControls
                                icon={<IconCodeAsterix />}
                                label='Quantity'
                                placeholder="Input quantity"
                                {...form.getInputProps(`productorder_set.${index}.deliveryschedule_set.${i}.quantity`)}
                            />
                            <DatePicker
                                radius='md'
                                label="Date"
                                placeholder="Pick a date"
                                inputFormat="YYYY-MM-DD"
                                {...form.getInputProps(`productorder_set.${index}.deliveryschedule_set.${i}.date`)}

                                icon={<IconCalendar />}
                            />
                            <ActionIcon color="red" mt='lg' onClick={() => form.removeListItem(`productorder_set.${index}.deliveryschedule_set`, i)}  >
                                <IconTrash />
                            </ActionIcon>
                        </Group>
                    ))}
                </Paper>

                <Button
                    radius='md'
                    mt='sm'
                    ml='lg'
                    color='indigo'
                    leftIcon={<IconCalendarPlus />}
                    onClick={() => form.insertListItem(`productorder_set.${index}.deliveryschedule_set`, { quantity: 0, date: '' })}

                >
                    Add schedule</Button>
            </Paper>
        ))
    }, [form, customer])


    return (
        <>

            <BreadCrumb links={breadcrumb} />
            <Loading />
            <Title className={classes.title} >
                New sales order
            </Title>

            <form id='formAddSo' onSubmit={form.onSubmit(openModal)} >

                <Stack spacing='xs' >

                    <NativeSelect
                        icon={<IconUser />}
                        label='Customer'
                        placeholder="Select customer name"
                        data={customer.map(customer => ({ value: customer.id, label: customer.name }))}
                        {...form.getInputProps('customer')}
                        radius='md'
                    />

                    <TextInput
                        icon={<IconCodeAsterix />}
                        label='Sales Order Code'
                        placeholder="Input a code"
                        {...form.getInputProps('code')}
                        radius='md'
                    />

                    <DatePicker
                        radius='md'
                        label="Date"
                        placeholder="Pick a date"
                        inputFormat="YYYY-MM-DD"
                        {...form.getInputProps('date')}
                        icon={<IconCalendar />}
                    />
                </Stack>


                {formFields}
                {formFields.length === 0 && (
                    <Text color='dimmed' align="center" m='md'  >
                        No product
                    </Text>
                )}
            </form>
            <Button
                radius='md'
                color='indigo'
                leftIcon={<IconClipboardPlus />}
                onClick={() => form.insertListItem('productorder_set', {
                    ordered: 0,
                    delivered: 0,
                    product: '',
                    done: false,
                    deliveryschedule_set: [
                        {
                            quantity: 0,
                            date: ''
                        }
                    ]
                })}

            >Add product</Button>
            <Center mt='lg' >
                <Button
                    leftIcon={<IconDownload />}
                    type="submit"
                    form='formAddSo'
                    radius='md'

                >
                    Save
                </Button>
            </Center>

        </>
    )
}


export default NewSalesOrder

