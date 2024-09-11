import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditIcon } from "lucide-react";
import { Editor } from "react-notion-wysiwyg";

export default function Component() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 border-r p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="font-semibold">Wotion</span>
          <Button variant="ghost" size="sm">
            <EditIcon className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 cursor-pointer">
            <span>Pages</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Untitled"
              className="text-xl font-bold border-none focus:ring-0"
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 max-w-3xl w-full space-y-4">
          <Editor />
        </main>
      </div>
    </div>
  );
}
