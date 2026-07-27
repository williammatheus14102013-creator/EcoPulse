const ALLOWED_CATEGORIES = ['Plástico', 'Papel', 'Papelão', 'Vidro', 'Metal', 'Orgânico', 'Eletrônico', 'Tecido', 'Isopor', 'Outros'];
const ALLOWED_URGENCIES = ['Baixa', 'Média', 'Alta', 'Crítica'];

function send(res, status, body) {
  res.status(status).json(body);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Método não permitido.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return send(res, 503, { error: 'A análise está indisponível. Configure OPENAI_API_KEY na Vercel.' });
  }

  const imageData = req.body?.imageData;
  if (typeof imageData !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(imageData)) {
    return send(res, 400, { error: 'Envie uma imagem JPG, PNG ou WEBP válida.' });
  }
  if (imageData.length > 4_000_000) {
    return send(res, 413, { error: 'A imagem é muito grande para análise.' });
  }

  const schema = {
    type: 'object', additionalProperties: false,
    required: ['identified', 'object', 'material', 'category', 'urgency', 'confidence', 'explanation', 'recommendation'],
    properties: {
      identified: { type: 'boolean' },
      object: { type: 'string' }, material: { type: 'string' },
      category: { type: 'string', enum: ALLOWED_CATEGORIES },
      urgency: { type: 'string', enum: ALLOWED_URGENCIES },
      confidence: { type: 'integer', minimum: 0, maximum: 100 },
      explanation: { type: 'string' }, recommendation: { type: 'string' }
    }
  };

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [{ role: 'user', content: [
          { type: 'input_text', text: 'Analise esta imagem somente para identificar resíduos. Seja conservador: se não houver um resíduo visível ou a imagem for ambígua, marque identified como false, confidence baixa e explique como melhorar a foto. Não invente informações. Se identificar, informe objeto, material, categoria, urgência ambiental, confiança, explicação curta e recomendação de descarte no Brasil.' },
          { type: 'input_image', image_url: imageData, detail: 'low' }
        ] }],
        text: { format: { type: 'json_schema', name: 'waste_analysis', strict: true, schema } }
      })
    });
    const payload = await response.json();
    if (!response.ok) return send(res, 502, { error: 'O serviço de análise não respondeu. Tente novamente.' });
    const outputText = payload.output_text || payload.output
      ?.flatMap(item => item.content || [])
      .find(content => content.type === 'output_text')?.text;
    const parsed = JSON.parse(outputText || '{}');
    if (!parsed.identified || parsed.confidence < 55) {
      return send(res, 200, { ...parsed, identified: false, explanation: parsed.explanation || 'Não foi possível identificar o resíduo com confiança. Tente aproximar e melhorar a iluminação.' });
    }
    return send(res, 200, parsed);
  } catch (error) {
    console.error('PulseIA analysis failed:', error?.message);
    return send(res, 500, { error: 'Não foi possível concluir a análise agora.' });
  }
}
