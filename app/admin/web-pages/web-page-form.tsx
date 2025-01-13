"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MdEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createWebPage, updateWebPage } from "@/lib/actions/web-page.actions";
import { IWebPage } from "@/lib/db/models/web-page.model";
import { WebPageInputSchema, WebPageUpdateSchema } from "@/lib/validator";
import { Checkbox } from "@/components/ui/checkbox";
import { toSlug } from "@/lib/utils";
import { toast } from "react-toastify";
const webPageDefaultValues =
  process.env.NODE_ENV === "development"
    ? {
        title: "Sample Page",
        slug: "sample-page",
        content: "Sample Content",
      }
    : {
        title: "",
        slug: "",
        content: "",
      };
const WebPageForm = ({
  type,
  webPage,
  webPageId,
}: {
  type: "Create" | "Update";
  webPage?: IWebPage;
  webPageId?: string;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof WebPageInputSchema>>({
    resolver:
      type === "Update"
        ? zodResolver(WebPageUpdateSchema)
        : zodResolver(WebPageInputSchema),
    defaultValues:
      webPage && type === "Update" ? webPage : webPageDefaultValues,
  });
  async function onSubmit(values: z.infer<typeof WebPageInputSchema>) {
    if (type === "Create") {
      const res = await createWebPage(values);
      if (!res.success) {
        toast.warning(res.message);
      } else {
        toast.success(res.message);
        router.push(`/admin/web-pages`);
      }
    }
    if (type === "Update") {
      if (!webPageId) {
        router.push(`/admin/web-pages`);
        return;
      }
      const res = await updateWebPage({ ...values, _id: webPageId });
      if (!res.success) {
        toast.warning(res.message);
      } else {
        router.push(`/admin/web-pages`);
      }
    }
  }
  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Tiêu đề</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter slug"
                      className="pl-8"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue("slug", toSlug(form.getValues("title")));
                      }}
                      className="absolute right-2 top-2.5"
                    >
                      Generate
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <MdEditor
                    {...field}
                    style={{ height: "500px" }}
                    renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
                    onChange={({ text }) => form.setValue("content", text)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="space-x-2 items-center">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Được phép truy cập?</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
              </div>
            ) : (
              `${type === "Create" ? "Tạo" : "Chỉnh sửa"}`
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default WebPageForm;
