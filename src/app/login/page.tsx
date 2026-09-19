"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Store,
  ShieldCheck,
  Crown,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { setAdminToken, getApiBaseUrl } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unauthorizedParam = searchParams.get("error") === "unauthorized";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    unauthorizedParam
      ? "تنبيه: يتطلب الوصول إلى لوحة الإدارة تسجيل الدخول بحساب المدير إبراهيم أولاً."
      : null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    const currentBaseUrl = getApiBaseUrl();
    const cleanBase = currentBaseUrl ? currentBaseUrl.replace(/\/$/, "") : "";
    const loginEndpoint = `${cleanBase}/api/admin/auth/login`;

    try {
      setLoading(true);
      const res = await fetch(loginEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        setAdminToken(data.token);
        setSuccessMessage(data.message || "مرحباً بك يا إبراهيم، تم تسجيل الدخول بنجاح!");
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        setErrorMessage(data.error || "فشل تسجيل الدخول: البريد أو كلمة المرور غير صحيحة");
      }
    } catch (err) {
      setErrorMessage("تعذر الاتصال بخادم المتجر. يرجى التأكد من تشغيل السيرفر والمحاولة مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAdmin = () => {
    setEmail("admin@store.com");
    setPassword("123456");
    setErrorMessage(null);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none"
      dir="rtl"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-1.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Store className="w-4 h-4 text-slate-950 font-black" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-1.5">
              <span>متجر سما الخضراء</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                لوحة الإدارة
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>المدير: إبراهيم</span>
          </span>
          <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            PRO SUITE v2.0
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto my-auto py-8 relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-black/50 space-y-6 hover:border-emerald-500/30 transition-all duration-500">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 p-0.5 shadow-2xl shadow-emerald-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                  <ShieldCheck className="w-9 h-9 text-emerald-400" />
                </div>
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center backdrop-blur-md">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
                <span>بوابة دخول المدير</span>
                <span className="text-emerald-400">إبراهيم</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1.5 font-medium">
                لوحة التحكم الإدارية الاحترافية لمتجر سما الخضراء
              </p>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-200 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-200 flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="font-bold">{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                البريد الإلكتروني المعتمد للمدير
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@store.com"
                  className="w-full pl-3 pr-11 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-xs sm:text-sm text-white placeholder-slate-500 transition-all font-mono"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-11 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-xs sm:text-sm text-white placeholder-slate-500 transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>جاري التحقق وتسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <span>دخول لوحة التحكم</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-3 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={fillQuickAdmin}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1.5 py-1 px-3 rounded-xl hover:bg-emerald-500/10 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>تعبئة بيانات المدير إبراهيم تلقائياً</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-[11px] text-slate-500 py-2 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>شركة سما الخضراء للهواتف الذكية والصيانة • 2026</span>
        <span className="font-mono text-[10px] text-slate-600">Secure Admin Session • RSA-256</span>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs">
          جاري التحميل...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
