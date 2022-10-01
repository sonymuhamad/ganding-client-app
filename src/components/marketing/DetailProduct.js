import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BaseAside from "../layout/BaseAside";
import BreadCrumb from "../BreadCrumb";
import { useRequest } from "../../hooks/useRequest";
import { useSectionProduct } from '../../hooks/useSectionProduct'
import { sectionStyle } from "../../styles/sectionStyle";
import { Title, Group, TextInput, Paper, Image, Text } from "@mantine/core";
import { IconBarbell, IconWriting, IconCodeAsterix, IconFileTypography, IconTag, IconTransferIn, IconTransferOut, IconList } from "@tabler/icons";
import BaseTable from "../layout/BaseTable";



const DetailProduct = () => {

    const params = useParams() //customerId productId
    const { Retrieve } = useRequest()
    const auth = useContext(AuthContext)
    const { classes } = sectionStyle()
    const { sectionRefs, activeSection } = useSectionProduct()
    const [breadcrumb, setBreadcrumb] = useState([])

    const [process, setProcess] = useState([])
    const [productName, setProductName] = useState('')
    const [weight, setWeight] = useState('')
    const [productCode, setProductCode] = useState('')
    const [price, setPrice] = useState('')
    const [productType, setProductType] = useState('')
    const [image, setImage] = useState(null)
    const [numberOfProcess, setNumberOfProcess] = useState('')

    const links = [
        {
            "label": "Detail",
            "link": "#product",
            "order": 1
        },
        {
            "label": "Wip and finish good",
            "link": "#wip-fg",
            "order": 1
        }
    ]

    useEffect(() => {

        const fetch = async () => {
            try {
                const product = await Retrieve(params.productId, auth.user.token, 'marketing/product-detail')
                console.log(product)
                setBreadcrumb([
                    {
                        path: '/home/marketing',
                        label: 'Marketing'
                    },
                    {
                        path: '/home/marketing/customers',
                        label: 'Customers'
                    },
                    {
                        path: `/home/marketing/customers/${product.customer.id}`,
                        label: `${product.customer.name}`
                    },
                    {
                        path: `/home/marketing/customers/${product.customer.id}/${product.id}`,
                        label: `${product.name}`
                    }
                ])

                setPrice(product.price)
                setProductCode(product.code)
                setProductName(product.name)
                setProductType(product.type.name)
                setWeight(product.weight)
                setImage(product.image)
                setNumberOfProcess(product.process)

                setProcess([...product.ppic_process_related])

            } catch (e) {
                console.log(e)
            }
        }

        fetch()

    }, [params.productId, auth.user.token])

    const columnProcess = useMemo(() => [
        {
            name: 'Process name',
            selector: row => row.process_name,
            sortable: true,
        },
        {
            name: 'Process type',
            selector: row => row.process_type.name,

        },
        {
            name: 'Stock',
            selector: row => row.warehouseproduct_set.find(wh => wh.warehouse_type.id !== 2).quantity,
        },
        {
            name: 'Wip',
            selector: row => row.warehouseproduct_set.find(wh => wh.warehouse_type.id !== 2).warehouse_type.name,
        },

    ], [])


    return (
        <>

            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />

            <section id='product' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#product" className={classes.a_href} >
                        Detail product
                    </a>
                </Title>

                <Paper my='md' >
                    <Image
                        radius='md'
                        src={image !== null ? `http://127.0.0.1:8000/images/${image}` : ''}
                        alt='product image'
                        withPlaceholder
                    />
                </Paper>

                <Group>
                    <TextInput
                        readOnly
                        label='Name'
                        icon={<IconWriting />}
                        value={productName}
                    />
                    <TextInput
                        readOnly
                        icon={<IconCodeAsterix />}
                        label='Code'
                        value={productCode}
                    />
                    <TextInput
                        readOnly
                        icon={<IconFileTypography />}
                        label='Product type'
                        value={productType}
                    />
                    <TextInput
                        readOnly
                        icon={<IconBarbell />}
                        label='Weight per piece'
                        value={weight}
                    />
                    <TextInput
                        readOnly
                        icon={<IconTag />}
                        label='Price'
                        value={price}
                    />

                    <TextInput
                        readOnly
                        icon={<IconList />}
                        label='Number of process'
                        value={numberOfProcess}
                    />

                </Group>

            </section>

            <section id='wip-fg' className={classes.section} ref={sectionRefs[1]} >

                <Title className={classes.title} >
                    <a href="#wip-fg" className={classes.a_href} >
                        Process
                    </a>
                </Title>

                <BaseTable
                    column={columnProcess}
                    data={process}
                />

            </section>

        </>
    )

}


export default DetailProduct



