import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";

import { useRequest } from "../../../hooks/useRequest";


const ProductionChart = () => {

    const [label, setLabel] = useState([])
    const [data, setData] = useState([])
    const { GetAndExpiredTokenHandler, Loading } = useRequest()

    const months = useMemo(() => {
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
    }, [])

    useEffect(() => {

        const fetch = async () => {
            try {
                const report = await GetAndExpiredTokenHandler('monthly-production-report')

                let labels = []
                let data = []

                for (const production of report) {
                    labels.push(`${months[production.date__month - 1]} ${production.date__year}`)
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
        <>

            <Loading />

            <Line
                datasetIdKey='id'
                data={{
                    labels: label,
                    datasets: [
                        {
                            id: 1,
                            label: 'Total production',
                            data: data,
                        },
                    ],
                }}


                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Monthly production volume",
                        },
                        legend: {
                            display: true,
                            position: 'top'
                        },

                    },

                    responsive: true,
                    animation: {
                        duration: 1500,
                        easing: 'easeOutSine',
                    },
                }}
            />

        </>
    )
}

export default ProductionChart

