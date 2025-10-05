'use client';
import React from 'react';

interface Article {
  title: string;
  link: string;
  summary: string;
  keywords: string;
}

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const keywords = article.keywords ? article.keywords.split(';').map(kw => kw.trim()).filter(kw => kw) : [];

  return (
    <li
      className="glass-container-blue p-6 rounded-lg flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300"
    >
      <div>
        <a href={article.link} target="_blank" rel="noopener noreferrer">
          <h4 className="text-lg font-bold mb-2 text-primary hover:underline">{article.title}</h4>
        </a>
        <p className="text-text-dark/90 mb-4">{article.summary}</p>
      </div>
      {keywords.length > 0 && (
        <div className="mt-auto pt-4 border-t border-border-subtle">
            <p className="text-sm text-text-dark/70 italic mb-2">
            Keywords: {keywords.join(', ')}
            </p>
            <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold hover:underline"
            >
                Read Article &rarr;
            </a>
        </div>
      )}
    </li>
  );
};

export default ArticleCard;
