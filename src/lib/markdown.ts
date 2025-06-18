import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

export function renderMarkdown(markdown: string): string {
  let html = marked.parse(markdown);

  html = html.replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/gim, (match, href, text) => {
    if (/\.(pdf|docx?|pptx?|xlsx?)$/i.test(href)) {
      return `<div class="my-6"><iframe src="${href}" class="w-full h-72 border border-slate-600 rounded-xl mb-2"></iframe><p><a href="${href}" class="text-blue-400 underline" target="_blank" rel="noopener noreferrer">${text}</a></p></div>`;
    }
    return `<a href="${href}" class="text-blue-400 underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });

  html = html.replace(/<p>(<div class="my-6">[\s\S]*?<\/div>)<\/p>/gim, '$1');

  html = html.replace(/<img src="(.*?)" alt="(.*?)"[^>]*>/gim, (match, src, alt) => {
    let cleanSrc = src;
    let style = "";
    const hashIndex = src.indexOf("#");
    if (hashIndex !== -1) {
      cleanSrc = src.substring(0, hashIndex);
      const params = new URLSearchParams(src.substring(hashIndex + 1));
      const width = params.get("width");
      const height = params.get("height");
      const styleParts = [] as string[];
      if (width) styleParts.push(`width:${width}px`);
      if (height) styleParts.push(`height:${height}px`);
      if (styleParts.length) style = ` style="${styleParts.join(';')}"`;
    }
    return `<div class="my-8 p-4 bg-gray-900/50 rounded-2xl border border-gray-700/50 max-w-screen-md mx-auto"><img src="${cleanSrc}" alt="${alt}" class="w-full h-auto rounded-xl shadow-2xl border border-gray-600/30"${style} /></div>`;
  });

  return html;
}
