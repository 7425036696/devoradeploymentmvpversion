import ProjectView from "@/components/project-view";

export default async function ProjectPage({ params }) {
    const paramss = await params
    const projectId = paramss.projectId
    return (

        <ProjectView projectId={projectId} />

    );
}
