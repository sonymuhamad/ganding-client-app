import React, { useState, useEffect, useMemo } from "react"

import { useRequest, useSearch } from "../../../hooks"
import { BaseTable } from "../../tables"
import { HeadSection, SearchTextInput } from "../../custom_components"


const ReceiptSchedule = () => {

    const { Get } = useRequest()
    const [schedule, setSchedule] = useState([])
    const { lowerCaseQuery, query, setValueQuery } = useSearch()

    const filteredSchedule = useMemo(() => {

        return schedule.filter(sch => {
            const { date, material_order } = sch
            const { material, purchase_order_material } = material_order
            const { name } = material
            const { supplier, code } = purchase_order_material

            return date.toLowerCase().includes(lowerCaseQuery) || name.toLowerCase().includes(lowerCaseQuery) || supplier.name.toLowerCase().includes(lowerCaseQuery) || code.toLowerCase().includes(lowerCaseQuery)
        })

    }, [schedule, lowerCaseQuery])

    const columnMaterialReceiptSchedule = useMemo(() => [
        {
            name: 'Supplier',
            selector: row => row.material_order.purchase_order_material.supplier.name
        },
        {
            name: 'Purchase order number',
            selector: row => row.material_order.purchase_order_material.code
        },
        {
            name: 'Material',
            selector: row => row.material_order.material.name
        },
        {
            name: 'Date',
            selector: row => row.date
        },
        {
            name: 'Quantity',
            selector: row => row.quantity
        },
    ], [])


    useEffect(() => {
        Get('schedules/material-incomplete').then(data => {
            setSchedule(data)
        })
    }, [])

    return (
        <>

            <HeadSection>
                <SearchTextInput
                    setValueQuery={setValueQuery}
                    query={query}
                />
            </HeadSection>

            <BaseTable
                column={columnMaterialReceiptSchedule}
                data={filteredSchedule}

                conditionalRowStyle={
                    [
                        {
                            when: row => new Date() > new Date(row.date),
                            style: {
                                backgroundColor: '#ffc9c9',
                                color: 'white',
                            },
                        },
                        {
                            when: row => Math.ceil((new Date(row.date) - new Date()) / (1000 * 3600 * 24)) <= 7 && Math.ceil((new Date(row.date) - new Date()) / (1000 * 3600 * 24)) > 0,
                            style: {
                                backgroundColor: '#fff3bf',
                                color: 'white',
                            },
                        }
                    ]
                }
            />

        </>
    )
}

export default ReceiptSchedule