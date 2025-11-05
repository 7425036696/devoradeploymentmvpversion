import React, { useState } from 'react'
import { Button } from './ui/button'
import { RefreshCcwIcon, ExternalLinkIcon } from 'lucide-react'
import Hint from './Hint'

function FragmentWeb({ data }) {
    const [copied, setCopied] = useState(false)
    const [key, setKey] = useState(0)

    const onRefresh = () => {
        setKey((prev) => prev + 1)
    }

    const handleCopy = async () => {
        if (!data.sandboxUrl) return
        await navigator.clipboard.writeText(data.sandboxUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className='flex flex-col w-full h-full'>
            <div className='p-2 border-b bg-sidebar flex items-center gap-x-2'>
                {/* Refresh Button (small width) */}
                <Hint text="Refresh" side="bottom" align="start">

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onRefresh}
                        className="w-10 flex justify-center items-center"
                    >
                        <RefreshCcwIcon size={16} />
                    </Button>
                </Hint>
                <Hint text="Click to copy" side="bottom" >
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopy}
                        disabled={!data.sandboxUrl || copied}
                        className="flex-1 font-normal justify-start truncate px-3"
                    >
                        {copied ? "Copied!" : data.sandboxUrl || "No URL"}
                    </Button>
                </Hint>
                {/* Open in new tab */}
                <Hint text="Open in a new tab" side="bottom" align="start">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={!data.sandboxUrl}
                        onClick={() => {
                            if (!data.sandboxUrl) return
                            window.open(data.sandboxUrl, '_blank')
                        }}
                        className="w-10 flex justify-center items-center"
                    >
                        <ExternalLinkIcon size={16} />
                    </Button>
                </Hint>
            </div>

            {/* Iframe */}
            <iframe
                key={key}
                sandbox="allow-forms allow-scripts allow-same-origin"
                className="flex-1 w-full"
                loading="lazy"
                src={data.sandboxUrl}
            />
        </div>
    )
}

export default FragmentWeb
