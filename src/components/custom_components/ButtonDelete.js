import { Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons";

const ButtonDelete = (props) => {

    // separated button delete component

    return (
        <Button
            leftIcon={<IconTrash stroke={2} size={16} />}
            color='red.6'
            variant='subtle'
            radius='md'
            {...props}
        >
            Delete
        </Button>
    )

}

export default ButtonDelete
