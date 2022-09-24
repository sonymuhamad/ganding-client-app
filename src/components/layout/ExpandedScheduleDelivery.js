import React from "react";
import { Group, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconSum, IconCalendarEvent } from "@tabler/icons";

export default function ExpandedScheduleDelivery({ data }) {


    return (
        <>
            {data.deliveryschedule_set.map((schedule) => {

                return (

                    <Group position="left" spacing='xs' key={schedule.id} >
                        <TextInput icon={<IconSum />}
                            m='xs'
                            radius='md'
                            label='Quantity'
                            value={schedule.quantity}
                            readOnly
                        />
                        <DatePicker
                            icon={<IconCalendarEvent />}
                            label='Schedule date'
                            value={new Date(schedule.date)}
                            clearable={false}
                        />
                    </Group>
                )
            })}
        </>
    )

}



