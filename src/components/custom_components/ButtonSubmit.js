import React from "react";
import { Button } from "@mantine/core";

const ButtonSubmit = ({ formId }) => {

    return (
        <Button
            type="submit"
            radius='md'
            fullWidth
            my='md'
            form={formId}
        >
            Save
        </Button>
    )

}

export default ButtonSubmit
