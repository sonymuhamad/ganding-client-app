import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";
import { IconDotsCircleHorizontal } from "@tabler/icons";
import { Button } from "@mantine/core";


const MaterialList = () => {

    const { GetAndExpiredTokenHandler, Loading } = useRequest()
    const [materialList, setMaterialList] = useState([])

    const columnMaterialList = useMemo(() => [
        {
            name: 'Supplier',
            selector: row => row.supplier.name,
            sortable: true
        },
        {
            name: 'Material name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Specification',
            selector: row => row.spec
        },
        {
            name: 'Stock',
            selector: row => `${row.warehousematerial.quantity} ${row.uom.name}`
        },
        {
            name: '',
            selector: row => row.detailButton
        }
    ], [])

    useEffect(() => {
        GetAndExpiredTokenHandler('material-list').then(dataMaterialList => {
            setMaterialList(dataMaterialList.map(material => ({
                ...material, detailButton: <Button
                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.6'
                    variant='subtle'
                    radius='md'
                    component={Link}
                    to={`/home/purchasing/material/${material.id}`}
                >
                    Detail
                </Button>
            })))
        })
    }, [])

    return (
        <>

            <Loading />

            <BaseTable
                column={columnMaterialList}
                data={materialList}
                noData="No data material"
            />

        </>
    )
}


export default MaterialList
