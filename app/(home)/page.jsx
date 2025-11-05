import { currentUser } from '@clerk/nextjs/server';
import ClientHome from "../ClientHome";
import { ProjectForm } from "./ProjectForm";
import Image from "next/image";
import ProjectList from "./ProjectList";

export default async function Home() {
  const user = await currentUser(); // Get the current signed-in user
  const isSignedIn = !!user; // Boolean value

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image
            src="https://res.cloudinary.com/drkfojrov/image/upload/v1762177925/cropped-Generated_Image_November_03__2025_-_7_15PM-removebg-preview_h1tscx.png"
            alt="logo"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="font-bold text-center md:text-5xl text-2xl">
          Build Something with Devora
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
          Create websites by chatting with AI
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>

      {isSignedIn && <ProjectList />}
    </div>
  );
}
