import { Group, SegmentedControl, Textarea, Progress, Box, Center, Text, TextInput } from "@mantine/core";

import { IconCircleCheck, IconCircleDotted, IconChecks, IconShieldLock, IconCodeAsterix, IconCalendar, IconUser, IconClipboard, } from "@tabler/icons";
import React, { } from "react";

import { DatePicker } from "@mantine/dates";
import { ActionButtons } from "../../../custom_components";



const ComponentDetailSalesOrder = ({ form, handleChangeStatus, handleEditSo, handleClickDeleteButton,
    customerName, percentage, status, editAccess, handleClickEditButton }) => {

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


                <ActionButtons
                    editAccess={editAccess}
                    handleClickEditButton={handleClickEditButton}
                    handleClickDeleteButton={handleClickDeleteButton}
                    formId='formEditSo'
                    formState={form.isDirty()}
                />

            </Group>

            <form onSubmit={form.onSubmit(handleEditSo)} id='formEditSo'  >

                <TextInput
                    icon={<IconUser />}
                    label='Customer'
                    readOnly
                    radius='md'
                    m='xs'
                    variant='filled'
                    value={customerName}
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

        </>
    )
}

export default ComponentDetailSalesOrder
