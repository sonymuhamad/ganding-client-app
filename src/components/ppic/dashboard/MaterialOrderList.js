import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";
import { BaseTableExpanded } from "../../tables";
import { ExpandedMaterial } from '../../layout'

const MaterialOrderList = () => {

    const { Get } = useRequest()
    const [materialList, setMaterialList] = useState([])


    const columnMaterialOrderList = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.name
        },
        {
            name: 'Material specification',
            selector: row => row.spec
        },
        {
            name: 'Supplier',
            selector: row => row.supplier.name
        },
        {
            name: 'Quantity',
            selector: row => `${row.rest_arrival} ${row.uom.name}`
        }
    ], [])

    useEffect(() => {
        const fetch = async () => {
            try {
                const materialOrderList = await Get('list-material-in-order')

                setMaterialList(materialOrderList)

            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [])


    return (
        <>

            <BaseTableExpanded
                column={columnMaterialOrderList}
                data={materialList}
                expandComponent={ExpandedMaterial}
                noData={'No upcoming material'}
            />

        </>
    )

}

export default MaterialOrderList
