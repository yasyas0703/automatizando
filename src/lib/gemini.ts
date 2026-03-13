import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Gerar texto
export async function generateText(prompt: string): Promise<string> {
  try {
    console.log("Texto: gerando com gemini-2.5-flash...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log("Texto: sucesso!");
    return response.text || "";
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.log("Texto: erro -", err.message?.substring(0, 150));
    throw new Error("Erro ao gerar texto: " + (err.message || "desconhecido"));
  }
}

// Gerar texto a partir de imagem (visão)
export async function generateFromImage(
  prompt: string,
  imageBase64: string,
  mimeType: string = "image/png",
): Promise<string> {
  try {
    console.log("Visão: analisando imagem com gemini-2.5-flash...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { text: prompt },
        {
          inlineData: {
            data: imageBase64,
            mimeType,
          },
        },
      ],
    });
    console.log("Visão: sucesso!");
    return response.text || "";
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.log("Visão: erro -", err.message?.substring(0, 150));
    throw error;
  }
}

// Gerar IMAGEM
export async function generateImage(
  prompt: string,
  referenceImageBase64?: string,
  mimeType: string = "image/png"
): Promise<string> {
  // Modelos de imagem em ordem de prioridade
  const models = ["gemini-2.5-flash-image", "gemini-3.1-flash-image-preview", "gemini-3-pro-image-preview"];
  const erros: string[] = [];

  for (const modelName of models) {
    try {
      console.log(`Imagem: tentando ${modelName}...`);

      const contents: Array<Record<string, unknown>> = [{ text: prompt }];

      if (referenceImageBase64) {
        contents.unshift({
          inlineData: { data: referenceImageBase64, mimeType },
        });
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      });

      // Procura a imagem na resposta
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            console.log(`Imagem: sucesso com ${modelName}!`);
            return part.inlineData.data;
          }
        }
      }

      const reason = response.candidates?.[0]?.finishReason || "sem imagem na resposta";
      console.log(`Imagem: ${modelName} - ${reason}`);
      erros.push(`${modelName}: ${reason}`);
      continue;
    } catch (error: unknown) {
      const err = error as { message?: string; status?: number };
      const msg = err.message || "erro desconhecido";
      console.log(`Imagem: erro ${modelName} - ${msg.substring(0, 200)}`);
      erros.push(`${modelName}: ${msg.substring(0, 150)}`);
      continue;
    }
  }

  throw new Error(`Falha em todos os modelos: ${erros.join(" | ")}`);
}
