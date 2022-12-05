import { Line } from "react-chartjs-2"

const LineChart = ({ label = [], dataset = [], title = '' }) => {

    return (
        <>

            <Line
                datasetIdKey='id'
                data={{
                    labels: label,
                    datasets: dataset
                }}


                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: title,
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

export default LineChart