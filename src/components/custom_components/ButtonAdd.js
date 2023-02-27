import React from "react";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons";


const ButtonAdd = (props) => {

    return (
        <Button
            radius='md'
            variant='outline'
            leftIcon={<IconPlus />}
            {...props}
        />

    )

}

export default ButtonAdd
