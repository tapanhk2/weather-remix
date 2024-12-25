// import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
// import { json, redirectDocument } from "@remix-run/node";
// import { Form, redirect } from "@remix-run/react";
// import { getSession, destroySession } from "~/session.server";

// export async function loader({ request }: LoaderFunctionArgs) {
//   let session = await getSession(request.headers.get("cookie"));
//   // redirect to / if the user is not logged-in
//   if (!session.has("userId") ) { return redirect("/login")}
//   return json(null);
// }

// export async function action({ request }: ActionFunctionArgs) {
//   let session = await getSession(request.headers.get("cookie"));
//   return redirectDocument("/login", {
//     headers: { "set-cookie": await destroySession(session) }
//   });
// }

// export default function Logout() {
//   return (
//     <Form method="post">
//       <button>Log Out</button>
//     </Form>
//   );
// }

import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect, redirectDocument } from "@remix-run/node";

import { destroySession, getSession } from "~/session.server";
 export async function action({ request }: ActionFunctionArgs) {
    let session = await getSession(request.headers.get("cookie"));
    return redirectDocument("/login", {
      headers: { "set-cookie": await destroySession(session) }
    });
  }
export const loader = async () => redirect("/");
