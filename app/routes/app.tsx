import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";

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

export default function AppLayout() {
  const { pages } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 border-r p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="font-semibold">Wotion</span>
          <Button variant="ghost" size="sm">
            <EditIcon className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 cursor-pointer">
            <span>Pages</span>
          </div>
          {pages.results.map((page) => (
            <div key={page.id}>{page.title}</div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content */}
        <main className="flex-1 p-8 max-w-3xl w-full space-y-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
