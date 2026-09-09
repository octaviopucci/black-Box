import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-brand-black px-4 py-16 text-center">
      <div className="grid-pattern absolute inset-0 opacity-20" />
      <p className="relative text-8xl font-black text-brand-yellow">404</p>
      <h1 className="relative mt-4 text-2xl font-black text-white">
        Ops! Essa página saiu de estoque.
      </h1>
      <p className="relative mt-2 text-brand-gray">
        Mas temos muita tecnologia esperando por você.
      </p>
      <Link href="/" className="btn-primary relative mt-8">
        <ArrowLeft className="h-4 w-4" />
        Voltar para a loja
      </Link>
    </div>
  );
}
