"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
 };

export const Actions = ({
    disabled,
    courseId,
    isPublished
}: ActionsProps) => {
    const router = useRouter();
  const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isPublishdLoading, setIsPublishedLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsPublishedLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Course unpublished");
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
              toast.success("Course published");
              confetti.onOpen();
            }

            router.refresh();
         } catch {
            toast.error("Something went wrong");
    } finally {
        setIsPublishedLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/courses/${courseId}`);

            toast.success("Course deleted");
            router.refresh();
            router.push(`/teacher/courses`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <div className="flex items-center gap-x-2">
        <Button
          onClick={onClick}
          disabled={disabled || isLoading}
          variant="outline"
          size="sm"
        >
          {isPublishdLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isPublished ? (
            "Unpublish"
          ) : (
            "Publish"
          )}
        </Button>
        <ConfirmModal onConfirm={onDelete}>
          <Button size="sm" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
          </Button>
        </ConfirmModal>
      </div>
    );
  };