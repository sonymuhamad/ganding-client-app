import React, { useContext, useMemo, useCallback } from "react";

import { AuthContext } from "../../context";
import { FullNameMonths } from "../../services";
import html2canvas from "html2canvas";
import { IconPrinter } from "@tabler/icons";
import jsPDF from "jspdf";
import { Button, Divider, Image, Table, Text, Title } from "@mantine/core";
import { DeliveryNoteReportStyle } from "../../styles/DeliveryNoteReportStyle";



const DeliveryNoteReport = ({
    data,
    vehicleNumber,
    driverName,
}) => {

    const { classes } = DeliveryNoteReportStyle()
    const { user } = useContext(AuthContext)
    const { username } = user

    const { code, customer, date, productdelivercustomer_set } = data

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

        if (productdelivercustomer_set[0]) {
            const firstProductDeliver = productdelivercustomer_set[0]
            const { product_order } = firstProductDeliver
            const { sales_order } = product_order
            const { code } = sales_order
            return salesOrderNumberCheck(code, productdelivercustomer_set.slice(1))
        }
        return null

    }, [productdelivercustomer_set, salesOrderNumberCheck])

    const salesOrderNumber = useMemo(() => {
        //if sales order number is not null, it means all delivery belongs to that sales order
        return getSalesOrderNumber()
    }, [getSalesOrderNumber])


    const printPDF = async () => {
        const doc = new jsPDF("l", "pt", "a5")
        const data = await html2canvas(document.getElementById('pdf'))
        const img = data.toDataURL("image/png")
        const imgProperties = doc.getImageProperties(img)
        const pdfWidth = doc.internal.pageSize.getWidth()
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

        doc.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight)
        doc.save(`${code}-${deliveryDate}.pdf`)

    }

    const rows = useMemo(() => {
        return productdelivercustomer_set.map((productDelivery, index) => {
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
    }, [productdelivercustomer_set])


    return (
        <>

            <div
                id='pdf'
                style={{
                    padding: 15
                }}
            >

                <div
                    style={{
                        border: '1px solid black',
                        padding: 5
                    }}
                >

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >

                        {/* heading surat jalan */}

                        <div
                            style={{
                                display: 'flex',
                                paddingTop: '2%',
                                justifyContent: 'space-evenly'
                            }}
                        >
                            <Image src="/logo.png" radius='xl' className={classes.image} />

                            <div
                                style={{
                                    textAlign: 'left'
                                }}
                            >

                                <Text
                                    size='xs'
                                >
                                    PT Ganding Toolsindo
                                </Text>

                                <Text
                                    size='xs'
                                >
                                    Jl. Raya Serang No.17 Ds. Pasirandu Cikarang - Bekasi
                                </Text>
                                <Text
                                    size='xs'
                                >
                                    Email : ganding_toolsindo2004@yahoo.com
                                </Text>
                                <Text
                                    size='xs'>
                                    Telp. (021) 89956347 Fax. (021) 89956349
                                </Text>

                            </div>


                        </div>


                        <div
                            style={{
                                border: '1px solid black',
                                padding: 5,
                                fontWeight: 600
                            }}
                        >
                            <Text
                                size='xs'
                            >
                                Kepada Yth.
                            </Text>
                            <Text
                                size='xs'
                            >
                                {customerName}
                            </Text>
                            <Text
                                size='xs'
                            >
                                {customerAddress}
                            </Text>
                        </div>

                    </div>

                    <Divider size='lg' my='sm' color='dark.8' />

                    <Title
                        underline
                        order={3}
                        align='center'
                        mt='sm'
                        mb='md'
                    >
                        Surat Jalan
                    </Title>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text
                            size='xs'
                        >
                            Harap diterima / diberikan barang seperti dibawah ini :
                        </Text>

                        <div
                            style={{
                                border: '1px solid black',
                                paddingTop: 4,
                                paddingBottom: 4,
                                paddingLeft: 20,
                                paddingRight: 20
                            }}
                        >
                            <Text
                                size='xs'
                                style={{
                                    fontWeight: 600
                                }}
                            >
                                {code}
                            </Text>
                        </div>

                    </div>

                    <Table
                        style={{
                            border: '1px solid black',
                            fontWeight: 600
                        }}
                        border={10}
                        fontSize={12}
                        mt='sm'
                        mb='xs'
                    >
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        textAlign: 'center',
                                        fontWeight: 800,
                                        color: '#1A1B1E'
                                    }}
                                >No</th>
                                <th
                                    style={{
                                        textAlign: 'center',
                                        fontWeight: 800,
                                        color: '#1A1B1E'
                                    }}
                                >Part Number</th>
                                <th

                                    style={{
                                        textAlign: 'center',
                                        fontWeight: 800,
                                        color: '#1A1B1E'
                                    }}
                                >Part Name</th>
                                <th

                                    style={{
                                        textAlign: 'center',
                                        fontWeight: 800,
                                        color: '#1A1B1E'
                                    }}
                                >Qty</th>
                                <th

                                    style={{
                                        textAlign: 'center',
                                        fontWeight: 800,
                                        color: '#1A1B1E'
                                    }}
                                >Keterangan</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows}
                        </tbody>

                    </Table>

                    <Text
                        align="center"
                        size='sm'
                        mb='sm'
                        style={{
                            fontWeight: 600
                        }}
                    >
                        {salesOrderNumber}
                    </Text>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontWeight: 600,
                            paddingLeft: 20,
                            paddingRight: 20
                        }}
                    >

                        <Text
                            size='sm'
                        >
                            Cikarang, {deliveryDate}
                        </Text>

                        <Text
                            size='sm'
                        >
                            No.Polisi :  {vehicleNumber}
                        </Text>

                        <Text
                            size='sm'
                        >
                            Driver : {driverName}
                        </Text>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingLeft: 35,
                            paddingRight: 35
                        }}
                    >

                        <Text>
                            Hormat kami,
                        </Text>

                        <Text>
                            Penerima,
                        </Text>

                    </div>

                    <div
                        style={{
                            marginTop: 55,
                            paddingLeft: 50,
                            paddingRight: 50,
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >

                        <Text>
                            {username}
                        </Text>

                        <Text>
                            {`(.........)`}
                        </Text>

                    </div>


                </div>



            </div>



            <Button
                fullWidth
                my='lg'
                radius='md'
                onClick={printPDF}
                leftIcon={<IconPrinter />}
            >

            </Button>

        </>
    )
}

export default DeliveryNoteReport
