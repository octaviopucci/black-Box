# Deploy — Maciel Motors Gestor

## Preview público (agora)

A Netlify atingiu o **limite diário de deploys anônimos**. Enquanto isso:

- **URL:** https://two-yaks-thank.loca.lt  
- **Login:** `admin` / `admin123`

> Se o localtunnel pedir confirmação, clique em Continue / bypass.

Alternativa: https://530f946ed57833.lhr.life

## Publicar permanente na sua Netlify (recomendado)

1. Abra https://app.netlify.com e faça login  
2. Em https://app.netlify.com/drop arraste a pasta `maciel-motors-gestor/dist`  
   **ou** no terminal:

```bash
cd maciel-motors-gestor
npm run build
npx netlify-cli login
npx netlify-cli deploy --dir=dist --prod
```

Assim o site fica na **sua** conta e não expira em 60 minutos.
