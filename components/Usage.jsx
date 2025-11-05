import { formatDuration, intervalToDuration } from 'date-fns'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { CrownIcon } from 'lucide-react'

function Usage({ points, msBeforeNext }) {
    return (
        <div className='rounded-t-xl bg-background border border-b-0 p-2.5'>
            <div className='flex items-center gap-x-2'>
                <div>
                    <div className=''>
                        <p className='text-sm'>
                            {points} free credits remaining

                        </p>
                        <p className='text-xs text-muted-foreground'>
                            Resets in {""}
                            {
                                formatDuration(intervalToDuration({
                                    start: new Date(),
                                    end: new Date(Date.now() + msBeforeNext)
                                }),
                                    {
                                        format: ['months', 'days', 'hours']
                                    }
                                )
                            }
                        </p>
                    </div>
                </div>
                <Button asChild size={"sm"} className={"ml-auto"}>
                    <Link href={"/pricing"}>
                    <CrownIcon/>Upgrade
                    </Link>
                    </Button>
            </div>
        </div>
    )
}

export default Usage
