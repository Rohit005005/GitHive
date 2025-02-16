"use client";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink, LoaderIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const CommitLog = () => {
  const { projectId, project } = useProject();
  const { data: commits, isLoading } = api.project.getCommits.useQuery({
    projectId,
  });

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col justify-center items-center">
        <div className="flex items-center justify-center text-white">
          <p>Loading </p>
          <LoaderIcon className="animate-spin text-white" />
        </div>
        <p className="text-sm text-gray-400" >First time takes longer...</p>
        </div>
      ) : (
        <ul className="space-y-6 w-full">
          {commits?.map((commit, index) => {
            return (
              <li
                key={commit.id}
                className="relative flex gap-x-4 w-full items-start"
              >
                {/* Timeline line */}
                <div
                  className={cn(
                    index === commits.length - 1 ? "h-6" : "-bottom-6",
                    "absolute left-0 top-0 flex w-6 justify-center"
                  )}
                >
                  <div className="w-px translate-x-1 bg-gray-600"></div>
                </div>
                {/* Commit avatar */}
                <img
                  src={commit.commitAuthorAvatar}
                  alt="commit avatar"
                  className="relative mt-4 size-8 flex-none rounded-full bg-gray-50"
                />
                {/* Commit details */}
                <div className="flex-auto rounded-md text-white p-3 ring-1 ring-inset ring-gray-700 bg-gray-800 w-full min-w-0">
                  <div className="flex justify-between">
                    <Link
                      href={`${project?.githubUrl}/commits/${commit.commitHash}`}
                      className="py-0.5 text-xs leading-5 text-gray-400 space-x-2"
                    >
                      <span className="font-medium">
                        {commit.commitAuthorName}
                      </span>
                      <span className="inline-flex items-center">
                        committed
                        <ExternalLink className="ml-2 size-4 text-white hover:size-5 transition-all" />
                      </span>
                    </Link>
                  </div>
                  <span className="font-semibold break-words">
                    {commit.commitMessage}
                  </span>
                  <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300 break-words">
                    {commit.summary}
                  </pre>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default CommitLog;
