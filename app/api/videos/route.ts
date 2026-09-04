import Videos from "@/models/video.models";
import { authOption } from "@/utils/auth";
import DatabaseConnection from "@/utils/config";
import { error } from "console";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const body = await request.json();
    await DatabaseConnection();
    const allvideos = await Videos.find({}).sort({ createdAt: -1 });
    return NextResponse.json(
      { message: "Your all videos find it", succes: true, allvideos },
      { status: 200 },
    );
  } catch (error) {
    console.error("VIDEOS GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Videos get error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getServerSession(authOption);
    if (!session) {
      return NextResponse.json(
        {
          sucess: false,
          error: "unauraize authentication is required",
        },
        { status: 400 },
      );
    }
    await DatabaseConnection();
    const body = await request.json();
    if (!body.title || !body.discription || !body.thumnail || !body.videos) {
      return NextResponse.json({
        sucess: false,
        message: "All feilds are required",
      });
    }
    const videoOpion = {
      title: body.title,
      discription: body.discription,
      thumnail: body.thumnail,
      Videos: body.videos,
      constrol: body.constrol ?? true,
      transformations: {
        height: 1920,
        width: 1080,
        quantity: body.quantity ?? 100,
      },
    };
   const savedate = await Videos.create(videoOpion)
   return NextResponse.json({message:"User  videos succesfuly create",Videos:savedate},{status:201})
  } catch (error:any){
    return NextResponse.json({error:error.message},{status:500})
  }
}

