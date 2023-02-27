import React, { useMemo } from "react";
import { FullNameMonths } from "../../services";
import DeliveryNoteFormat from "./DeliveryNoteFormat";

const DeliveryNoteSubcontReport = (
    {
        supplier,
        productDeliveryList,
        vehicleNumber,
        driverName,
        data,
    }
) => {


    const { code, date } = data

    const [supplierName, supplierAddress] = useMemo(() => {
        const { name, address } = supplier
        return [name, address]

    }, [supplier])


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


    const rows = useMemo(() => {
        return productDeliveryList.map((productDelivery, index) => {
            const { product, id, quantity, description } = productDelivery
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
        <>

            <DeliveryNoteFormat
                companyAddress={supplierAddress}
                companyName={supplierName}
                deliveryNumber={code}
                deliveryDate={deliveryDate}
                rows={rows}
                driverName={driverName}
                vehicleNumber={vehicleNumber}
            />
        </>
    )
}

export default DeliveryNoteSubcontReport