# Diretrizes de Design - Trailer da Praça (Street Food Neo-Brutalista)

Você está criando o cardápio digital e sistema de pedidos via WhatsApp para um trailer de lanches, pastéis e porções localizado na praça central da cidade.

1. **Proibições (Anti-AI Slop):**
   - NUNCA use fundo escuro genérico (`slate-900`, `gray-950`), roxo neon ou gradientes artificiais.
   - Evite visual de "hamburgueria gourmet cara"; o visual deve ser popular, vibrante, limpo e super fácil de ler no celular ao ar livre.

2. **Paleta de Cores (Alta Visibilidade na Praça):**
   - **Fundo da página:** Creme Claro / Papel Lanche (`#FAF7F2`).
   - **Cards e Modais:** Branco Puro (`#FFFFFF`).
   - **Bordas e Textos:** Preto Carvão (`#111111`) com bordas grossas (`border-2 border-[#111111]`).
   - **Cores de Destaque:**
     - Amarelo Pastel/Mostarda (`#FFB703`) para botões principais, preços e abas ativas.
     - Vermelho Ketchup (`#E63946`) para badges de destaque ("Sai na Hora", "Mais Pedido") e botões de remover.
     - Verde Praça (`#2A9D8F`) para o status "Trailer Aberto na Praça" e botão final do WhatsApp.

3. **Assinatura Visual (Tailwind CSS):**
   - **Sombras duras:** `shadow-[4px_4px_0px_0px_#111111]` nos cards e `shadow-[2px_2px_0px_0px_#111111]` nos botões.
   - **Efeito tátil:** `transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`.
   - **Tipografia:** `Space Grotesk` (negrito) para títulos e preços; `Inter` para ingredientes e opções.
   - **Mobile-First:** Botões grandes e espaçados para serem clicados facilmente com uma mão só enquanto o cliente está na praça.
