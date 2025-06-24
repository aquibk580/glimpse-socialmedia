import prisma from "@/lib/client";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt.type;
    // console.log(
    //   `Received webhook with ID ${id} and event type of ${eventType}`
    // );
    // console.log("Webhook payload:", evt.data);

    if (eventType === "user.created") {
      try {
        const username =
          evt.data.username ??
          evt.data.first_name ??
          "user_" + evt.data.id.slice(0, 5);

        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (existingUser) {
          return new Response("Username already exists", { status: 400 });
        }

        await prisma.user.create({
          data: {
            id: evt.data.id,
            username: username,
            avatar: evt.data.image_url || "/noAvatar.png",
            Cover: "/noCover.png",
          },
        });

        return new Response("User has been created", { status: 201 });
      } catch (error) {
        console.log(error);
        return new Response("Failed to create the user", { status: 500 });
      }
    }

    if (eventType === "user.updated") {
      try {
        const username =
          evt.data.username ??
          evt.data.first_name ??
          "user_" + evt.data.id.slice(0, 5);

        const existsingUser = await prisma.user.findUnique({
          where: {
            id: evt.data.id,
          },
        });

        if (!existsingUser) {
          return new Response("User not found", { status: 404 });
        }

        await prisma.user.update({
          where: {
            id: evt.data.id,
          },
          data: {
            id: evt.data.id,
            username: username,
            avatar: evt.data.image_url || "/noAvatar.png",
            Cover: "/noCover.png",
          },
        });

        return new Response("User has been updated", { status: 200 });
      } catch (error) {
        console.log(error);
        return new Response("Failed to update the user", { status: 500 });
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
