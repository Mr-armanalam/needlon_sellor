import { UseFormReturn } from "react-hook-form";

type SignInValues = {
  email: string;
  password: string;
};

type SignUpValues = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  pin: string;
};

// This union type represents both possible states of your form
export type AuthFormValues = SignInValues | SignUpValues;

// This is the type for your 'form' variable
export type AuthFormReturn = UseFormReturn<AuthFormValues>;