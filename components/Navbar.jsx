"use client";
import { SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { SignedIn } from '@clerk/nextjs';
import Image from 'next/image';
import useScroll from '@/app/hooks/useScroll';
import { cn } from '@/lib/utils';

function Navbar() {
    const isScroll = useScroll()
    return (
        <nav className={cn('left-0 z-50 transition-all duration-200 border-transparent p-4 bg-transparent fixed top-0 right-0', isScroll && "bg-background border-border")}>
            <div className='max-w-5xl mx-auto w-full flex justify-between items-center '>
                <Link href={"/"} className='flex items-center gap-2'>
                    <Image src={"https://res.cloudinary.com/drkfojrov/image/upload/v1762177925/cropped-Generated_Image_November_03__2025_-_7_15PM-removebg-preview_h1tscx.png"}
                        alt="logo"
                        width={24}
                        height={24}
                    />
                    <span className='text-lg font-semibold'>Devora</span>
                </Link>
                <SignedOut>
                    <div className='gap-2 flex '>
                        <SignUpButton>
                            <Button variant={"outline"} size="sm">
                                Sign up
                            </Button>
                        </SignUpButton>
                        <SignInButton>
                            <Button size="sm">
                                Sign In
                            </Button>
                        </SignInButton>
                    </div>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    )
}

export default Navbar
