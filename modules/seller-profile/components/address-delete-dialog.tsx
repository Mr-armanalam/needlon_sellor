import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React from "react";
import {SaveStatus} from "@/modules/seller-profile/section/seller-foundation-page";

export function AddressDeleteDialog({isDeleting, setSaveStatus, remove, addressId}:{
    isDeleting:boolean;
    remove: (id: string) => Promise<void>;
    setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
    addressId: string;
}) {
    const handleDelete = async (
        addressId: string,
    ) => {

        try {
            setSaveStatus("Saving...");

            await remove(addressId);

            setSaveStatus("Saved ✓");
        } catch {
            setSaveStatus("Changes pending");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger render={
                <button
                    type="button"
                    disabled={isDeleting}
                    className="text-red-600 cursor-pointer hidden group-hover:block hover:text-red-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                    Delete
                </button>
            } />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this address?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(addressId)}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
