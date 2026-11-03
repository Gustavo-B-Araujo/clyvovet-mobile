# 🐾 Clyvo Vet — Mobile

Aplicativo mobile do Clyvo Vet, construído com [Expo](https://expo.dev) e React Native. O app oferece duas jornadas distintas conforme o papel do usuário autenticado:

- **Tutor**: cadastra seu pet, acompanha carteira de vacinação, histórico clínico, medicamentos/lembretes e agenda consultas com veterinários.
- **Veterinário**: acompanha as consultas atendidas, cria novas consultas para pacientes já atendidos, emite receitas (vinculadas à consulta) e gerencia os próprios dados de conta.

Vídeo de demonstração: https://youtu.be/SlxU2w0kIjw

## Funcionalidades

**Tutor**

- Cadastro, edição e troca entre vários pets
- Carteira de vacinação (registro, edição e exclusão de vacinas)
- Histórico clínico e agendamento de consultas com veterinários
- Medicamentos com lembretes por notificação (veja [Notificações](#notificações))
- Check-up de saúde e guia de emergência
- Conta: edição de dados, alteração de senha, aparência do app e logout

**Veterinário**

- Consultas atendidas, com tela de detalhes
- Criação de novas consultas para pacientes já atendidos
- Emissão de receitas vinculadas à consulta (o medicamento aparece para o tutor e gera os lembretes dele)
- Conta: edição de dados, alteração de senha, aparência do app e logout

O acesso é protegido por autenticação (JWT da API) com sessão persistida: o usuário não precisa entrar de novo ao reabrir o app.

## Notificações

O app usa **notificações locais** (`expo-notifications`) como lembrete de medicamento. Elas são geradas a partir dos medicamentos que vêm da API, então qualquer mudança na lista as atualiza: o tutor cadastrando, suspendendo ou excluindo um medicamento, ou o veterinário emitindo uma receita.

| Frequência do medicamento | Quando notifica |
|---|---|
| Diário | Todos os dias às **10h** e às **22h** |
| Semanal, Mensal, Trimestral, Anual | Às **10h**, no dia de cada ciclo |

- Os lembretes respeitam a data de início e a data de término do tratamento e só valem para medicamentos **ativos**.
- Ao tocar na notificação, o app abre a tela **Medicamentos** do pet correspondente, com o app aberto, em segundo plano ou fechado.
- A permissão de notificações é solicitada na primeira vez que há um lembrete para agendar.
- Os lembretes são reagendados sempre que a lista de medicamentos é carregada. Para o medicamento diário, o app agenda os próximos 7 dias; por isso, abrir o app ao menos uma vez por semana mantém os lembretes em dia.
- Ao encerrar a sessão, os lembretes pendentes são cancelados.

Para validar as notificações, use o APK gerado pelo EAS (veja [Publicação](#publicação)): o Expo Go tem limitações com o `expo-notifications`.

## Tema claro e escuro

O app tem tema claro e escuro. Em **Configurações → Aparência** é possível escolher entre **Sistema** (acompanha o tema do celular), **Claro** e **Escuro**. A escolha é salva e mantida ao reabrir o app.

## Sobre o App e versão

Em **Configurações → Sobre o App** são exibidas a versão e o **hash do commit** que originou o build. O hash é injetado em `app.config.js` (`EAS_BUILD_GIT_COMMIT_HASH` no build do EAS, com `git rev-parse HEAD` como alternativa em build local) e lido com `expo-constants`. Um sufixo `-dirty` indica um build local feito com alterações ainda não commitadas.

## Stack

- [Expo](https://expo.dev) / React Native `0.86` + React `19`
- TypeScript
- [React Navigation](https://reactnavigation.org/) (bottom tabs + native stack), com pilhas de navegação separadas para tutor e veterinário
- [TanStack Query](https://tanstack.com/query) para cache, invalidação e chamadas HTTP
- [Axios](https://axios-http.com/) como cliente HTTP, com interceptor de JWT
- `@react-native-async-storage/async-storage` para persistência de sessão e da preferência de tema
- [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/) para notificações locais
- [EAS Build](https://docs.expo.dev/build/introduction/) para gerar o APK e [Firebase App Distribution](https://firebase.google.com/docs/app-distribution) para distribuí-lo

O app consome uma API REST (Spring Boot) própria do Clyvo Vet — a URL é configurada via variável de ambiente (veja abaixo).

## Estrutura do projeto

```
src/
  api/            Camada de acesso à API (uma função por recurso: /consultas, /pets, /vacinas, /medicamentos, /veterinarios...)
  hooks/          Hooks TanStack Query que consomem a camada api/ (cache, invalidação, mutações) e hooks de lembretes
  context/        Contextos globais (autenticação, seleção de pet, tema)
  navigation/     Navegação — pilhas separadas para tutor (AppStack) e veterinário (VetStack)
  screens/        Telas do app, uma por fluxo/funcionalidade
  components/     Componentes de UI reutilizáveis (Card, Button, Input, Badge, etc.)
  config/         Configuração do app (URL da API, versão e hash do commit)
  constants/      Paletas de cores clara e escura, tipografia, espaçamento e constantes de domínio
  services/       Regras de negócio auxiliares (ex.: formatação de datas, alertas de saúde, agendamento de notificações)
  storage/        Persistência local de sessão e da preferência de tema
  utils/          Utilitários genéricos
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) e npm
- Um backend do Clyvo Vet (API REST) — o repositório do backend é separado deste projeto. Por padrão o app usa a API publicada no Azure (`https://app-clyvo-api.azurewebsites.net`), então não é preciso subir um backend local
- Para rodar no celular: o [Expo Go](https://expo.dev/go); para emuladores, Android Studio ou Xcode

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure a URL da API. Copie `.env.example` para `.env`. O arquivo já aponta para a API publicada no Azure, que pode ser usada sem alterações. Para usar um backend local, ajuste `EXPO_PUBLIC_API_URL` conforme onde o app for executado:

   ```bash
   cp .env.example .env
   ```

   | Ambiente | URL sugerida |
   |---|---|
   | Emulador Android | `http://10.0.2.2:8080` |
   | Simulador iOS | `http://localhost:8080` |
   | Celular físico (Expo Go) | `http://<IP-da-sua-máquina-na-rede>:8080` |

3. Inicie o app:

   ```bash
   npx expo start
   ```

   No terminal, escolha abrir em um emulador Android, simulador iOS, no navegador (web) ou escaneando o QR code com o Expo Go.

## Scripts disponíveis

```bash
npm start      # expo start
npm run android
npm run ios
npm run web
```

## Publicação

O app é distribuído como APK pelo **Firebase App Distribution**. O APK é gerado pelo EAS Build (perfis em `eas.json`).

1. Faça login no EAS e confirme que o código a ser publicado já está commitado e enviado ao GitHub (o hash do commit é gravado no build):

   ```bash
   npx eas-cli login
   git status
   git push
   ```

2. Gere o APK de distribuição interna:

   ```bash
   npx eas-cli build --platform android --profile preview
   ```

3. Baixe o `.apk` gerado, envie-o em **Firebase Console → App Distribution** e adicione os testers (incluindo o e-mail institucional do professor).

4. Instale o app pelo link do convite e confira em **Configurações → Sobre o App** se o hash exibido é o do commit publicado.

| Item | Valor |
|---|---|
| Link do Firebase App Distribution | https://appdistribution.firebase.google.com/testerapps/1:925264606600:android:023940858110840306763d/releases/4scfcjna9rdk8?utm_source=firebase-console |
| Commit do APK publicado | ff2ffcf589ebd5f801908b4bd8668b07270fb085 |

## Equipe

| Nome | RM |
|---|---|
| Gustavo Barrios de Araújo | RM563358 |
| Matheus Almeida Ribeiro | RM562980 |
| Phietro Solon Oliveira | RM563842 |
