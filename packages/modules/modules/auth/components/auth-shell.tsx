"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthShell({
  title,
  description,
  children,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="w-full max-w-md"
    >
      <Card className="p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            {title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {children}
      </Card>
    </motion.div>
  );
}