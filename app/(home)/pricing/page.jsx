"use client";
import { PricingTable } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import React from 'react'

function page() {
    const {theme} = useTheme()
    return (
        <div className='flex flex-col max-w-3xl mx-auto w-full'>
            <section className='space-y-6 pt-[16vh] 2xl:pt-48'>
                <div className='flex flex-col items-center'>
                    <Image
                        src="https://res.cloudinary.com/drkfojrov/image/upload/v1762177925/cropped-Generated_Image_November_03__2025_-_7_15PM-removebg-preview_h1tscx.png"
                        alt="logo"
                        width={50}
                        height={50}
                        className="hidden md:block"
                    />
                </div>
                <h1 className='text-xl md:text-3xl font-bold text-center'>Pricing</h1>
                <p className='text-muted-foreground text-center text-sm md:text-base'>
                    Choose the plans that fit your needs best.
                </p>
                <PricingTable appearance={{
                    baseTheme: theme === "dark"? dark : undefined,
                    elements:{
                        pricingTableCard:"border shadow-none rounded-lg "
                    }
                }} />

            </section>

        </div>
    )
}

export default page
