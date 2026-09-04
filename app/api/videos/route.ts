import Videos from "../../../models/video.models";
import { authOption } from "../../../utils/auth";
import DatabaseConnection from "../../../utils/config";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const body =  request.json();
    await DatabaseConnection();
    const videosModel = Videos as any;
    const allvideos = await videosModel.find({}).sort({ createdAt: -1 });
     return NextResponse.json(
      {
        success: true,
        message: "All videos fetched successfully",
        allvideos,
      });
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
    const session = await getServerSession(authOption);
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
    const videoOption = {
  title: body.title,
  discription: body.discription,
  thumnail: body.thumnail,
  videos: body.videos, // ✅ lowercase
  constrol: body.constrol ?? true,

  transformations: {
    height: 1920,
    width: 1080,
    quantity: body.quantity ?? 100,
  },
};
   const savedate = await Videos.create(videoOption)
   return NextResponse.json({message:"User  videos succesfuly create",Videos:savedate},{status:201})
  } catch (error:any){
    return NextResponse.json({error:error.message},{status:500})
  }
}

