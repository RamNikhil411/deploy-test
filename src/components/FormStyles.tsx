import { Image, Loader2, Palette } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { useContext, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FormContext } from "@/context/formContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FONT_OPTIONS } from "@/lib/constants/formFieldConstants";
import FileUpload from "./core/fileUpload";
import { useDownloadUrl } from "@/utils/helpers/useDownloadUrl";
export default function FormStyles() {
  const [activeTab, setActiveTab] = useState("Colors");
  const { formStyles, setFormStyles } = useContext(FormContext);
  const [pagePreviewImage, setPagePreviewImage] = useState<string | undefined>(
    undefined
  );
  const [formPreviewImage, setFormPreviewImage] = useState<string | undefined>(
    undefined
  );
  const { data: pageCover, isLoading: pageCoverLoading } = useDownloadUrl(
    formStyles?.page_properties?.cover
  );
  const { data: formCover, isLoading } = useDownloadUrl(
    formStyles?.form_properties?.cover
  );
  useEffect(() => {
    setPagePreviewImage(pageCover?.target_url ?? undefined);
  }, [pageCover]);

  useEffect(() => {
    setFormPreviewImage(formCover?.target_url ?? undefined);
  }, [formCover]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-amber-600 hover:bg-orange-400 text-white rounded py-1 h-fit flex items-center gap-1">
          <Palette className="w-4 h-4" /> Form Styles
        </Button>
      </SheetTrigger>
      <SheetContent className="w-3/12 bg-white p-0 shadow-md font-primary rounded-md">
        <SheetHeader className="flex flex-row justify-between px-2 py-3 items-center space-y-0">
          <SheetTitle className="text-base 2xl:text-lg 3xl:text-xl font-normal leading-none text-[#141414] ">
            Form Styles
          </SheetTitle>
          <div className="flex gap-1 items-center">
            <SheetClose />
          </div>
        </SheetHeader>
        <div className="flex border-b bg-green-200 w-full">
          <Button
            className={`px-4 w-1/2 text-black bg-transparent hover:bg-transparent shadow-none font-normal ${activeTab === "Colors" ? "text-green-600 border-b-2 border-green-600 rounded-none font-medium" : ""}`}
            onClick={() => setActiveTab("Colors")}
          >
            Colors
          </Button>
          <Button
            className={`px-4 w-1/2 text-black bg-transparent hover:bg-transparent shadow-none font-normal ${activeTab === "Styles" ? "text-green-600 border-b-2 border-green-600 rounded-none font-medium" : ""} `}
            onClick={() => setActiveTab("Styles")}
          >
            Styles
          </Button>
        </div>
        <div className="h-[calc(100vh-80px)] relative overflow-y-auto">
          {activeTab === "Colors" ? (
            <div className="p-1 space-y-2  ">
              <div className="flex flex-col space-y-2 border-b p-2">
                <div className="space-y-2">
                  <Label className="font-normal">Page color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      className="w-4/5 shrink-0 h-8 bg-gray-200 rounded focus-visible:ring-0"
                      value={formStyles?.page_properties?.color}
                      onChange={(e) => {
                        setFormStyles({
                          ...formStyles,
                          page_properties: {
                            ...formStyles?.page_properties,
                            color: e.target.value,
                          },
                        });
                      }}
                    />
                    <input
                      type="color"
                      className="h-8 w-8 p-0 border-0 rounded-full cursor-pointer appearance-none
                 [&::-webkit-color-swatch-wrapper]:p-0
                 [&::-webkit-color-swatch-wrapper]:rounded-full
                 [&::-webkit-color-swatch]:rounded-full"
                      value={formStyles?.page_properties?.color}
                      onChange={(e) => {
                        setFormStyles({
                          ...formStyles,
                          page_properties: {
                            ...formStyles?.page_properties,
                            color: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <Label className="font-normal"> Page Image</Label>
                {!formStyles?.page_properties?.cover ? (
                  <Button
                    className="bg-gray-200 hover:bg-gray-200 text-black h-8 rounded py-1 px-2  w-2/5 shadow-none cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FileUpload
                      onFileSelect={(file, fileUrl) => {
                        setFormStyles({
                          ...formStyles,
                          page_properties: {
                            ...formStyles?.page_properties,
                            cover: fileUrl,
                          },
                        });
                      }}
                    >
                      <div className="flex gap-1 items-center text-sm text-black shadow-none cursor-pointer">
                        <Image className="!h-4 !w-3" />
                        Choose a file
                      </div>
                    </FileUpload>
                  </Button>
                ) : (
                  <div className="relative w-24 h-16">
                     {pageCoverLoading ? (
                      <Loader2 className="animate-spin h-6 w-6 text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    ) : (
                      <>
                    <img
                      src={pagePreviewImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormStyles({
                          ...formStyles,
                          page_properties: {
                            ...formStyles.page_properties,
                            cover: "",
                          },
                        })
                      }
                      className="absolute top-0 right-0 bg-black/50 text-white rounded-full p-1 hover:bg-black"
                    >
                      ✕
                    </button>
                    </>)}
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2 border-b  p-2">
                <Label className="font-normal">Form Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    className="w-4/5 h-8 bg-gray-200 rounded focus-visible:ring-0"
                    placeholder="#ffffff"
                    value={formStyles?.form_properties?.color}
                    onChange={(e) => {
                      setFormStyles({
                        ...formStyles,
                        form_properties: {
                          ...formStyles?.form_properties,
                          color: e.target.value,
                        },
                      });
                    }}
                  />
                  <input
                    type="color"
                    className="h-8 w-8 p-0 border-0 rounded-full cursor-pointer appearance-none
                 [&::-webkit-color-swatch-wrapper]:p-0
                 [&::-webkit-color-swatch-wrapper]:rounded-full
                 [&::-webkit-color-swatch]:rounded-full"
                    value={formStyles?.form_properties?.color}
                    onChange={(e) => {
                      setFormStyles({
                        ...formStyles,
                        form_properties: {
                          ...formStyles?.form_properties,
                          color: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
                <Label className="font-normal">Form Image</Label>
                {!formStyles?.form_properties?.cover ? (
                  <Button
                    className="bg-gray-200 hover:bg-gray-200 text-black h-8 rounded py-1 px-2  w-2/5 shadow-none cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FileUpload
                      onFileSelect={(file, fileUrl) => {
                        setFormStyles({
                          ...formStyles,
                          form_properties: {
                            ...formStyles?.form_properties,
                            cover: fileUrl,
                          },
                        });
                      }}
                    >
                      <div className="flex gap-1 items-center text-sm text-black shadow-none cursor-pointer">
                        <Image className="!h-4 !w-3" />
                        Choose a file
                      </div>
                    </FileUpload>
                  </Button>
                ) : (
                  <div className="relative w-24 h-16">
                    {isLoading ? (
                      <Loader2 className="animate-spin h-6 w-6 text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    ) : (
                      <>
                        <img
                          src={formPreviewImage}
                          alt="Cover Preview"
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormStyles({
                              ...formStyles,
                              form_properties: {
                                ...formStyles.form_properties,
                                cover: "",
                              },
                            })
                          }
                          className="absolute top-0 right-0 bg-black/50 text-white rounded-full p-1 hover:bg-black"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2 p-2">
                <Label className="font-normal">Font color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    className="w-4/5 h-8 bg-gray-200 rounded focus-visible:ring-0"
                    placeholder="#374151"
                    value={formStyles?.font_properties?.font_color}
                    onChange={(e) => {
                      setFormStyles({
                        ...formStyles,
                        font_properties: {
                          ...formStyles?.font_properties,
                          font_color: e.target.value,
                        },
                      });
                    }}
                  />
                  <input
                    type="color"
                    className="h-8 w-8 p-0 border-0 rounded-full cursor-pointer appearance-none
                 [&::-webkit-color-swatch-wrapper]:p-0
                 [&::-webkit-color-swatch-wrapper]:rounded-full
                 [&::-webkit-color-swatch]:rounded-full"
                    value={formStyles?.font_properties?.font_color}
                    onChange={(e) => {
                      setFormStyles({
                        ...formStyles,
                        font_properties: {
                          ...formStyles?.font_properties,
                          font_color: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
                <Label className="font-normal">Input Background</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    className="w-4/5 h-8 bg-gray-200 rounded focus-visible:ring-0"
                    placeholder="#ffffff"
                    value={formStyles?.form_properties?.input_background_color}
                    onChange={(e) => {
                      setFormStyles({
                        ...formStyles,
                        form_properties: {
                          ...formStyles?.form_properties,
                          input_background_color: e.target.value,
                        },
                      });
                    }}
                  />
                  <input
                    type="color"
                    className="h-8 w-8 p-0 border-0 rounded-full cursor-pointer appearance-none
                 [&::-webkit-color-swatch-wrapper]:p-0
                 [&::-webkit-color-swatch-wrapper]:rounded-full
                 [&::-webkit-color-swatch]:rounded-full"
                    value={formStyles?.form_properties?.input_background_color}
                    onChange={(e) => {
                      setFormStyles({
                        ...formStyles,
                        form_properties: {
                          ...formStyles?.form_properties,
                          input_background_color: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
                <Label className="font-normal">Input Border</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    className="w-4/5 h-8 bg-gray-200 rounded focus-visible:ring-0"
                    placeholder="#ffffff"
                    value={formStyles?.form_properties?.input_border_color}
                    onChange={(e) => {
                      setFormStyles({
                        ...formStyles,
                        form_properties: {
                          ...formStyles?.form_properties,
                          input_border_color: e.target.value,
                        },
                      });
                    }}
                  />
                  <input
                    type="color"
                    className="h-8 w-8 p-0 border-0 rounded-full cursor-pointer appearance-none
                 [&::-webkit-color-swatch-wrapper]:p-0
                 [&::-webkit-color-swatch-wrapper]:rounded-full
                 [&::-webkit-color-swatch]:rounded-full"
                    value={formStyles?.form_properties?.input_border_color}
                    onChange={(e) => {
                      setFormStyles({
                        ...formStyles,
                        form_properties: {
                          ...formStyles?.form_properties,
                          input_border_color: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-1 space-y-2">
              <div className="flex flex-col space-y-2 border-b  p-2">
                <Label className="font-normal">Question Spacing</Label>
                <Input
                  className="w-4/5 h-8 bg-gray-200 rounded focus-visible:ring-0"
                  placeholder="0"
                  type="number"
                  defaultValue={formStyles?.form_properties?.question_spacing}
                  onChange={(e) => {
                    setFormStyles({
                      ...formStyles,
                      form_properties: {
                        ...formStyles?.form_properties,
                        question_spacing: Number(e.target.value),
                      },
                    });
                  }}
                />
                <Label className="font-normal">Label Width</Label>
                <Input
                  className="w-4/5 h-8 bg-gray-200 rounded focus-visible:ring-0"
                  placeholder="0"
                  type="number"
                />
              </div>
              <div className="flex flex-col space-y-2 p-2">
                <Label className="font-normal">Font</Label>
                <Select
                  value={formStyles?.font_properties?.font_family}
                  onValueChange={(e) => {
                    setFormStyles({
                      ...formStyles,
                      font_properties: {
                        ...formStyles?.font_properties,
                        font_family: e,
                      },
                    });
                  }}
                >
                  <SelectTrigger className="w-4/5 h-8 bg-gray-200 rounded focus-visible:ring-0">
                    <SelectValue
                      defaultValue={formStyles?.font_properties?.font_family}
                      placeholder="Select a font"
                    />
                  </SelectTrigger>
                  <SelectContent className="h-[40vh]">
                    {FONT_OPTIONS?.map((option) => (
                      <SelectItem key={option.label} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
