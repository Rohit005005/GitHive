import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summarizeCode } from "./gemini";
import { db } from "@/server/db";

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || process.env.GITHUB_TOKEN,
    branch: "main",
    ignoreFiles: [
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });
  const docs = await loader.load();
  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  console.log(`Starting GitHub repo indexing...${githubUrl}`);
  const docs = await loadGithubRepo(githubUrl, githubToken);
  console.log(`Loaded ${docs.length} documents from repo...${githubUrl}`);

  const embeddings = await generateEmbeddings(docs);
  console.log(`Generated embeddings for ${embeddings.length} documents...${githubUrl}`);

  let processedCount = 0;
  for (const embedding of embeddings) {
    if (!embedding) continue;

    try {
      const sanitizedSourceCode = embedding.sourceCode.replace(/\x00/g, '');
      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          summary: embedding.summary,
          sourceCode: sanitizedSourceCode,
          fileName: embedding.fileName,
          projectId,
        },
      });

      await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}`;

      processedCount++;
      console.log(
        `Processed ${processedCount}/${embeddings.length} embeddings...${githubUrl}`,
      );
    } catch (error) {
      console.error(`Error saving embedding for ${embedding.fileName}:`, error);
    }
  }

  console.log(`Finished indexing GitHub repo...${githubUrl}`);
};

type EmbeddingResult = {
  embedding: number[];
  summary: string;
  sourceCode: string;
  fileName: string;
} | null;

async function generateEmbeddings(
  docs: Document[],
): Promise<EmbeddingResult[]> {
  //console.log("Starting to generate embeddings...");
  const results: EmbeddingResult[] = [];

  for (const doc of docs) {
    try {
      //console.log(`Processing document: ${doc.metadata.source}`);

      // Get summary first
      const summary = await summarizeCode(doc);
      //console.log(`Generated summary for ${doc.metadata.source}`);

      // Then get embedding
      const embedding = await generateEmbedding(summary);
      //console.log(`Generated embedding for ${doc.metadata.source}`);

      results.push({
        embedding,
        summary,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        fileName: doc.metadata.source,
      });
    } catch (error) {
      console.error(`Error processing document: ${doc.metadata.source}`, error);
      console.error(error);
      results.push(null); // Push null for failed documents
    }
  }

  return results;
}




