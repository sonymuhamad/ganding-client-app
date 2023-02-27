import React from "react";
import { Text } from "@mantine/core";

export default function TextPricePurchaseOrderReport({ price }) {

    return (
        <Text>
            {new Intl.NumberFormat('IDR-ID').format(price)}
        </Text>
    )
}

