import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instructions, seed, categoryId } = body;

    if (!params.companionId) {
      return new NextResponse("Companion ID is required", { status: 400 });
    }
    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!src || !name || !instructions || !seed || !categoryId) {
      return new NextResponse("Missing required Fields", { status: 400 });
    }

    //TODO : Check for subscription

    const compaion = await prismadb.companion.update({
      where: {
        id: params.companionId,
      },
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
      },
    });

    return NextResponse.json(compaion);
  } catch (error) {
    console.log("[COMPANION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { companionId: string } }

) {
  try {
    const { userId } = auth();
    const companion = await prismadb.companion.delete({
      where: {
        id:params.companionId,
      }
    })
    return NextResponse.json(companion)

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });

    }


  } catch (error) {
    console.log("[COMPANION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
