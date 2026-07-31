import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSlot } from "@/components/AdSlot";
import { PlatformRow } from "@/components/PlatformRow";
import { HomeAnalyzer } from "@/components/HomeAnalyzer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-5 py-10">
        <div className="flex justify-center">
          <AdSlot slot="top-banner" className="max-w-[728px]" />
        </div>

        <section className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Save video from anywhere
            </h1>
            <p className="text-base text-text-secondary">
              Paste a link, pick a format, download. No sign-up, no clutter.
            </p>
          </div>

          <div className="w-full max-w-2xl text-left">
            <HomeAnalyzer />
          </div>

          <PlatformRow />
        </section>

        <AdSlot slot="in-content" className="mx-auto max-w-md" />
      </main>

      <div className="mx-auto w-full max-w-5xl px-5">
        <AdSlot slot="footer" className="mx-auto mb-8 max-w-[728px]" />
      </div>

      <Footer />
    </div>
  );
}
