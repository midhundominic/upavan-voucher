"use client";

import { useActionState, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { signIn } from "@/app/actions";
import { AssetImage } from "@/components/AssetImage";
import { Botanical } from "@/components/Botanical";
import { ResortLogo } from "@/components/ResortLogo";

export function LoginForm({
  configured,
  logo,
  hero,
}: {
  configured: boolean;
  logo: string;
  hero: string;
}) {
  const [state, action, pending] = useActionState(signIn, { error: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <main className="login-page">
      <section className="login-visual" aria-label="Welcome to Upavan Resort">
        <AssetImage
          src={hero}
          alt="The lush, peaceful grounds of Upavan Resort in Wayanad"
          className="login-photo"
        />
        <div className="login-photo-overlay" />
        <span className="login-visual-eyebrow">
          <Leaf size={17} strokeWidth={1.4} /> NATURE RESTS HERE WITH YOU
        </span>
        <div className="login-visual-copy">
          <p className="eyebrow">UPAVAN RESORT · WAYANAD</p>
          <h1>
            Some gifts
            <br />
            are <em>felt.</em>
          </h1>
          <p>
            A quiet morning. A little wonder.
            <br />A memory that stays, long after the stay.
          </p>
          <span className="login-gold-line" />
        </div>
        <p className="login-visual-footer">MORE THAN A STAY. A FEELING.</p>
      </section>
      <section className="login-form-panel">
        <ResortLogo src={logo} className="login-logo" />
        <div className="login-form-content">
          <p className="eyebrow">
            <span /> YOUR PRIVATE WORKSPACE
          </p>
          <h2>
            Welcome to
            <br />
            <em>Voucher Designer.</em>
          </h2>
          <p className="login-description">
            A beautiful gesture starts here. Sign in to create a personalized complimentary stay
            voucher.
          </p>
          {!configured && (
            <div className="setup-notice">
              <LockKeyhole size={18} />
              <div>
                <strong>Your workspace is almost ready</strong>
                <p>
                  Set <code>AUTH_EMAIL</code>, <code>AUTH_PASSWORD</code> (8+ characters), and{" "}
                  <code>AUTH_SECRET</code> (32+ characters) in your <code>.env.local</code> file,
                  then restart the app.
                </p>
              </div>
            </div>
          )}
          <form action={action} className="login-form">
            <div className="field-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@upavanresort.com"
                autoComplete="username"
                required
                maxLength={254}
                disabled={pending || !configured}
              />
            </div>
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  maxLength={1024}
                  disabled={pending || !configured}
                />
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  disabled={pending || !configured}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            {state.error && (
              <p className="login-error" role="alert">
                {state.error}
              </p>
            )}
            <button
              type="submit"
              className="button button-primary login-submit"
              disabled={pending || !configured}
              aria-busy={pending}
            >
              {pending ? (
                <>
                  Signing in <LoaderCircle size={17} className="spin" />
                </>
              ) : (
                <>
                  Enter the designer <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
          <p className="login-privacy">
            <ShieldCheck size={14} /> A private space for thoughtful gifting.
          </p>
        </div>
        <Botanical className="login-botanical" />
        <footer className="login-footer">WHERE NATURE FEELS LIKE HOME</footer>
      </section>
    </main>
  );
}
