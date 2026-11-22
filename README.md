# Oficina de Currículos
Aplicação Next.js para atendimento e elaboração de currículos em português brasileiro, com revisão assistida por IA e impressão/PDF pelo navegador.

## Desenvolvimento
Node.js 22 ou superior. Execute `npm ci`, `npm run dev`. Validação: `npm test` e `npm run build`.

## Vercel
Importe este repositório e selecione o framework Next.js. Configure nas variáveis de ambiente:
- `OPENAI_API_KEY`: chave da API OpenAI, exclusivamente no servidor.
- `KIOSK_ACCESS_CODE`: senha forte compartilhada com os atendentes; exigida para usar a IA.
- `OPENAI_MODEL`: opcional, padrão `gpt-4.1-mini`.

Depois, faça o deploy. Em “Meu acesso à IA”, informe sua senha uma vez. A sessão permanece por até 30 dias no mesmo navegador, usando cookie HttpOnly, Secure em produção e SameSite=Strict. Use “Sair” para apagar a sessão deste navegador. Limpar cookies, trocar de navegador, expirar o prazo ou alterar KIOSK_ACCESS_CODE exige novo login. A senha não é armazenada no navegador. Sem configuração, o formulário manual e impressão continuam funcionando. Configure limites de gastos no provedor e proteção de taxa no firewall da Vercel antes de disponibilizar publicamente; o código compartilhado não substitui autenticação individual.

## Privacidade e revisão
Dados do currículo permanecem na memória da aba, sem banco ou armazenamento local. Apenas a sessão de acesso à IA persiste em cookie. Fechar/recarregar perde os dados. Apenas o campo selecionado e estilo são enviados pelo back-end à OpenAI (`store:false`); evite dados pessoais nos campos livres. As políticas de retenção do provedor também se aplicam. Não há envio dos campos de nome, contato, empresa ou datas. A IA pode errar: revisão humana é obrigatória, nenhuma sugestão é aplicada automaticamente. As versões anteriores ficam disponíveis na sessão, por campo. Remover uma experiência remove também seu histórico.

## Escopo
Versão inicial com experiências repetíveis, objetivo, resumo, competências e formação básica. Não inclui contas individuais ou persistência. Impressão usa a caixa de diálogo do navegador. Os testes automatizados cobrem validação e minimização de contexto; a qualidade das respostas reais requer chave válida e avaliação humana.
