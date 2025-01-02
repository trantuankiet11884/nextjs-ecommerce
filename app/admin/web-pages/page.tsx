import Link from "next/link";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import { deleteWebPage, getAllWebPages } from "@/lib/actions/web-page.actions";
import { IWebPage } from "@/lib/db/models/web-page.model";
import { EditIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Trang web",
};

export default async function WebPageAdminPage() {
  const webPages = await getAllWebPages();
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h1-bold">Tạo trang web</h1>
        <Button asChild variant="default">
          <Link prefetch={true} href="/admin/web-pages/create">
            Tạo
          </Link>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Mã</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Truy cập</TableHead>
              <TableHead className="w-[100px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webPages.map((webPage: IWebPage) => (
              <TableRow key={webPage._id}>
                <TableCell>{formatId(webPage._id)}</TableCell>
                <TableCell>{webPage.title}</TableCell>
                <TableCell>{webPage.slug}</TableCell>
                <TableCell>
                  {webPage.isPublished ? "Đã truy cập" : "Chặn"}
                </TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link
                      prefetch={true}
                      href={`/admin/web-pages/${webPage._id}`}
                    >
                      <EditIcon />
                    </Link>
                  </Button>
                  <DeleteDialog id={webPage._id} action={deleteWebPage} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
