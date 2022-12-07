import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";
import { Badge } from "@mantine/core";


const MaterialRequest = () => {

    const { Get } = useRequest()
    const [mrpList, setMrpList] = useState([])

    const columnMrp = useMemo(() => [
        {
            name: 'Material',
            selector: row => row.material.name,
            sortable: true
        },
        {
            name: 'Spec material',
            selector: row => row.material.spec,
            sortable: true
        },
        {
            name: 'Quantity request',
            selector: row => `${row.quantity} ${row.material.uom.name} `
        },
        {
            name: 'Request type',
            selector: row => row.id ? <Badge
                variant='filled'
                color='teal.6'
            >Additional request</Badge> : <Badge
                color='blue.6'
                variant='filled'
            >Production request</Badge>
        }
    ], [])

    useEffect(() => {

        Get('mrp').then(data => {
            setMrpList(data)
        })

    }, [])

    return (
        <>

            <BaseTable
                column={columnMrp}
                data={mrpList}
                noData='No request material'
            />

        </>
    )
}

export default MaterialRequest