# Dra. Danielle Lavinsky — landing 1 página

Landing HTML estática focada em conversão WhatsApp.

## Dados (fontes)

- Instagram: [@dra.daniellelavinsky](https://www.instagram.com/dra.daniellelavinsky/)
- Clínica Lavinsky — Rua Quintino Bocaiúva, 673, Porto Alegre/RS
- Telefone/WhatsApp: (51) 3332-0032 → `wa.me/555133320032`
- CRO/RS 15888

## Ver local

Abra `index.html` no navegador ou sirva a pasta:

```bash
cd projects/dra-danielle-lavinsky
python3 -m http.server 8080
```

## Re-extrair Instagram

```bash
python3 .cursor/skills/frontend/instagram-extract/references/extract.py \
  dra.daniellelavinsky \
  --out projects/dra-danielle-lavinsky/public
```

Depois reconverter WebP em `img/` se trocar fotos.

## Pendente

- Confirmar se WhatsApp é o mesmo número da clínica
- Substituir depoimentos placeholder
- Incluir preços reais quando disponíveis
