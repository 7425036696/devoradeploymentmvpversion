import React from 'react';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { format } from "date-fns"
import Image from 'next/image';
import { Code2Icon } from 'lucide-react';
import { ChevronRightIcon } from 'lucide-react';
// User Message Component
const UserMessage = ({ content }) => {
    return (
        <div className="flex justify-end pb-4 pr-2 pl-10">
            <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] wrap-break-word">
                {content}
            </Card>
        </div>
    );
};
const FragementCard = ({ fragment, isActiveFragment, onFragmentClick }) => {
    console.log("Fragment:", fragment);
    console.log("isActiveFragment:", isActiveFragment);
    console.log("data coming from fragment card component ")
    return (
        <button className={cn("flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors ", isActiveFragment && "bg-primary text-primary-foreground border-primary hover:bg-primary")} onClick={() => onFragmentClick()}>
            <Code2Icon className='size-4 mt-0.5 ' />
            <div className='flex flex-col flex-1'>
                <span className='text-sm font-medium line-clamp-1'>
                    {fragment[0].title}
                </span>
                <span className='text-sm'>
                    Preview
                </span>
            </div>
            <div className='flex items-center justify-center mt-0.5'>
                <ChevronRightIcon className='size-4 ' />
            </div>
        </button>
    );
};

// Assistant Message Component (you'll need to create this)
const AssistantMessage = ({ content, error, fragment, createdAt, activeFragment, type, onFragmentClick }) => {
    return (
        <div className={cn("flex flex-col group px-2 pb-4 ", type == "error" ? "text-red-700 dark:text-red-500" : "")}>
            <div className='flex items-center gap-2 pl-2 mb-2 '>
                <Image
                    height={30}
                    alt='logo png'
                    width={30}
                    src={"https://res.cloudinary.com/drkfojrov/image/upload/v1762177925/cropped-Generated_Image_November_03__2025_-_7_15PM-removebg-preview_h1tscx.png"}
                />
                <span className='text-sm font-medium'>Devora</span>
                <span className='text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100'>{
                    format(createdAt, "HH:mm 'on' MMM dd, yyy")
                }</span>
            </div>
            <div className='pl-9 flex flex-col gap-y-4'>  {/* Fixed pl-8.5 to pl-9 */}
                <span>{content}</span>
                {
                    console.log("activeFragement", activeFragment)
                }
                {fragment  && (  /* Only render if fragment exists */
                    <FragementCard
                        key={fragment?.[0].id}
                        fragment={fragment}
                        isActiveFragment={fragment[0]?._id === activeFragment?._id}
                        onFragmentClick={() => onFragmentClick(fragment)}
                    />
                )}
            </div>
        </div>
    );
};

// Main MessageCard Component
function MessageCard({
    role,
    content,
    fragment,
    createdAt,
    activeFragment,
    error,
    type,
    onFragmentClick,
}) {
    return (
        <div>
            {/* Always show user message if role is 'user' */}
            {role === 'user' && <UserMessage content={content} />}

            {/* Show assistant message only if role is 'assistant' and type is 'text' */}
            {role === "assistant" && (
                <AssistantMessage
                    content={content}
                    fragment={fragment}
                    error={error}
                    createdAt={createdAt}
                    activeFragment={activeFragment}
                    onFragmentClick={onFragmentClick}
                    type={type}
                />
            )}
        </div>
    );
}

export default MessageCard;