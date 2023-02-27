
import { ActionButtons, ReadOnlyTextInput } from "../../../custom_components"
import { TextInput, Group, HoverCard, Text, SegmentedControl, Box, Center, Button, Badge, Textarea, NumberInput } from "@mantine/core"
import { IconChecks, IconUserCheck, IconReceiptTax, IconDiscount2, IconCircleDotted, IconCheck, IconClipboard, IconFolderOff, IconPrinter, IconShieldLock, IconCodeAsterix, IconShoppingCart, IconCalendar } from "@tabler/icons"
import { DatePicker } from '@mantine/dates'

const SectionDetailPurchaseOrder = (
    {
        completeStatus,
        handleChangeStatus,
        statusOfPurchaseOrder,
        hoverMessage,
        editAccess,
        form,
        handleEditPurchaseOrder,
        amountOfMaterialOrdered,
        handleClickDeleteButton,
        handleClickEditButton,
        supplierName,
        handleClickPrintButton,
    }
) => {


    return (
        <>


            <Group position='apart' mt='md' mb='md'  >

                <HoverCard
                    width={200}
                    shadow='md'
                >
                    <HoverCard.Target>
                        <SegmentedControl
                            value={completeStatus}
                            onChange={handleChangeStatus}
                            data={[
                                {
                                    value: 'incomplete', label: (
                                        <Center>
                                            <IconCircleDotted />
                                            <Box ml={10} >In progress</Box>
                                        </Center>
                                    ),
                                    disabled: completeStatus === 'closed'
                                },
                                {
                                    value: 'complete', label: (
                                        <Center>
                                            <IconChecks />
                                            <Box ml={10} >Completed</Box>
                                        </Center>
                                    ),
                                    disabled: statusOfPurchaseOrder || completeStatus === 'closed'
                                },
                                {
                                    value: 'closed', label: (
                                        <Center>
                                            <IconShieldLock />
                                            <Box ml={10} >Closed</Box>
                                        </Center>
                                    ),
                                    disabled: completeStatus === 'incomplete'
                                }
                            ]}
                            color='blue'
                            size='xs'
                            radius='md'
                        />
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <Text size="sm">
                            {hoverMessage}
                        </Text>
                    </HoverCard.Dropdown>
                </HoverCard>

                <ActionButtons
                    editAccess={editAccess}
                    formState={form.isDirty()}
                    handleClickDeleteButton={handleClickDeleteButton}
                    formId='formEditPurchaseOrder'
                    handleClickEditButton={handleClickEditButton}
                />

            </Group>

            <form id='formEditPurchaseOrder' onSubmit={form.onSubmit(handleEditPurchaseOrder)} >

                <ReadOnlyTextInput
                    label='Supplier'
                    m='xs'
                    icon={<IconUserCheck />}
                    value={supplierName}
                />

                <Group grow m='xs' >

                    <TextInput
                        required
                        label='Purchase order number'
                        placeholder="Input purchase order number"
                        radius='md'
                        readOnly={!editAccess}
                        icon={<IconCodeAsterix />}
                        {...form.getInputProps('code')}
                    />

                    <DatePicker
                        label='Order date'
                        placeholder="Pick order date"
                        radius='md'
                        disabled={!editAccess}
                        icon={<IconCalendar />}
                        {...form.getInputProps('date')}
                    />

                </Group>

                <Group grow m='xs' >

                    <NumberInput
                        label='Ppn'
                        placeholder="Input ppn dalam persen"
                        radius='md'
                        min={0}
                        hideControls
                        disabled={!editAccess}
                        rightSection={<Text size='sm' color='dimmed' >
                            %
                        </Text>}
                        icon={<IconReceiptTax />}
                        {...form.getInputProps('tax')}
                    />

                    <NumberInput
                        label='Discount'
                        placeholder="Input discount dalam persen"
                        radius='md'
                        disabled={!editAccess}
                        min={0}
                        hideControls
                        rightSection={<Text size='sm' color='dimmed' >
                            %
                        </Text>}
                        icon={<IconDiscount2 />}
                        {...form.getInputProps('discount')}
                    />


                    <ReadOnlyTextInput
                        label='Number of material ordered'
                        icon={<IconShoppingCart />}
                        m='xs'
                        value={amountOfMaterialOrdered}
                    />

                </Group>

                <Textarea
                    label='Keterangan'
                    placeholder="Input keterangan"
                    readOnly={!editAccess}
                    m='xs'
                    radius='md'
                    icon={<IconClipboard />}
                    {...form.getInputProps('description')}
                />

                <Group m='sm' >

                    <Badge
                        fullWidth
                        leftSection={completeStatus === 'complete' ?
                            <IconChecks /> : amountOfMaterialOrdered === 0 ? <IconFolderOff /> :
                                statusOfPurchaseOrder ?
                                    <IconCircleDotted /> :
                                    <IconCheck />}

                        variant='filled'
                        color={completeStatus === 'complete' ?
                            'gray' : amountOfMaterialOrdered === 0 ? 'gray' :
                                statusOfPurchaseOrder ?
                                    'cyan.6' :
                                    'blue.6'}
                    >
                        {completeStatus === 'complete' ?
                            'This purchase order is closed' :
                            amountOfMaterialOrdered === 0 ? "This purchase order doesn't have any material to order" :
                                statusOfPurchaseOrder ?
                                    'Material order is in progress' :
                                    'All material orders have been completed'}</Badge>

                </Group>

            </form>

            <Button
                leftIcon={<IconPrinter />}
                onClick={handleClickPrintButton}
                radius='md'
                fullWidth
                my='lg'
            >
                Print
            </Button>

        </>
    )

}

export default SectionDetailPurchaseOrder