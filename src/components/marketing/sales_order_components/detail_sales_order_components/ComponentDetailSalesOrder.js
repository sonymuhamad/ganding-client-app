import { Group, SegmentedControl, Textarea, Progress, Box, Center, Text, Button, TextInput } from "@mantine/core";

import { IconCircleCheck, IconCircleDotted, IconChecks, IconShieldLock, IconEdit, IconTrashX, IconX, IconCodeAsterix, IconCalendar, IconUser, IconClipboard, IconDownload, IconPrinter } from "@tabler/icons";
import React, { } from "react";

import { DatePicker } from "@mantine/dates";
import { DeliveryReport } from "../../../outputs";
import { openModal } from "@mantine/modals";



const ComponentDetailSalesOrder = ({ form, handleChangeStatus, handleEditSo, handleDeleteSo, customer, percentage, status, editAccess, handleClickEditButton, productOrderList, noSalesOrder, salesOrderDate }) => {

    const { name } = customer
    const openModalPrintDeliveryReport = () => openModal({
        size: 'auto',
        radius: 'md',
        children: <DeliveryReport
            productOrderList={productOrderList}
            noSalesOrder={noSalesOrder}
            salesOrderDate={salesOrderDate}
            customerName={name}
        />
    })

    return (
        <>

            <Group position="apart" my='md' >

                <SegmentedControl
                    value={status}
                    onChange={handleChangeStatus}
                    data={[
                        {
                            value: 'pending', label: (
                                <Center>
                                    <IconCircleDotted />
                                    <Box ml={10} >Pending</Box>
                                </Center>
                            ),
                            disabled: status === 'closed'
                        },
                        {
                            value: 'progress', label: (
                                <Center>
                                    <IconCircleCheck />
                                    <Box ml={10} >In progress</Box>
                                </Center>
                            ),
                            disabled: status === 'closed' || status === 'finished'
                        },
                        {
                            value: 'finished', label: (
                                <Center>
                                    <IconChecks />
                                    <Box ml={10} >Finished</Box>
                                </Center>
                            ),
                            disabled: status === 'closed' || status === 'progress' || status === 'pending'
                        },
                        {
                            value: 'closed', label: (
                                <Center>
                                    <IconShieldLock />
                                    <Box ml={10} >Closed</Box>
                                </Center>
                            ),
                            disabled: status !== 'finished'
                        }
                    ]}
                    color='blue'
                    size='xs'
                    radius='md'
                />



                <Group position="right" >
                    <Button.Group>

                        <Button
                            size='xs'
                            radius='md'
                            color={!editAccess ? 'blue.6' : 'red.6'}
                            onClick={() => handleClickEditButton()}
                            leftIcon={!editAccess ? <IconEdit /> : <IconX />}
                        >
                            {!editAccess ? 'Edit' : 'Cancel'}
                        </Button>

                        <Button
                            form='formEditSo'
                            size='xs'
                            color='blue.6'
                            type='submit'
                            disabled={!form.isDirty()}
                            leftIcon={<IconDownload />} >
                            Save Changes</Button>
                        <Button
                            size='xs'
                            color='red.6'
                            disabled={editAccess}
                            radius='md'
                            onClick={handleDeleteSo}
                            leftIcon={<IconTrashX />} >
                            Delete</Button>
                    </Button.Group>
                </Group>

            </Group>

            <form onSubmit={form.onSubmit(handleEditSo)} id='formEditSo'  >

                <TextInput
                    icon={<IconUser />}
                    label='Customer'
                    readOnly
                    radius='md'
                    m='xs'
                    variant='filled'
                    value={customer.name}
                />

                <TextInput
                    icon={<IconCodeAsterix />}
                    label='Sales order number'
                    radius='md'
                    m='xs'
                    placeholder="Input sales order number"
                    readOnly={!editAccess}
                    {...form.getInputProps('code')}
                />

                <DatePicker
                    label="Date"
                    {...form.getInputProps('date')}
                    disabled={!editAccess}
                    clearable={false}
                    radius='md'
                    m='xs'
                    placeholder="Pick order date"
                    icon={<IconCalendar />}
                />

                <Textarea
                    label='Keterangan'
                    {...form.getInputProps('description')}
                    readOnly={!editAccess}
                    radius='md'
                    m='xs'
                    placeholder="Input keterangan"
                    icon={<IconClipboard />}
                />

            </form>

            <Text size='sm' mt='md' >
                Current progress
            </Text>
            <Progress
                value={percentage}

                label={`${percentage} %`}

                size="xl" radius="xl" />


            <Button
                my='lg'
                leftIcon={<IconPrinter />}
                onClick={openModalPrintDeliveryReport}
                radius='md'
                fullWidth
            >
                Print
            </Button>

        </>
    )
}

export default ComponentDetailSalesOrder
