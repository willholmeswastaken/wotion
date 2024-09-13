import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewPageModal({
  onSubmit,
  open,
  setOpen,
}: {
  onSubmit: (pageName: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [pageName, setPageName] = useState("");

  const handleCreatePage = async () => {
    if (!pageName.trim()) return;
    onSubmit(pageName);
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
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
      </DialogContent>
    </Dialog>
  );
}
