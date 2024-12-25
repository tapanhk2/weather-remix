import { redirect, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { getSession } from "~/session.server";


export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get("cookie"));
  // redirect to / if the user is logged-in
  if (session.has("userId")){ return redirect("/weathers")}
  return redirect("/login")
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return null
}


