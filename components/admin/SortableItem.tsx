"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SortableItem({ id, children }: { id: string, children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
        opacity: isDragging ? 0.8 : 1,
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-2 group/sortable w-full">
            <div
                {...attributes}
                {...listeners}
                className="p-3 cursor-grab active:cursor-grabbing text-gray-500 hover:text-white transition-colors opacity-30 group-hover/sortable:opacity-100 touch-none shrink-0"
            >
                <GripVertical className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                {children}
            </div>
        </div>
    );
}
