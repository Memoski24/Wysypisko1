const API_URL = 'https://fkdenppjrkgyluoadzts.supabase.co/rest/v1/article';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZGVucHBqcmtneWx1b2FkenRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjc5MzAsImV4cCI6MjA2Mzk0MzkzMH0.k574iw0MP3PAhoAZIOjr7Eoq9D6phiUgy_i0ws90vIA';
import './style.css';
import { format } from 'date-fns';

const fetchArticles = async (orderBy = 'created_at.desc') => {
  try {
    const response = await fetch(`${API_URL}?order=${orderBy}`, {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const createNewArticle = async (article) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(article)
    });

    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

document.querySelector('#app').innerHTML = `
  <h1 class="text-2xl font-bold mb-4 text-primary">Artykuły</h1>
  <div id="article-list" class="space-y-4 mb-8"></div>
  <label class="block mb-2">
    <select id="sort-select" class="border p-2">
      <option value="created_at.asc">po dacie rosnąco</option>
      <option value="created_at.desc">po dacie malejąco</option>
      <option value="title.asc">po nazwie alfabetycznie</option>
    </select>
  </label>

  <h2 class="text-xl font-semibold mb-2 text-primary">Dodaj nowy artykuł</h2>
  <form id="article-form" class="space-y-2">
    <input name="title" placeholder="Tytuł" required class="w-full border p-2" />
    <input name="subtitle" placeholder="Podtytuł" required class="w-full border p-2" />
    <input name="author" placeholder="Autor" required class="w-full border p-2" />
    <input type="date" name="created_at" required class="w-full border p-2" />
    <div>
    <textarea name="content" placeholder="Treść" required class="w-full border p-2 h-32"></textarea>
    </div>
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Dodaj artykuł</button>
  </form>
`;

const renderArticles = async () => {
  const order = document.getElementById('sort-select')?.value || 'created_at.desc';
  const articles = await fetchArticles(order);
  const container = document.getElementById('article-list');
  container.innerHTML = '';

  articles.forEach((a) => {
    const div = document.createElement('div');
    div.className = 'border p-4';
    div.innerHTML = `
      <h2 class="text-xl font-semibold">${a.title}</h2>
      <h3 class="italic text-gray-600">${a.subtitle}</h3>
      <p class="text-sm text-gray-500">${a.author} – ${format(new Date(a.created_at), 'dd-MM-yyyy')}</p>
      <div class="mt-2">${a.content}</div>
    `;
    container.appendChild(div);
  });
};
document.getElementById('sort-select').addEventListener('change', renderArticles);

document.getElementById('article-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const article = {
    title: form.title.value,
    subtitle: form.subtitle.value,
    author: form.author.value,
    content: form.content.value,
    created_at: form.created_at.value
  };
  await createNewArticle(article);
  form.reset();
  renderArticles();
});

renderArticles();