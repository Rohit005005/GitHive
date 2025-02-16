import { db } from "@/server/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
type Props = {
  params: Promise<{ projectId: string }>;
};
const JoinHandler = async (props: Props) => {
  const { projectId } = await props.params;
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");
  const dbUser = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (!dbUser) {
    await db.user.create({
      data: {
        id: userId,
        emailAddress: user.emailAddresses[0]!.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
    });
  }
  const project = await db.project.findMany({
    where: {
      id: projectId,
    },
  });
  if (!project){
    window.alert("Invalid link !!")
    return redirect("/dashboard")
  }
  try {
    await db.userToProject.create({
      data: {
        userId: userId,
        projectId: projectId,
      },
    });
  } catch (error) {
    console.log("user already exist in project !!");
  }

  return redirect(`/dashboard`);
};
export default JoinHandler;
