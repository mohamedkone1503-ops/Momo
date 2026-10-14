"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-8 space-y-4">
      <label htmlFor="password" className="block text-sm">Mot de passe</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="w-full rounded-[6px] border border-ink-line bg-ink px-4 py-3.5 focus:border-gold focus:outline-none"
      />
      {state?.error && <p className="text-sm text-barber-red" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-gold w-full">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
