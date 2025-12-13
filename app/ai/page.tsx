import { AIConfigurator } from "@/components/ai-configurator";

export const metadata = {
  title: "AI 정장 맞추기 | GOLD FINGER",
};

export default function AIPage() {
  return (
    <main className="h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-5rem)] lg:max-h-[calc(100dvh-5rem)] mt-16 lg:mt-20 bg-neutral-100 text-neutral-900">
      <AIConfigurator />
    </main>
  );
}
