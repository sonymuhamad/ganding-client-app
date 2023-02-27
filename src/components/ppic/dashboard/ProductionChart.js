import React, { useState, useEffect } from "react"

import { useRequest } from "../../../hooks";
import { LineChart } from "../../charts";
import { Months } from "../../../services";

const ProductionChart = () => {

    const [label, setLabel] = useState([])
    const [data, setData] = useState([])
    const { GetAndExpiredTokenHandler } = useRequest()

    useEffect(() => {

        const fetch = async () => {
            try {
                const report = await GetAndExpiredTokenHandler('monthly-production-report')

                let labels = []
                let data = []

                for (const production of report) {
                    labels.push(`${Months[production.date__month - 1]} ${production.date__year}`)
                    data.push(production.total_production)
                }

                setData(data)
                setLabel(labels)

            } catch (e) {
                console.log(e)
            }
        }

        fetch()

    }, [])


    return (

        <LineChart label={label} dataset={[
            {
                id: 1,
                label: 'Total production',
                data: data,
            },
        ]}
            title='Monthly production volume'
        />

    )
}

export default ProductionChart

