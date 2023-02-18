import React, { useState, useEffect, useMemo } from "react";
import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";
import { NavigationDetailButton } from '../../custom_components'


const MaterialList = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
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
            selector: row => <NavigationDetailButton
                url={`/home/purchasing/material/${row.id}`}
            />
        }
    ], [])

    useEffect(() => {
        GetAndExpiredTokenHandler('material-list').then(dataMaterialList => {
            setMaterialList(dataMaterialList)
        })
    }, [])

    return (
        <>
            <BaseTable
                column={columnMaterialList}
                data={materialList}
                noData="No data material"
            />
        </>
    )
}


export default MaterialList
