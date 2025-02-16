"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { Info, LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { checkPrivate, checkValidRepo } from "../dashboard/actions";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);  // New local state for immediate disabling

  useEffect(() => {
    const storedProjectId = localStorage.getItem("pendingProjectId");
    if (storedProjectId) {
      setCurrentProjectId(storedProjectId);
    }
  }, []);

  const { data: projectStatus } = api.project.getProjectStatus.useQuery(
    { projectId: currentProjectId ?? "" },
    { 
      enabled: !!currentProjectId,
      refetchInterval: 5000
    }
  );

  // Include isSubmitting in loading state check
  const isLoading = isSubmitting || createProject.isPending || projectStatus === "PENDING" || projectStatus === "PROCESSING";

  useEffect(() => {
    if (currentProjectId) {
      localStorage.setItem("pendingProjectId", currentProjectId);
    } else {
      localStorage.removeItem("pendingProjectId");
    }
  }, [currentProjectId]);

  useEffect(() => {
    if (projectStatus === "COMPLETED") {
      toast.success("Project created successfully");
      setCurrentProjectId(null);
      setIsSubmitting(false);  // Reset submitting state
      reset();
    } else if (projectStatus === "FAILED") {
      toast.error("Failed to create project");
      setCurrentProjectId(null);
      setIsSubmitting(false);  // Reset submitting state
    } else if (projectStatus === "PROCESSING" && currentProjectId) {
      toast.info("Project is being processed...");
    }
  }, [projectStatus, reset, currentProjectId]);

  useEffect(() => {
    if (currentProjectId && (projectStatus === "PENDING" || projectStatus === "PROCESSING")) {
      toast.info("Project creation is still in progress...");
    }
  }, [currentProjectId, projectStatus]);

  async function onSubmit(data: FormInput) {
    // Set submitting state immediately
    setIsSubmitting(true);

    try {
      const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+\/?$/;
      if (data.repoUrl.endsWith(".git")) {
        toast.error(`Remove ".git" from the end of the URL !!`);
        setIsSubmitting(false);
        return;
      }
      if (!githubRegex.test(data.repoUrl)) {
        toast.error("Invalid GitHub repository URL");
        setIsSubmitting(false);
        return;
      }

      const privRepo = await checkPrivate(data.repoUrl, data.githubToken);
      if (privRepo) {
        toast.error("Can't link private repository !!");
        setIsSubmitting(false);
        return;
      }

      const validRepo = await checkValidRepo(data.repoUrl, data.githubToken);
      if (!validRepo) {
        toast.error("Can't find GitHub repository !!");
        setIsSubmitting(false);
        return;
      }

      createProject.mutate(
        {
          githubUrl: data.repoUrl,
          name: data.projectName,
          githubToken: data.githubToken,
        },
        {
          onSuccess: (project) => {
            setCurrentProjectId(project.id);
            toast.info("Starting project creation...");
          },
          onError: (error) => {
            toast.error("Failed to initiate project creation");
            console.error("Project creation error:", error);
            setIsSubmitting(false);  // Reset submitting state on error
          },
        }
      );
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
      setIsSubmitting(false);  // Reset submitting state on error
    }
  }

  const getButtonText = () => {
    if (isSubmitting && !projectStatus) return "Checking repository...";
    if (createProject.isPending) return "Initiating...";
    if (projectStatus === "PENDING") return "Starting...";
    if (projectStatus === "PROCESSING") return "Processing...";
    return "Create Project";
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-12 overflow-hidden sm:flex-row">
      <img src="/github.svg" className="h-56 w-auto" alt="GitHub Logo" />
      <div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-semibold text-white">
            Link your GitHub repository
          </h1>
          <p className="text-sm text-gray-400">
            Enter the URL of your repository to link it to GitHive
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("projectName", { required: true })}
              placeholder="Project Name"
              required
              className="bg-gray-300 text-black"
              disabled={isLoading}
            />
            <div className="h-2"></div>
            <Input
              {...register("repoUrl", { required: true })}
              placeholder="Repository URL"
              required
              type="url"
              className="bg-gray-300 text-black"
              disabled={isLoading}
            />
            <div className="h-2"></div>
            {/* <Input
              {...register("githubToken")}
              placeholder="GitHub Token (Optional)"
              className="bg-gray-300 text-black"
              disabled={isLoading}
            /> */}
            <div className="h-4"></div>
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {getButtonText()}
              {isLoading && <LoaderIcon className="animate-spin" />}
            </Button>
            <div className="mt-2 flex items-center gap-2 rounded-md border border-gray-600 px-2 py-1">
              <Info size={20} className="text-gray-200" />
              <p className="text-sm text-gray-400">
                {projectStatus === "PROCESSING" 
                  ? "Processing repository... This may take 5-10 minutes... Works on free API"
                  : "Wait 5-10 minutes, depends on the size of repo. Works on free API"}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;