import { redirect } from "next/navigation";
import VisualEditor from "@/components/cms/VisualEditor";
import { getSession } from "@/lib/cms/auth";
import { getCmsStorageStatus, getDraftContent, getPublishedContent, listRevisions } from "@/lib/cms/content";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Visual editor | Holiday Home Bhaktapur",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await getSession())) redirect("/admin/login");
  const [draft, published, revisions] = await Promise.all([
    getDraftContent(),
    getPublishedContent(),
    listRevisions(),
  ]);

  return (
    <VisualEditor
      initialDocument={draft?.data || published?.data || null}
      revisions={revisions}
      storageStatus={getCmsStorageStatus()}
    />
  );
}
