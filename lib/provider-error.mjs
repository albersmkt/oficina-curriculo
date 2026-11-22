// Never forward upstream messages: they can contain credentials or user text.
export async function providerError(response) {
 let code;
 try { code=(await response.json())?.error?.code; } catch {}
 if (code==='insufficient_quota' || code==='billing_hard_limit_reached') return 'A OpenAI informou que a cota da API foi esgotada. Confira os créditos e o faturamento em platform.openai.com. A assinatura do ChatGPT não inclui créditos da API.';
 if (response.status===401) return 'A OpenAI não aceitou a chave de API. Confira OPENAI_API_KEY na Vercel e faça um novo deploy após corrigir.';
 if (response.status===403) return 'A OpenAI recusou a permissão desta chave ou projeto. Verifique as permissões da chave e o acesso ao modelo na plataforma OpenAI.';
 if (code==='model_not_found' || response.status===404) return 'O modelo configurado não foi encontrado ou não está disponível para sua conta. Confira OPENAI_MODEL na Vercel; o padrão do sistema é gpt-4.1-mini.';
 if (response.status===429) return 'O limite de solicitações da OpenAI foi atingido. Aguarde um pouco e tente novamente.';
 if (response.status===400 || response.status===422) return 'A OpenAI não aceitou a configuração da solicitação. Verifique se OPENAI_MODEL é compatível com Chat Completions e respostas JSON estruturadas; o padrão é gpt-4.1-mini.';
 return 'O serviço de IA está temporariamente indisponível. Tente novamente mais tarde ou continue manualmente.';
}
