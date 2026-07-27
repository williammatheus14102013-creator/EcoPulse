# EcoPulse

Aplicação web de gamificação sustentável em HTML, CSS e JavaScript. A PulseIA usa uma função serverless da Vercel para analisar imagens com a OpenAI sem expor a chave no navegador.

## Executar localmente

Para testar apenas a interface, sirva a pasta com um servidor estático:

```bash
python -m http.server 4173
```

Abra `http://localhost:4173`. A PulseIA real requer o ambiente de funções da Vercel e a variável de ambiente descrita abaixo.

## Configurar a PulseIA na Vercel

1. Importe este repositório em um novo projeto na Vercel.
2. Abra **Project Settings → Environment Variables**.
3. Crie uma variável chamada `OPENAI_API_KEY` e informe sua chave de API da OpenAI como valor.
4. Aplique-a aos ambientes desejados (Production, Preview e/ou Development) e faça um novo deploy.

Não coloque a chave no `index.html`, no `script.js`, no código CSS ou em qualquer outra variável exposta ao navegador. Ela é lida somente pela função `api/analyze.js` no servidor.

## Deploy

1. Envie a pasta a um repositório Git.
2. Na Vercel, selecione **Add New → Project** e importe o repositório.
3. Mantenha o framework como **Other** e não informe comando de build.
4. Configure `OPENAI_API_KEY` conforme a seção anterior.
5. Clique em **Deploy**.

## Testar a PulseIA

1. Publique o projeto na Vercel após configurar a variável.
2. Abra **PulseIA** e escolha uma imagem JPG, PNG ou WEBP de até 3 MB; em celulares compatíveis o seletor oferece a câmera traseira.
3. Clique em **Iniciar análise**.
4. A interface mostra a animação enquanto chama `POST /api/analyze`.
5. Se a imagem tiver um resíduo identificável, a aplicação mostra objeto, material, categoria, urgência, confiança, explicação, recomendação e uma missão gerada. Imagens ambíguas retornam um pedido para tentar outra foto, sem inventar identificação.

## Estrutura

- `index.html` — estrutura da aplicação.
- `style.css` — design responsivo, animações e alto contraste.
- `script.js` — telas, progresso no `localStorage`, PulseIA e gamificação.
- `api/analyze.js` — função serverless segura que chama a API da OpenAI.
- `vercel.json` — configuração de hospedagem e função.

O progresso do usuário é armazenado apenas no `localStorage` do navegador. **Reiniciar progresso** limpa EcoPontos, nível, experiência, missões, conquistas, estatísticas, avatar e impacto ambiental, preservando preferências visuais do navegador.
