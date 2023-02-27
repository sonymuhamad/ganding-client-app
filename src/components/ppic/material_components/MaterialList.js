import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import { BaseTableExpanded } from "../../tables"
import { useRequest, useSearch } from "../../../hooks";
import { ExpandedMaterial } from "../../layout";
import { NavigationDetailButton, ButtonAdd, HeadSection, SearchTextInput } from '../../custom_components'



const MaterialList = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
    const [materialList, setMaterialList] = useState([])
    const { lowerCaseQuery, query, setValueQuery } = useSearch()

    const filteredMaterialList = useMemo(() => {

        return materialList.filter(material => {
            const { name, spec, supplier, uom } = material
            return name.toLowerCase().includes(lowerCaseQuery) || spec.toLowerCase().includes(lowerCaseQuery) || supplier.name.toLowerCase().includes(lowerCaseQuery) || uom.name.toLowerCase().includes(lowerCaseQuery)

        })

    }, [materialList, lowerCaseQuery])


    const columnMaterialList = useMemo(() => [
        {
            name: 'Supplier name',
            selector: row => row.supplier.name
        },
        {
            name: 'Material name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Material spec',
            selector: row => row.spec,
        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/ppic/material/${row.id}`}
            />,
        }
    ], [])

    useEffect(() => {

        GetAndExpiredTokenHandler('material-list').then(materialList => {
            setMaterialList(materialList)
        })

    }, [])



    return (
        <>
            <HeadSection>
                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />

                <ButtonAdd
                    component={Link}
                    to={'/home/ppic/material/new'}
                >
                    Material
                </ButtonAdd>

            </HeadSection>

            <BaseTableExpanded
                column={columnMaterialList}
                data={filteredMaterialList}
                expandComponent={ExpandedMaterial}
            />
        </>
    )

}

export default MaterialList