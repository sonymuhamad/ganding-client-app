import React, { useMemo } from "react";
import jsPDF from "jspdf";
import { Table, Text, Paper, Group, Image, Divider, Button } from "@mantine/core";
import { DeliveryReportStyle } from "../../styles";
import html2canvas from "html2canvas";
import { IconPrinter } from "@tabler/icons";
import { FullNameMonths } from "../../services";



const DeliveryReport = ({ productOrderList, noSalesOrder, salesOrderDate, customerName }) => {

    const { classes } = DeliveryReportStyle()

    const printPDF = async () => {
        const doc = new jsPDF("portrait", "pt", "a4")
        const data = await html2canvas(document.querySelector('#pdf'))
        const img = data.toDataURL("image/png")
        const imgProperties = doc.getImageProperties(img)
        const pdfWidth = doc.internal.pageSize.getWidth()
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

        doc.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight)
        doc.save(`${noSalesOrder}${salesOrderDate.toLocaleDateString()}.pdf`)

    }

    const rows = useMemo(() => {

        /// loop through product order, get total product delivery and loop though each product delivery


        let count = 0
        return productOrderList.map(productOrder => {
            const { productdelivercustomer_set, total_deliver, product } = productOrder
            const { name, code } = product

            const productDeliver = productdelivercustomer_set.map((pDeliver, index) => {
                const { delivery_note_customer, quantity } = pDeliver
                const date = new Date(delivery_note_customer.date)
                count += 1
                return (
                    <tr key={index}  >
                        <td>{count}</td>
                        <td>{delivery_note_customer.code}</td>
                        <td>{noSalesOrder}</td>
                        <td>{name}</td>
                        <td>{code}</td>
                        <td>{`${date.getDate()} ${FullNameMonths[date.getMonth()]} ${date.getFullYear()}`}</td>
                        <td>{quantity}</td>
                    </tr>
                )
            })

            return (
                <>
                    {productDeliver}

                    <tr>
                        <td colSpan={6}
                            style={{
                                textAlign: 'center',
                            }}
                        >TOTAL</td>
                        <td>{total_deliver}</td>
                    </tr>
                </>
            )

        })

    }, [productOrderList, noSalesOrder])

    return (
        <>

            <div
                id='pdf'
                style={{
                    padding: 10
                }}
            >

                <Paper
                    withBorder
                    p='xs'
                    style={{
                        border: '1px solid black',
                    }}
                >
                    <div
                        style={{
                            display: 'flex'
                        }}
                    >

                        <div
                            style={{
                                width: '25%',
                            }}
                        >

                            <Image src="/logo.png" radius='xl' className={classes.image} />

                            <Text >
                                PT GANDING TOOLSINDO
                            </Text>
                        </div>

                        <div
                            style={{
                                width: '50%',
                                textAlign: 'center',
                                border: '1px solid black',
                                borderLeft: '2px solid black',
                                borderBottom: '2px solid black',
                            }}

                        >
                            <h1
                                style={{
                                    fontWeight: 250
                                }}
                            >
                                REKAP DELIVERY
                            </h1>
                        </div>

                        <div
                            style={{
                                width: '25%',
                                display: 'flex'
                            }}
                        >
                            <div
                                style={{
                                    border: '1px solid black',
                                    width: '45%'
                                }}
                            ></div>

                            <div

                                style={{
                                    border: '1px solid black',
                                    width: '45%'
                                }}
                            ></div>

                            <div

                                style={{
                                    border: '1px solid black',
                                    width: '50%'
                                }}
                            ></div>

                        </div>

                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >

                        <div>
                            <Text>
                                Customer : {customerName}
                            </Text>
                        </div>


                        <div
                            style={{
                                width: '25%',
                                display: 'flex'
                            }}
                        >
                            <div
                                style={{
                                    border: '1px solid black',
                                    width: '45%',
                                    borderLeft: '2px solid black'
                                }}
                            >
                                <Text
                                    size='sm'
                                    align="center"
                                >
                                    DIBUAT
                                </Text>
                            </div>

                            <div

                                style={{
                                    border: '1px solid black',
                                    width: '45%'
                                }}
                            >
                                <Text
                                    size='sm'
                                    align="center"
                                >
                                    DI KETAHUI
                                </Text>
                            </div>

                            <div

                                style={{
                                    border: '1px solid black',
                                    width: '50%'
                                }}
                            >
                                <Text
                                    size='sm'
                                    align="center"
                                >
                                    DISETUJUI
                                </Text>
                            </div>

                        </div>



                    </div>

                    <Group position="left" >
                        <Text>
                            BULAN :
                        </Text>
                        {salesOrderDate &&
                            <Text>
                                {FullNameMonths[salesOrderDate.getMonth()]} {salesOrderDate.getFullYear()}
                            </Text>
                        }
                    </Group>

                    <Group position="left" >
                        <Text>
                            PO NO :
                        </Text>
                        <Text>
                            {noSalesOrder}
                        </Text>
                    </Group>

                    <Divider my={2} color='dark.8' />
                    <Table
                        withBorder
                        style={{
                            border: '1px solid black',
                        }}
                    >
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>NO SURAT JALAN</th>
                                <th>NO PO</th>
                                <th>NAMA PART</th>
                                <th>NOMOR PART</th>
                                <th>TANGGAL KIRIM</th>
                                <th>QTY</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows}
                        </tbody>

                    </Table>


                </Paper>

            </div>


            <Button
                onClick={printPDF}
                radius='md'
                leftIcon={<IconPrinter />}
                fullWidth
                mt='lg'
                mb='md'
            >
            </Button>

        </>
    )
}

export default DeliveryReport
