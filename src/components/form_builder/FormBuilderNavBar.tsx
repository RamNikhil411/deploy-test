import { useLocation, useParams, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Eye,
  Link,
  Loader,
  Monitor,
  Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";
import PublishDialog from "../core/PublishDialog";
import FormStyles from "../FormStyles";
import { Button } from "../ui/button";
import ConditionIcon from "../ui/icons/conditionIcon";

interface BuilderLayoutProps {
  isUpdating: boolean;
  lastSavedAt: number;
  viewMode: string;
  setViewMode: React.Dispatch<React.SetStateAction<string>>;
}

export default function BuilderLayout({
  isUpdating,
  lastSavedAt,
  viewMode,
  setViewMode,
}: BuilderLayoutProps) {
  const router = useRouter();
  const { form_id } = useParams({ strict: false });
  const pathName = useLocation().pathname;
  const [linkCopied, setLinkCopied] = useState(false);
  const [relativeTime, setRelativeTime] = useState("Just now");

  useEffect(() => {
    const updateRelativeTime = () => {
      const seconds = Math.floor((Date.now() - lastSavedAt) / 1000);

      if (seconds < 10) {
        setRelativeTime("Just now");
      } else if (seconds < 60) {
        setRelativeTime(`${seconds} seconds ago`);
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setRelativeTime(`${minutes} minute${minutes !== 1 ? "s" : ""} ago`);
      } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        setRelativeTime(`${hours} hour${hours !== 1 ? "s" : ""} ago`);
      } else {
        const days = Math.floor(seconds / 86400);
        setRelativeTime(`${days} day${days !== 1 ? "s" : ""} ago`);
      }
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [lastSavedAt]);

  const handleCopyLink = async () => {
    try {
      const link = `${window.location.origin}/forms/${form_id}`;
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex relative justify-between items-center w-full px-4 py-3 shadow-none bg-white border-b">
      <div className="text-xl 2xl:text-2xl 3xl:!text-3xl text-lime-600">
        L<span className="">Digital</span>
      </div>

      {pathName.includes("form_preview") && (
        <div className="absolute -translate-x-1/2 left-1/2 flex items-center self-center gap-2">
          <Button
            onClick={() => setViewMode("phone")}
            className={`text-base font-normal ${viewMode === "phone" ? "bg-lime-600 hover:bg-lime-800 text-white" : "text-lime-600 bg-transparent hover:bg-transparent"} [&_svg:not([class*='size-'])]:size-6`}
          >
            <Smartphone className="w-6 h-6" />
            Phone
          </Button>
          <div className="h-8 w-0.25 bg-gray-400"></div>
          <Button
            onClick={() => setViewMode("desktop")}
            className={`text-base font-normal ${viewMode === "desktop" ? "bg-lime-600 hover:bg-lime-800 text-white" : "text-lime-600 bg-transparent hover:bg-transparent"} [&_svg:not([class*='size-'])]:size-6`}
          >
            <Monitor className="w-6 h-6" />
            Desktop
          </Button>
        </div>
      )}

      <div className="flex items-center space-x-2">
        {pathName.includes("form_preview") ? null : (
          <>
            <div>
              {isUpdating ? (
                <div className="flex items-center gap-1">
                  <Loader className="w-4 h-4 animate-spin" />
                  <div>Saving</div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div>Saved</div>
                  <div className="text-xs text-gray-500">{relativeTime}</div>
                </div>
              )}
            </div>
          </>
        )}

        <Button
          onClick={() =>
            router.navigate({ to: `/forms/${form_id}/conditions` })
          }
          className="bg-lime-600 cursor-pointer h-fit hover:bg-lime-700"
        >
          <ConditionIcon />
        </Button>

        <FormStyles />

        {pathName.includes("form_preview") ? (
          <Button
            className={`bg-lime-600 font-normal h-fit py-1 hover:bg-green-700 text-white rounded flex items-center gap-1 ${linkCopied ? "pointer-events-none" : "cursor-pointer"}`}
            onClick={handleCopyLink}
          >
            <Link className="w-4 h-4" />
            {linkCopied ? "Copied!" : "Copy Link"}
          </Button>
        ) : (
          <Button
            onClick={() => {
              router.navigate({
                to: `/forms/${form_id}/form_preview`,
              });
            }}
            className="border cursor-pointer border-green-600 py-1 h-fit text-lime-600 bg-transparent hover:bg-transparent rounded flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            Preview Form
          </Button>
        )}

        {pathName.includes("form_preview") ? (
          <Button
            onClick={() => {
              router.navigate({
                to: `/forms/${form_id}/form_builder`,
              });
            }}
            className="border cursor-pointer border-green-600 py-1 h-fit text-lime-600 bg-transparent hover:bg-transparent rounded flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        ) : (
          <PublishDialog
            handleCopyLink={handleCopyLink}
            linkCopied={linkCopied}
          />
        )}
      </div>
    </div>
  );
}
