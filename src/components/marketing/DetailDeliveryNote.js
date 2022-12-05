import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useRequest } from "../../hooks";
import { useForm } from "@mantine/form";
import { TextInput, Textarea, Button, Text, Title, Group } from "@mantine/core";
import { IconPackgeExport, IconFileDollar, IconAssembly, IconStatusChange, IconQrcode, IconUserCircle, IconClock2, IconCar, IconUser, IconNotes } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import BreadCrumb from "../BreadCrumb";
import { customStyle } from '../../styles'



const DetailDeliveryNote = () => {

    const { classes } = customStyle()
    const { Retrieve, Put, Loading } = useRequest()
    const params = useParams()
    const [productDeliver, setProductDeliver] = useState([])

    const breadcrumb = [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/delivery-note',
            label: 'Delivery note'
        },
        {
            path: `/home/marketing/delivery-note/${params.deliverynoteId}`,
            label: 'Detail'
        }
    ]

    const form = useForm({
        initialValues: {
            customer: '',
            code: '',
            created: '',
            driver: '',
            note: '',
            vehicle: ''
        }
    })

    useEffect(() => {

        const fetch = async () => {

            try {
                const { productdelivercustomer_set, ...dn } = await Retrieve(params.deliverynoteId, 'delivery-notes')
                dn.created = new Date(dn.created).toString()
                form.setValues(dn)
                setProductDeliver(productdelivercustomer_set)

            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [Retrieve, params.deliverynoteId])


    const handleStatusChange = useCallback(async (id) => {
        const [certainPdeliver] = productDeliver.filter((pdeliver) => pdeliver.id === id)
        certainPdeliver.paid = !certainPdeliver.paid

        try {
            await Put(id, certainPdeliver, 'productdelivery-management-put')
        } catch (e) {
            console.log(e)
        }

    }, [productDeliver, Put])

    const openModal = useCallback((id) => openConfirmModal({
        title: `Change invoice status `,
        children: (
            <Text size="sm">
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, change', cancel: "No, don't change it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleStatusChange(id),
    }), [handleStatusChange])

    return (
        <>

            <Loading />

            <BreadCrumb links={breadcrumb} />

            <Title className={classes.title} >
                Detail delivery note
            </Title>
            <p>
                This page contains every detail of delivery note, and access to change paid status
            </p>

            <TextInput
                variant="unstyled"
                m='xs'
                readOnly
                label='Sent to'
                icon={<IconUserCircle />}
                {...form.getInputProps('customer.name')}
            />
            <TextInput
                variant="unstyled"
                m='xs'
                readOnly
                label='Delivery code'
                icon={<IconQrcode />}
                {...form.getInputProps('code')}
            />
            <TextInput
                variant="unstyled"
                m='xs'
                readOnly
                label='Created at'
                icon={<IconClock2 />}
                {...form.getInputProps('created')}
            />

            <TextInput
                variant="unstyled"
                m='xs'
                readOnly
                label='Driver name'
                icon={<IconUser />}
                {...form.getInputProps('driver.name')}
            />
            <TextInput
                variant="unstyled"
                m='xs'
                readOnly
                label='Vehicle licence number'
                icon={<IconCar />}
                {...form.getInputProps('vehicle.license_part_number')}
            />

            <Textarea
                variant="unstyled"
                readOnly
                label='Note'
                icon={<IconNotes />}
                {...form.getInputProps('note')}
            />


            <Title mt='xl' ml='md' className={classes.titleChild} >
                Products
            </Title>
            {productDeliver.map((pdeliver) => {

                return (
                    <Group
                        key={pdeliver.id}
                        m='xs'
                        style={{ backgroundColor: pdeliver.paid ? '#b2f2bb' : '#ffc9c9' }}
                        radius='md' >

                        <TextInput icon={<IconAssembly />}
                            m='xs'
                            radius='md'
                            label='Product'
                            defaultValue={pdeliver.product_order.product.name}
                            readOnly
                        />
                        <TextInput icon={<IconPackgeExport />}
                            m='xs'
                            radius='md'
                            label='Delivered'
                            readOnly
                            defaultValue={pdeliver.quantity}
                        />
                        <TextInput icon={<IconFileDollar />}
                            m='xs'
                            radius='md'
                            label='Invoice Status'
                            readOnly
                            defaultValue={pdeliver.paid ? 'Finished' : 'Pending'}
                        />
                        <Button
                            mt='lg'
                            radius='md'
                            leftIcon={<IconStatusChange />}
                            onClick={() => openModal(pdeliver.id)}
                        >
                            change paid status
                        </Button>
                    </Group>
                )
            })}

        </>
    )
}


export default DetailDeliveryNote

