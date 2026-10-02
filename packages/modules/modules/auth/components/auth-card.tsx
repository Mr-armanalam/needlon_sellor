import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
}: Props) {
  return (
    <Card className="w-full max-w-md p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">
          {title}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {description}
        </p>
      </div>

      {children}
    </Card>
  );
}