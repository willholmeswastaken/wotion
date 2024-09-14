import { Editor } from "react-notion-wysiwyg";
import {
  ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import {
  ShouldRevalidateFunction,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { Editor as Editor$1 } from "@tiptap/core";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useCallback } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

type Page = {
  id: string;
  title: string;
  content: string;
};

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const { env } = context.cloudflare;

  const page = await env.DB.prepare("SELECT * FROM pages WHERE id = ?")
    .bind(params.page)
    .first<Page>();

  if (!page) {
    return redirect("/app/not-found");
  }

  page.content = page?.content.length === 0 ? "<p></p>" : page?.content;

  return json({ page });
};

export const action = async ({
  params,
  request,
  context,
}: ActionFunctionArgs) => {
  const { env } = context.cloudflare;

  const formData = await request.formData();
  const content = formData.get("content") as string;

  await env.DB.prepare("UPDATE pages SET content = ? WHERE id = ?")
    .bind(content, params.page)
    .run();

  return json({ success: true });
};

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
}) => {
  return currentParams.page !== nextParams.page;
};

export default function Component() {
  const { page } = useLoaderData<typeof loader>();

  const fetcher = useFetcher({ key: "page-update" });

  const debouncedSubmit = useDebounce((content: string) => {
    console.log("submitting", content);
    fetcher.submit(
      { content: content ?? "<p></p>" },
      {
        method: "post",
      }
    );
  }, 500);

  const handleContentChange = useCallback(
    (editor: Editor$1) => {
      const content = editor.getHTML();
      debouncedSubmit(content);
    },
    [debouncedSubmit]
  );

  return (
    <div>
      <Editor content={page?.content} onUpdate={handleContentChange} />
    </div>
  );
}
