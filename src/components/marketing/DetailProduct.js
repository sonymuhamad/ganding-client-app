import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import BaseAside from "../layout/BaseAside";
import BreadCrumb from "../BreadCrumb";
import { useRequest } from "../../hooks/useRequest";
import { useSectionProduct } from '../../hooks/useSectionProduct'
import { sectionStyle } from "../../styles/sectionStyle";
import { Title, Group, TextInput, Paper, Image } from "@mantine/core";
import { IconBarbell, IconWriting, IconCodeAsterix, IconFileTypography, IconTag, IconList } from "@tabler/icons";
import BaseTable from "../tables/BaseTable";



const DetailProduct = () => {

    const params = useParams() //customerId productId
    const { Retrieve, Loading } = useRequest()
    const { classes } = sectionStyle()
    const { sectionRefs, activeSection } = useSectionProduct()
    const [breadcrumb, setBreadcrumb] = useState([])

    const [product, setProduct] = useState({
        id: '',
        code: '',
        image: null,
        name: '',
        customer: {
            name: '',
        },
        process: '',
        weight: '',
        price: 0,
        type: {
            name: ''
        },
        ppic_process_related: [],
    })

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
                const product = await Retrieve(params.productId, 'product-detail')
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

                setProduct(product)

            } catch (e) {
                console.log(e)
            }
        }

        fetch()

    }, [params.productId, Retrieve])

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

            <Loading />

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
                        src={product.image !== null ? `http://127.0.0.1:8000/images/${product.image}` : ''}
                        alt='product image'
                        withPlaceholder
                    />
                </Paper>

                <Group>
                    <TextInput
                        readOnly
                        label='Name'
                        icon={<IconWriting />}
                        value={product.name}
                    />
                    <TextInput
                        readOnly
                        icon={<IconCodeAsterix />}
                        label='Code'
                        value={product.code}
                    />
                    <TextInput
                        readOnly
                        icon={<IconFileTypography />}
                        label='Product type'
                        value={product.type.name}
                    />
                    <TextInput
                        readOnly
                        icon={<IconBarbell />}
                        label='Weight per piece'
                        value={product.weight}
                    />
                    <TextInput
                        readOnly
                        icon={<IconTag />}
                        label='Price'
                        value={product.price}
                    />

                    <TextInput
                        readOnly
                        icon={<IconList />}
                        label='Number of process'
                        value={product.process}
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
                    data={product.ppic_process_related}
                />

            </section>

        </>
    )

}


export default DetailProduct



