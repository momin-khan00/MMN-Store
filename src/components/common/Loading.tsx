export default function Loading() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-brand-light" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
