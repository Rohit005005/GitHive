"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useProject from "@/hooks/use-project";
import React from "react";
import { toast } from "sonner";

const InviteButton = () => {
  const [open, setOpen] = React.useState(false);
  const { projectId } = useProject();
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-800 border-gray-600 text-white">
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
          </DialogHeader>
          <p className="text-md font-semibold text-center text-gray-400">
            Ask them to copy and paste this link on browser
          </p>
          <Input
            readOnly
            className="mt-4 text-black text-sm"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/join/${projectId}`,
              );
              toast.success("Copied !!");
            }}
            value={`${window.location.origin}/join/${projectId}`}
          />
        </DialogContent>
      </Dialog>
      <Button
        size="sm"
        onClick={() => {
          setOpen(true);
        }}
      >
        Invite Members
      </Button>
    </>
  );
};

export default InviteButton;
