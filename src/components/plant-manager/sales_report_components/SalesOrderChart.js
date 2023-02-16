import React, { useState, useEffect } from "react";

import { useRequest } from "../../../hooks";
import { LineChart } from "../../charts";
import { Months } from '../../../services'



const SalesOrderChart = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
    const [labels, setLabels] = useState([])
    const [data, setData] = useState([])


    useEffect(() => {

        GetAndExpiredTokenHandler('report-sales-order').then(reports => {

            let labels = []
            let store_data = []

            for (const report of reports) {
                const date = report.order_date.split('-')
                labels.push(`${Months[parseInt(date[1]) - 1]} ${date[0]}`)
                store_data.push(report.total_order)
            }

            setLabels(labels)
            setData(store_data)

        })

    }, [])


    return (
        <LineChart

            label={labels}

            dataset={[
                {
                    id: 1,
                    label: 'Total product ordered ',
                    data: data,
                },
            ]}

            title='The total number of products ordered each month'

        />
    )
}

export default SalesOrderChart
