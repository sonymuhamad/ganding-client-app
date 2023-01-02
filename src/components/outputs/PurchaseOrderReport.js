import React, { useCallback, useMemo, useState } from "react";
import jsPDF from "jspdf";
import { Table, Text, Image, Button } from "@mantine/core"
import html2canvas from "html2canvas";
import { IconPrinter } from "@tabler/icons";
import { FullNameMonths, Months } from "../../services"
import { TextPricePurchaseOrderReport } from "../layout";

import { PurchaseOrderReportStyle } from "../../styles";

const PurchaseOrderReport = ({
    data,
    materialOrderList,
    dataSupplier,
    personInChargeName,
}) => {

    const { classes } = PurchaseOrderReportStyle()
    const { code, date, description, discount, tax } = data
    const { name, address, phone } = dataSupplier
    const [totalAmountPrice, setTotalAmountPrice] = useState(0)
    const doc = new jsPDF("landscape")

    function* range(start, end) {
        for (let i = start; i <= end; i++) {
            yield i;
        }
    }

    const getSubTotalPrice = useCallback(() => {

        const priceDiscount = (discount / 100) * totalAmountPrice
        const priceAfterDiscount = totalAmountPrice - priceDiscount

        return [priceDiscount, priceAfterDiscount]

    }, [discount, totalAmountPrice])

    const getTaxPrice = useCallback((priceAfterDiscount) => {

        const priceTax = (tax / 100) * priceAfterDiscount
        const finalPrice = priceAfterDiscount + priceTax

        return [priceTax, finalPrice]
    }, [tax])

    const [priceDiscount, priceSubtotal, priceTax, finalPrice] = useMemo(() => {
        const [priceDiscount, priceAfterDiscount] = getSubTotalPrice()
        const [priceTax, finalPrice] = getTaxPrice(priceAfterDiscount)

        return [priceDiscount, priceAfterDiscount, priceTax, finalPrice]
    }, [getTaxPrice, getSubTotalPrice])


    const [maxDueDate, scheduleList] = useMemo(() => {

        let maxDueDate = 0
        let maxMaterialOrderScheduled = null

        for (const materialOrder of materialOrderList) {
            const { total_receipt_schedule } = materialOrder
            if (total_receipt_schedule > maxDueDate) {
                maxDueDate = total_receipt_schedule
                maxMaterialOrderScheduled = materialOrder
            }
        }

        if (maxMaterialOrderScheduled) {
            const { materialreceiptschedule_set } = maxMaterialOrderScheduled
            return [maxDueDate, materialreceiptschedule_set]
        }

        return [maxDueDate, []]

    }, [materialOrderList])

    const printPDF = async () => {
        const data = await html2canvas(document.querySelector('#pdf'))
        const img = data.toDataURL("image/png")
        const imgProperties = doc.getImageProperties(img)
        const pdfWidth = doc.internal.pageSize.getWidth()
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

        doc.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight)
        doc.save(`${code}-${date.toLocaleDateString()}.pdf`)

    }

    const getNameAndCodeInTable = useCallback((product, materialName) => {
        let nameValueInTable = ''
        let codeValueInTable = ''

        if (product) {
            const { name, code } = product
            nameValueInTable = name
            codeValueInTable = code
            return [nameValueInTable, codeValueInTable]
        }
        nameValueInTable = materialName
        return [nameValueInTable, codeValueInTable]
    }, [])

    const generatePrice = useCallback((price, totalPcs, totalSheet, totalKg) => {
        let totalPrice
        if (totalKg) {
            totalPrice = totalKg * price
            return [totalPrice, totalPcs, totalSheet, Math.round(totalKg)]
        }

        if (totalSheet) {
            totalPrice = totalKg * price
            return [totalPrice, totalPcs, totalSheet, totalKg]
        }

        totalPrice = totalPcs * price
        return [totalPrice, totalPcs, totalSheet, totalKg]

    }, [])

    const generateData = useCallback((price, weight, uom, ordered) => {
        const { id } = uom
        let totalKg
        let totalPcs
        let totalSheet

        if (id === 1 || id === 2) {
            if (weight) {
                totalKg = ordered * weight
                totalSheet = ordered
                return generatePrice(price, totalPcs, totalSheet, totalKg)
            }
            totalSheet = ordered
            return generatePrice(price, totalPcs, totalSheet, totalKg)
        }

        if (id === 4) {
            totalKg = weight
            return generatePrice(price, totalPcs, totalSheet, totalKg)
        }

        totalPcs = ordered
        return generatePrice(price, totalPcs, totalSheet, totalKg)

    }, [generatePrice])

    const generateTableSchedule = useCallback((materialReceiptSchedule) => {
        let arr = []

        for (const num of range(0, maxDueDate - 1)) {
            const currentSchedule = materialReceiptSchedule[num]
            if (currentSchedule) {
                const { quantity } = currentSchedule
                arr.push(
                    <td key={num + 1} >
                        {quantity}
                    </td>)
                continue
            }
            arr.push(
                <td></td>
            )
        }

        return arr

    }, [maxDueDate])

    const rows = useMemo(() => {

        let amountPrice = 0

        const rowTables = materialOrderList.map((materialOrder, index) => {
            const { material, ordered, price, to_product, materialreceiptschedule_set } = materialOrder
            const { spec, length, width, thickness, uom, name, berat_jenis, weight } = material

            const [nameForTable, codeForTable] = getNameAndCodeInTable(to_product, name)

            const [totalPrice, totalPcs, totalSheet, totalKg] = generateData(price, weight, uom, ordered)
            const i = index + 1
            const tdForSchedule = generateTableSchedule(materialreceiptschedule_set)
            amountPrice += totalPrice

            return (
                <tr
                    key={i}
                    style={{
                        borderBottom: '1px solid black',
                        borderTop: '1px solid black'

                    }}
                >
                    <td>{i}</td>
                    <td>{codeForTable}</td>
                    <td>{nameForTable}</td>
                    <td>{spec}</td>
                    <td>{thickness}</td>
                    <td>{width}</td>
                    <td>{length}</td>
                    <td>{berat_jenis}</td>
                    <td>{uom.name}</td>
                    <td>{weight}</td>
                    <td>{totalPcs}</td>
                    <td>{totalSheet}</td>
                    <td>{totalKg}</td>
                    <td><TextPricePurchaseOrderReport price={price} /></td>
                    <td><TextPricePurchaseOrderReport price={totalPrice} /></td>
                    {tdForSchedule}
                </tr>
            )
        })

        setTotalAmountPrice(amountPrice)

        return rowTables

    }, [getNameAndCodeInTable, materialOrderList, generateData, generateTableSchedule,])



    return (
        <>

            <div
                id='pdf'
                style={{
                    padding: 40
                }}
            >

                <div
                    style={{
                        display: 'flex',
                    }}
                >

                    <div
                        style={{
                            width: '45%',
                            display: 'flex',
                            border: '1px solid black',
                            paddingLeft: 5,

                        }}
                    >

                        <Image src="/logo.png" radius='xl' className={classes.image} />

                        <Text
                            align='center'
                            size='xs'
                            style={{
                                fontWeight: 700,
                                verticalAlign: 'center'
                            }}
                        >
                            PT. GANDING TOOLSINDO Jl. Raya Serang Cibarusah No. 17 Cikarang Bekasi no Tlp (021) 89956347
                        </Text>

                    </div>

                    <div
                        style={{
                            width: '15%',
                            border: '1px solid black',
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: 700,
                            }}
                            size='xs'
                            align="center"
                        >
                            PURCHASE ORDER
                        </Text>

                    </div>

                    <div
                        style={{
                            width: '30%',
                            border: '1px solid black',
                        }}
                    >

                        <Text
                            style={{
                                fontWeight: 700
                            }}
                            size='xs'
                            align="center"
                        >
                            {code}
                        </Text>

                    </div>

                    <div
                        style={{
                            width: '10%',
                            border: '1px solid black',
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: 700
                            }}
                            size='xs'
                            align='center'
                        >
                            {date.getDate()} {FullNameMonths[date.getMonth()]} {date.getFullYear()}
                        </Text>

                    </div>



                </div>

                <div
                    style={{
                        display: 'flex',
                        marginTop: 40
                    }}
                >
                    <div
                        style={{
                            width: '35%',
                            border: '1px solid black'
                        }}
                    >
                        <Text
                            align='center'
                            size='xs'
                            style={{
                                fontWeight: 700
                            }}
                        >
                            SUPPLIER / VENDOR
                        </Text>

                    </div>

                    <div
                        style={{
                            width: '40%',
                            justifyContent: 'space-between',
                            display: 'flex',
                            paddingLeft: 50,
                            paddingRight: 100
                        }}
                    >
                        <div
                            style={{
                                width: '45%',
                                border: '1px solid black'
                            }}
                        >
                            <div>
                                <Text
                                    size='xs'
                                    align="center"
                                    style={{
                                        fontWeight: 600
                                    }}
                                >
                                    SHIP TO
                                </Text>
                            </div>

                        </div>

                        <div
                            style={{
                                width: '45%',
                                border: '1px solid black'
                            }}
                        >
                            <div>
                                <Text
                                    size='xs'
                                    align="center"
                                    style={{
                                        fontWeight: 600
                                    }}
                                >
                                    SUPPLIER
                                </Text>
                            </div>
                        </div>

                    </div>

                    <div
                        style={{
                            width: '25%'
                        }}
                    >
                        <div
                            style={{
                                border: '1px solid black'
                            }}
                        >
                            <Text
                                align="center"
                            >
                                PT. GANDING TOOLSINDO
                            </Text>

                        </div>

                    </div>


                </div>

                <div
                    style={{
                        display: 'flex'
                    }}
                >

                    <div
                        style={{
                            width: '35%',
                            borderBottom: '1px solid black',
                            borderLeft: '1px solid black',
                            borderRight: '1px solid black',
                        }}
                    >

                        {/* supplier / vendor */}
                        <Text
                            size='xs'
                            style={{
                                fontWeight: 700
                            }}
                        >
                            {/* supplier name */}

                            {name}
                        </Text>

                        <Text
                            size='xs'
                        >
                            {/* address */}
                            {address}
                        </Text>

                        <Text
                            size='xs'
                        >
                            {/* no phone */}
                            Telp: {phone}
                        </Text>

                        <Text
                            size='xs'
                            mb='sm'
                        >
                            {/* atas nama */}
                            {personInChargeName}
                        </Text>

                    </div>

                    <div
                        style={{
                            width: '40%',
                            justifyContent: 'space-between',
                            display: 'flex',
                            paddingLeft: 50,
                            paddingRight: 100
                        }}
                    >

                        <div
                            style={{
                                borderLeft: '1px solid black',
                                width: '45%',
                                borderRight: '1px solid black',
                                borderBottom: '1px solid black'
                            }}
                        >
                            {/* ship to */}
                        </div>

                        <div
                            style={{
                                borderBottom: '1px solid black',
                                width: '45%',
                                borderRight: '1px solid black',
                                borderLeft: '1px solid black'
                            }}
                        >
                            {/* supplier */}

                            <div
                                style={{
                                    height: '20%',
                                    width: '100%',
                                    borderBottom: '1px solid black'
                                }}
                            >
                                {/* approved */}
                                <Text
                                    size='xs'
                                    align="center"
                                >
                                    Approved
                                </Text>
                            </div>

                            <div
                                style={{
                                    height: '60%'
                                }}
                            >

                            </div>

                            <div
                                style={{
                                    borderTop: '1px solid black',
                                    height: '20%'
                                }}
                            >

                            </div>

                        </div>

                    </div>


                    <div
                        style={{
                            width: '25%',
                            display: 'flex',
                        }}
                    >

                        <div
                            style={{
                                width: '40%',
                                borderBottom: '1px solid black',
                                borderRight: '1px solid black',
                                borderLeft: '1px solid black'
                            }}
                        >

                            <div
                                style={{
                                    height: '20%',
                                    borderBottom: '1px solid black'
                                }}
                            >
                                <Text
                                    size='xs'
                                    align='center'
                                >
                                    Issued
                                </Text>
                            </div>

                            <div
                                style={{
                                    height: '60%',
                                }}
                            >

                            </div>

                            <div
                                style={{
                                    height: '20%',
                                    borderTop: '1px solid black'
                                }}
                            >
                            </div>

                        </div>

                        <div
                            style={{
                                width: '30%',
                                borderRight: '1px solid black',
                                borderBottom: '1px solid black'
                            }}
                        >


                            <div
                                style={{
                                    height: '20%',
                                    borderBottom: '1px solid black'
                                }}
                            >
                                <Text
                                    size='xs'
                                    align='center'
                                >
                                    Checked
                                </Text>
                            </div>

                            <div
                                style={{
                                    height: '60%',
                                }}
                            >

                            </div>

                            <div
                                style={{
                                    height: '20%',
                                    borderTop: '1px solid black'
                                }}
                            >
                            </div>

                        </div>

                        <div
                            style={{
                                width: '30%',
                                borderBottom: '1px solid black',
                                borderRight: '1px solid black'
                            }}
                        >


                            <div
                                style={{
                                    height: '20%',
                                    borderBottom: '1px solid black'
                                }}
                            >
                                <Text
                                    size='xs'
                                    align='center'
                                >
                                    Approved
                                </Text>
                            </div>

                            <div
                                style={{
                                    height: '60%',
                                }}
                            >

                            </div>

                            <div
                                style={{
                                    height: '20%',
                                    borderTop: '1px solid black'
                                }}
                            >
                            </div>

                        </div>

                    </div>


                </div>


                <Table
                    my='md'
                    fontSize={9}
                    style={{
                        border: '2px solid black',
                        textAlign: 'center',
                        fontWeight: 600,

                    }}
                    border={10}
                >

                    <thead>
                        <tr
                        >
                            <th rowSpan={2} >NO</th>
                            <th rowSpan={2} >Part Code</th>
                            <th rowSpan={2} >Part Name</th>
                            <th rowSpan={2} >Spec</th>
                            <th
                                style={{
                                    border: '1px solid black'
                                }}
                            >T</th>
                            <th
                                style={{
                                    border: '1px solid black'
                                }}
                            >W</th>
                            <th
                                style={{
                                    border: '1px solid black'
                                }}
                            >L</th>
                            <th rowSpan={2} >BJ</th>
                            <th rowSpan={2} >UM</th>
                            <th rowSpan={2} >Pcs/Sheet</th>

                            <th colSpan={3}
                                style={{
                                    border: '1px solid black',
                                    textAlign: 'center'
                                }} >Order Qty</th>
                            <th

                                style={{
                                    border: '1px solid black'
                                }}
                            >Price/Kg</th>
                            <th

                                style={{
                                    border: '1px solid black'
                                }}
                            >Amount</th>
                            <th colSpan={maxDueDate}

                                style={{
                                    border: '1px solid black',
                                    textAlign: 'center'
                                }}
                            >Due Date Delivery</th>
                        </tr>

                        <tr
                            style={{
                                borderBottom: '1px solid black'
                            }}
                        >
                            <th
                                style={{
                                    border: '1px solid black'
                                }}
                            >mm</th>
                            <th

                                style={{
                                    border: '1px solid black'
                                }}
                            >mm</th>
                            <th

                                style={{
                                    border: '1px solid black'
                                }}
                            >mm</th>
                            <th>Pcs</th>
                            <th>Sheet</th>
                            <th>Kg</th>
                            <th>IDR</th>
                            <th>IDR</th>
                            {scheduleList.map((schedule, index) => {
                                const { date } = schedule
                                const NewDate = new Date(date)
                                return (
                                    <th
                                        key={index}
                                    >
                                        {NewDate.getDate()} {Months[NewDate.getMonth()]}
                                    </th>
                                )
                            })}
                        </tr>

                    </thead>

                    <tbody>
                        {rows}

                        <tr
                            style={{
                                borderTop: '1px solid black'
                            }}
                        >
                            <td
                                rowSpan={6}
                                colSpan={10}
                                style={{
                                    borderTop: '1px solid black'
                                }}
                            >
                                <Text
                                    align="left"
                                    mt={-50}
                                    style={{
                                        position: 'relative',
                                    }}
                                >
                                    Comments or special instruction :
                                </Text>
                                <Text
                                    align="left"
                                    mt='xs'
                                >
                                    {description}
                                </Text>
                            </td>

                            <td
                                rowSpan={6}
                                colSpan={3}
                            >
                            </td>

                        </tr>

                        <tr>
                            <td>
                                Total
                            </td>
                            <td>
                                <TextPricePurchaseOrderReport price={totalAmountPrice} />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                Discount
                            </td>
                            <td>
                                <TextPricePurchaseOrderReport price={priceDiscount} />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                Sub Total
                            </td>
                            <td>
                                <TextPricePurchaseOrderReport price={priceSubtotal} />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                PPN {tax} %
                            </td>
                            <td>
                                <TextPricePurchaseOrderReport price={priceTax} />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                Total Amount
                            </td>
                            <td>
                                <TextPricePurchaseOrderReport price={finalPrice} />
                            </td>
                        </tr>

                    </tbody>



                </Table>

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
export default PurchaseOrderReport