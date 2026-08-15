import Link from "next/link";

export default function Breadcrumbs({
  bucket,
  prefix,
}: {
  bucket: string;
  prefix: string;
}) {
  const segments = prefix.split("/").filter(Boolean);
  const crumbs = segments.reduce<{ segment: string; cumulative: string }[]>(
    (acc, segment) => {
      const prevCumulative = acc.length > 0 ? acc[acc.length - 1].cumulative : "";
      acc.push({ segment, cumulative: prevCumulative + segment + "/" });
      return acc;
    },
    []
  );

  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-zinc-500">
      <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
        Buckets
      </Link>
      <span>/</span>
      <Link
        href={`/?bucket=${encodeURIComponent(bucket)}`}
        className="font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
      >
        {bucket}
      </Link>
      {crumbs.map(({ segment, cumulative }, i) => {
        const href = `/?bucket=${encodeURIComponent(bucket)}&prefix=${encodeURIComponent(cumulative)}`;
        const isLast = i === crumbs.length - 1;
        return (
          <span key={cumulative} className="flex items-center gap-1">
            <span>/</span>
            <Link
              href={href}
              className={
                isLast
                  ? "font-medium text-zinc-900 dark:text-zinc-100"
                  : "hover:text-zinc-900 dark:hover:text-zinc-100"
              }
            >
              {segment}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
