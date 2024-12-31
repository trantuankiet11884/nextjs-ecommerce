import { Metadata } from "next";
import WebPageForm from "../web-page-form";
export const metadata: Metadata = {
  title: "Tạo",
};
export default function CreateWebPagePage() {
  return (
    <>
      <h1 className="h1-bold">Tạo</h1>
      <div className="my-8">
        <WebPageForm type="Create" />
      </div>
    </>
  );
}
