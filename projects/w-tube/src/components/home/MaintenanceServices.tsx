import Link from "next/link";
import {
  Smartphone,
  Battery,
  MonitorSmartphone,
  Wrench,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { storeConfig } from "@/config/store";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SectionHeader } from "@/components/ui/SectionHeader";

const services = [
  {
    icon: MonitorSmartphone,
    title: "Troca de tela",
    description: "Vidro, display e reparos em iPhones e smartphones.",
    tag: "iPhone",
  },
  {
    icon: Battery,
    title: "Bateria",
    description: "Substituição com peças selecionadas e teste de desempenho.",
    tag: "iPhone",
  },
  {
    icon: Smartphone,
    title: "Conector e áudio",
    description: "Problemas de carga, microfone e alto-falante.",
    tag: "Geral",
  },
  {
    icon: Wrench,
    title: "Manutenção geral",
    description: "Android, tablets e eletrônicos — diagnóstico e reparo.",
    tag: "Geral",
  },
];

export function MaintenanceServices() {
  const whatsappUrl = getWhatsAppUrl(
    `Olá! Gostaria de informações sobre manutenção de celular na ${storeConfig.name}.`
  );

  return (
    <section className="section-dark relative overflow-hidden py-14 md:py-20">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="container-store relative">
        <SectionHeader
          title="Manutenção de iPhone e geral"
          subtitle="Reparos com atendimento consultivo — consulte disponibilidade e prazos"
          variant="dark"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-2xl border border-brand-border bg-brand-surface/80 p-6 transition-all duration-300 hover:border-brand-purple/50 hover:shadow-[0_8px_32px_rgba(147,51,234,0.08)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-purple/15 transition-colors group-hover:bg-brand-purple/25">
                  <service.icon className="h-6 w-6 text-brand-purple" />
                </div>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-gray">
                  {service.tag}
                </span>
              </div>
              <h3 className="mb-2 font-bold text-white">{service.title}</h3>
              <p className="text-sm leading-relaxed text-brand-gray">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-2xl border border-brand-purple/20 bg-brand-purple/5 p-6 md:flex-row md:p-8">
          <div className="text-center md:text-left">
            <p className="text-lg font-bold text-white">
              Precisa de manutenção?
            </p>
            <p className="mt-1 text-sm text-brand-gray">
              Envie o modelo do aparelho e o problema pelo WhatsApp. Retornamos com
              diagnóstico e orçamento.
            </p>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
            <MessageCircle className="h-5 w-5" />
            Solicitar orçamento
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-brand-muted">
          Serviços sujeitos à disponibilidade de peças e análise técnica. Valores
          e prazos informados no atendimento.
        </p>
      </div>
    </section>
  );
}
