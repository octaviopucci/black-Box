import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface InstitutionalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function InstitutionalLayout({ title, children }: InstitutionalLayoutProps) {
  return (
    <div className="container-store py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: title },
        ]}
      />
      <h1 className="mb-8 text-3xl font-bold">{title}</h1>
      <div className="prose-store max-w-3xl space-y-4 text-brand-gray leading-relaxed">
        {children}
      </div>
    </div>
  );
}
