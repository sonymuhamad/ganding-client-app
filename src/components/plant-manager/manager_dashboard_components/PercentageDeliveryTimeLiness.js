import React, { useState, useEffect } from "react";

import { useRequest } from "../../../hooks";
import { cardStyle } from "../../../styles";
import { Text, RingProgress, Group, Card } from "@mantine/core";

const PercentageDeliveryTimeLiness = () => {

    const { classes, theme } = cardStyle()
    const [percentage, setPercentage] = useState(100)
    const [totalSchedule, setTotalSchedule] = useState(0)
    const [totalScheduleOnTime, setTotalScheduleOnTime] = useState(0)
    const [unscheduledDelivery, setUnscheduledDelivery] = useState(0)

    const { GetAndExpiredTokenHandler } = useRequest()

    useEffect(() => {

        GetAndExpiredTokenHandler('report-timeliness-delivery').then(data => {
            const { percentage, total_schedule, total_schedule_on_time, unscheduled } = data

            setPercentage(percentage)
            setTotalSchedule(total_schedule)
            setTotalScheduleOnTime(total_schedule_on_time)
            setUnscheduledDelivery(unscheduled)

        })

    }, [])

    return (
        <>
            <Card withBorder p="xl" radius="md" className={classes.card}>
                <div className={classes.inner}>
                    <div>
                        <Text size="xl" className={classes.label}>
                            Percentage of on time deliveries
                        </Text>
                        <div>
                            <Text className={classes.lead} mt={30}>
                                {totalSchedule}
                            </Text>
                            <Text size="xs" color="dimmed">
                                Total scheduled deliveries
                            </Text>
                        </div>
                        <Group mt="lg">

                            <div>
                                <Text className={classes.label}>Total on time deliveries</Text>
                                <Text size="sm" color="dimmed">
                                    {totalScheduleOnTime}
                                </Text>
                            </div>

                            <div>
                                <Text className={classes.label}>Unscheduled deliveries</Text>
                                <Text size="sm" color="dimmed">
                                    {unscheduledDelivery}
                                </Text>
                            </div>

                        </Group>
                    </div>

                    <div className={classes.ring}>
                        <RingProgress
                            roundCaps
                            thickness={6}
                            size={150}
                            sections={[{ value: percentage, color: theme.primaryColor }]}
                            label={
                                <div>
                                    <Text align="center" size="lg" className={classes.label} sx={{ fontSize: 22 }}>
                                        {percentage}%
                                    </Text>
                                    <Text align="center" size="xs" color="dimmed">
                                        On time delivery rate
                                    </Text>
                                </div>
                            }
                        />
                    </div>
                </div>
            </Card>

        </>
    )
}

export default PercentageDeliveryTimeLiness

