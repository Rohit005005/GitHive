"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import React from "react";
import { askQuestion, repoStructure, summarizeRepo } from "./actions";
import { readStreamableValue } from "ai/rsc";
import MDEditor from "@uiw/react-md-editor";
import { CodeReferences } from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";
import { Github, Info, LoaderIcon } from "lucide-react";

const AskQuestionCard = () => {
  const refetch = useRefetch();
  const { project } = useProject();
  const [question, setQuestion] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [filesReferences, setFilesReferences] = React.useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = React.useState("");
  const [repositorySummary, setRepositorySummary] = React.useState("");
  const saveAnswer = api.project.saveAnswer.useMutation();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer("");
    setFilesReferences([]);
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);

    const { output, fileReference } = await askQuestion(question, project.id);
    setOpen(true);
    setFilesReferences(fileReference);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((ans) => ans + delta);
      }
    }
    setLoading(false);
  };

  const repoSummary = async () => {
    if (!project?.id) return;
    setLoading(true);
    setRepositorySummary("");
    const response = await summarizeRepo(project!.id);
    setOpen2(true);
    setRepositorySummary(response || "");
    setLoading(false);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[75vh] max-w-[95vw] overflow-y-scroll border-gray-700 bg-gray-800 text-white scrollbar-webkit sm:max-h-[90vh] sm:max-w-[80vw]">
          <div className="flex items-center gap-2 sm:gap-5">
            <DialogHeader>
              <DialogTitle className="flex flex-row items-center justify-center gap-2">
                <Github className="animate-pulse-scale h-5 w-5 text-green-400" />
                <p className="text-xl font-bold text-white transition-transform duration-300 hover:scale-105 md:text-2xl">
                  GitHive
                </p>
              </DialogTitle>
            </DialogHeader>
            <Button
              disabled={saveAnswer.isPending}
              className="text-md"
              onClick={() => {
                saveAnswer.mutate(
                  {
                    projectId: project!.id,
                    answer,
                    question,
                    filesReferences,
                  },
                  {
                    onSuccess: () => {
                      toast.success("Answer Saved !!");
                      refetch();
                    },
                    onError: () => {
                      toast.error("Error Saving Answer !!");
                    },
                  },
                );
              }}
            >
              Save Answer
            </Button>
            <div className="hidden items-center gap-2 rounded-md border border-gray-500 px-2 py-1 sm:flex">
              <Info size={20} />
              <p className="text-sm text-gray-400">
                Answer will be added on the Saved Q&A Page
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-gray-500 px-2 py-1 sm:hidden">
            <Info size={20} />
            <p className="text-sm text-gray-400">
              Answer will be added on the Saved Q&A Page
            </p>
          </div>
          <MDEditor.Markdown
            source={answer}
            className="max-w-[80vw] rounded-md p-5 sm:max-w-[73vw]"
          />
          <div className="h-3"></div>

          <CodeReferences filesReferences={filesReferences} />

          <Button
            type="button"
            className="text-md w-fit"
            variant="destructive"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
      {/*dialog for summary of repo */}
      <Dialog open={open2} onOpenChange={setOpen2}>
        <DialogContent className="max-h-[75vh] max-w-[95vw] overflow-y-scroll border-gray-700 bg-gray-800 text-white scrollbar-webkit sm:max-h-[90vh] sm:max-w-[80vw]">
          <DialogHeader>
            <DialogTitle className="flex flex-row items-center">
              <Github className="animate-pulse-scale h-5 w-5 text-green-400" />
              <p className="text-xl font-bold text-white transition-transform duration-300 hover:scale-105 md:text-2xl">
                GitHive
              </p>
            </DialogTitle>
          </DialogHeader>
          <MDEditor.Markdown
            source={repositorySummary}
            className="max-w-[80vw] rounded-md p-5 sm:max-w-[73vw]"
          />
          <Button
            type="button"
            className="text-md w-fit"
            variant="destructive"
            onClick={() => {
              setOpen2(false);
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
      {/*main card */}
      <Card className="relative border-gray-600 bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder="Ask about any file in the repository. Ex: what does App.js does..."
              value={question}
              className="md:text-md bg-gray-300 text-sm font-medium text-gray-950 sm:text-sm"
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="h-4"></div>
            <div className="flex items-center justify-start">
              <Button type="submit" className="px-2 sm:px-3" disabled={loading}>
                Ask GitHive
                {loading && <LoaderIcon className="animate-spin text-white" />}
              </Button>
              <Button
                className="ml-3 px-2 sm:px-3"
                disabled={loading}
                type="button"
                onClick={() => {
                  repoSummary();
                }}
              >
                Summarize Repo
                {loading && <LoaderIcon className="animate-spin text-white" />}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
