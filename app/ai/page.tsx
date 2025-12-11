import { AIConfigurator } from "@/components/ai-configurator";

export const metadata = {
  title: "AI 정장 맞추기 | GOLD FINGER",
};

export default function AIPage() {
  return (
    <main className="h-[calc(100vh-4rem)] mt-16 bg-neutral-100 text-neutral-900">
      <AIConfigurator />
    </main>
  );
}
