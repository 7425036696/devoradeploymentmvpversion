"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { inngest } from "@/app/inngest/client";

export default function ClientHome() {
  const [userInput, setUserInput] = useState("");
  const [projectName, setProjectName] = useState(null);
  const router = useRouter();

  // 🧠 Mutation: run Inngest task
  const inngestMutation = useMutation({
    mutationFn: async (value) => {
      if (!value.trim()) throw new Error("Prompt required");
      const name = `Project-${Math.random().toString(36).substring(2, 8)}`;
      setProjectName(name);
      await inngest.send({ name: "coding-agent/run", data: { value, projectName: name } });
      return name;
    },
  });

  // ⚙️ Query: fetch project once projectName exists
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectName],
    queryFn: async () => {
      const res = await fetch(`/api/projects?name=${projectName}`);
      if (!res.ok) throw new Error("Project not found");
      const { project } = await res.json();
      return project;
    },
    enabled: !!projectName, // 👈 only runs when projectName is set
    retry: 3,
    refetchInterval: 2000, // 🔁 optional: keep polling until project appears
  });

  // 🚀 Redirect once project is ready
  if (data?._id) {
    router.push(`/project/${data._id}`);
  }

  return (
    <div className="p-8">
      <input
        type="text"
        placeholder="Enter prompt"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="border px-4 py-2 rounded mr-3"
      />
      <button
        onClick={() => inngestMutation.mutate(userInput)}
        disabled={inngestMutation.isPending}
        className="bg-black text-white px-5 py-2 rounded"
      >
        {inngestMutation.isPending ? "Running..." : "Run Task"}
      </button>

      {isLoading && projectName && <p>Waiting for project...</p>}
      {isError && <p className="text-red-500">Failed to fetch project.</p>}
    </div>
  );
}
