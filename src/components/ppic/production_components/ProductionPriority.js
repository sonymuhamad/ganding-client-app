import React, { useState, useEffect, useMemo } from "react";

import { Button } from "@mantine/core";
import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";
import { IconAffiliate } from "@tabler/icons";
import { Link } from "react-router-dom";


const ProductionPriority = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
    const [dataPriority, setDataPriority] = useState([])

    const columnProductionPriority = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product.name
        },
        {
            name: 'Process',
            selector: row => row.process_name
        },
        {
            name: 'Quantity to produce',
            selector: row => `${row.production_quantity} pcs`
        },
        {
            name: 'Wip',
            selector: row => `Wip${row.order}`
        },
        {
            name: '',
            selector: row => <Button
                leftIcon={<IconAffiliate stroke={2} size={16} />}
                color='blue.6'
                variant='subtle'
                radius='md'
                mx='xs'
                component={Link}
                to={`/home/ppic/production/new/${row.id}`}
            >
                Produksi
            </Button>
        }
    ], [])

    useEffect(() => {
        GetAndExpiredTokenHandler('production-priority').then(data => {

            const priority = data.reduce((prev, current) => {
                const { ppic_process_related } = current
                return [...prev, ...ppic_process_related]
            }, [])

            setDataPriority(priority)

        })
    }, [])

    return (

        <BaseTable
            column={columnProductionPriority}
            data={dataPriority}
        />

    )

}

export default ProductionPriority
