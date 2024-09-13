import { Editor } from "react-notion-wysiwyg";
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

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

export default function Component() {
  const { page } = useLoaderData<typeof loader>();

  return <Editor content={page?.content} />;
}
