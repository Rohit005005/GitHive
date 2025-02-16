import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from 'axios'
import { aiSummarizeCommit } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitMessage: string;
  commitHash: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (
  githubUrl: string,
): Promise<Response[]> => {
  const [owner, repo] = githubUrl.split("/").slice(-2);
  if(!owner||!repo){
    throw new Error('Invlaid Github Url');
  }
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo
  });
  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime(),
  ) as any;

  return sortedCommits.slice(0, 15).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit.message ?? "",
    commitAuthorName: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit?.author?.avatar_url ?? "",
    commitDate: commit.commit?.author?.date ?? "",
  }));
};

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  console.log(`pollCommit started......${githubUrl}`)
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await fetchUnprocessedCommits(
    projectId,
    commitHashes,
  );
  const summaryResonses=await Promise.allSettled(unprocessedCommits.map(commit => {
    return summarizeCommit(githubUrl,commit.commitHash)
  }))
  const summaries=summaryResonses.map((response)=>{
    if(response.status==='fulfilled'){
      return response.value as string
    }
    return ""
  })

  const commits =await db.commit.createMany({
    data:summaries.map((summary,index)=>{
      return{
        projectId:projectId,
        commitHash:unprocessedCommits[index]!.commitHash,
        commitMessage:unprocessedCommits[index]!.commitMessage,
        commitAuthorName:unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvatar:unprocessedCommits[index]!.commitAuthorAvatar,
        commitDate:unprocessedCommits[index]!.commitDate,
        summary
      }
    })
  })
  console.log(`pollCommit completed......${githubUrl}`)
  return commits
};

async function summarizeCommit(githubUrl:string,commitHash:string){
  const {data}=await axios.get(`${githubUrl}/commit/${commitHash}.diff`,{
    headers:{
      'Accept': 'application/vnd.github.v3.diff',
    }
  })
  return await aiSummarizeCommit(data) || "";
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      githubUrl: true,
    },
  });
  if (!project?.githubUrl) {
    throw new Error("Project has no github url");
  }
  return { project, githubUrl: project?.githubUrl };
}

async function fetchUnprocessedCommits(
  projectId: string,
  commitHashes: Response[],
) {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  });
  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );

  return unprocessedCommits;
}

