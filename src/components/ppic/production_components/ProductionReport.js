import React, { useState, useEffect, useMemo } from "react";
import { useRequest, useSearch } from "../../../hooks";
import { BaseTable } from "../../tables";
import { Link } from "react-router-dom";

import { ButtonAdd, HeadSection, SearchTextInput, NavigationDetailButton } from "../../custom_components";


const ProductionReport = () => {

    const { Get } = useRequest()
    const [reports, setReports] = useState([])
    const { lowerCaseQuery, query, setValueQuery } = useSearch()


    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const { product, process, date } = report
            const { name, code } = product
            const { process_name } = process

            return name.toLowerCase().includes(lowerCaseQuery) || process_name.toLowerCase().includes(lowerCaseQuery) || date.toLowerCase().includes(lowerCaseQuery) || code.toLowerCase().includes(lowerCaseQuery)
        })

    }, [lowerCaseQuery, reports])


    const ColumnProductionReport = useMemo(() => [
        {
            name: 'Product name',
            selector: row => row.product.name
        },
        {
            name: 'Product number',
            selector: row => row.product.code
        },
        {
            name: 'Process',
            selector: row => row.process.process_name
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/ppic/production/${row.id}`}
            />
        },
    ], [])



    useEffect(() => {
        const fetchProductionReport = async () => {
            try {
                const reports = await Get('production-report')
                setReports(reports)
            } catch (e) {
                console.log(e)
            }
        }
        fetchProductionReport()
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
                    to='/home/ppic/production/new'
                >
                    Production
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={ColumnProductionReport}
                data={filteredReports}
            />
        </>
    )
}


export default ProductionReport

