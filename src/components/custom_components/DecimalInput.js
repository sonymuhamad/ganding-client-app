import { NumberInput } from "@mantine/core";


const DecimalInput = (props) => {

    return (
        <NumberInput
            min={0}
            decimalSeparator=','
            precision={2}
            step={0.5}
            hideControls
            radius='md'
            {...props}
        />
    )
}

export default DecimalInput
