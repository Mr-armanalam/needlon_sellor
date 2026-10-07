"use client";

import { Form } from "@/components/ui/form";
import { getSignUp } from "@/modules/auth/server/sign-up";
import { signIn } from "next-auth/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { sendStyledOtpEmail } from "@/modules/shared/navbar/components/email-template";
import SwitchSignup from "@/modules/auth/components/switch-signup";
import FirstAndLastName from "@/modules/auth/components/first-last-name";
import { signupSchema } from "@/modules/auth/schema/signupSchema";
import { signInSchema } from "@/modules/auth/schema/signInSchema";
import { AuthFormValues } from "@/types/auth-form";
import EmailOtpPassword from "@/modules/auth/components/email-otp-password";
import AuthProviderButton from "@/modules/auth/components/auth-provider-button";
import CredentialAuthButton from "@/modules/auth/components/credential-auth-button";
import MobileSwitchSignup from "@/modules/auth/components/mobile-switch-signup";

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isOtp, setIsOtp] = useState(false);
  const [loading, setIsloading] = useState(false);
  const router = useRouter();

  const schema = useMemo(
    () => (isSignUp ? signupSchema : signInSchema),
    [isSignUp],
  );

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: isSignUp
      ? {
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          pin: "",
        }
      : {
          email: "",
          password: "",
        },
  });

  const handleSignIn = async (data: z.infer<typeof signInSchema>) => {
    const { email, password } = data;

    try {
      // Attempt NextAuth Sign In
      setIsloading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });
      setIsloading(false);

      //  Handle NextAuth errors
      if (result?.error) {
        console.error("Sign In Error:", result.error);
        form.setError("email", {
          message: "Email or password is not correct.",
        });
        return;
      }

      // Success handling
      toast.success("Sign In successful, redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      console.error("Unexpected Error during sign in:", error);
      toast.error("A network error occurred. Please try again.");
    }
  };

  const handleSignUp = async (data: z.infer<typeof signupSchema>) => {
    const { firstname, lastname, email, password, pin } = data;

    // Handle OTP Request
    if (!isOtp) {
      try {
        setIsloading(true);
        await sendStyledOtpEmail(email);
        form.setValue("pin", "");
        setIsOtp(true);
        setIsloading(false);
        toast.success("OTP sent to your email!");
        return; // STOP HERE. Wait for user to enter PIN and click button again.
      } catch (error: any) {
        console.error(error);
        form.setError("email", {
          message: error?.message || "Failed to send OTP",
        });
        setIsloading(false);
        return;
      }
    }

    // Final Submission (User has entered the PIN)
    if (pin) {
      try {
        // NOTE: Verify PIN and Hash Password INSIDE this function (Server Side)
        setIsloading(true);
        const result = await getSignUp({
          firstname: firstname ?? "",
          lastname: lastname ?? "",
          email,
          password, // plain password, hash it on the server!
          pin, // pin, verify it on the server!
        });

        if (result.success) {
          // Sign in the user automatically
          const loginResponse = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          if (loginResponse?.error) {
            toast.error(
              "Account created, but login failed. Please sign in manually.",
            );
            return;
          }

          setIsloading(false);

          toast.success("Sign Up successful! Redirecting...");

          // Next.js router.push; 1000ms is good for the user to read the toast
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          setIsloading(false);

          // Handle known backend errors (like "User already exists")
          form.setError("email", {
            type: "manual",
            message: result.message,
          });
          toast.error(result.message);
        }
      } catch (err) {
        // Handle unexpected network/code crashes
        toast.error("Network error. Please try again later.");
      }
    }
  };

  return (
    <div className=" flex justify-center items-center h-[80vh] max-md:px-4 md:px-12 ">
      <div className="grid border shadow-inne shadow-[12px_12px_35px_rgba(0,0,0,0.25)] h-fit w-full grid-cols-2 rounded-3xl bg-white max-sm:grid-cols-1 max-sm:p-6 sm:p-16 lg:w-[72vw]">
        <SwitchSignup
          setIsOtp={setIsOtp}
          isSignUp={isSignUp}
          setIsSignUp={setIsSignUp}
        />

        <div>
          <Form
            // key={isSignUp ? "signup" : "signin"}
            {...form}
          >
            <form
              className="flex flex-col gap-2"
              onSubmit={form.handleSubmit(
                isSignUp ? handleSignUp : handleSignIn,
              )}
            >
              {isSignUp && !isOtp && <FirstAndLastName form={form} />}
              <EmailOtpPassword
                setIsOtp={setIsOtp}
                setIsSignUp={setIsSignUp}
                isOtp={isOtp}
                form={form}
              />
              <CredentialAuthButton loading={loading} isSignUp={isSignUp} />
            </form>
          </Form>

          {!isSignUp && (
            <AuthProviderButton setIsLoading={setIsloading} loading={loading} />
          )}

          {/* extra for responsive */}
          <MobileSwitchSignup isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
