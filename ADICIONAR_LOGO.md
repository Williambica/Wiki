# Como Adicionar o Logo

## 📋 Passo a Passo

### 1. Salvar a Imagem
1. Clique com o botão direito na imagem do logo que você enviou
2. Selecione "Salvar imagem como..."
3. Salve com o nome exato: `logo-farmacias-associadas.png`

### 2. Colocar no Projeto
Mova o arquivo para a pasta `public/` do projeto:

```
Projeto Associadas/
├── public/
│   ├── documentos/
│   ├── app.js
│   ├── index.html
│   ├── style.css
│   └── logo-farmacias-associadas.png  ← COLOQUE AQUI
├── src/
└── ...
```

### 3. Verificar
Após adicionar o logo:
1. Acesse: http://localhost:3001
2. O logo aparecerá automaticamente em:
   - Header da landing page
   - Hero section (início da página)
   - Footer
   - Header da página de documentação

## ✅ Onde o Logo Aparece

### Landing Page
- **Header**: Logo no canto superior esquerdo (50px altura)
- **Hero**: Logo grande no início do conteúdo (80px altura)
- **Footer**: Logo branco no rodapé (60px altura)

### Página de Documentação
- **Header**: Logo no canto superior esquerdo (45px altura)

## 🎨 Estilos Aplicados

### Header Landing
```css
height: 50px;
width: auto;
```

### Hero
```css
height: 80px;
width: auto;
filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
```

### Footer
```css
height: 60px;
width: auto;
filter: brightness(0) invert(1); /* Branco */
opacity: 0.8;
```

### Header Documentação
```css
height: 45px;
width: auto;
```

## 🔄 Fallback

Se a imagem não carregar, o sistema mostrará automaticamente:
- Texto estilizado "FARMÁCIAS Associadas"
- Cores: Laranja (#f47920) + Turquesa (#1db89f)

## 🚀 Pronto!

Depois de adicionar a imagem, recarregue a página e o logo aparecerá em todos os lugares!

## 📝 Nota

O nome do arquivo DEVE ser exatamente:
```
logo-farmacias-associadas.png
```

Qualquer outro nome não funcionará!
