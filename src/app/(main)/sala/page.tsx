"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SalaPage() {
  const { status } = useSession();
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin-slow text-6xl">🎲</div>
      </div>
    );
  }

  async function handleCreate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sala", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/sala/${data.code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao criar sala.");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/sala/${joinCode.toUpperCase()}/entrar`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/sala/${data.code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Código inválido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8 text-center">
        <div className="mb-4 text-5xl">👥</div>
        <h1 className="font-display text-4xl text-black">Sala em Grupo</h1>
        <p className="mt-2 font-medium text-black/60">
          Encontre uma recomendação que agrada todo mundo
        </p>
      </div>

      <div className="space-y-6">
        <div className="neo-card-static animate-pop-in bg-brutal-yellow p-6">
          <h2 className="font-display mb-2 text-2xl text-black">
            Criar uma Sala
          </h2>
          <p className="mb-4 text-sm font-medium text-black/70">
            Você recebe um código e convida seus amigos.
          </p>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="neo-btn w-full bg-black text-lg text-white disabled:opacity-50"
          >
            {loading ? "Criando..." : "🚀 Criar Sala"}
          </button>
        </div>

        <div
          className="neo-card-static animate-pop-in bg-white p-6"
          style={{ animationDelay: "80ms" }}
        >
          <h2 className="font-display mb-2 text-2xl text-black">
            Entrar em uma Sala
          </h2>
          <form onSubmit={handleJoin} className="space-y-3">
            <input
              type="text"
              className="neo-input text-center text-xl font-bold uppercase tracking-widest"
              placeholder="CÓDIGO"
              maxLength={6}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            />
            <button
              type="submit"
              disabled={loading || joinCode.length < 6}
              className="neo-btn w-full bg-brutal-sky text-lg text-black disabled:opacity-50"
            >
              {loading ? "Entrando..." : "🔗 Entrar"}
            </button>
          </form>
        </div>

        {error && (
          <div className="neo-card-static bg-brutal-red/20 p-4 text-center font-bold text-black">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
