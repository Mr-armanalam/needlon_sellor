import { PlusIcon } from "lucide-react";
import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateAddressApi, fetchStatesApi } from "../server/api/address";

export const FormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Number must be at least 10 digits." }),
  pincode: z.string().min(6, { message: "Pincode must be 6 digits." }),
  locality: z
    .string()
    .min(2, { message: "Locality must be at least 2 characters." }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters." }),
  city: z
    .string()
    .min(2, { message: "City name must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  landmark: z
    .string()
    .min(2, { message: "Landmark must be at least 2 characters." }),
  alternate_phone: z.string().optional(),
});

type AddressFormData = z.infer<typeof FormSchema> & { id?: string };

type Props = {
  editingAddress?: AddressFormData | null;
  clearEditing?: () => void;
  accordionValue: string | undefined;
  setAccordionValue: (state: string | undefined) => void;
};

const AddNewAddress = ({
  editingAddress,
  clearEditing,
  setAccordionValue,
  accordionValue,
}: Props) => {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const queryClient = useQueryClient();


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phone: "",
      pincode: "",
      locality: "",
      address: "",
      city: "",
      state: "",
      landmark: "",
      alternate_phone: "",
    },
  });

  const clearAddressForm = () => {
    form.reset();
    clearEditing?.();
    setAccordionValue(undefined);
  };

  useEffect(() => {
    if (editingAddress) {
      form.reset(editingAddress);
      setAccordionValue("item-1");
    } else {
      form.reset();
      setAccordionValue(undefined);
    }
  }, [editingAddress, form, setAccordionValue]);

  const addOrUpdateMutation = useMutation({
    mutationFn: addOrUpdateAddressApi,
    onSuccess: () => {
      toast.success("Address saved successfully!");
      queryClient.invalidateQueries({
        queryKey: ["addresses", userId],
      });
      clearAddressForm();
    },
    onError: () => {
      toast.error("Something went wrong while saving the address.");
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const userId = session?.user.id;
    if (!userId) return toast.error("You must be logged in to save address.");

    try {
      addOrUpdateMutation.mutate({
        userId,
        data: {
          ...data,
          alternate_phone: data.alternate_phone ?? "",
          userId,
        },
        editingAddressId: editingAddress?.id,
      });

      toast.success("Address saved successfully!");
      queryClient.invalidateQueries({
        queryKey: ['addresses', userId]
      })
      clearAddressForm();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while saving the address.");
    }
  };

  const {
    data: allState = [],
    // isLoading: stateLoading,
    // error: stateError,
  } = useQuery({
    queryKey: ["states"],
    queryFn: fetchStatesApi,
    staleTime: Infinity,
  });

  return (
    <Accordion
      className="border bg-stone-100 dark:bg-black rounded-xs px-3"
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="justify-start cursor-pointer text-blue-700 hover:no-underline flex items-center gap-x-2">
          <PlusIcon size={18} />
          <h2 className="font-semibold">ADD NEW ADDRESS</h2>
        </AccordionTrigger>

        <AccordionContent className="max-w-200">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 p-1 space-x-4 space-y-4"
            >
              {[
                "name",
                "phone",
                "pincode",
                "locality",
                "city",
                "landmark",
                "alternate_phone",
              ].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as keyof z.infer<typeof FormSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="rounded-xs border-none shadow-sm focus-visible:ring-1 bg-white px-3 col-span-1 h-11"
                          placeholder={fieldName
                            .replace("_", " ")
                            .toUpperCase()}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write your full address"
                          className="resize-none border-none shadow-sm focus-visible:ring-1 bg-white rounded-xs h-[100px] col-span-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="min-h-11 border-none shadow-sm focus-visible:ring-1 bg-white rounded-xs w-full">
                          <SelectValue placeholder="Select Your State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allState.length !== 0 &&
                          allState.map((state) => (
                            <SelectItem
                              key={state.state_code}
                              value={state.name}
                            >
                              {state.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <br className="md:hidden"/>
              <div className="col-span-1 flex gap-x-4">
                <Button
                  className="rounded-xs cursor-pointer w-fit"
                  type="submit"
                  disabled={addOrUpdateMutation.isPending}
                >
                  {addOrUpdateMutation.isPending ? "Saving..." : "Submit"}
                </Button>
                <Button
                  onClick={clearAddressForm}
                  className="rounded-xs cursor-pointer w-fit"
                  type="button"
                  variant="outline"
                >
                  Clear
                </Button>
              </div>
            </form>
          </Form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AddNewAddress;
