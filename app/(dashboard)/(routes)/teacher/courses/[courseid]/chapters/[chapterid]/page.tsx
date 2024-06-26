import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ChevronLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterTitleForm } from "./_componets/chapter-title-form";
import { ChapterDescriptionForm } from "./_componets/chapter-description-form";
import { ChapterAccessForm } from "./_componets/chapter-access-form";
import { ChapterVideoForm } from "./_componets/chapter-video-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_componets/chapter-actions";

const ChaperIdPage = async ({
  params,
}: {
  params: { courseid: string; chapterid: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterid,
      courseId: params.courseid,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);



  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course."
        />
      )}
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${chapter.courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to course setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completionText}
              </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseid}
                chapterId={params.chapterid}
                isPublished={chapter.isPublished}
              />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your chapter</h2>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              courseId={chapter.courseId}
              chapterId={params.chapterid}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={params.courseid}
              chapterId={params.chapterid}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Settings</h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              courseId={params.courseid}
              chapterId={params.chapterid}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl">Add a video</h2>
          </div>
          <ChapterVideoForm
            initialData={chapter}
            courseId={params.courseid}
            chapterId={params.chapterid}
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default ChaperIdPage;
