import React from "react";

export default function VideoInfo({ categories }) {
  return (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-100 w-64 z-10">
      <h2 className="text-lg font-semibold mb-3">Video Info</h2>
      <p className="text-muted-foreground text-sm mb-4">
        Select a node to see related videos and details.
      </p>
      <div className="space-y-3">
        <div className="p-3 border rounded-lg bg-gray-50/80">
          <h3 className="font-medium text-sm">Hot Topics</h3>
          <ul className="mt-2 space-y-1 text-xs">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></span>
                <span>{category.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
