import React, { useMemo } from "react"
import jsPDF from "jspdf"
import { Divider, Table, Title, Image, Text, Button, Group } from "@mantine/core"
import { ReportStyle } from "../../styles"
import html2canvas from "html2canvas"
import { FullNameMonths } from "../../services"
import { IconPrinter } from "@tabler/icons"
import { TextPrice } from '../layout'


const InvoiceReport = ({ customer,
    salesOrder,
    detailInvoice,
    productInvoiceList,
    priceCalculation,
    sentencesPrice
}) => {

    const { classes } = ReportStyle()

    const { name, address } = customer
    const { code, date, tax } = detailInvoice

    const { subTotal, totalDiscount, totalPriceAfterDiscount, totalTax, totalInvoice } = priceCalculation

    const rows = useMemo(() => (productInvoiceList.map((productInvoice, index) => {

        const no = index + 1
        const { product, id, quantity, price } = productInvoice
        const { name, code } = product
        const totalPrice = quantity * price

        return (
            <tr key={id}>
                <td>{no}</td>
                <td>{name}</td>
                <td>{code}</td>
                <td>{quantity}</td>
                <td><TextPrice price={price} /></td>
                <td><TextPrice price={totalPrice} /></td>
            </tr>
        )
    }

    )
    ), [productInvoiceList]);


    const printPDF = async () => {
        const doc = new jsPDF("portrait", "pt", "a4")
        const data = await html2canvas(document.querySelector('#pdf'))
        const img = data.toDataURL("image/png")
        const imgProperties = doc.getImageProperties(img)
        const pdfWidth = doc.internal.pageSize.getWidth()
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

        doc.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight)
        doc.save(`${code}${date.toLocaleDateString()}.pdf`)

    }

    return (
        <>
            <div id="pdf"
                style={{
                    justifyContent: 'center',
                    padding: '25px'
                }} >

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        paddingLeft: '18%'
                    }}
                >

                    <Image src="/logo.png" radius='xl' className={classes.image} />

                    <div>

                        <h2
                            style={{
                                textAlign: 'center'
                            }}
                        >PT. GANDING TOOLSINDO</h2>

                        <div>
                            <Text size='xs' style={{ textAlign: 'center' }}>Jl. Raya Serang Cibarusah No.17 Ds. Pasir Randu Cikarang Bekasi</Text>
                            <Text size='xs' style={{ textAlign: 'center' }} > Telp.(021) 89956347 Fax.(021) 89956349</Text>
                        </div>

                    </div>

                </div>


                <Divider mt={5} mb={5} />
                <Divider mt={0} mb={5} />

                <Group
                    position='apart'
                    grow
                    mt={-10}
                >
                    <div style={{
                        paddingRight: 75
                    }} >
                        <h4>
                            {name}
                        </h4>

                        <Text
                            mt='-xs'
                        >
                            {address}
                        </Text>

                    </div>

                    <div
                        style={{
                            marginTop: -40,
                            paddingLeft: 75,
                        }}
                    >
                        <div>

                            <Text>
                                Invoice No &nbsp;: {code}
                            </Text>

                            <Text>
                                Tanggal &nbsp; &nbsp;&nbsp; : {`${date.getDate()} ${FullNameMonths[date.getMonth()]} ${date.getUTCFullYear()}`}
                            </Text>

                            <Text>
                                Po number : {salesOrder.code}
                            </Text>


                        </div>
                    </div>

                </Group>

                <Title mt='sm' order={3} weight={500} underline align="center">
                    INVOICE
                </Title>

                <Table
                    withBorder
                    my='md'
                >

                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Part name</th>
                            <th>Part number</th>
                            <th>Unit</th>
                            <th>Harga/Unit</th>
                            <th>Jumlah</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows}
                    </tbody>

                </Table>


                <Divider mt='xl' mb={5} size='lg' />

                <div
                    style={{
                        justifyContent: 'space-between',
                        display: 'flex'
                    }}
                >
                    <div
                        style={{
                            width: '50%'
                        }}
                    >

                    </div>

                    <div
                        style={{
                            width: '50%'
                        }}
                    >
                        <Group
                            position="apart"
                        >
                            <Text>
                                Sub Total
                            </Text>

                            <TextPrice price={subTotal} />

                        </Group>

                        <Group
                            position="apart"
                        >
                            <Text>
                                Discount
                            </Text>

                            <TextPrice price={totalDiscount} />

                        </Group>

                        <Group
                            position="apart"
                        >
                            <Text>
                                Pembayaran
                            </Text>

                            <TextPrice price={totalPriceAfterDiscount} />

                        </Group>

                        <Group
                            position="apart"
                        >
                            <Text>
                                PPN
                            </Text>
                            <Text>
                                {tax}%
                            </Text>

                            <TextPrice price={totalTax} />

                        </Group>

                    </div>
                </div>

                <Divider mt={5} mb='md' size='lg' />

                <Group
                    position="right"
                >
                    <div>
                        <Group>
                            <Text>
                                Total
                            </Text>

                            <TextPrice price={totalInvoice} />

                        </Group>
                    </div>

                </Group>

                <Text
                    align="right"
                    mt='xs'
                    mb='lg'
                >
                    {sentencesPrice.toUpperCase()}
                </Text>

                <div
                    style={{
                        justifyContent: 'space-between',
                        display: 'flex'
                    }}
                >

                    <div
                        style={{
                            width: '50%',
                            textAlign: 'center'
                        }}
                    >
                        <h4>
                            Penerima
                        </h4>

                    </div>

                    <div
                        style={{
                            width: '50%',
                            justifyContent: 'flex-start',
                            paddingLeft: '7%'
                        }}
                    >
                        <h4>
                            PT. GANDING TOOLSINDO
                        </h4>
                    </div>


                </div>


                <div
                    style={{
                        justifyContent: 'space-between',
                        display: 'flex',
                        marginTop: 150,
                    }}
                >

                    <div
                        style={{
                            width: '50%',
                            textAlign: 'center'
                        }}
                    >
                        <h4>
                            Tandatangan & Stamp
                        </h4>

                    </div>

                    <div
                        style={{
                            width: '50%',
                            justifyContent: 'flex-start',
                            paddingLeft: '8.5%'
                        }}
                    >
                        <h4>
                            Tandatangan & Stamp
                        </h4>
                    </div>


                </div>

                <Text
                    mt='sm'
                >
                    Note
                </Text>

                <Text
                    pl='md'
                >
                    Payment to.
                </Text>
                <Text
                    pl='xl'
                >
                    Bank MANDIRI Cabang Cikarang
                </Text>
                <Text
                    pl='xl'
                >
                    Account no. 1560002410308
                </Text>
                <Text
                    pl='md'
                >
                    a/n PT. GANDING TOOLSINDO
                </Text>


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

export default InvoiceReport