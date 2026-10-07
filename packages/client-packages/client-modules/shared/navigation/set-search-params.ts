import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

export const useCustomSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();

  const setParam = useCallback(({ value, navigate, path }: { value: string; navigate: boolean; path?: string }) => {
    const customPath = path && `/items-for-${path.toLowerCase()}`

    const target = (navigate && customPath) ? `${customPath}` : pathname;
    router.push(`${target}/${value.replaceAll(" ", "_")}`);
  }, [router, pathname]);

  return { setParam };
};

// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// export const useCustomSearchParams = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const pathname = usePathname();

//   const setParam = (value: string, navigate: boolean) => {
//     const params = new URLSearchParams(searchParams.toString());
//     params.set("sbct", value.replaceAll(" ", "_"));

//     router.push(
//       navigate ? `/explore/product?${params.toString()}` : `${pathname}?${params.toString()}`
//     );
//   };

//   return { setParam };
// };
