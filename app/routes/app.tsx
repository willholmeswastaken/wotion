import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, Outlet, useLoaderData, useSubmit } from "@remix-run/react";
import { NewPageModal } from "@/components/new-page-modal";
import { v4 as uuidv4 } from "uuid";
import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useState } from "react";

type Page = {
  id: string;
  title: string;
  content: string;
  userId: string;
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { env } = context.cloudflare;

  const pages = await env.DB.prepare("SELECT * FROM pages").all<Page>();

  return json({ pages });
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const { env } = context.cloudflare;

  if (!title) {
    return json({ error: "Title is required" }, { status: 400 });
  }

  const id = uuidv4();
  const content = "";

  try {
    await env.DB.prepare(
      "INSERT INTO pages (id, title, content) VALUES (?, ?, ?)"
    )
      .bind(id, title, content)
      .run();

    return redirect("/app/pages/" + id);
  } catch (error) {
    console.error("Error creating page:", error);
    return json({ error: "Failed to create page" }, { status: 500 });
  }
};

export default function AppLayout() {
  const { pages } = useLoaderData<typeof loader>();
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const submit = useSubmit();

  // Update handleCreatePage to use the action
  const handleCreatePage = (pageName: string) => {
    submit({ title: pageName }, { method: "post" });
    setShowNewPageModal(false);
  };
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 border-r p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="font-semibold">Wotion</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowNewPageModal(true);
            }}
          >
            <EditIcon className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 cursor-pointer">
            <span>Pages</span>
          </div>
          {pages.results.map((page) => (
            <Link key={page.id} to={`/app/pages/${page.id}`}>
              {page.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content */}
        <main className="flex-1 p-8 max-w-3xl w-full space-y-4">
          <Outlet />
          <NewPageModal
            onSubmit={handleCreatePage}
            open={showNewPageModal}
            setOpen={setShowNewPageModal}
          />
        </main>
      </div>
    </div>
  );
}
