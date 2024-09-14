import { Button } from "@/components/ui/button";
import { Menu, ChevronLeft, FileIcon } from "lucide-react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  Link,
  Outlet,
  useFetchers,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { NewPageModal } from "@/components/new-page-modal";
import { v4 as uuidv4 } from "uuid";
import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

type Page = {
  id: string;
  title: string;
  content: string;
  userId: string;
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { env } = context.cloudflare;

  const pages = await env.DB.prepare("SELECT id, title FROM pages").all<Page>();

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
  const content = "<p></p>";

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

export default function Component() {
  const { pages } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const fetchers = useFetchers();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const isPageSaving = fetchers.some(
    (fetcher) => fetcher.key === "page-update" && fetcher.state === "submitting"
  );

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleCreatePage = (pageName: string, callback: () => void) => {
    submit({ title: pageName }, { method: "post" });
    callback();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`
            ${
              sidebarOpen || isLargeScreen
                ? "translate-x-0"
                : "-translate-x-full"
            }
            w-64 bg-card shadow-lg transition-transform duration-300 ease-in-out
            ${
              !isLargeScreen ? "fixed" : ""
            } inset-y-0 left-0 z-50 lg:relative lg:translate-x-0
          `}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Wotion</h2>
            {!isLargeScreen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            )}
          </div>
          <div className="flex-1 overflow-auto">
            <nav className="space-y-1 p-2">
              <div className="mb-2 px-2 text-sm font-medium text-muted-foreground">
                Pages
              </div>
              {pages.results.map((page) => (
                <Button
                  key={page.id}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={`/app/pages/${page.id}`}>
                    <FileIcon className="mr-2 h-4 w-4" />
                    {page.title}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
          <div className="p-4">
            <NewPageModal onSubmit={handleCreatePage} />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b p-4">
          <div className="flex items-center">
            {!isLargeScreen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="mr-4 lg:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            )}
            <h1 className="text-2xl font-bold">Notion-like Page</h1>
          </div>
          <div className="flex items-center">
            <div className="relative mr-4">
              {isPageSaving && (
                <span className="flex items-center gap-x-1 text-sm">
                  <Spinner size="small" /> Saving...
                </span>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <div className="max-w-3xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
