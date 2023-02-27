import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";


const SearchTextInput = ({ query, setValueQuery }) => {

    return (
        <TextInput
            placeholder="Search"
            icon={<IconSearch />}
            radius='md'
            value={query}
            onChange={setValueQuery}
        />
    )
}

export default SearchTextInput

