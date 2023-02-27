
import { TextInput, Group, SegmentedControl, Button, NumberInput, Center, Box, Text } from "@mantine/core";
import { IconCalendarEvent, IconClipboardCheck, IconCodeAsterix, IconUserCheck, IconReceiptTax, IconDiscount2, IconCalendar, IconCircleDotted, IconShieldLock, IconChecks, IconSum, IconDiscountCheck, IconDiscount, IconReceipt, IconChecklist, IconPrinter, IconCornerDownRightDouble } from "@tabler/icons";
import React, { useState } from "react";

import { DatePicker } from "@mantine/dates";
import { openModal } from "@mantine/modals";

import { InvoiceReport } from "../../../outputs";
import { ActionButtons, PriceTextInput } from '../../../custom_components'



const ModalInvoice = ({ printInvoice }) => {
    const [sentencesPrice, setSentencesPrice] = useState('')
    return (
        <>
            <TextInput
                label='Jumlah terbilang'
                placeholder="Masukkan jumlah terbilang"
                radius='md'
                value={sentencesPrice}
                icon={<IconReceipt />}
                onChange={e => setSentencesPrice(e.target.value)}
            />

            <Button
                onClick={() => printInvoice(sentencesPrice)}
                radius='md'
                fullWidth
                leftIcon={<IconCornerDownRightDouble />}
                disabled={sentencesPrice === '' || sentencesPrice === undefined}
                my='md'
            >
                Submit
            </Button>
        </>
    )
}


const DetailComponentInvoice = ({
    customer,
    salesOrder,
    handleClickEditButton,
    editAccess,
    currentStatusInvoice,
    handleClickDeleteButton,
    handleSubmit,
    handleChangeStatus,
    form,
    priceCalculation,
    detailInvoice,
    productInvoiceList
}) => {

    const { code, date } = salesOrder
    const { name } = customer
    const { subTotal, totalDiscount, totalPriceAfterDiscount, totalTax, totalInvoice } = priceCalculation

    const printInvoice = (sentences) => openModal({
        size: 'auto%',
        radius: 'md',
        children: <InvoiceReport
            customer={customer}
            salesOrder={salesOrder}
            detailInvoice={detailInvoice}
            productInvoiceList={productInvoiceList}
            priceCalculation={priceCalculation}
            sentencesPrice={sentences}
        />,
        centered: true
    })


    const openModalPrintInvoice = () => {

        openModal({
            size: 'xl',
            radius: 'md',
            children: (
                <ModalInvoice printInvoice={printInvoice} />
            )

        })
    }

    return (
        <>
            <Group position="apart" my='md' >


                <SegmentedControl
                    value={currentStatusInvoice}
                    onChange={handleChangeStatus}
                    data={[
                        {
                            value: 'pending', label: (
                                <Center>
                                    <IconCircleDotted />
                                    <Box ml={10} >Pending</Box>
                                </Center>
                            ),
                            disabled: currentStatusInvoice === 'closed'
                        },
                        {
                            value: 'done', label: (
                                <Center>
                                    <IconChecks />
                                    <Box ml={10} >Finished</Box>
                                </Center>
                            ),
                            disabled: currentStatusInvoice === 'closed'
                        },
                        {
                            value: 'closed', label: (
                                <Center>
                                    <IconShieldLock />
                                    <Box ml={10} >Closed</Box>
                                </Center>
                            ),
                            disabled: currentStatusInvoice !== 'done'
                        }
                    ]}
                    color='blue'
                    size='xs'
                    radius='md'
                />

                <ActionButtons
                    formId='formEditInvoice'
                    formState={form.isDirty()}
                    editAccess={editAccess}
                    handleClickEditButton={handleClickEditButton}
                    handleClickDeleteButton={handleClickDeleteButton}
                />

            </Group>

            <form id='formEditInvoice' onSubmit={form.onSubmit(handleSubmit)} >

                <TextInput
                    label='Customer name'
                    variant="filled"
                    radius='md'
                    m='xs'
                    icon={<IconUserCheck />}
                    value={name}
                    readOnly
                />

                <TextInput
                    icon={<IconClipboardCheck />}
                    label='Sales order number'
                    radius='md'
                    m='xs'
                    readOnly
                    variant='filled'
                    value={code}
                />

                <TextInput
                    variant="filled"
                    radius='md'
                    m='xs'
                    readOnly
                    label='Sales order date'
                    icon={<IconCalendarEvent />}
                    value={new Date(date).toDateString()}
                />

                <TextInput
                    {...form.getInputProps('code')}
                    label='Invoice number'
                    readOnly={!editAccess}
                    placeholder="Input invoice number"
                    radius='md'
                    m='xs'
                    icon={<IconCodeAsterix />}
                />


                <DatePicker
                    label='Date'
                    m='xs'
                    placeholder="Pick invoice date"
                    radius='md'
                    disabled={!editAccess}
                    icon={<IconCalendar />}
                    {...form.getInputProps('date')}
                />

                <Group
                    grow
                    m='xs'
                >

                    <NumberInput
                        label='Ppn'
                        placeholder="Input ppn dalam persen"
                        radius='md'
                        required
                        min={0}
                        disabled={!editAccess}
                        hideControls
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
                        min={0}
                        required
                        hideControls
                        disabled={!editAccess}
                        rightSection={<Text size='sm' color='dimmed' >
                            %
                        </Text>}
                        icon={<IconDiscount2 />}
                        {...form.getInputProps('discount')}
                    />

                </Group>

            </form>


            <Group
                m='xs'
                grow
            >
                <PriceTextInput
                    icon={<IconSum />}
                    label='Sub total'
                    variant='filled'
                    value={subTotal}
                    readOnly
                />

                <PriceTextInput
                    label='Total discount'
                    variant='filled'
                    readOnly
                    icon={<IconDiscount />}
                    value={totalDiscount}
                />

                <PriceTextInput
                    icon={<IconDiscountCheck />}
                    label='Pembayaran'
                    variant='filled'
                    readOnly
                    value={totalPriceAfterDiscount}
                />

            </Group>

            <Group
                m='xs'
                grow
            >

                <PriceTextInput
                    label='PPN'
                    variant='filled'
                    value={totalTax}
                    readOnly
                />

                <PriceTextInput
                    icon={<IconChecklist />}
                    label='Total'
                    variant='filled'
                    value={totalInvoice}
                    readOnly
                />



            </Group>

            <Button
                onClick={openModalPrintInvoice}
                radius='md'
                leftIcon={<IconPrinter />}
                fullWidth
                my='md'
            >
                Print invoice
            </Button>

        </>
    )
}

export default DetailComponentInvoice
