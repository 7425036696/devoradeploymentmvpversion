import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'
import { Button } from './ui/button'
import CodeView from './CodeView'
import Hint from './Hint'
import { CopyIcon } from 'lucide-react'
import TreeView from './TreeView'
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb'
import { CopyCheckIcon } from 'lucide-react'
function convertFilesToTreeData(files) {
    // Build a tree structure using nested objects
    const tree = {};

    // Process each file path
    Object.keys(files).forEach(filePath => {
        const parts = filePath.split('/');
        let current = tree;

        // Navigate/create the tree structure
        parts.forEach((part, index) => {
            const isLastPart = index === parts.length - 1;

            if (isLastPart) {
                // It's a file - mark it with null to distinguish from folders
                current[part] = null;
            } else {
                // It's a folder - create if doesn't exist
                if (!current[part]) {
                    current[part] = {};
                }
                current = current[part];
            }
        });
    });

    // Convert the tree object to nested array format
    function objectToArray(obj, name = null) {
        const entries = Object.keys(obj).sort((a, b) => {
            // Sort folders first, then files
            const aIsFolder = obj[a] !== null;
            const bIsFolder = obj[b] !== null;

            if (aIsFolder && !bIsFolder) return -1;
            if (!aIsFolder && bIsFolder) return 1;
            return a.localeCompare(b);
        });

        const result = [];

        entries.forEach(key => {
            if (obj[key] === null) {
                // It's a file
                result.push(key);
            } else {
                // It's a folder
                result.push(objectToArray(obj[key], key));
            }
        });

        // If this is a named folder, prepend the name
        if (name) {
            result.unshift(name);
        }

        return result;
    }

    return objectToArray(tree);
}
function getExt(filename) {
    console.log(filename, "this is")
    if (!filename || typeof filename !== "string") return "text";

    // 1) If the string contains a colon like `"app/page.tsx":"code"` or `app/page.tsx: code`,
    //    take the part that looks like a filename (before the colon).
    let maybeName = filename;
    const colonIndex = filename.indexOf(':');
    if (colonIndex !== -1) {
        maybeName = filename.slice(0, colonIndex);
    }

    // 2) Strip surrounding quotes, braces, whitespace
    maybeName = maybeName.trim().replace(/^["'{\s]+|["'}\s]+$/g, '');

    // 3) If there are path-like characters, keep only the last segment after '/'
    const base = maybeName.split('/').pop();

    // 4) If there are query-like or extra characters (e.g. "app/page.tsx?x=1"), remove them
    const cleanBase = base.split(/[?#]/)[0];

    // 5) Find last dot and return extension, default to "text"
    const parts = cleanBase.split('.');
    if (parts.length < 2) return "text";
    const ext = parts.pop().toLowerCase();
    return ext || "text";
}
function Filebreadcrumbs({ filePath }) {
    const pathSegments = filePath.split('/');
    const maxSegments = 3;
    const renderBreadcrumbItems = () => {
        if (pathSegments.length <= maxSegments) {
            return pathSegments.flatMap((segment, index) => {
                const isLast = index === pathSegments.length - 1
                return (
                    <Fragment key={index} >
                        <BreadcrumbItem>
                            {
                                isLast ? (
                                    <BreadcrumbPage>
                                        {segment}
                                    </BreadcrumbPage>
                                ) : (
                                    <span className='text-muted-foreground'>
                                        {segment}
                                    </span>
                                )
                            }
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                    </Fragment>
                )
            })

        }
        else {
            const firstSegment = pathSegments[0]
            const lastSegment = pathSegments[pathSegments.length - 1]
            return (
                <>
                    <BreadcrumbItem>
                        <span className='text-muted-foreground '>
                            {firstSegment}
                        </span>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbEllipsis />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        </BreadcrumbItem>
                        <BreadcrumbPage className={"font-medium"}>
                            {lastSegment}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </>
            )
        }
    }
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {renderBreadcrumbItems()}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
function FileExplorer({ files }) {
    const [copied, setCopied] = useState(null)
    // Extract all filenames from the array of objects
    const allFiles = useMemo(() => {
        return files.flatMap(fileObj => Object.keys(fileObj))
    }, [files])

    const [selectedFile, setSelectedFile] = useState(() => {
        return allFiles[0] || null
    })
    const [codeString, setCodeString] = useState('')

    // Update selectedFile when allFiles changes
    useEffect(() => {
        if (!selectedFile && allFiles.length > 0) {
            setSelectedFile(allFiles[0])
        }
    }, [allFiles, selectedFile])

    useEffect(() => {
        if (selectedFile) {
            // Find the file content from the array
            const fileObj = files.find(obj => obj[selectedFile])
            const content = fileObj ? fileObj[selectedFile] : ""
            setCodeString(content)
        } else {
            setCodeString("")
        }
    }, [selectedFile, files])

    const handleCopy = async () => {
        if (codeString) {
            setCopied(true)
            await navigator.clipboard.writeText(codeString)
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        }
    }

    const treeData = useMemo(() => {
        return convertFilesToTreeData(files[0])
    }, [files])

    const handleFileSelect = useCallback((filePath) => {
        // filePath will be an array like ["app", "page.tsx"]
        // We need to join it back to match the key format
        const fullPath = Array.isArray(filePath) ? filePath.join('/') : filePath

        // Check if this file exists in our files array
        const fileExists = files.some(obj => obj[fullPath])

        if (fileExists) {
            setSelectedFile(fullPath)
        }
    }, [files])

    return (
        <ResizablePanelGroup direction="horizontal">
            {/* Sidebar / Tree View */}
            <ResizablePanel defaultSize={30} maxSize={50} className="bg-sidebar h-full" minSize={30}>
                <TreeView
                    data={treeData}
                    value={selectedFile}
                    onSelect={handleFileSelect}
                />
            </ResizablePanel>

            <ResizableHandle className="hover:bg-primary transition-colors" />

            {/* File Viewer */}
            <ResizablePanel defaultSize={70} minSize={50}>
                {selectedFile ? (
                    <div className='h-full w-full flex flex-col'>
                        <div className='border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2'>
                            <Filebreadcrumbs filePath={selectedFile} />
                            <Hint text="Copy to clipboard" side="bottom">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopy}
                                    disabled={copied}
                                >
                                    {
                                        copied ? <CopyCheckIcon /> : <CopyIcon size={16} />
                                    }
                                </Button>
                            </Hint>
                        </div>
                        <div className='flex-1 overflow-auto'>
                            <CodeView code={codeString} lang={getExt(selectedFile)} />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Select a file to view its content
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default FileExplorer