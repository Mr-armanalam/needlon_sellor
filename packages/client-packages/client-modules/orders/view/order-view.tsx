"use client";
import React, { useEffect, useState } from "react";
import SearchOrder from "../ui/search-order";
import DisplayOrders from "../ui/display-orders";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/modules/account/server/api/order";
import { useDebounce } from "@/hooks/use-debounce";
import { GroupedOrder } from "@/types/order";

type Props = {
  initialSearch: string;
};

const OrderView = ({ initialSearch }: Props) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchValue);

  useEffect(() => {
    const query = new URLSearchParams();
    if (debouncedSearch.trim()) {
      query.set("search", debouncedSearch);
    }

    router.replace(`?${query.toString()}`);
  }, [debouncedSearch, router]);

  const { data: orders = [] } = useQuery<GroupedOrder[]>({
    queryKey: ["orders", initialSearch],
    queryFn: () => fetchOrders(initialSearch),
  });

  return (
    <>
      <SearchOrder
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={() => {
          const params = new URLSearchParams();
          if (searchValue) params.set("search", searchValue);
          router.push(`?${params.toString()}`);
        }}
      />
      <DisplayOrders orders={orders} loading={false} />
    </>
  );
};

export default OrderView;
