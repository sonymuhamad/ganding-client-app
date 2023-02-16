import React, { useEffect, useState } from "react";

import { LineChart } from "../../charts";
import { useRequest } from "../../../hooks"
import { Months } from "../../../services";



const MaterialChart = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
    const [orderDataSet, setOrderDataSet] = useState([])
    const [usageDataSet, setUsageDataSet] = useState([])
    const [labels, setLabels] = useState([])

    useEffect(() => {

        GetAndExpiredTokenHandler('report-material-usage-and-order').then(data => {
            let labels = []
            let firstDataSet = []
            let secondDataSet = []

            for (const material of data) {
                const date = material.date.split('-')
                labels.push(`${Months[parseInt(date[1]) - 1]} ${date[0]}`)
                firstDataSet.push(material.total_order)
                secondDataSet.push(material.total_usage)
            }


            setOrderDataSet(firstDataSet)
            setUsageDataSet(secondDataSet)
            setLabels(labels)

        })

    }, [])


    return (
        <>
            <LineChart label={labels} dataset={[
                {
                    id: 1,
                    label: 'Amount of material ordered',
                    data: orderDataSet,
                },
                {
                    id: 2,
                    label: 'Amount of material used',
                    data: usageDataSet,
                },
            ]}
                title='Monthly data on material usage and ordering'
            />


        </>
    )
}

export default MaterialChart