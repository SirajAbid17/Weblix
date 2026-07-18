import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const generateWithGemini = async (prompt, retries = 3) => {
  let lastError = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Gemini attempt ${i + 1}...`);
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      
      let text = response.text;
      text = text.replace(/```html\s*/gi, '');
      text = text.replace(/```\s*$/g, '');
      text = text.trim();
      
      return text;
      
    } catch (error) {
      console.log(`❌ Attempt ${i + 1} failed:`, error.message);
      lastError = error;
      
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  throw lastError;
};


export function isGameRequest(prompt) {
  const gameKeywords = [
    'game', 'tic tac toe', 'tictactoe', 'snake', 'chess', 
    'memory game', 'matching game', 'puzzle', 'quiz game',
    'rpg', 'platformer', 'shooting game', 'racing game',
    'flappy bird', 'space invaders', 'tetris', 'sudoku',
    'word game', 'trivia', 'card game', 'dice game'
  ];
  
  const lowerPrompt = prompt.toLowerCase();
  return gameKeywords.some(keyword => lowerPrompt.includes(keyword));
}

export function detectWebsiteType(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  if (isGameRequest(prompt)) return 'game';
  if (lowerPrompt.includes('portfolio')) return 'portfolio';
  if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('shop') || lowerPrompt.includes('store')) return 'ecommerce';
  if (lowerPrompt.includes('blog')) return 'blog';
  if (lowerPrompt.includes('restaurant') || lowerPrompt.includes('food')) return 'restaurant';
  if (lowerPrompt.includes('travel') || lowerPrompt.includes('hotel')) return 'travel';
  if (lowerPrompt.includes('business') || lowerPrompt.includes('corporate') || lowerPrompt.includes('company')) return 'business';
  if (lowerPrompt.includes('landing') || lowerPrompt.includes('marketing')) return 'landing';
  
  return 'general';
}


function getSpecificInstructions(prompt, type) {
  if (type === 'game') {
    return `
CRITICAL: User wants a GAME called "${prompt}"

Create an ACTUAL PLAYABLE GAME, NOT a game studio website.

Requirements for this game:
- Full game logic implemented in JavaScript
- Interactive UI where users can actually play
- Score tracking if applicable
- Reset/Restart functionality
- Win/Loss detection
- Visual feedback on moves
- Responsive game board

Example: If user asks for "tic tac toe", create a 3x3 grid with X and O.
If user asks for "memory game", create a card matching game.
If user asks for "snake game", create a working snake game.

DO NOT create a company profile or portfolio page.
CREATE THE ACTUAL GAME PLAYABLE IN THE BROWSER.
`;
  }
  
  if (type === 'portfolio') {
    return `
Create a professional portfolio website with:
- Hero section with name/title
- About section with bio
- Projects/works gallery (at least 3 projects)
- Skills section
- Contact form
- Social media links
`;
  }
  
  if (type === 'ecommerce') {
    return `
Create an ecommerce product page with:
- Product grid (at least 4 products)
- Product cards with image, name, price
- Add to cart buttons (basic JavaScript functionality)
- Cart sidebar or modal
- Total price calculation
`;
  }
  
  return `
Create a modern ${type} website with:
- Hero section with headline and CTA
- Features/services section (3-4 items)
- About section
- Contact section
- Footer with social links
`;
}

export const generateWebsiteWithGemini = async (prompt) => {
  const type = detectWebsiteType(prompt);
  console.log(`Detected type: ${type} for prompt: "${prompt}"`);
  
  const specificInstructions = getSpecificInstructions(prompt, type);
  
  const systemPrompt = `YOU ARE A SENIOR FRONTEND ENGINEER.

USER REQUEST: Create a ${prompt}

DETECTED TYPE: ${type}

${specificInstructions}

**IMPORTANT IMAGE INSTRUCTIONS:**
- Use reliable image URLs: https://picsum.photos/id/100/400/300
- Add onerror="this.src='https://picsum.photos/400/300'" to ALL images
- For game backgrounds, use subtle gradients, not complex images

**TECHNICAL REQUIREMENTS:**
- Use HTML5, CSS3, and vanilla JavaScript (no external libraries except FontAwesome)
- All game logic must be in JavaScript
- Make it fully functional, not just visual
- Add proper event listeners
- Include reset functionality for games

Return ONLY valid HTML starting with <!DOCTYPE html>
No markdown, no backticks.`;

  let generatedCode = await generateWithGemini(systemPrompt);
  generatedCode = ensureWorkingImages(generatedCode, prompt);
  
  return generatedCode;
};

function ensureWorkingImages(html, userPrompt) {
  let updatedHtml = html;
  

  updatedHtml = updatedHtml.replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, (match, src) => {
    if (!src || src === '' || src.includes('undefined') || src.includes('null') || src === '#') {
      const randomId = Math.floor(Math.random() * 200);
      const newSrc = `https://picsum.photos/id/${randomId}/800/600`;
      return match.replace(/src=["'][^"']*["']/, `src="${newSrc}"`);
    }
    return match;
  });

  updatedHtml = updatedHtml.replace(/<img([^>]*)>/gi, (match, attrs) => {
    if (!attrs.includes('onerror')) {
      return `<img${attrs} onerror="this.src='https://picsum.photos/800/600?random='+Math.random()">`;
    }
    return match;
  });
  
  return updatedHtml;
}

export const updateWebsiteWithGemini = async (currentCode, userRequest) => {
  const type = detectWebsiteType(userRequest);
  
  const updatePrompt = `Modify the existing website based on user request.

EXISTING WEBSITE TYPE: ${type}
EXISTING CODE:
${currentCode}

USER REQUEST: ${userRequest}

CRITICAL:
- If this is a GAME, maintain the game functionality
- Keep ALL images working with fallbacks
- Preserve the core purpose of the website
- Add the requested features

Return COMPLETE updated HTML with working functionality.
No markdown, no backticks.`;

  let updatedCode = await generateWithGemini(updatePrompt);
  updatedCode = ensureWorkingImages(updatedCode, userRequest);
  
  return updatedCode;
};