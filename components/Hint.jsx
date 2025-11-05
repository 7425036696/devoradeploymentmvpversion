"use client"
import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

function Hint({children,text,side="top",align ="center"}) {
  return (
   <TooltipProvider>
    <Tooltip>
        <TooltipTrigger asChild>
            {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
            <p>{text}</p>
        </TooltipContent>
    </Tooltip>
   </TooltipProvider>
  )
}

export default Hint
