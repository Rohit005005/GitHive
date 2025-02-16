"use client";
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { ArchiveX } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const ArchiveButton = () => {
  const archiveProject = api.project.archiveProject.useMutation();
  const { projectId } = useProject();
  const refetch = useRefetch();
  return (
    <Button
      size="sm"
      disabled={archiveProject.isPending}
      variant={"destructive"}
      onClick={() => {
        const confirm = window.confirm(
          "Are you sure you want to delete this project ?",
        );
        if (confirm) {
          archiveProject.mutate(
            { projectId },
            {
              onSuccess: () => {
                toast.success("Project deleted !!");
                refetch();
              },
              onError: () => {
                toast.error("Error deletinging project !!");
              },
            },
          );
        }
      }}
    >
      <p className="flex items-center gap-1"><ArchiveX/> Project</p>
    </Button>
  );
};

export default ArchiveButton;
