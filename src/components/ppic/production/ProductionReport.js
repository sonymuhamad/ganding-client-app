import React, { useState, useEffect, useContext, useMemo } from "react";

import { IconPlus, IconSearch, IconDotsCircleHorizontal } from "@tabler/icons";
import { Button, Group, TextInput, } from "@mantine/core";
import { AuthContext } from "../../../context/AuthContext";
import { useRequest } from "../../../hooks/useRequest";
import BaseTable from "../../tables/BaseTable";
import { Link } from "react-router-dom";



const ProductionReport = () => {

    const auth = useContext(AuthContext)
    const { Get } = useRequest()
    const [reports, setReports] = useState([])
    const [searchReport, setSearchReport] = useState('')


    const filteredReports = useMemo(() => {

        const filteringVal = searchReport.toLowerCase()


        return reports.filter(report => report.product.name.toLowerCase().includes(filteringVal) || report.process.process_name.toLowerCase().includes(filteringVal) || report.created.toLowerCase().includes(filteringVal))

    }, [searchReport, reports])


    const ColumnProductionReport = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product.name
        },
        {
            name: 'Process',
            selector: row => row.process.process_name
        },
        {
            name: 'Date',
            selector: row => new Date(row.created).toDateString()
        },
        {
            name: '',
            selector: row => row.buttonEdit
        },
        {
            name: '',
            selector: row => row.buttonDetail
        },
    ], [])



    useEffect(() => {
        const fetchProductionReport = async () => {
            try {
                const reports = await Get(auth.user.token, 'production-report')
                const productionReport = reports.map(report => ({
                    ...report,
                    buttonDetail:
                        <Button
                            leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                            color='teal.8'
                            variant='subtle'
                            radius='md'
                            mx='xs'

                            component={Link}
                            to={`/home/ppic/production/${report.id}`}
                        >
                            Detail
                        </Button>,

                }))

                setReports(productionReport)
            } catch (e) {
                console.log(e)
            }
        }
        fetchProductionReport()
    }, [auth.user.token])

    return (
        <>
            <Group position="right" >

                <TextInput
                    icon={<IconSearch />}
                    radius='md'
                    value={searchReport}
                    onChange={e => setSearchReport(e.target.value)}
                    placeholder="Search report"
                />

                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    component={Link}
                    to='/home/ppic/production/new'
                >
                    Production
                </Button>
            </Group>

            <BaseTable
                column={ColumnProductionReport}
                data={filteredReports}
            />
        </>
    )
}


export default ProductionReport

