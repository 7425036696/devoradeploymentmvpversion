import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { ChevronDownIcon } from 'lucide-react'
import { ChevronLeftIcon } from 'lucide-react'
import { SunMoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import Image from 'next/image'

function ProjectHeader({ projectId,projectName }) {
    const { theme, setTheme } = useTheme()

    return (
        <header className="p-2 flex justify-between items-center border-b">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className={"focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!"}>
                        <Image
                            height={30}
                            alt='logo png'
                            width={30}
                            src={"https://res.cloudinary.com/drkfojrov/image/upload/v1762177925/cropped-Generated_Image_November_03__2025_-_7_15PM-removebg-preview_h1tscx.png"}
                        />
                        <span className='text-sm font-medium'>{projectName || "No project selected"}</span>
                        <ChevronDownIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start">
                    <DropdownMenuItem asChild>
                        <Link href={"/"}>
                            <ChevronLeftIcon />
                            <span>
                                Dashboard
                            </span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className={"gap-2"}>
                            <SunMoonIcon className='size-4 text-muted-foreground' />
                            <span>Appearance</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={theme} onValueChange={(newValue) => {
                                    setTheme(newValue)
                                }}>
                                    <DropdownMenuRadioItem value="dark">
                                        <span>Dark</span>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="light">
                                        <span>Light</span>
                                    </DropdownMenuRadioItem>

                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}

export default ProjectHeader
