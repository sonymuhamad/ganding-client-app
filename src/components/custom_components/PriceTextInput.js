import { NumberInput } from "@mantine/core";
import { IconReceipt2 } from "@tabler/icons";


const PriceTextInput = (props) => {

    return (
        <NumberInput
            min={0}
            hideControls
            radius='md'
            parser={(value) => value.replace(/Rp\s?|(,*)/g, '')}
            formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                    ? `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 'Rp '
            }
            icon={<IconReceipt2 />}
            {...props}
        />
    )
}

export default PriceTextInput
