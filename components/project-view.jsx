"use client";

import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import MessagesContainer from "./MessagesContainer";
import ProjectHeader from "./ProjectHeader";
import FragmentWeb from "./FragmentWeb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { EyeIcon } from "lucide-react";
import { CodeIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { CrownIcon } from "lucide-react";
import FileExplorer from "./FileExplorer";

export default function ProjectView({ projectId }) {
  const [activeFragement, setActiveFragment] = useState(null);
  const [tabState, setTabState] = useState("demo")
  const [projectDetails, setProjectDetails] = useState(null);
  const fetchProjectDetails = async () => {
    try {
      const response = await fetch("/api/project/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: projectId } || {}), // ✅ ensure it's not undefined
        cache: "no-store", // ✅ optional: avoids caching in Next.js
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to fetch project details: ${errText}`);
      }

      const projectDetails = await response.json();
      setProjectDetails(projectDetails);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  if (!projectId) return <p className="p-6">No project selected.</p>;
  { console.log(activeFragement?.[0].files[0], "import") }
  return (
    <ResizablePanelGroup
      direction="horizontal"
      id="_R_2nebn5rlb_"
      className="max-h-screen h-screen overflow-hidden"
    >
      <ResizablePanel
        defaultSize={35}
        minSize={20}
        className="flex flex-col min-h-0"
      >
        <ProjectHeader projectId={projectId} projectName={projectDetails?.name} />
        <MessagesContainer projectId={projectId} activeFragement={activeFragement} setActiveFragment={setActiveFragment} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={65} minSize={50}>

        <Tabs className={"h-full gap-y-0"} defaultValue="preview" value={tabState} onValueChange={(value) => setTabState(value)}>
          <div className="w-full flex items-center p-2 border-b gap-x-2 ">
            <TabsList className={"rounded-md border h-8 p-0"}>
              <TabsTrigger value="demo" className={"rounded-md"}>
                <EyeIcon /> <span className="">Demo</span>
              </TabsTrigger>
              <TabsTrigger value="code" className={"rounded-md"}>
                <CodeIcon /> <span className="">Code</span>
              </TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-x-2 ">
              <Button asChild size={"sm"} variant={"default"}>
                <Link href={"/pricing"}>
                  <CrownIcon /> Upgrade
                </Link>
              </Button>
            </div>
          </div>
          <TabsContent value="demo">
            {
              activeFragement && <FragmentWeb data={activeFragement[0]} />
            }
          </TabsContent>
          <TabsContent value="code">
            {
              activeFragement?.[0].files && (
                <FileExplorer
                  files={activeFragement[0].files}
                />
              )
            }
          </TabsContent>
        </Tabs>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
