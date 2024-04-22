import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseid: string; chapterid: string } }
) {
    try { 

        const { userId } = auth();
        const {isPublished, ...values} = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseid,
                userId
            },
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterid,
                courseId: params.courseid
            },
            data: {
                ...values
            }
        });

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("[COURSE_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}