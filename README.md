# Challenge XP App

Aplicativo mobile desenvolvido com Expo/React Native para o desafio XP. O app permite cadastro, autenticação, preenchimento de formulários e visualização de informações financeiras, com integração ao Supabase.

---

## 🚀 Tecnologias Utilizadas
- **React Native** (Expo)
- **TypeScript**
- **Supabase** (Backend as a Service)
- **Context API** (Gerenciamento de estado)
- **React Navigation**
- **Componentização customizada**

---

## 📦 Instalação e Execução Local

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repo>
   cd Challenge-xp-app
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Inicie o projeto:**
   ```bash
   npx expo start --tunnel -c
   ```
   > O parâmetro `--tunnel` facilita o acesso em dispositivos físicos.

---

## 🗂️ Estrutura do Projeto

```
├── app/                # Rotas e telas principais
│   ├── (app)/          # Telas autenticadas
│   ├── (auth)/         # Telas de autenticação
│   └── form/           # Etapas do formulário
├── components/         # Componentes reutilizáveis
│   ├── ui/             # Componentes de UI (Button, Header, etc)
│   └── auth/           # Componentes de autenticação
├── contexts/           # Contextos globais (Auth, Form)
├── hooks/              # Custom hooks
├── lib/                # Integrações (supabase, auth, tema, validação)
├── assets/             # Imagens e ícones
├── metro.config.js     # Configuração do Metro bundler
├── app.json            # Configuração do Expo
├── tsconfig.json       # Configuração do TypeScript
└── ...
```

---

## 🔑 Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com/).
2. Copie a URL e a chave anônima do projeto.
3. Crie um arquivo `.env` na raiz do projeto:
   ```env
   SUPABASE_URL=coloque_aqui_sua_url
   SUPABASE_ANON_KEY=coloque_aqui_sua_chave
   ```
4. Certifique-se de que o arquivo `lib/supabase.ts` está lendo essas variáveis.

---

## 🧩 Principais Funcionalidades
- Autenticação de usuários (login, registro, recuperação de senha)
- Formulário multi-etapas (dados pessoais, financeiros, preferências, etc)
- Visualização de resumo e perfil
- Pesquisa e exibição de ações
- UI responsiva e moderna

---

## 🛠️ Dicas para Desenvolvimento
- Use `npx expo start --tunnel -c` para evitar problemas de rede.
- Se ocorrer erro relacionado ao Supabase, confira o arquivo `metro.config.js`:
  ```js
  // metro.config.js
  const { getDefaultConfig } = require('expo/metro-config');
  const config = getDefaultConfig(__dirname);
  config.resolver.unstable_enablePackageExports = false;
  module.exports = config;
  ```
- Para adicionar novas telas, crie arquivos em `app/(app)/` ou `app/(auth)/` e registre as rotas.
- Componentes reutilizáveis ficam em `components/ui/`.

---

## 🐞 Troubleshooting
- **Erro de dependências:** Rode `npm install` novamente.
- **Problemas com o Supabase:** Verifique as variáveis de ambiente e a configuração do Metro.
- **Problemas de navegação:** Confira se as rotas estão corretamente exportadas.

---

## 🤝 Como Contribuir
1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: minha nova feature'`
4. Push para o fork: `git push origin minha-feature`
5. Abra um Pull Request

---

## 📄 Licença
Este projeto está sob a licença MIT.

---

> Feito com 💙 para o desafio XP.
