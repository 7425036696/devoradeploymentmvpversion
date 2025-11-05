export async function fetchProjectById(projectId) {
  const res = await fetch(`/api/project/get?projectId=${projectId}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch project");
  }

  return res.json();
}
