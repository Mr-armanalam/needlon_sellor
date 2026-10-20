"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { sendEmails } from "../utils";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.email().min(10, {
    message: "Email is Required",
  }),
  subject: z.string().min(2, {
    message: "subject must be at least 2 charactors.",
  }),
  phone: z.string().optional(),
  message: z.string().min(2, {
    message: "Please write at least 2 charactors.",
  }),
});

const ContactForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      phone: undefined,
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
  if (values === undefined) return;
  try {
    await sendEmails(values);
    toast("Thank you for reach out to us");
    form.reset();
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error");
    toast("Something went wrong!");
    return;
  }
}
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-2 text-xs"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="outline-1 rounded-xs p-2"
                  placeholder="Enter Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  className="outline-1 rounded-xs p-2"
                  placeholder="Enter Email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  className="outline-1 rounded-xs p-2"
                  placeholder="Enter Subject"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="string"
                  className="outline-1 rounded-xs p-2"
                  placeholder="Enter Phone"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormControl>
                <Textarea
                  placeholder="Message"
                  rows={6}
                  className="outline-1 rounded-xs p-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-x-4">
          <Button
            type="submit"
            className=" cursor-pointer px-4 py-2.5 rounded-md bg-stone-700 text-white"
          >
            SEND MESSAGE
          </Button>
          <Button
            onClick={() => form.reset()}
            variant={"outline"}
            type="button"
            className="border cursor-pointer border-stone-300 px-4 font-semibold rounded-md"
          >
            RESET
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
