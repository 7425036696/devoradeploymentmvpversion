"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/project/getall", { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch projects");
                const data = await res.json();
                setProjects(data?.projects || []);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="w-full bg-white dark:bg-sidebar gap-y-6 rounded-xl p-8 border flex flex-col sm:gap-y-4">
            <h2 className="text-2xl font-semibold">Saved Projects</h2>

            {loading ? (
                <div className="text-center text-muted-foreground text-sm">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {projects.length === 0 ? (
                        <div className="col-span-full text-center">
                            <p className="text-sm text-muted-foreground">No Projects Found</p>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <Button
                                asChild
                                key={project._id}
                                variant="outline"
                                className="font-normal h-auto justify-start w-full text-start p-4"
                            >
                                <Link href={`/project/${project._id}`} className="flex items-center gap-3 w-full">
                                    <Image
                                        src={
                                            "https://res.cloudinary.com/drkfojrov/image/upload/v1762177925/cropped-Generated_Image_November_03__2025_-_7_15PM-removebg-preview_h1tscx.png"
                                        }
                                        alt="logo"
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                    <div className="flex flex-col">
                                        <h3 className="font-medium truncate">{project.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {project.updatedAt
                                                ? formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })
                                                : "No update info"}
                                        </p>
                                    </div>
                                </Link>
                            </Button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default ProjectList;
