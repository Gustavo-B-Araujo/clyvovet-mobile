# 🐾 Clyvo Vet — Mobile

Aplicativo mobile do Clyvo Vet, construído com [Expo](https://expo.dev) e React Native. O app oferece duas jornadas distintas conforme o papel do usuário autenticado:

- **Tutor**: cadastra seu pet, acompanha carteira de vacinação, histórico clínico, medicamentos/lembretes e agenda consultas com veterinários.
- **Veterinário**: acompanha as consultas atendidas, cria novas consultas para pacientes já atendidos, emite receitas (vinculadas à consulta) e gerencia os próprios dados de conta.

## Stack

- [Expo](https://expo.dev) / React Native `0.86` + React `19`
- TypeScript
- [React Navigation](https://reactnavigation.org/) (bottom tabs + native stack), com pilhas de navegação separadas para tutor e veterinário
- [TanStack Query](https://tanstack.com/query) para cache, invalidação e chamadas HTTP
- [Axios](https://axios-http.com/) como cliente HTTP, com interceptor de JWT
- `@react-native-async-storage/async-storage` para persistência de sessão local

O app consome uma API REST (Spring Boot) própria do Clyvo Vet — a URL é configurada via variável de ambiente (veja abaixo).

## Estrutura do projeto

```
src/
  api/            Camada de acesso à API (uma função por recurso: /consultas, /pets, /vacinas, /medicamentos, /veterinarios...)
  hooks/          Hooks TanStack Query que consomem a camada api/ (cache, invalidação, mutações)
  context/        Contextos globais (autenticação, seleção de pet)
  navigation/     Navegação — pilhas separadas para tutor (AppStack) e veterinário (VetStack)
  screens/        Telas do app, uma por fluxo/funcionalidade
  components/     Componentes de UI reutilizáveis (Card, Button, Input, Badge, etc.)
  constants/      Tema (cores, tipografia, espaçamento) e constantes de domínio
  services/       Regras de negócio auxiliares (ex.: formatação de datas, alertas de saúde)
  storage/        Persistência local de sessão
  utils/          Utilitários genéricos
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) e npm
- Um backend do Clyvo Vet rodando (API REST) acessível na rede — o repositório do backend é separado deste projeto
- Para rodar no celular: o [Expo Go](https://expo.dev/go); para emuladores, Android Studio ou Xcode

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure a URL da API. Copie `.env.example` para `.env` e ajuste `EXPO_PUBLIC_API_URL` conforme onde o app for executado:

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

## Equipe

| Nome | RM |
|---|---|
| Gustavo Barrios de Araújo | RM563358 |
| Matheus Almeida Ribeiro | RM562980 |
| Phietro Solon Oliveira | RM563842 |
