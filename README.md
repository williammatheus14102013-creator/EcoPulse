# EcoPulse

Aplicação web estática de gamificação sustentável, criada em HTML, CSS e JavaScript puro. Não há dependências de build: ela pode ser hospedada diretamente na Vercel, Netlify ou GitHub Pages.

## Executar localmente

Abra `index.html` em um servidor estático. Por exemplo, com Python:

```bash
python -m http.server 4173
```

Depois acesse `http://localhost:4173`.

## Publicar na Vercel

1. Envie esta pasta para um repositório Git.
2. Na Vercel, escolha **Add New → Project** e importe o repositório.
3. Mantenha o framework como **Other** e não informe comando de build.
4. Clique em **Deploy**.

O arquivo `vercel.json` já está incluído. Todo o estado de demonstração fica apenas no `localStorage` de cada navegador.

## Estrutura

- `index.html` — estrutura da aplicação.
- `style.css` — design responsivo e animações.
- `script.js` — estado, telas, PulseIA simulada, missões, pontos, conquistas e resgates.
- `assets/` — orientação para substituir os visuais locais por fotos licenciadas.
