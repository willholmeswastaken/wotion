import { useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function NewPageModal({
  onSubmit,
}: {
  onSubmit: (pageName: string, callback: () => void) => void;
}) {
  const [pageName, setPageName] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleCreatePage = async () => {
    if (!pageName.trim()) return;
    onSubmit(pageName, () => {
      closeRef.current?.click();
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          New Page
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="pageName"
            placeholder="Enter page name"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
          />
          <Button onClick={handleCreatePage}>Create</Button>
        </div>
        <DialogClose ref={closeRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
