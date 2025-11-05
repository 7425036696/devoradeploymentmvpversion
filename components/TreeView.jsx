import React, { useState } from 'react'
import { FileIcon, FolderIcon, ChevronRightIcon, ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function TreeView({ data, value, onSelect }) {
    return (
        <div className="h-full overflow-auto p-2">
            <div className="space-y-1">
                {data.map((item, index) => (
                    <Tree key={index} item={item} selectedValue={value} onSelect={onSelect} parentPath={""} />
                ))}
            </div>
        </div>
    )
}

const Tree = ({ item, selectedValue, onSelect, parentPath }) => {
    const [name, ...items] = Array.isArray(item) ? item : [item];
    const currentPath = parentPath ? `${parentPath}/${name}` : name;
    const [isOpen, setIsOpen] = useState(true);

    if (!items.length) {
        const isSelected = selectedValue === currentPath;
        return (
            <button
                onClick={() => onSelect(currentPath)}
                className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors text-left",
                    isSelected && "bg-accent"
                )}
            >
                <FileIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">{name}</span>
            </button>
        );
    }

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors text-left"
            >
                {isOpen ? (
                    <ChevronDownIcon className="h-4 w-4 shrink-0" />
                ) : (
                    <ChevronRightIcon className="h-4 w-4 shrink-0" />
                )}
                <FolderIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">{name}</span>
            </button>
            {isOpen && (
                <div className="ml-4 mt-1 space-y-1">
                    {items.map((subitem, index) => (
                        <Tree
                            key={index}
                            selectedValue={selectedValue}
                            item={subitem}
                            onSelect={onSelect}
                            parentPath={currentPath}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeView