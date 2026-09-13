import * as React from "react";
import { Container, MonoText } from "@/components/ui";

export default function PublicLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[50vh] flex flex-col items-center justify-center py-24"
    >
      <Container size="reading" className="flex flex-col items-center space-y-4 text-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <MonoText className="text-xs text-foreground-muted tracking-wider uppercase">
          Loading Portfolio Data...
        </MonoText>
      </Container>
    </div>
  );
}
