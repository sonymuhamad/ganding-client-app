import React from "react";
import { Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons";

const ButtonSubmit = ({ formId }) => {

    return (
        <Button
            type="submit"
            radius='md'
            fullWidth
            my='md'
            form={formId}
            leftIcon={<IconDownload />}
        >
            Save
        </Button>
    )

}

export default ButtonSubmit
