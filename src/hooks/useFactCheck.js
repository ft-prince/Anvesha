import { useQuery } from 'react-query';
import { fetchFactChecks } from '../api/factCheckApi';
import { fetchNewsArticles } from '../api/newsApi';

export const useFactCheck = (query) => {
  const { data: factChecks, isLoading: isLoadingFacts } = useQuery(
    ['factChecks', query],
    () => fetchFactChecks(query),
    { enabled: !!query }
  );

  const { data: newsArticles, isLoading: isLoadingNews } = useQuery(
    ['news', query],
    () => fetchNewsArticles(query),
    { enabled: !!query }
  );

  return {
    factChecks,
    newsArticles,
    isLoading: isLoadingFacts || isLoadingNews
  };
};