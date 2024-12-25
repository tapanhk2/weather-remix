import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { Form, Link, useActionData } from "@remix-run/react";

import { getSession, commitSession } from "~/session.server";

import { createUser, findUser } from "~/models/user.server"; // mock 

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get("cookie"));
  // redirect to / if the user is logged-in
  if (session.has("userId")){ return redirect("/weathers")}
  return json(null);
}

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();

  const user = await findUser({
    username: formData.get("username"),
    password: formData.get("password")

  })
  // let user2 = await createUser('ipgautomotive', 'carmaker')
  // console.log(user2); return null;
  if(user){
    let session = await getSession(request.headers.get("cookie"));
    session.set("userId", user.id);
    session.set("username", user.username);
    return redirect("/weathers", {
      headers: { "set-cookie": await commitSession(session) }
    });
  }
  else{
    return json({ error:'error' });
  }
  
}

export default function Component() {

    const actionProps = useActionData<typeof action>();
  
    return (
        <Form className="flex h-full items-center justify-center" method="post">
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            </div>
            {actionProps?.error &&
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 mt-10 rounded relative" role="alert">
              <span className="font-bold">Error! </span>
              <span className="block sm:inline">Invalid username or password.</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
               </span>
            </div>
            }

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" method="POST">
                <div>
                    <label className="block text-sm/6 font-medium text-gray-900">Username</label>
                    <div className="mt-2">
                    <input type="text" name="username" id="username"  required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                    <label  className="block text-sm/6 font-medium text-gray-900">Password</label>
                    <div className="text-sm">
                        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                    </div>
                    </div>
                    <div className="mt-2">
                    <input type="password" name="password" id="password"  required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                </div>
                </form>

                
            </div>
            </div>
        </Form>
      );
}
