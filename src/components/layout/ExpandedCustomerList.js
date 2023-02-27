import { Text, Group, TextInput } from "@mantine/core"
import { IconBarcode, IconCodeAsterix, IconClipboardCheck } from "@tabler/icons"


const ExpandedCustomerList = ({ data }) => {
    const { most_ordered_product } = data
    let productName = ''
    let productCode = ''
    let totalOrder = 0

    if (most_ordered_product) {
        const { name, code, total_order } = most_ordered_product
        productName = name
        productCode = code
        totalOrder = total_order
    }

    return (
        <>
            {most_ordered_product ?
                <>

                    <Text
                        align="center"
                        color='dimmed'
                        size='sm'
                        my='xs'
                    >
                        Most ordered product
                    </Text>

                    <Group m='xs' p='xs' grow >

                        <TextInput
                            label='Product name'
                            readOnly
                            radius='md'
                            icon={<IconBarcode />}
                            variant='filled'
                            value={productName}
                        />

                        <TextInput
                            label='Product number'
                            readOnly
                            radius='md'
                            variant='filled'
                            value={productCode}
                            icon={<IconCodeAsterix />}
                        />

                        <TextInput
                            label="Total ordered"
                            readOnly
                            radius='md'
                            variant='filled'
                            value={totalOrder}
                            icon={<IconClipboardCheck />}
                            rightSection={<Text color='dimmed' size='xs' >
                                Unit
                            </Text>}
                        />

                    </Group>
                </>

                :

                <Text
                    align="center"
                    m='md'
                    size='sm'
                    color='dimmed'
                >
                    There are no products ordered by this customer yet
                </Text>
            }

        </>
    )
}

export default ExpandedCustomerList