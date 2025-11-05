"use client";
import React, { useState } from "react";
import { emoji, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize"
import { Loader2Icon } from "lucide-react";
import { inngest } from "@/app/inngest/client";
import { useUser } from '@clerk/nextjs'; // or '@clerk/react'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const formSchema = z.object({
    value: z.string(),
});
export const PROJECT_TEMPLATES = [
    {
        emoji: "🎬",
        title: "Build a Netflix clone",
        prompt:
            "Build a Netflix-style homepage with a hero banner (use a nice, dark-mode compatible gradient here), movie sections, responsive cards, and a modal for viewing details using mock data and local state. Use dark mode.",
    },
    {
        emoji: "📦",
        title: "Build an admin dashboard",
        prompt:
            "Create an admin dashboard with a sidebar, stat cards, a chart placeholder, and a basic table with filter and pagination using local state. Use clear visual grouping and balance in your design for a modern, professional look.",
    },
    {
        emoji: "📋",
        title: "Build a kanban board",
        prompt:
            "Build a kanban board with drag-and-drop using react-beautiful-dnd and support for adding and removing tasks with local state. Use consistent spacing, column widths, and hover effects for a polished UI.",
    },
    {
        emoji: "🗂️",
        title: "Build a file manager",
        prompt:
            "Build a file manager with folder list, file grid, and options to rename or delete items using mock data and local state. Focus on spacing, clear icons, and visual distinction between folders and files.",
    },
    {
        emoji: "📺",
        title: "Build a YouTube clone",
        prompt:
            "Build a YouTube-style homepage with mock video thumbnails, a category sidebar, and a modal preview with title and description using local state. Ensure clean alignment and a well-organized grid layout.",
    },
    {
        emoji: "🛍️",
        title: "Build a store page",
        prompt:
            "Build a store page with category filters, a product grid, and local cart logic to add and remove items. Focus on clear typography, spacing, and button states for a great e-commerce UI.",
    },
    {
        emoji: "🏡",
        title: "Build an Airbnb clone",
        prompt:
            "Build an Airbnb-style listings grid with mock data, filter sidebar, and a modal with property details using local state. Use card spacing, soft shadows, and clean layout for a welcoming design.",
    },
    {
        emoji: "🎵",
        title: "Build a Spotify clone",
        prompt:
            "Build a Spotify-style music player with a sidebar for playlists, a main area for song details, and playback controls. Use local state for managing playback and song selection. Prioritize layout balance and intuitive control placement for a smooth user experience. Use dark mode.",
    }
]
function ProjectForm() {
    const {isSignedIn} = useUser()
    const router = useRouter()
    const [isFocused, setIsFocused] = useState(false);
    const [showUsage, setShowUsage] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        },
    });

    const onSubmit = async (values) => {
        try {
            setIsLoading(true)
            form.reset()
            if(isSignedIn === false){
                router.push("/sign-in")
            }
            const content = {
                value: values.value,
            };
            const res = await fetch("/api/project/create", {
                method: "POST",
                body:JSON.stringify(content),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Failed to create project");

            const { projectId } = await res.json();
            console.log(projectId, "projectId")
            if (projectId) {
                await inngest.send({ name: "coding-agent/run", data: { value: values.value, projectId: projectId } });
            }


            // 2️⃣ Redirect immediately to /project/[projectId]
            router.push(`/project/${projectId}`);
        } catch (error) {
            console.error("Error creating message:", error);
        } finally {
            setIsLoading(false)
        }
    };
    const onSelect = (content) => {
        form.setValue("value", content, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        })
    }

    return (
        <Form {...form}>
            <section className="space-y-6">

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn(
                        "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
                        isFocused && "shadow-xs",
                        showUsage && "rounded-t-none"
                    )}
                >
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <TextareaAutosize
                                disabled={isLoading}
                                {...field}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                minRows={2}
                                maxRows={8}
                                className="pt-4 resize-none border-none w-full outline-none bg-transparent "
                                placeholder="What would you like to build?"
                                onKeyDown={(e) => {
                                    if (e.key == "Enter" && (e.ctrlKey || e.metaKey)) {
                                        e.preventDefault()
                                        form.handleSubmit(onSubmit)(e)
                                    }
                                }}
                            />
                        )}
                    />
                    <div className="flex gap-x-2 items-end justify-between pt-2 ">
                        <div className="text-[10px] text-muted-foreground font-mono ">
                            <kbd className=" ml-auto pointer-events-none inline-flex h-5 select-none items-cetner gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                                <span className="text-center flex justify-center items-center">⌘ Enter</span>

                            </kbd>
                            &nbsp; to submit
                        </div>
                        <Button className={cn("size-8 rouonded-full ", isLoading && "bg-muted-foreground border")} disabled={isLoading}>
                            {
                                isLoading ? (
                                    <Loader2Icon className="size-4 animate-spin" />
                                ) : (
                                    <ArrowUpIcon />

                                )
                            }
                        </Button>
                    </div>
                </form>
                <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
                    {
                        PROJECT_TEMPLATES.map((tempelate) => {
                            return (
                                <Button variant={"outline"} size={"sm"} key={tempelate.title} className={"bg-white dark:bg-sidebar"} onClick={() => onSelect(tempelate.prompt)}>
                                    {tempelate.emoji}{tempelate.title}
                                </Button>
                            )

                        })
                    }
                </div>
            </section>

        </Form>
    );
}

export { ProjectForm };
