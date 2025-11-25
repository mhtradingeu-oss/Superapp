Back-end Init Plan (Step-by-Step).

هذا المستند يعرّف خطوات إنشاء البنية الأساسية للـ Back-end في مشروع
MH-OS SUPERAPP
وفق الـ Master Prompt النهائي.

الهدف:

إنشاء مشروع Node.js + TypeScript + Express + Prisma

تأسيس بنية نظيفة واضحة

بدون أي OS modules بعد (Skeleton only)

مع Auth + Brand + Product كموديلات أساسية فقط

مع إمكانية التوسّع لاحقًا بسهولة

🏁 المرحلة 0 — تجهيز بيئة Codex + GitHub

قبل البدء:

✔ تأكد أن المستودع GitHub فارغ كما اتفقنا
✔ Codex متصل بالمستودع
✔ docs/00_master_prompt_codex مرفوع
✔ باقي الملفات (01–07) موجودة داخل docs

لا نكتب أي كود OS الآن.
الآن نبني البنية الأساسية فقط.

🚀 المرحلة 1 — إنشاء مشروع الـ Back-end

في Terminal داخل Codex أو Local:

1.1 — إنشاء مجلد back-end
mkdir back-end
cd back-end

1.2 — تهيئة مشروع Node.js + TS + ESM
npm init -y
npm pkg set type="module"


type=module ضروري لاستخدام ESM imports بدون مشاكل.

1.3 — تثبيت الباقات الأساسية
npm install express cors dotenv jsonwebtoken bcryptjs
npm install prisma @prisma/client
npm install zod

npm install -D typescript ts-node-dev @types/express @types/node @types/bcryptjs @types/jsonwebtoken

1.4 — إضافة TypeScript config

أنشئ ملف:

back-end/tsconfig.json


المحتوى:

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "Node",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "baseUrl": "./src",
    "paths": {
      "@core/*": ["core/*"],
      "@modules/*": ["modules/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}

1.5 — إنشاء هيكل مجلد src
mkdir -p src/core/{config,prisma,security,http,utils,events,ai-service}
mkdir -p src/modules
mkdir -p src

🗄 المرحلة 2 — إعداد Prisma
2.1 — إنشاء Prisma init
npx prisma init


سوف ينشئ:

prisma/schema.prisma
.env

2.2 — وضع .env.example
DATABASE_URL="postgresql://YOUR_DB_URL"
JWT_SECRET="change_me"
PORT=4000

2.3 — وضع محتوى schema.prisma (نسخة v1 فقط)

📌 هذه نسخة مبسطة — فقط الموديلات الأساسية
📌 بعدها سنضيف باقي الـ OS من خلال مراحل منفصلة

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      String   @default("USER")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Brand {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BrandProduct {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  brandId   String
  brand     Brand    @relation(fields: [brandId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

💻 المرحلة 3 — إنشاء core files
3.1 — core/config/env.ts
import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 4000,
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
};

3.2 — core/prisma/client.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

🧩 المرحلة 4 — إنشاء server + app
4.1 — src/app.ts
import express from "express";
import cors from "cors";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}

4.2 — src/server.ts
import { createApp } from "./app.js";
import { env } from "./core/config/env.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚀 API running at http://localhost:${env.PORT}`);
});

🔒 المرحلة 5 — إنشاء Auth Module (أساسي)

أنشئ مجلد:

src/modules/auth/

5.1 — auth.routes.ts
import { Router } from "express";
import { registerHandler, loginHandler, meHandler } from "./auth.controller.js";
import { authGuard } from "../../core/http/middleware/auth.js";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/me", authGuard, meHandler);

export default router;

5.2 — auth.controller.ts
import { Request, Response } from "express";
import { authService } from "./auth.service.js";

export async function registerHandler(req: Request, res: Response) {
  const result = await authService.register(req.body);
  res.json(result);
}

export async function loginHandler(req: Request, res: Response) {
  const result = await authService.login(req.body);
  res.json(result);
}

export async function meHandler(req: Request, res: Response) {
  res.json({ user: (req as any).user });
}

5.3 — auth.service.ts
import { prisma } from "../../core/prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../core/config/env.js";

export const authService = {
  async register({ email, password }) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });
    return { user };
  },

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return { token, user };
  },
};

5.4 — core/http/middleware/auth.ts
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { prisma } from "../../prisma/client.js";

export async function authGuard(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded: any = jwt.verify(token, env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) return res.status(401).json({ error: "Unauthorized" });

    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

🔌 المرحلة 6 — ربط Auth في server

في app.ts:

import authRoutes from "./modules/auth/auth.routes.js";
app.use("/api/v1/auth", authRoutes);

🧪 المرحلة 7 — اختبار أولي
Run backend:
npm run dev


ثم:

GET → http://localhost:4000/health

POST → /api/v1/auth/register

POST → /api/v1/auth/login

🧱 المرحلة 8 — ماذا يأتي بعد هذا؟

الخطوة التالية رسميًا:

09 — Phase 1: Architecture Analysis (Codex Execution Document)

وهو ملف يكتبه Codex تلقائيًا عندما يقرأ:

master prompt

ملفات 01–08

باقي docs

وسيخرج:

SECTION A — Final Architecture
SECTION B — Gap Analysis
SECTION C — Execution Plan

وهذا ضروري قبل أن يبدأ Codex بكتابة أي كود OS.

بعد اعتمادك للـ Architecture:

وبرسالة واحدة منك فقط:

“ابدأ Phase 2: Build Backend Foundation”

سيبدأ Codex تلقائيًا بإنشاء:

package.json

server.ts

prisma/schema v1

modules/auth

modules/brand

modules/product

وهكذا

لكن بالتسلسل الصحيح.
