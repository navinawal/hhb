import { getSession } from "@/lib/cms/auth";
import { uploadCmsImage } from "@/lib/cms/content";

export async function POST(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const image = await uploadCmsImage(formData.get("image"));
    return Response.json({ image });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The image could not be uploaded." }, { status: 400 });
  }
}
