import React, { useState, useEffect, useMemo } from "react";

import { Button } from "@mantine/core";
import { useRequest } from "../../../hooks/useRequest";
import BaseTable from "../../tables/BaseTable";
import { IconAffiliate } from "@tabler/icons";
import { Link } from "react-router-dom";


const ProductionPriority = () => {

    const { Get, Loading } = useRequest()
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
            selector: row => row.button
        }
    ], [])

    useEffect(() => {
        Get('production-priority').then(data => {

            const priority = data.reduce((prev, current) => {
                const { ppic_process_related } = current

                const many_process = ppic_process_related.map(pros => ({
                    ...pros, button: <Button
                        leftIcon={<IconAffiliate stroke={2} size={16} />}
                        color='blue.6'
                        variant='subtle'
                        radius='md'
                        mx='xs'
                        component={Link}
                        to={`/home/ppic/production/new/${pros.id}`}
                    >
                        Produce
                    </Button>
                }))

                return [...prev, ...many_process]
            }, [])

            setDataPriority(priority)

        })
    }, [])

    return (
        <>
            <Loading />
            <BaseTable
                column={columnProductionPriority}
                data={dataPriority}
            />
        </>
    )

}

export default ProductionPriority
