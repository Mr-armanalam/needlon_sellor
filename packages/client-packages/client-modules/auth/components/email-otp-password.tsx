import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AuthFormReturn } from "@/types/auth-form";

const EmailOtpPassword = ({
  isOtp,
  form,
  setIsOtp,
  setIsSignUp,
}: {
  isOtp: boolean;
  form: AuthFormReturn;
  setIsOtp: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignUp?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleChangeEmail = () => {
    form.setValue("email", "");
    form.setValue("pin", "");
    setIsOtp(false);
    setIsSignUp?.(true);
  }
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Email <span className="text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input
                autoComplete="email"
                className="text-xs focus-visible:ring-0 border focus-visible:border-gray-300 focus-visible:outline-none"
                type="email"
                disabled={isOtp}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {isOtp ? (
        <>
          <Button
            variant={"link"}
            onClick={handleChangeEmail}
            className="text-xs -mt-4 p-1 cursor-pointer decoration-dashed text-stone-500 w-fit"
            type="button"
          >
            Do you want to change the email ?
          </Button>

          <FormField
            key="pin-field" // Forces React to re-mount
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  One-Time Password <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <InputOTP
                    {...field}
                    maxLength={6}
                    autoComplete="one-time-code" 
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ) : (
        <FormField
          key="password-field" 
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="text-xs focus-visible:ring-0 border focus-visible:border-gray-300 focus-visible:outline-none"
                  type="password" 
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default EmailOtpPassword;
