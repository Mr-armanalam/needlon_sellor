import type { ReactNode } from "react";

function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h1 className="font-garamond text-[34px] leading-tight text-foreground">
        {title}
      </h1>
      <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="mt-4 h-px bg-gradient-to-r from-brass-500/70 via-border to-transparent" />
    </div>
  );
}

export function AdminPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-7 px-6 py-8 lg:px-10">
      <PageHeader title={title} description={description} />
      {children}
    </div>
  );
}
