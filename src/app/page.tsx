"use client";

import { useState, useEffect } from "react";
import {
  CATEGORIAS,
  MATERIAIS,
  CORES,
  TEMPLATES_PACOTE,
  VARIACOES_SAQUINHO,
} from "@/lib/types";

const FUNDOS = [
  { id: "branco", label: "Fundo Branco" },
  { id: "mesa_madeira", label: "Mesa de Madeira" },
  { id: "mesa_marmore", label: "Mesa Marmore" },
  { id: "mesa_escura", label: "Mesa Escura" },
  { id: "cenario_quarto", label: "Quarto" },
  { id: "cenario_sala", label: "Sala" },
  { id: "cenario_escritorio", label: "Escritorio" },
  { id: "cenario_infantil", label: "Quarto Infantil" },
  { id: "natureza", label: "Natureza/Jardim" },
  { id: "gradiente_azul", label: "Gradiente Azul" },
  { id: "gradiente_rosa", label: "Gradiente Rosa" },
  { id: "gradiente_roxo", label: "Gradiente Roxo" },
  { id: "gradiente_neutro", label: "Gradiente Neutro" },
  { id: "neon", label: "Neon/Colorido" },
  { id: "holografico", label: "Holografico" },
  { id: "preto", label: "Fundo Preto" },
  { id: "pastel", label: "Pastel Suave" },
  { id: "textura_tecido", label: "Tecido/Linho" },
  { id: "textura_concreto", label: "Concreto" },
  { id: "papel_kraft", label: "Papel Kraft" },
];

const ESTILOS = [
  { id: "principal", label: "Foto Principal" },
  { id: "detalhe", label: "Close-up" },
  { id: "angulo_45", label: "Angulo 45°" },
  { id: "angulo_cima", label: "Flat Lay (cima)" },
  { id: "angulo_baixo", label: "Vista Heroica" },
  { id: "lateral", label: "Lateral" },
  { id: "escala_mao", label: "Na Mao" },
  { id: "escala_regua", label: "Com Medida" },
  { id: "uso_real", label: "Em Uso" },
  { id: "grupo", label: "Varias Cores" },
  { id: "embalagem", label: "Embalagem" },
  { id: "comparacao", label: "Comparacao" },
  { id: "360", label: "Grid Angulos" },
  { id: "artistico", label: "Artistico" },
  { id: "macro", label: "Super Macro" },
  { id: "flutuando", label: "Flutuando" },
];

interface GeneratedData {
  titulo_shopee: string;
  titulo_ml: string;
  titulo_tiktok: string;
  descricao: string;
  tags: string[];
}

export default function Home() {
  // Produto
  const [productImage, setProductImage] = useState<string | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [material, setMaterial] = useState("PLA");
  const [cor, setCor] = useState("Preto");
  const [alturaZ, setAlturaZ] = useState("");
  const [larguraX, setLarguraX] = useState("");
  const [profundidadeY, setProfundidadeY] = useState("");
  const [pesoGramas, setPesoGramas] = useState<number>(0);
  const [tempoImpressao, setTempoImpressao] = useState<number>(0);
  const [categoria, setCategoria] = useState("Decoração");
  const [templatePacote, setTemplatePacote] = useState<"pequeno" | "medio" | "grande">("medio");
  const [saquinho, setSaquinho] = useState("15x20");

  // Imagens config
  const [selectedFundos, setSelectedFundos] = useState<string[]>(["branco"]);
  const [selectedEstilos, setSelectedEstilos] = useState<string[]>(["principal"]);
  const [corImagem, setCorImagem] = useState("original");
  const [removerFundoAuto, setRemoverFundoAuto] = useState(false);

  // Resultados
  const [generatedImages, setGeneratedImages] = useState<{img: string; fundo: string; estilo: string}[]>([]);
  const [conteudo, setConteudo] = useState<GeneratedData | null>(null);
  const [preco, setPreco] = useState<{ custoMaterial: number; custoEmbalagem: number; custoTotal: number; taxaPlataforma: number; precoVenda: number; lucro: number } | null>(null);

  // ML
  const [mlConnected, setMlConnected] = useState(false);
  const [mlNickname, setMlNickname] = useState("");
  const [publishing, setPublishing] = useState<string | null>(null);
  const [publishResult, setPublishResult] = useState<{ platform: string; success: boolean; message: string; permalink?: string }[]>([]);

  // UI
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [copied, setCopied] = useState("");
  const [alertas, setAlertas] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/ml/status").then(r => r.json()).then(d => {
      if (d.connected) { setMlConnected(true); setMlNickname(d.nickname); }
    }).catch(() => {});
  }, []);

  // Calcula preço em tempo real
  const custoMaterial = (pesoGramas / 1000) * 99;
  const custoEmbalagem = 3;
  const custoTotal = custoMaterial + custoEmbalagem;
  const precoVenda = (custoTotal * 1.65) / 0.80;
  const taxaPlataforma = precoVenda * 0.20;
  const lucro = precoVenda - custoTotal - taxaPlataforma;
  const lucroPorHora = tempoImpressao > 0 ? lucro / tempoImpressao : 0;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setProductImagePreview(result);
      setProductImage(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  // Remover imagem gerada
  const removeImage = (index: number) => {
    setGeneratedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Mover imagem (reordenar)
  const moveImage = (from: number, to: number) => {
    setGeneratedImages(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  // GERAR TUDO
  const handleGenerate = async () => {
    if (!nome || !pesoGramas) {
      alert("Preencha: Nome e Peso (gramas)");
      return;
    }

    setLoading(true);
    setGeneratedImages([]);
    setConteudo(null);
    setPreco(null);
    setPublishResult([]);
    setAlertas([]);

    try {
      // 1. Preço
      setStep("Calculando preco...");
      const precoRes = await fetch("/api/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pesoGramas }),
      });
      const precoData = await precoRes.json();
      setPreco(precoData);

      // 2. Titulo + Descrição
      setStep("Gerando titulo e descricao completa...");
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome, material, cor, tamanho: `${alturaZ}x${larguraX}x${profundidadeY}cm (AxLxP)`, categoria, pesoGramas,
          precoVenda: precoData.precoVenda,
          productImage: productImage || undefined,
        }),
      });
      const genData = await genRes.json();
      if (genData.error) {
        setStep("Erro: " + genData.error);
        setLoading(false);
        return;
      }
      setConteudo(genData);

      // 3. Imagens — pareamento 1:1, geração no client (sem timeout da Vercel)
      if (selectedFundos.length > 0 && selectedEstilos.length > 0) {
        const total = Math.max(selectedFundos.length, selectedEstilos.length);
        const variations: { fundo: string; cor: string; estilo: string }[] = [];
        for (let i = 0; i < total; i++) {
          variations.push({
            fundo: selectedFundos[i % selectedFundos.length],
            cor: corImagem,
            estilo: selectedEstilos[i % selectedEstilos.length],
          });
        }
        const limited = variations.slice(0, 5);

        // Pega a API key e os prompts do server
        setStep("Preparando prompts...");
        const promptRes = await fetch("/api/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName: nome, variations: limited }),
        });
        const promptData = await promptRes.json();
        if (promptData.error || !promptData.apiKey) {
          setAlertas(prev => [...prev, `Erro preparando imagens: ${promptData.error || "GEMINI_API_KEY nao configurada"}`]);
        } else {
          const geminiModels = ["gemini-2.5-flash-image", "gemini-3.1-flash-image-preview", "gemini-3-pro-image-preview"];
          const modelErrors: string[] = [];

          for (let i = 0; i < limited.length; i++) {
            const fundoLabel = FUNDOS.find(f => f.id === limited[i].fundo)?.label || limited[i].fundo;
            const estiloLabel = ESTILOS.find(e => e.id === limited[i].estilo)?.label || limited[i].estilo;
            setStep(`Gerando imagem ${i + 1} de ${limited.length} (${fundoLabel} + ${estiloLabel})...`);

            let generated = false;
            modelErrors.length = 0;

            // Tenta cada modelo, com retry automático no 429
            for (const modelName of geminiModels) {
              if (generated) break;

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const contents: any[] = [{ text: promptData.prompts[i] }];
              if (productImage) {
                contents.unshift({ inlineData: { data: productImage, mimeType: "image/png" } });
              }

              const requestBody = JSON.stringify({
                contents: [{ parts: contents }],
                generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
              });
              const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${promptData.apiKey}`;

              for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                  setStep(`Imagem ${i + 1}/${limited.length} (${fundoLabel} + ${estiloLabel}) — ${modelName}${attempt > 1 ? ` tentativa ${attempt}` : ""}...`);

                  const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: requestBody,
                  });

                  const bodyText = await res.text();

                  if (res.status === 429) {
                    const retryMatch = bodyText.match(/retry in (\d+)/i);
                    const waitSecs = retryMatch ? Math.min(parseInt(retryMatch[1]) + 5, 65) : 55;
                    if (attempt < 3) {
                      setStep(`Imagem ${i + 1}: rate limit, aguardando ${waitSecs}s...`);
                      await new Promise(r => setTimeout(r, waitSecs * 1000));
                      continue; // retry mesmo modelo
                    }
                    modelErrors.push(`${modelName} -> 429 rate limit (tentou ${attempt}x)`);
                    break; // proximo modelo
                  }

                  if (!res.ok) {
                    let errMsg = `HTTP ${res.status}`;
                    try { errMsg += `: ${JSON.parse(bodyText).error?.message?.substring(0, 100)}`; } catch { errMsg += `: ${bodyText.substring(0, 80)}`; }
                    modelErrors.push(`${modelName} -> ${errMsg}`);
                    break; // proximo modelo (não retry em erros non-429)
                  }

                  const data = JSON.parse(bodyText);
                  const parts = data.candidates?.[0]?.content?.parts || [];
                  const imgPart = parts.find((p: { inlineData?: { data: string } }) => p.inlineData?.data);

                  if (imgPart) {
                    let img = `data:image/png;base64,${imgPart.inlineData.data}`;

                    if (removerFundoAuto) {
                      setStep(`Removendo fundo da imagem ${i + 1}...`);
                      try {
                        const blob = await fetch(img).then(r => r.blob());
                        const form = new FormData();
                        form.append("image", blob, "img.png");
                        const bgRes = await fetch("/api/remove-bg", { method: "POST", body: form });
                        const bgData = await bgRes.json();
                        if (bgData.image) img = bgData.image;
                      } catch {
                        setAlertas(prev => [...prev, `Remover fundo ${i + 1}: falhou, usando original`]);
                      }
                    }

                    setGeneratedImages(prev => [...prev, { img, fundo: limited[i].fundo, estilo: limited[i].estilo }]);
                    generated = true;
                    break; // sucesso!
                  } else {
                    const reason = data.candidates?.[0]?.finishReason || "resposta sem imagem";
                    modelErrors.push(`${modelName} -> ${reason}`);
                    break; // proximo modelo
                  }
                } catch (err) {
                  modelErrors.push(`${modelName} -> ${err instanceof Error ? err.message : "erro de rede"}`);
                  break;
                }
              }
            }

            if (!generated) {
              setAlertas(prev => [...prev, `Imagem ${i + 1} (${fundoLabel} + ${estiloLabel}): ${modelErrors.join(" | ")}`]);
            }
          }
        }
      }

      setStep("Pronto!");
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Erro desconhecido";
      setStep("Erro. Tente novamente.");
      setAlertas(prev => [...prev, `Erro geral: ${msg}`]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${nome.replace(/\s+/g, "-").toLowerCase()}-${index + 1}.png`;
    a.click();
  };

  const handlePublish = async (platform: string) => {
    if (!conteudo || !preco) return;
    setPublishing(platform);

    const titulo = platform === "shopee" ? conteudo.titulo_shopee
      : platform === "tiktok" ? conteudo.titulo_tiktok
      : conteudo.titulo_ml;

    try {
      if (platform === "ml") {
        const res = await fetch("/api/ml/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo,
            descricao: conteudo.descricao,
            preco: preco.precoVenda,
            pesoGramas,
            categoria,
            dimensoes: TEMPLATES_PACOTE[templatePacote],
            imagens: generatedImages.map(g => g.img).filter(img => img.startsWith("http")),
          }),
        });
        const result = await res.json();
        setPublishResult(prev => [...prev, {
          platform: "Mercado Livre",
          success: !!result.success,
          message: result.success ? result.message : result.error,
          permalink: result.permalink,
        }]);
      } else {
        // Shopee e TikTok: por enquanto exporta JSON
        const data = {
          titulo, descricao: conteudo.descricao, preco: preco.precoVenda,
          peso: pesoGramas, tags: conteudo.tags || [],
          dimensoes: TEMPLATES_PACOTE[templatePacote], material, cor,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${platform}-${nome.replace(/\s+/g, "-").toLowerCase()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setPublishResult(prev => [...prev, {
          platform: platform === "shopee" ? "Shopee" : "TikTok",
          success: true,
          message: "JSON exportado! API sera conectada em breve.",
        }]);
      }
    } catch {
      setPublishResult(prev => [...prev, { platform, success: false, message: "Erro de conexao" }]);
    } finally {
      setPublishing(null);
    }
  };

  const dimensoes = TEMPLATES_PACOTE[templatePacote];

  return (
    <div className="space-y-6">
      {/* STEP 1: ESSENCIAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Foto */}
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center text-xs">1</span>
            Foto do Produto
          </h2>
          <input type="file" accept="image/*" onChange={handleImageUpload}
            className="block w-full text-sm text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-violet-600 file:text-white hover:file:bg-violet-500 file:cursor-pointer mb-3" />
          {productImagePreview ? (
            <img src={productImagePreview} alt="Produto" className="w-full h-48 object-contain rounded-lg border border-zinc-700 bg-zinc-800" />
          ) : (
            <div className="w-full h-48 rounded-lg border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 text-sm">
              Arraste ou clique para enviar
            </div>
          )}
        </div>

        {/* Dados essenciais */}
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center text-xs">2</span>
            Dados
          </h2>
          <div className="space-y-2.5">
            <input type="text" value={nome} onChange={e => setNome(e.target.value)}
              placeholder="Nome do produto *" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500" />
            <div className="grid grid-cols-2 gap-2">
              <select value={material} onChange={e => setMaterial(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500">
                {MATERIAIS.map(m => <option key={m}>{m}</option>)}
              </select>
              <select value={cor} onChange={e => setCor(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500">
                {CORES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-zinc-500">DIMENSOES (cm)</div>
              <div className="grid grid-cols-3 gap-2">
                <input type="text" value={alturaZ} onChange={e => setAlturaZ(e.target.value)}
                  placeholder="Altura (Z)" className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500" />
                <input type="text" value={larguraX} onChange={e => setLarguraX(e.target.value)}
                  placeholder="Largura (X)" className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500" />
                <input type="text" value={profundidadeY} onChange={e => setProfundidadeY(e.target.value)}
                  placeholder="Profund. (Y)" className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={pesoGramas || ""} onChange={e => setPesoGramas(Number(e.target.value))}
                placeholder="Peso gramas *" className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500" />
              <input type="number" step="0.5" value={tempoImpressao || ""} onChange={e => setTempoImpressao(Number(e.target.value))}
                placeholder="Horas impressao" className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select value={categoria} onChange={e => setCategoria(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500">
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={templatePacote} onChange={e => setTemplatePacote(e.target.value as "pequeno" | "medio" | "grande")} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500">
                {(["pequeno", "medio", "grande"] as const).map(t => {
                  const d = TEMPLATES_PACOTE[t];
                  return <option key={t} value={t}>{t} ({d.largura}x{d.altura}x{d.profundidade})</option>;
                })}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <select value={saquinho} onChange={e => setSaquinho(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500">
                {VARIACOES_SAQUINHO.map(s => <option key={s.id} value={s.id}>Saquinho {s.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Preço em tempo real */}
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <h2 className="font-bold mb-3">Preco (automatico)</h2>
          {pesoGramas > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-zinc-800 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-zinc-500">FILAMENTO</div>
                  <div className="text-lg font-bold text-red-400">R$ {custoMaterial.toFixed(2)}</div>
                </div>
                <div className="bg-zinc-800 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-zinc-500">EMBALAGEM</div>
                  <div className="text-lg font-bold text-red-400">R$ {custoEmbalagem.toFixed(2)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-zinc-800 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-zinc-500">CUSTO TOTAL</div>
                  <div className="text-lg font-bold text-orange-400">R$ {custoTotal.toFixed(2)}</div>
                </div>
                <div className="bg-zinc-800 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-zinc-500">TAXA PLATAFORMA (20%)</div>
                  <div className="text-lg font-bold text-yellow-400">R$ {taxaPlataforma.toFixed(2)}</div>
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <div className="text-[10px] text-green-400">PRECO DE VENDA</div>
                <div className="text-xl font-bold text-green-400">R$ {precoVenda.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-violet-400">LUCRO (65%)</div>
                  <div className="text-xl font-bold text-violet-400">R$ {lucro.toFixed(2)}</div>
                </div>
                <div className={`rounded-lg p-3 text-center border ${tempoImpressao > 0 && lucroPorHora < 3 ? "bg-red-500/10 border-red-500/20" : tempoImpressao > 0 && lucroPorHora < 5 ? "bg-yellow-500/10 border-yellow-500/20" : "bg-emerald-500/10 border-emerald-500/20"}`}>
                  <div className="text-[10px] text-zinc-400">LUCRO/HORA</div>
                  {tempoImpressao > 0 ? (
                    <>
                      <div className={`text-xl font-bold ${lucroPorHora < 3 ? "text-red-400" : lucroPorHora < 5 ? "text-yellow-400" : "text-emerald-400"}`}>
                        R$ {lucroPorHora.toFixed(2)}/h
                      </div>
                      <div className={`text-[10px] mt-1 ${lucroPorHora < 3 ? "text-red-400" : lucroPorHora < 5 ? "text-yellow-400" : "text-emerald-400"}`}>
                        {lucroPorHora < 3 ? "NAO COMPENSA" : lucroPorHora < 5 ? "AVALIE BEM" : "VALE A PENA"}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-zinc-600">Informe as horas</div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-zinc-500 text-center">
                {pesoGramas}g | R$99/kg | Embalagem R$3 | Plataforma 20%{tempoImpressao > 0 ? ` | ${tempoImpressao}h impressao` : ""} | Saquinho: {saquinho}
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-sm text-zinc-600">
              Digite o peso para calcular
            </div>
          )}
        </div>
      </div>

      {/* STEP 2: CONFIG IMAGENS */}
      <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
        <h2 className="font-bold mb-3 flex items-center gap-2">
          <span className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center text-xs">3</span>
          Configurar Imagens
          <span className="ml-auto text-xs font-normal text-zinc-500">
            {Math.min(selectedFundos.length * selectedEstilos.length, 5)} imagens
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Fundos */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-zinc-400">Fundo ({selectedFundos.length})</label>
              <button onClick={() => setSelectedFundos([])} className="text-[10px] text-zinc-500 hover:text-zinc-300">limpar</button>
            </div>
            <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
              {FUNDOS.map(f => (
                <button key={f.id} onClick={() => toggleItem(selectedFundos, f.id, setSelectedFundos)}
                  className={`px-2 py-1.5 rounded border text-[11px] transition-all ${
                    selectedFundos.includes(f.id)
                      ? "border-violet-500 bg-violet-500/10 text-violet-300"
                      : "border-zinc-700 bg-zinc-800 text-zinc-500 hover:border-zinc-600"
                  }`}>{f.label}</button>
              ))}
            </div>
          </div>

          {/* Estilos */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-zinc-400">Estilo ({selectedEstilos.length})</label>
              <button onClick={() => setSelectedEstilos([])} className="text-[10px] text-zinc-500 hover:text-zinc-300">limpar</button>
            </div>
            <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
              {ESTILOS.map(e => (
                <button key={e.id} onClick={() => toggleItem(selectedEstilos, e.id, setSelectedEstilos)}
                  className={`px-2 py-1.5 rounded border text-[11px] transition-all ${
                    selectedEstilos.includes(e.id)
                      ? "border-violet-500 bg-violet-500/10 text-violet-300"
                      : "border-zinc-700 bg-zinc-800 text-zinc-500 hover:border-zinc-600"
                  }`}>{e.label}</button>
              ))}
            </div>
          </div>

          {/* Opções */}
          <div className="space-y-2">
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Cor nas imagens</label>
              <select value={corImagem} onChange={e => setCorImagem(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500">
                <option value="original">Cor original</option>
                {CORES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={removerFundoAuto} onChange={e => setRemoverFundoAuto(e.target.checked)}
                className="w-3.5 h-3.5 accent-violet-500" />
              <span className="text-xs text-zinc-300">Remover fundo (Remove.bg)</span>
            </label>
            <div className="bg-zinc-800 rounded p-2 text-[10px] text-zinc-500 space-y-1">
              <div className="font-bold text-zinc-400">{Math.min(Math.max(selectedFundos.length, selectedEstilos.length), 5)} imagens (pareamento 1:1)
                {Math.max(selectedFundos.length, selectedEstilos.length) > 5 && <span className="text-amber-400 ml-1">(max 5)</span>}
              </div>
              {selectedFundos.length > 0 && selectedEstilos.length > 0 && (
                <div className="space-y-0.5">
                  {Array.from({ length: Math.min(Math.max(selectedFundos.length, selectedEstilos.length), 5) }).map((_, i) => {
                    const fundoId = selectedFundos[i % selectedFundos.length];
                    const estiloId = selectedEstilos[i % selectedEstilos.length];
                    const fundoLabel = FUNDOS.find(f => f.id === fundoId)?.label || fundoId;
                    const estiloLabel = ESTILOS.find(e => e.id === estiloId)?.label || estiloId;
                    return (
                      <div key={i} className="flex items-center gap-1">
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold ${i === 0 ? "bg-violet-600 text-white" : "bg-zinc-700 text-zinc-300"}`}>{i + 1}</span>
                        <span className="text-violet-400">{fundoLabel}</span>
                        <span className="text-zinc-600">+</span>
                        <span className="text-emerald-400">{estiloLabel}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTÃO GERAR */}
      <button onClick={handleGenerate} disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-4 rounded-xl text-lg transition-all">
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="animate-spin inline-block">&#9881;</span> {step}
          </span>
        ) : "Gerar Tudo"}
      </button>

      {/* ALERTAS DE ERRO */}
      {alertas.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-red-400">Erros durante a geracao ({alertas.length})</h3>
            <button onClick={() => setAlertas([])} className="text-xs text-red-400 hover:text-red-300 underline">Limpar</button>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {alertas.map((a, i) => (
              <div key={i} className="text-xs text-red-300 bg-red-500/5 rounded px-2 py-1 font-mono break-all">
                {a}
              </div>
            ))}
          </div>
          <div className="text-[10px] text-red-400/70">
            Causas comuns: quota da API Gemini esgotada (aguarde alguns minutos), modelo de imagem indisponivel, ou timeout na Vercel (max 10s no plano free)
          </div>
        </div>
      )}

      {/* RESULTADOS */}
      {(conteudo || generatedImages.length > 0) && (
        <div className="space-y-6 animate-fade-in">

          {/* IMAGENS com gerenciamento */}
          {generatedImages.length > 0 && (
            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">Imagens ({generatedImages.length})</h3>
                <button onClick={() => generatedImages.forEach((g, i) => downloadImage(g.img, i))}
                  className="text-xs text-violet-400 hover:text-violet-300">Baixar todas</button>
              </div>
              <p className="text-[10px] text-zinc-500 mb-3">
                Imagem 1 = principal. Setas = reordenar. X = excluir. Selects = trocar fundo/estilo.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {generatedImages.map((g, i) => (
                  <div key={i} className="relative group">
                    <div className={`absolute top-1 left-1 z-10 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-violet-600 text-white" : "bg-zinc-700 text-zinc-300"}`}>
                      {i + 1}
                    </div>
                    {i === 0 && <div className="absolute top-1 right-8 z-10 bg-violet-600 text-white text-[8px] px-1.5 py-0.5 rounded font-bold">PRINCIPAL</div>}

                    <img src={g.img} alt={`Img ${i + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border border-zinc-700" />

                    {/* Labels fundo + estilo */}
                    <div className="mt-1 space-y-1">
                      <select value={g.fundo} onChange={e => {
                        const newFundo = e.target.value;
                        setGeneratedImages(prev => prev.map((item, idx) => idx === i ? { ...item, fundo: newFundo } : item));
                      }} className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-[10px] text-zinc-300">
                        {FUNDOS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                      </select>
                      <select value={g.estilo} onChange={e => {
                        const newEstilo = e.target.value;
                        setGeneratedImages(prev => prev.map((item, idx) => idx === i ? { ...item, estilo: newEstilo } : item));
                      }} className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-[10px] text-zinc-300">
                        {ESTILOS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
                      </select>
                    </div>

                    {/* Controles */}
                    <div className="absolute bottom-12 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        {i > 0 && (
                          <button onClick={() => moveImage(i, i - 1)}
                            className="bg-black/80 text-white text-[10px] w-6 h-6 rounded flex items-center justify-center hover:bg-violet-600">
                            ←
                          </button>
                        )}
                        {i < generatedImages.length - 1 && (
                          <button onClick={() => moveImage(i, i + 1)}
                            className="bg-black/80 text-white text-[10px] w-6 h-6 rounded flex items-center justify-center hover:bg-violet-600">
                            →
                          </button>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => downloadImage(g.img, i)}
                          className="bg-black/80 text-white text-[10px] w-6 h-6 rounded flex items-center justify-center hover:bg-green-600">
                          ↓
                        </button>
                        <button onClick={() => removeImage(i)}
                          className="bg-black/80 text-red-400 text-[10px] w-6 h-6 rounded flex items-center justify-center hover:bg-red-600 hover:text-white">
                          X
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTEUDO */}
          {conteudo && (
            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 space-y-4">
              <h3 className="font-bold">Conteudo Gerado</h3>

              {/* Títulos */}
              {[
                { label: "Shopee", key: "titulo_shopee" as const, color: "text-orange-400" },
                { label: "Mercado Livre", key: "titulo_ml" as const, color: "text-yellow-400" },
                { label: "TikTok", key: "titulo_tiktok" as const, color: "text-pink-400" },
              ].map(({ label, key, color }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`text-xs ${color}`}>{label}</label>
                    <button onClick={() => copyToClipboard(conteudo[key] || "", key)}
                      className="text-[10px] text-violet-400 hover:text-violet-300">
                      {copied === key ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                  <div className="bg-zinc-800 rounded-lg px-3 py-2 text-sm">{conteudo[key]}</div>
                </div>
              ))}

              {/* Descrição */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-zinc-400">Descricao</label>
                  <button onClick={() => copyToClipboard(conteudo.descricao, "desc")}
                    className="text-[10px] text-violet-400 hover:text-violet-300">
                    {copied === "desc" ? "Copiado!" : "Copiar"}
                  </button>
                </div>
                <div className="bg-zinc-800 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
                  {conteudo.descricao}
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-zinc-400">Tags</label>
                  <button onClick={() => copyToClipboard((conteudo.tags || []).join(", "), "tags")}
                    className="text-[10px] text-violet-400 hover:text-violet-300">
                    {copied === "tags" ? "Copiado!" : "Copiar"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(conteudo.tags || []).map((tag, i) => (
                    <span key={i} className="bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2 py-0.5 rounded-full text-[10px]">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PUBLICAR */}
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <h3 className="font-bold mb-4">Publicar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Mercado Livre */}
              <div className="space-y-2">
                {mlConnected ? (
                  <div className="text-[10px] text-green-400 flex items-center gap-1 mb-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> {mlNickname}
                  </div>
                ) : (
                  <div className="flex gap-2 mb-1">
                    <button onClick={async () => { const r = await fetch("/api/ml/auth"); const d = await r.json(); window.open(d.url, "_blank"); }}
                      className="text-[10px] text-yellow-400 hover:text-yellow-300 underline">Conectar ML</button>
                    <button onClick={async () => { const r = await fetch("/api/ml/status"); const d = await r.json(); if (d.connected) { setMlConnected(true); setMlNickname(d.nickname); }}}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300">Verificar</button>
                  </div>
                )}
                <button onClick={() => handlePublish("ml")} disabled={publishing === "ml" || !conteudo || !mlConnected}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold py-2.5 rounded-lg text-sm transition-colors">
                  {publishing === "ml" ? "Publicando..." : "Mercado Livre"}
                </button>
              </div>

              {/* Shopee */}
              <div className="space-y-2">
                <div className="text-[10px] text-zinc-500 mb-1">Aguardando verificacao</div>
                <button onClick={() => handlePublish("shopee")} disabled={publishing === "shopee" || !conteudo}
                  className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
                  {publishing === "shopee" ? "Exportando..." : "Shopee (JSON)"}
                </button>
              </div>

              {/* TikTok */}
              <div className="space-y-2">
                <div className="text-[10px] text-zinc-500 mb-1">Em breve</div>
                <button onClick={() => handlePublish("tiktok")} disabled={publishing === "tiktok" || !conteudo}
                  className="w-full bg-pink-600 hover:bg-pink-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
                  {publishing === "tiktok" ? "Exportando..." : "TikTok (JSON)"}
                </button>
              </div>
            </div>

            {/* Resultados de publicação */}
            {publishResult.length > 0 && (
              <div className="mt-3 space-y-2">
                {publishResult.map((r, i) => (
                  <div key={i} className={`rounded-lg p-2 text-xs ${r.success ? "bg-green-500/10 border border-green-500/20 text-green-300" : "bg-red-500/10 border border-red-500/20 text-red-300"}`}>
                    <strong>{r.platform}:</strong> {r.message}
                    {r.permalink && <a href={r.permalink} target="_blank" rel="noopener noreferrer" className="ml-2 underline">Ver anuncio</a>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
