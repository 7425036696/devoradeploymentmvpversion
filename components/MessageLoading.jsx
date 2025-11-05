import Image from "next/image";
import React, { useEffect, useState } from "react";

function Shimmermsgs() {
    const messages = [
        "Thinking...",
        "Loading...",
        "Generating...",
        "Analyzing your request...",
        "Building your website...",
        "Crafting components...",
        "Optimizing layout...",
        "Adding final touches...",
        "Almost ready...",
    ];

    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMsgIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2000); // changes every 2 seconds

        return () => clearInterval(interval); // cleanup on unmount
    }, [messages.length]);

    return (
        <div className="flex items-center gap-2">
            <span className="text-base text-muted-foreground animate-pulse">
                {messages[currentMsgIndex]}

            </span>
        </div>
    );
}

function MessageLoading() {
    return (
        <div className="flex flex-col group px-2 pb-4">
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image
                    height={30}
                    alt='logo png'
                    width={30}
                    src={"https://res.cloudinary.com/drkfojrov/image/upload/v1762177925/cropped-Generated_Image_November_03__2025_-_7_15PM-removebg-preview_h1tscx.png"}
                />
                <span className='text-sm font-medium'>Devora</span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4 ">
                <Shimmermsgs />
            </div>
        </div>
    )
}



export default MessageLoading;
