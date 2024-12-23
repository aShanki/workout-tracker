export function Spinner() {
  return (
    <div
      className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent text-primary"
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
