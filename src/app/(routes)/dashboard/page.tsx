import { stream } from "@/module/gpt/v1";

export default async function Page() {
  let text = "";

  for await (const chunk of stream("Hello")) {
    text += chunk || "";
  }

  return <pre>{text}</pre>;
}