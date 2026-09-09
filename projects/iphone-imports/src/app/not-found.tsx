import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-store flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="mb-2 text-6xl font-bold text-brand-yellow">404</p>
      <h1 className="mb-2 text-2xl font-bold">Ops! Essa página saiu de estoque.</h1>
      <p className="mb-8 text-brand-gray">
        Mas temos muita tecnologia esperando por você.
      </p>
      <Button href="/">Voltar para a loja</Button>
    </div>
  );
}
