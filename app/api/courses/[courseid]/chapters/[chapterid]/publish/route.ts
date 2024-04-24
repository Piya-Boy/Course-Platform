import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseid: string, chapterid: string } }
) {
    try { 
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseid,
                userId
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterid,
                courseId: params.courseid
            }
        });

        if (!chapter) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterid,
            }
        });

        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing required fields", { status: 400 });
        }
        
        const publishedChapter = await db.chapter.update({
            where: {
                id: params.chapterid,
                courseId: params.courseid
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishedChapter);

    } catch (error) {
        console.log("[CHAPTER_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }    
}