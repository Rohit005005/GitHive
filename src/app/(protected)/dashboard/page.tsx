"use client";
import useProject from "@/hooks/use-project";
import { ArrowRight, GitCommitVertical, Github } from "lucide-react";
import Link from "next/link";
import React from "react";
import CommitLog from "./commit-log";
import AskQuestionCard from "./ask-question-card";
import ArchiveButton from "./archive-button";
import InviteButton from "./invite-button";
import TeamMembers from "./team-members";
import RepoStructureCard from "./repo-structure";
import { cn } from "@/lib/utils";

const DashboardPage = () => {
  const { project } = useProject();
  const [show, setShow] = React.useState(false);
  return (
    <>
      {!project ? (
        <div className="flex h-full items-center justify-center rounded-md border border-gray-700">
          <Link
            href={"/create"}
            className="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-700 px-5 py-3"
          >
            <h1 className="text-lg text-gray-300">Add New Project</h1>
            <ArrowRight className="text-gray-300" size={20} />
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-y-4">
            {/*github link */}
            <div className="w-fit rounded-md bg-primary px-4 py-3">
              <div className="flex items-center">
                <Github className="size-5 text-white" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-white">
                    This project is linked to
                    <Link className="ml-2" href={project?.githubUrl ?? ""}>
                      {project?.githubUrl}
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="h-4"></div>

            <div className="flex items-center justify-center gap-4">
              <TeamMembers />
              <InviteButton />
              <ArchiveButton />
            </div>
          </div>

          <div className="mt-4">
            <div className="">
              <AskQuestionCard />
            </div>
          </div>

          <div className="mt-8">
            <div className="m-auto mb-2 flex w-fit items-center justify-center rounded-md p-2">
              <button
                onClick={() => {
                  setShow(false);
                }}
                className={cn(
                  "rounded-md rounded-l-full bg-gray-700 px-3 py-1 text-white",
                  {
                    "bg-primary": show === false,
                  },
                )}
              >
                Commits
              </button>
              <GitCommitVertical className="text-gray-300" />
              <button
                onClick={() => {
                  setShow(true);
                }}
                className={cn(
                  "rounded-md rounded-r-full bg-gray-700 px-3 py-1 text-white",
                  {
                    "bg-primary": show === true,
                  },
                )}
              >
                Structure
              </button>
            </div>
            {show ? <RepoStructureCard /> : <CommitLog />}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
