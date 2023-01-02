import React from "react";
import { Text } from "@mantine/core";

export default function TextPrice({ price }) {

    return (
        <Text>
            {new Intl.NumberFormat('IDR-ID', { style: 'currency', currency: 'IDR' }).format(price)}
        </Text>
    )
}

