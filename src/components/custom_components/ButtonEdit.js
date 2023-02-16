import { Button } from "@mantine/core";
import { IconEdit } from "@tabler/icons";

const ButtonEdit = (props) => {

    // separated button edit component

    return (
        <Button
            leftIcon={<IconEdit stroke={2} size={16} />}
            color='blue.6'
            variant='subtle'
            radius='md'
            {...props}
        >
            Edit
        </Button>
    )

}

export default ButtonEdit
