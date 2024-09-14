import { Editor } from "react-notion-wysiwyg";
import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";

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

export function shouldRevalidate() {
  return false;
}

export default function Component() {
  const { page } = useLoaderData<typeof loader>();

  const fetcher = useFetcher({ key: "page-update" });

  const handleContentChange = (editor: string) => {
    fetcher.submit(
      { content: editor ?? "" },
      {
        method: "post",
      }
    );
  };

  return (
    <Editor
      content={page?.content}
      onUpdate={(editor) => handleContentChange(editor.getHTML())}
    />
  );
}
