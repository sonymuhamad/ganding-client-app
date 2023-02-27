import React from "react";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons";


const ButtonAdd = (props) => {

    const { children, onClick } = props

    return (
        <Button
            onClick={onClick}
            radius='md'
            variant='outline'
            leftIcon={<IconPlus />}
        >
            {children}
        </Button>
    )

}

export default ButtonAdd
