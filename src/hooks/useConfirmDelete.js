import { openConfirmModal } from "@mantine/modals";
import { Text } from "@mantine/core";
import { useCallback } from "react";

export const useConfirmDelete = ({ entity }) => {

    const openConfirmDeleteData = useCallback((handleDelete) => openConfirmModal({
        title: `Delete ${entity}`,
        children: (
            <Text size="sm">
                Are you sure?, deleted data cannot be recovered.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDelete(),
    }), [entity])

    return {
        openConfirmDeleteData
    }

}
