"use client";

import React, { useState } from "react";
import AddNewAddress from "../ui/add-new-address";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { userAddress } from "@/db/schema/user-address";
import { EllipsisVertical, HomeIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import NoUserAddress from "../shared/no-user-address";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAddressApi, getAddresses } from "../server/api/address";
import AddressSkeleton from "./loadingAddress";

const AddressView = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  const [editingAddress, setEditingAddress] = useState<
    typeof userAddress.$inferSelect | null
  >(null);
  const [accordionValue, setAccordionValue] = useState<string | undefined>();

  
  const {
    data: addresses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["addresses", userId],
    queryFn: () => getAddresses(userId!),
    enabled: !!userId,
  });


  const deleteMutation = useMutation({
    mutationFn: deleteAddressApi,
    onSuccess: () => {
      toast.success("Address deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["addresses", userId],
      });
    },
    onError: () => {
      toast.error("Failed to delete address");
    },
  });


  const onDeleteAddress = (id: string) => {
    deleteMutation.mutate(id);
  };

  const onEditAddress = (addr: typeof userAddress.$inferSelect) => {
    if (!session?.user.id) return;
    setAccordionValue("item-1");
    setEditingAddress(addr);
  };

  return (
    <div>
      <h1 className="text-xl mb-6 text-stone-800 dark:text-white font-garamond font-semibold">
        Manage Address
      </h1>

      <AddNewAddress
        accordionValue={accordionValue}
        setAccordionValue={setAccordionValue}
        editingAddress={
          editingAddress
            ? {
                name: editingAddress.name,
                phone: editingAddress.phone,
                pincode: editingAddress.pincode,
                locality: editingAddress.locality,
                address: editingAddress.address,
                city: editingAddress.city,
                state: editingAddress.state,
                id: editingAddress.id,
                landmark: editingAddress.landmark ?? "",
                alternate_phone: editingAddress.alternate_phone ?? "",
              }
            : null
        }
        clearEditing={() => setEditingAddress(null)}
      />

      <div className="mt-6">
        {isLoading && <AddressSkeleton />}

        {!isLoading && error && (
          <p className="text-red-600 text-sm">{error.message}</p>
        )}

        {!isLoading && !error && addresses.length === 0 && (
          <NoUserAddress Icon={HomeIcon} description="No address saved" />
        )}

        {!isLoading && addresses.length > 0 && (
          <div className="border dark:border-stone-900 border-stone-200 rounded-xs">
            {addresses.map((addr) => (
              <div
                className="border-b relative dark:border-stone-900 border-stone-200 rounded-xs py-5 px-8"
                key={addr.id}
              >
                <HoverCard>
                  <HoverCardTrigger className="absolute cursor-pointer right-4">
                    <EllipsisVertical size={17} />
                  </HoverCardTrigger>
                  <HoverCardContent
                    align="end"
                    className="max-w-28 p-1.5 text-sm"
                  >
                    <div
                      onClick={() => onEditAddress(addr)}
                      className="hover:bg-stone-100 px-2.5 cursor-pointer py-1.5 rounded"
                    >
                      Edit
                    </div>
                    <div
                      onClick={() => onDeleteAddress(addr.id)}
                      className="hover:bg-stone-100 cursor-pointer px-2.5 py-1.5 rounded"
                    >
                      Delete
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <p className="font-semibold mb-2">
                  {addr.name}&nbsp; &nbsp;{addr.phone}&nbsp; &nbsp;
                  {addr?.alternate_phone}
                </p>
                <p className="text-sm max-w-[500px]">
                  {addr.address}, {addr.city}, {addr.landmark}, {addr.locality},{" "}
                  {addr.state} - {addr.pincode}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressView;
