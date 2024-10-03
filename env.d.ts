// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_SECRET: string;
    MONGODB_URI: string;
    NEXTAUTH_URL: string;
  }
}
