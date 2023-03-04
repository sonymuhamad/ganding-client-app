import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRequest } from "../../../hooks"

import { ProductDeliveryList, ComponentDetailDeliveryNote } from "./detail_delivery_note_components";
import { BaseContent } from '../../layout'

const DetailDeliveryNote = () => {

    const { Retrieve } = useRequest()
    const { deliveryNoteId } = useParams()
    const [productDeliver, setProductDeliver] = useState([])

    const [detailDeliveryNote, setDetailDeliveryNote] = useState({
        id: '',
        code: '',
        created: '',
        note: '',
        date: '',
        last_update: '',
        customer: {
            name: '',
            email: '',
            address: '',
            phone: '',
        },
        vehicle: {
            id: '',
            license_part_number: ''
        },
        driver: {
            id: '',
            name: ''
        }
    })

    const links = useMemo(() => [
        {
            "label": "Detail delivery note",
            "link": "detail",
            "order": 1
        },
        {
            "label": "Product shipped",
            "link": "product",
            "order": 1
        },
    ], [])


    const breadcrumb = [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/delivery-note',
            label: 'Delivery note'
        },
        {
            path: `/home/marketing/delivery-note/${deliveryNoteId}`,
            label: 'Detail'
        }
    ]



    useEffect(() => {

        const fetch = async () => {

            try {
                const { productdelivercustomer_set, ...dn } = await Retrieve(deliveryNoteId, 'deliveries/customer')

                setProductDeliver(productdelivercustomer_set)
                setDetailDeliveryNote(dn)

            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <ComponentDetailDeliveryNote data={detailDeliveryNote} />
        },
        {
            description: '',
            component: <ProductDeliveryList data={productDeliver} />
        }
    ], [detailDeliveryNote, productDeliver])

    return (
        <BaseContent links={links} breadcrumb={breadcrumb} contents={contents} />
    )
}


export default DetailDeliveryNote

