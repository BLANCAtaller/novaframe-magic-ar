import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Eres un nutricionista experto. Analiza la imagen de comida proporcionada y responde ÚNICAMENTE con un objeto JSON válido (sin texto adicional, sin markdown, sin bloques de código).

El JSON debe tener exactamente esta estructura:
{
  "nombre": "Nombre del plato en español",
  "descripcion": "Ingredientes y preparación detectados (máximo 2 oraciones)",
  "porcion_estimada": "1 plato ~350g",
  "calorias": 450,
  "proteinas_g": 25,
  "carbohidratos_g": 45,
  "grasas_g": 15,
  "fibra_g": 5,
  "confianza": "alta"
}

Reglas importantes:
- calorias, proteinas_g, carbohidratos_g, grasas_g y fibra_g deben ser números enteros
- confianza puede ser: "alta", "media" o "baja"
- Si no puedes identificar la comida claramente, usa confianza "baja" y haz tu mejor estimación
- Responde SOLO con el JSON, sin explicaciones adicionales`;

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY no configurada. Añádela en las variables de entorno de Vercel.', setup_url: 'https://aistudio.google.com/app/apikey' },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 });
  }

  const { image } = body;
  if (!image || typeof image !== 'string' || !image.startsWith('data:image')) {
    return NextResponse.json({ error: 'Se requiere una imagen en formato base64 data URL' }, { status: 400 });
  }

  const matches = image.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    return NextResponse.json({ error: 'Formato de imagen inválido' }, { status: 400 });
  }
  const mimeType = matches[1];
  const base64Data = matches[2];

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      { inlineData: { mimeType, data: base64Data } },
    ]);

    const text = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(text.trim());
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json({ error: 'El modelo no devolvió un JSON válido', raw: text }, { status: 502 });
      }
      parsed = JSON.parse(jsonMatch[0]);
    }

    const numericFields = ['calorias', 'proteinas_g', 'carbohidratos_g', 'grasas_g', 'fibra_g'];
    for (const field of numericFields) {
      parsed[field] = Math.round(Number(parsed[field]) || 0);
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Gemini API error:', err);
    return NextResponse.json(
      { error: 'Error al analizar la imagen. Intenta de nuevo.', details: err.message },
      { status: 500 }
    );
  }
}
