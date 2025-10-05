'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Papa from 'papaparse';
import ArticleCard from './components/ArticleCard';

interface Article {
  title: string;
  link: string;
  summary: string;
  keywords: string;
}

interface KeywordCount {
  name: string;
  count: number;
}

const RoundedBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx="3" />; 
};

const ChartPlaceholder = () => {
    const placeholderHeights = [45, 60, 30, 50, 75, 40, 55, 35, 65, 70, 45, 60, 50, 30, 75];
    return (
      <div className="animate-pulse">
        <div className="w-full h-[500px] bg-card-surface/50 rounded-2xl p-6 md:p-8 blur-sm">
          <div className="flex items-end h-full justify-around">
            {placeholderHeights.map((height, i) => (
              <div key={i} className="w-8 bg-gray-400/50 rounded-t-md" style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [keywordData, setKeywordData] = useState<KeywordCount[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleArticles, setVisibleArticles] = useState(5);
  const articlesSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch('/data.csv');
      const reader = response.body!.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value!);
      const parsedData = Papa.parse<Article>(csv, {
        header: true,
        skipEmptyLines: true,
      }).data;

      setAllArticles(parsedData);

      const keywordCounts: { [key: string]: number } = {};
      parsedData.forEach((row) => {
        if (row.keywords) {
          const keywords = row.keywords.split(';').map((kw) => kw.trim().replace(/\.$/, ''));
          keywords.forEach((keyword) => {
            if (keyword) {
              keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
            }
          });
        }
      });

      const formattedData = Object.keys(keywordCounts)
        .map((key) => ({
          name: key,
          count: keywordCounts[key],
        }))
        .filter((item) => item.count >= 3)
        .sort((a, b) => b.count - a.count);

      setKeywordData(formattedData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleBarClick = (data: KeywordCount) => {
    if (selectedKeyword === data.name) {
      setSelectedKeyword(null);
    } else {
      setSelectedKeyword(data.name);
      setSearchTerm('');
      setVisibleArticles(5); 
      setTimeout(() => {
        articlesSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 100);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      setSelectedKeyword(searchTerm.trim());
      setVisibleArticles(5);
      setTimeout(() => {
        articlesSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 100);
    }
  };

  const handleHide = () => {
    setSelectedKeyword(null);
    setSearchTerm('');
  };

  const handleSeeMore = () => {
    setVisibleArticles((prev) => prev + 5);
  };

  const filteredArticles = selectedKeyword
    ? allArticles.filter(
        (article) =>
          article.keywords &&
          article.keywords
            .split(';')
            .map((kw) => kw.trim().replace(/\.$/, '').toLowerCase())
            .includes(selectedKeyword.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-background text-text-dark font-body">
      <header className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-sm z-10 border-b border-border-subtle">
        <div className="container mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-heading font-bold text-primary">
            Space Biology
          </h1>
          <p className="text-sm text-text-dark/80 hidden sm:block">
            Keyword Analysis
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 sm:px-8 pt-24">
        <section className="py-16 text-center">
          <h2 className="text-5xl md:text-7xl font-bold font-heading text-primary">
            Explore the Frontiers of Space Biology
          </h2>
          <p className="text-lg text-text-dark/80 mt-4 max-w-2xl mx-auto">
            An interactive visualization of keyword frequencies in space biology research articles.
          </p>
        </section>

        <section className="py-8">
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Enter a keyword to search for..."
              className="w-full max-w-lg px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 text-white bg-primary rounded-r-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Search
            </button>
          </div>
        </section>

        <section className="py-16">
          <div className="bg-card-surface rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-3xl font-bold font-heading mb-8 text-center text-secondary">
              Keyword Frequency
            </h3>
            {loading ? (
              <ChartPlaceholder />
            ) : (
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <div style={{ height: '500px', width: `${keywordData.length * 80}px`, minWidth: '100%' }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={keywordData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 150 }}
                      className="font-mono"
                    >
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#5e60ce" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#48bfe3" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
                      <XAxis dataKey="name" stroke="var(--color-text-dark)" angle={-45} textAnchor="end" interval={0} />
                      <YAxis stroke="var(--color-text-dark)" allowDecimals={false} />
                      <Tooltip cursor={{ fill: 'rgba(72, 191, 227, 0.1)' }} />
                      <Legend verticalAlign="top" wrapperStyle={{ color: 'var(--color-text-dark)', paddingBottom: '20px' }} />
                      <Bar dataKey="count" fill="url(#barGradient)" onClick={handleBarClick} shape={<RoundedBar />} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </section>

        {selectedKeyword && (
          <section ref={articlesSectionRef} className="py-16">
            <div className="rounded-2xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold font-heading text-accent">
                        Articles with keyword: <span className="text-primary">{selectedKeyword}</span>
                    </h3>
                    <button
                        onClick={handleHide}
                        className="px-4 py-2 text-sm font-bold text-white bg-secondary rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                        Hide
                    </button>
                </div>
              <ul className="grid grid-cols-1 gap-6">
                {filteredArticles.slice(0, visibleArticles).map((article, index) => (
                  <ArticleCard key={index} article={article} />
                ))}
              </ul>
              {filteredArticles.length > visibleArticles && (
                <div className="text-center mt-8">
                  <button 
                    onClick={handleSeeMore}
                    className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-primary-dark transition-colors duration-300"
                  >
                    See More
                  </button>
                </div>
              )}
               {filteredArticles.length === 0 && (
                <p className="text-center text-text-dark/80">No articles found for this keyword.</p>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="py-8 text-center text-text-dark/60">
        <p>Built with Next.js, Recharts, and Tailwind CSS. Styled by Gemini.</p>
      </footer>
    </div>
  );
}
