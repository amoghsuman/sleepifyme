export default function BrandedLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-midnight px-6 pt-[86px]">
      <div className="mb-6 h-8 w-8 animate-pulse rounded-full bg-gold/70" />
      <span className="text-xs uppercase tracking-[3px] text-goldSoft/70">
        Loading
      </span>
    </div>
  );
}
