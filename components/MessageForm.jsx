"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { inngest } from "@/app/inngest/client";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Usage from "./Usage";

const formSchema = z.object({
  value: z.string().min(1, "Message cannot be empty"),
});

function MessageForm({ projectId }) {
  const { isSignedIn } = useUser();

  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usageData, setUsageData] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
  });

  // 🔹 Define reusable fetchUsage function
  const fetchUsage = async () => {
    try {
      const res = await fetch("/api/usage/status");
      if (!res.ok) throw new Error("Failed to fetch usage");
      const data = await res.json();
      setUsageData(data);
    } catch (err) {
      console.error("Failed to fetch usage:", err);
    }
  };

  // 🔹 Call once when mounted
  useEffect(() => {
    fetchUsage();
  }, []);

  const onSubmit = async (values) => {
    if (!isSignedIn) {
      redirect("/sign-in");
      return;
    }

    try {
      setIsLoading(true);

      const content = { value: values.value, projectId };
      const res = await fetch("/api/messages/create", {
        method: "POST",
        body: JSON.stringify(content),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create Message");

      await inngest.send({
        name: "coding-agent/run",
        data: { value: values.value, projectId },
      });

      form.reset();

      // 🔹 Refetch usage after message created
      await fetchUsage();

    } catch (error) {
      console.error("Error creating message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const usageExceeded = usageData?.remainingPoints === 0;

  return (
    <Form {...form}>
      {usageData && (
        <Usage
          points={usageData.remainingPoints}
          msBeforeNext={usageData.msBeforeNext}
        />
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          isFocused && "shadow-xs",
          usageData && "rounded-t-none"
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              disabled={isLoading || usageExceeded}
              {...field}
              placeholder={
                usageExceeded
                  ? "Usage limit reached — please wait or upgrade."
                  : "What would you like to build?"
              }
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="pt-4 resize-none border-none w-full outline-none bg-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />

        <div className="flex gap-x-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ⌘ Enter
            </kbd>{" "}
            to submit
          </div>

          <Button
            className={cn(
              "size-8 rounded-full",
              isLoading && "bg-muted-foreground border"
            )}
            disabled={isLoading || usageExceeded}
          >
            {isLoading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { MessageForm };
