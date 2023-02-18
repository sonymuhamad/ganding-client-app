import React, { useState, useEffect } from "react"
import { useRequest } from "../../../../hooks"
import { LineChart } from "../../../charts"
import { Months } from "../../../../services"
import { useParams } from "react-router-dom"

const SectionMaterialCharts = () => {

    const { RetrieveWithoutExpiredTokenHandler } = useRequest()
    const [orderDataSet, setOrderDataSet] = useState([])
    const [usageDataSet, setUsageDataSet] = useState([])
    const [labels, setLabels] = useState([])
    const { materialId } = useParams()

    useEffect(() => {

        RetrieveWithoutExpiredTokenHandler(materialId, 'report-material-usage-and-order').then(data => {
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

    }, [materialId])

    return (
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
    )

}

export default SectionMaterialCharts