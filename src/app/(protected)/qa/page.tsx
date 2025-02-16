"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import React from "react";
import AskQuestionCard from "../dashboard/ask-question-card";
import MDEditor from "@uiw/react-md-editor";
import { CodeReferences } from "../dashboard/code-references";
import { LoaderCircle, LoaderIcon } from "lucide-react";

const QAPage = () => {
  const { projectId } = useProject();
  const { data: questions, isLoading } = api.project.getQuestions.useQuery({
    projectId,
  });
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const question = questions?.[questionIndex];
  return (
    <Sheet>
      <AskQuestionCard />
      <div className="h-4"></div>
      <h1 className="text-xl font-semibold text-white">Saved Questions</h1>
      <div className="h-2"></div>
      {isLoading ? (
        <div className="flex items-center justify-center text-white">
          <p>Loading </p>
          <LoaderIcon className="animate-spin text-white" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {questions?.map((question, index) => {
            return (
              <React.Fragment key={question.id}>
                <SheetTrigger
                  onClick={() => {
                    setQuestionIndex(index);
                  }}
                  key={question.id}
                >
                  <div className="flex items-center gap-4 rounded-lg border border-gray-600 bg-gray-800 p-4 shadow">
                    <img
                      className="rounded-full"
                      height={30}
                      width={30}
                      src={question.user.imageUrl ?? ""}
                    />
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2">
                        <p className="line-clamp-1 text-lg font-medium text-gray-200">
                          {question.question}
                        </p>
                        <span className="text-gray-400">
                          {question.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-sm text-gray-400">
                        {question.answer}
                      </p>
                    </div>
                  </div>
                </SheetTrigger>
              </React.Fragment>
            );
          })}
        </div>
      )}
      {question && (
        <SheetContent className="overflow-y-scroll border-gray-600 bg-gray-800 scrollbar-webkit sm:max-w-[70vw] max-w-[90vw] text-white">
          <SheetHeader>
            <SheetTitle className="text-xl text-gray-100">
              {question.question}
            </SheetTitle>
            <MDEditor.Markdown source={question.answer} className="p-5" />
            <CodeReferences
              filesReferences={(question.filesReferences ?? []) as any}
            />
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
};

export default QAPage;
