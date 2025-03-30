import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    console.log("Opening modal");
    setIsOpen(true);
  };

  return (
    <div className="p-8 border rounded-md m-4">
      <h2 className="text-lg font-bold mb-4">Modal Test Component</h2>

      <Button
        onClick={handleOpen}
        className="h-7 text-xs gap-1 px-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
      >
        Test Modal Button
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Test Modal Content</h3>
            <p className="mb-4">
              This is a test modal to verify functionality.
            </p>
            <Button onClick={() => setIsOpen(false)}>Close Modal</Button>
          </div>
        </div>
      )}
    </div>
  );
}
