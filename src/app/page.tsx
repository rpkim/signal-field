import { AppShell } from "@/components/AppShell";
import { HomeClient } from "@/components/HomeClient";

export default function HomePage() {
  return (
    <AppShell current="/">
      <HomeClient />
    </AppShell>
  );
}
