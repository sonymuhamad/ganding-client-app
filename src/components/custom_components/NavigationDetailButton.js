import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mantine/core";
import { IconDotsCircleHorizontal } from "@tabler/icons";

const NavigationDetailButton = (props) => {

    const { url } = props


    return (
        <Button
            leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
            color='teal.8'
            variant='subtle'
            radius='md'
            component={Link}
            to={url}
        >
            Detail
        </Button>
    )
}

export default NavigationDetailButton


