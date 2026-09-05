export default function GlobalLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] items-center justify-center p-6"
    >
      <div className="flex items-center space-x-2 text-neutral-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  );
}
