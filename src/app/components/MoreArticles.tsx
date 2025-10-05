'use client';

import { useEffect, useState } from 'react';

interface Study {
  study_id: string;
  study_title: string;
  description: string;
  url: string;
}

interface MoreArticlesProps {
  keyword: string | null;
}

const MoreArticles = ({ keyword }: MoreArticlesProps) => {
  const [studies, setStudies] = useState<Study[]>([]);

  useEffect(() => {
    const fetchStudies = async () => {
      const term = keyword || 'bio';
      try {
        const response = await fetch(`/api/nasa?term=${term}`);
        const data = await response.json();
        if (data.hits && data.hits.hits) {
          const fetchedStudies = data.hits.hits
            .map((hit: any) => {
                const source = hit._source;
                const authoritativeSourceUrl = source['Authoritative Source URL'];
                const study_id = source['Study Identifier'] || source.Accession;
                const url = `https://osdr.nasa.gov/bio/repo/search?q=${authoritativeSourceUrl}&data_source=cgene,alsda,esa,nih_geo_gse,ebi_pride,mg_rast&data_type=study`;

                return {
                    study_id: study_id,
                    study_title: source['Study Title'],
                    description: source['Study Description'],
                    url: url
                };
            })
            .filter((study: Study) => study.description && study.url);
          setStudies(fetchedStudies);
        }
      } catch (error) {
        console.error('Error fetching more articles:', error);
      }
    };

    fetchStudies();
  }, [keyword]);

  return (
    <section className="py-16">
      <h3 className="text-3xl font-bold text-center text-primary mb-8">
        Want to keep learning about this topic?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {studies.map((study) => (
          <a
            key={study.study_id}
            href={study.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center mb-4">
              <img src="/file.svg" alt="File icon" className="w-8 h-8 mr-4" />
              <h4 className="text-xl font-bold text-gray-900">{study.study_title}</h4>
            </div>
            <p className="font-normal text-gray-700">
              {study.description.substring(0, 150)}...
            </p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default MoreArticles;
