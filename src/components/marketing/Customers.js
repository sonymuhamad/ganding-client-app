import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useForm } from '@mantine/form'
import { Text, Button, Modal, TextInput, Group, Textarea, NumberInput } from '@mantine/core'
import DataTable from 'react-data-table-component'

import { IconPlus, IconDotsCircleHorizontal, IconAt, IconDeviceMobile, IconMapPin, IconSquarePlus, IconUserPlus } from '@tabler/icons'


import { customTableStyle } from '../../services/External'
import BreadCrumb from '../BreadCrumb'
import { FailedNotif, SuccessNotif } from '../notifications/Notifications'
import { useRequest } from '../../hooks/useRequest'
import { customerPageStyle } from '../../styles/customerPageStyle'


const Customers = () => {

    const { classes } = customerPageStyle()
    const form = useForm({
        initialValues: {
            name: '',
            address: '',
            phone: '',
            email: ''
        }
    })
    const breadcrumb = [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/customers',
            label: 'Customers'
        }
    ]

    const [action, setAction] = useState(0)
    const [opened, setOpened] = useState(false)
    const [dataCustomer, setDataCustomer] = useState([])
    const { Get, Post, Loading, GetAndExpiredTokenHandler } = useRequest()

    const fetch = useCallback(async () => {
        try {
            let data_customers = await GetAndExpiredTokenHandler('customer')

            data_customers = data_customers.map((customer) => {
                return ({ ...customer, detailButton: <Button component={Link} to={`/home/marketing/customers/${customer.id}`} leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />} color='teal.8' variant='subtle' radius='md' >Detail</Button> })
            })

            setDataCustomer(data_customers)
        } catch (e) {

        }
    }
        , [Get])

    useEffect(() => {
        fetch()
    }, [fetch, action])

    const handlesubmit = useCallback(async (data) => {
        // add new customer handle
        try {
            await Post(data, 'customer')
            SuccessNotif('Add customer success')
            form.reset()
            setAction(prev => prev + 1)
            setOpened((o) => !o)
        } catch (e) {
            form.setErrors({ ...e.message.data })
            FailedNotif('Add customer failed')
        }
    }, [Post])

    const column = useMemo(() => [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
        },
        {
            name: 'Email',
            selector: row => row.email,

        },
        {
            name: '',
            selector: row => row.detailButton,
            style: {
                padding: 0,
            }
        }

    ], [])

    return (

        <>
            <Group position='apart' >
                <BreadCrumb links={breadcrumb} />
            </Group>

            <Button
                radius='md'
                size='sm'
                color='blue.6'
                variant='outline'
                leftIcon={<IconPlus stroke={2} size={20} />}
                onClick={() => setOpened(true)}
            >
                <Text size='md' >
                    New Customer
                </Text>
            </Button>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={
                    <Text weight={600} size='md' >
                        Add new customer
                    </Text>
                }
                radius='md'
                size='xl'
            >
                <Loading />
                <form onSubmit={form.onSubmit(handlesubmit)} >

                    <TextInput
                        icon={<IconUserPlus size={15} stroke={2} />}
                        placeholder='Name'
                        label='Name'
                        withAsterisk
                        {...form.getInputProps('name')}

                    />

                    <TextInput
                        icon={<IconAt size={15} stroke={2} />}
                        mt='xs'
                        placeholder='Email'
                        label='Email'
                        withAsterisk
                        {...form.getInputProps('email')}
                        required
                    />

                    <NumberInput
                        icon={<IconDeviceMobile size={15} stroke={2} />}
                        mt='xs'
                        placeholder='Phone'
                        label='Phone'
                        withAsterisk
                        {...form.getInputProps('phone')}
                        required
                    />

                    <Textarea
                        icon={<IconMapPin size={20} stroke={2} />}
                        mt='lg'
                        label='Address'
                        withAsterisk
                        {...form.getInputProps('address')}
                        required
                    />

                    <Button leftIcon={<IconSquarePlus size={17} stroke={2} />} type='submit' color='green' variant='filled' radius='md' mt='lg' fullWidth >Submit</Button>
                </form>

            </Modal>

            <div className={classes.wrapper} >
                <div className={classes.leftDiv} >
                    <DataTable
                        columns={column}
                        data={dataCustomer}
                        customStyles={customTableStyle}
                        highlightOnHover={true}
                        pagination
                        dense

                    />


                </div>



            </div>

        </>

    )

}


export default Customers







