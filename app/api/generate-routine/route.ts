import { GoogleGenerativeAI } from "@google/generative-ai";
import { STRETCH_BANK } from "@/lib/stretches";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const system = `You are a kinesiology expert. Select ONLY from this bank.
  Bank: ${JSON.stringify(STRETCH_BANK.map(s => ({ id: s.id, name: s.name, muscle: s.muscleGroup, category: s.category })))}
  Rules: Return 5-6 stretches. Respect limitations. If user says avoid spinal loading, do NOT pick cat-cow, down-dog, or child's pose.
  Return JSON ONLY: { routine: string[], reasoning: string }`;

  const result = await model.generateContent(`${system}\nUser: ${prompt}`);
  const text = result.response.text().replace(/```json|```/g, "");
  const parsed = JSON.parse(text);

  const routine = parsed.routine
    .map((id: string) => STRETCH_BANK.find(s => s.id === id))
    .filter(Boolean);

  return NextResponse.json({ routine, reasoning: parsed.reasoning });
}
