import React, { useMemo } from "react";

import { BaseTableExpanded } from "../../../tables";
import { ExpandedDescriptionDelivery } from "../../../layout";
import { Badge, Button } from "@mantine/core";
import { IconPrinter } from "@tabler/icons";

import { DeliveryReport } from "../../../outputs";
import { openModal } from "@mantine/modals";
import { useSearch } from "../../../../hooks";
import { HeadSection, SearchTextInput } from "../../../custom_components";
import { getScheduleState } from "../../../../services";

const ReportDelivery = ({ data, productOrderList, noSalesOrder, salesOrderDate, customerName }) => {

    const { setValueQuery, query, lowerCaseQuery } = useSearch()

    const openModalPrintDeliveryReport = () => openModal({
        size: 'auto',
        radius: 'md',
        children: <DeliveryReport
            productOrderList={productOrderList}
            noSalesOrder={noSalesOrder}
            salesOrderDate={salesOrderDate}
            customerName={customerName}
        />
    })

    const columnProductDelivery = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product_order.product.name,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Delivery number',
            selector: row => row.delivery_note_customer.code,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Delivery date',
            selector: row => row.delivery_note_customer.date,
            sortable: true,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Quantity shipped',
            selector: row => `${row.quantity} Unit`,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: '',
            selector: row => {
                const { schedules, delivery_note_customer } = row
                const { date } = delivery_note_customer
                const { color, label } = getScheduleState(schedules, date)
                return (
                    <Badge color={color} variant='filled' >
                        {label}</Badge>
                )
            },
            style: {
                paddingLeft: 0,
                marginLeft: -30,
                marginRight: 0,
                justifyContent: 'center'
            }

        }

    ], [])


    const filteredProductDelivery = useMemo(() => {

        return data.filter(pdeliver => {
            const { delivery_note_customer, product_order } = pdeliver
            const { product } = product_order
            const { date, code } = delivery_note_customer
            const { name } = product

            return name.toLowerCase().includes(lowerCaseQuery) || product.code.toLowerCase().includes(lowerCaseQuery) || code.toLowerCase().includes(lowerCaseQuery) || date.toLowerCase().includes(lowerCaseQuery)

        })

    }, [lowerCaseQuery, data])

    return (
        <>

            <HeadSection>

                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />

                <Button
                    radius='md'
                    leftIcon={<IconPrinter />}
                    onClick={openModalPrintDeliveryReport}
                >
                    Print
                </Button>

            </HeadSection>

            <BaseTableExpanded
                noData="No data delivery product"
                data={filteredProductDelivery}
                column={columnProductDelivery}
                expandComponent={ExpandedDescriptionDelivery}
            />
        </>
    )
}

export default ReportDelivery
