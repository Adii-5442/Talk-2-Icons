import { StreamingTextResponse, LangChainStream } from "ai";
import { auth, currentUser } from '@clerk/nextjs'
import { CallbackManager } from 'langchain/callbacks';
import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import { Ratelimit } from "@upstash/ratelimit";
import prismadb from "@/lib/prismadb";
import { Replicate } from 'langchain/llms/replicate'
import { ratelimit } from "@/lib/rate-limit";

export async function POST(
    request: Request,
    {params}:{params:{chatId:string}}
) {
    try {
        const { prompt } = await request.json();
        const user = await currentUser();

        if (!user || user.firstName || !user.id) {
            return new NextResponse("Unautharized", { status: 401 });

        }

        const identifier = request.url + "-" + user.id;
        const { success } = await ratelimit(identifier);

        if (!success) {
            return new NextResponse("Rate Limit exceeded", { status: 429 })
        }

        const companion = await prismadb.companion.update({
            where: {
                id: params.chatId,
                userId: user.id,
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: 'user',
                        userId: user.id,
                    }
                }
            }
        });

        if (!companion) {
            return new NextResponse("Companion not found", { status: 404 });
        }

        const name = companion.id;
        const companion_file_name = name + ".txt";

        const companionKey = {
            companionName: name,
            userId: user.id,
            modelName: 'llama2-13b',
        };

        const memoryMananger = await MemoryManager.getInstance()

        const records = await memoryMananger.readLatestHistory(companionKey);

        if (records.length == 0) {
            await memoryMananger.seedChatHistory(companion.seed,"\n\n",companionKey)
        }
        await memoryMananger.writeToHistory("User: " + prompt + "\n", companionKey);

        const recentChatHistory = await memoryMananger.readLatestHistory(companionKey)

        const similarDocs = await memoryMananger.vectorSearch(
            recentChatHistory,
            companion_file_name,
        );
        let relevantHistory = "";
        if (!!similarDocs && similarDocs.length !== 0) {
          relevantHistory = similarDocs
            .map((doc) => doc.pageContent)
            .join("\n");
        }
        const { handlers } = LangChainStream();
        const model = new Replicate({
          model:
            "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
          input: {
            max_length: 2048,
          },
          apiKey: process.env.REPLICATE_API_TOKEN,
          callbackManager: CallbackManager.fromHandlers(handlers),
        });

        model.verbose = true;

        const resp = String(
          await model
            .call(
              `
        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix.

        ${companion.instructions}

        Below are relevant details about ${companion.name}'s past and the conversation you are in.
        ${relevantHistory}


        ${recentChatHistory}\n${companion.name}:`
            )
            .catch(console.error)
        );





    } catch (e) {
        console.log("[CHAT_POST]", e);
        return new NextResponse("Internal Error", { status: 500 });
    }
}