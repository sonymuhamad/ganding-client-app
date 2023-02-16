import React, { useState } from "react";
import { LoadingOverlay } from "@mantine/core";

const useLoader = () => {

    const [visible, setVisible] = useState(false)

    const changeVisibility = () => {
        setVisible(prev => !prev)
    }

    const Loader = () => {
        return (
            <LoadingOverlay visible={visible} overlayBlur={2} />
        )
    }

    return {
        changeVisibility,
        Loader
    }

}

export { useLoader }

