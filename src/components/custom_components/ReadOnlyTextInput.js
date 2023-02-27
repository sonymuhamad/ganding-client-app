import { TextInput } from "@mantine/core";


const ReadOnlyTextInput = (props) => {

    return (
        <TextInput
            variant='filled'
            radius='md'
            readOnly
            {...props}
        />
    )
}

export default ReadOnlyTextInput