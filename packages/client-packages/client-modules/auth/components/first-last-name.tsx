import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthFormReturn } from "@/types/auth-form";


const FirstAndLastName = ({ form }:{form:AuthFormReturn}) => {
  return (
    <div className="flex gap-x-3 justify-between">
      <FormField
        control={form.control}
        name="firstname"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>
              First Name <span className="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input
                className=" text-xs focus-visible:ring-0 focus-visible:border-gray-300 focus-visible:outline-none"
                type="text"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastname"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>
              Last Name <span className="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input
                className=" text-xs focus-visible:ring-0 focus-visible:border-gray-300 focus-visible:outline-none"
                type="text"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FirstAndLastName;
