import React, { useMemo, useCallback } from "react";
import { FullNameMonths } from "../../services";
import DeliveryNoteFormat from "./DeliveryNoteFormat";

const DeliveryNoteReport = ({
    data,
    vehicleNumber,
    driverName,
    productDeliveryList,
    customer
}) => {


    const { code, date } = data

    const [customerName, customerAddress] = useMemo(() => {
        const { name, address } = customer
        return [name, address]

    }, [customer])


    const deliveryDate = useMemo(() => {

        if (date !== '') {
            const day = date.getDate()
            const month = date.getMonth()
            const year = date.getFullYear()
            const monthName = FullNameMonths[month]
            return `${day} ${monthName} ${year}`
        }

        return ''

    }, [date])

    const salesOrderNumberCheck = useCallback((firstSalesNumber, restProductDelivery) => {

        for (const pDeliver of restProductDelivery) {
            const { product_order } = pDeliver
            const { sales_order } = product_order
            const { code } = sales_order
            if (code !== firstSalesNumber) {
                return null
            }
        }

        return firstSalesNumber

    }, [])

    const getSalesOrderNumber = useCallback(() => {

        if (productDeliveryList[0]) {
            const firstProductDeliver = productDeliveryList[0]
            const { product_order } = firstProductDeliver
            const { sales_order } = product_order
            const { code } = sales_order
            return salesOrderNumberCheck(code, productDeliveryList.slice(1))
        }
        return null

    }, [productDeliveryList, salesOrderNumberCheck])

    const salesOrderNumber = useMemo(() => {
        //if sales order number is not null, it means all delivery belongs to that sales order
        return getSalesOrderNumber()
    }, [getSalesOrderNumber])

    const rows = useMemo(() => {
        return productDeliveryList.map((productDelivery, index) => {
            const { product_order, description, quantity, id } = productDelivery
            const { product } = product_order
            const { name, code } = product
            const no = index + 1

            return (
                <tr
                    key={id}
                >
                    <td
                        style={{
                            textAlign: 'center'
                        }}
                    >{no}</td>
                    <td>{code}</td>
                    <td>{name}</td>
                    <td>{quantity}</td>
                    <td>{description}</td>
                </tr>
            )

        })
    }, [productDeliveryList])

    return (
        <DeliveryNoteFormat
            companyAddress={customerAddress}
            companyName={customerName}
            salesOrderNumber={salesOrderNumber}
            deliveryNumber={code}
            deliveryDate={deliveryDate}
            rows={rows}
            driverName={driverName}
            vehicleNumber={vehicleNumber}
        />
    )
}

export default DeliveryNoteReport
