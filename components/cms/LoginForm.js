"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginAction } from "@/app/actions/cms";

const initialState = { error: "" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form className="cms-login-form" action={formAction}>
      <label>
        <span>Username</span>
        <input name="username" autoComplete="username" required autoFocus />
      </label>
      <label>
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state?.error && <p className="cms-form-error" role="alert">{state.error}</p>}
      <button className="cms-primary-button" type="submit" disabled={pending}>
        <LogIn aria-hidden="true" /> {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

