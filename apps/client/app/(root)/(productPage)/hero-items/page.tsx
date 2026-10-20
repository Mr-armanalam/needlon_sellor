"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function HeroItemUpload() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formElement = e.currentTarget;
    const form = new FormData(formElement);

    const res = await fetch("/api/hero-items", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success("Hero item uploaded!");
      formElement.reset();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload Hero Item</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border p-6 rounded-xl shadow"
      >
        <Input name="name" placeholder="Item Name" required />
        <Textarea name="description" placeholder="Description" required />
        <Input name="offer" placeholder="Offer" required />
        <Input name="slug" placeholder="Slug" />

        <Input type="file" name="image" accept="image/*" required />

        <Button disabled={loading} className="w-full">
          {loading ? "Uploading..." : "Upload Item"}
        </Button>
      </form>
    </div>
  );
}
