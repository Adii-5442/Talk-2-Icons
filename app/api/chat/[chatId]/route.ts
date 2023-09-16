import { StreamingTextResponse, LangChainStream } from "ai";
import { auth, currentUser } from '@clerk/nextjs'
import { CallbackManager } from 'langchain/callbacks';
import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import { Ratelimit } from "@upstash/ratelimit";
import prismadb from "@/lib/prismadb";
import {Replicate} from 'langchain/llms/replicate'
