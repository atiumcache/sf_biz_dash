import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

export const getData = async (neighborhood: string, currentOnly: boolean): Promise<any[]> => {
  const data: any[] = [];
  let offset = 0;
  const limit = 1000;
  let hasMoreData = true;

  while (hasMoreData){
    let apiUrl = `${getApiUrl(neighborhood)}&$offset=${offset}&$limit=${limit}`;
    if (currentOnly) {
      apiUrl += '&$where=dba_end_date IS NULL';
    }
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const chunk = await response.json();
    data.push(...chunk);

    if (chunk.length < limit) {
      hasMoreData = false;
    }
    offset += limit;
  }
  return data;
};

export const useNeighborhoodData = (neighborhood: string, currentOnly: boolean = false) => {
  return useQuery({
    queryKey: ['neighborhoodData', neighborhood, currentOnly],
    queryFn: () => getData(neighborhood, currentOnly),
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, // 10 mins
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000) // exponential backoff
  })
}

export const countUniqueNAICs = (data: any[]): number => {
  const uniqueNAICs = new Set<string>();
  
  for (const record of data) {
    if (record.naic_code) {
      uniqueNAICs.add(record.naic_code);
    }
  }
  
  return uniqueNAICs.size;
};

const getApiUrl = (neighborhood: string): string => {
  switch (neighborhood) {
    case 'FiDi':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Financial%20District%2FSouth%20Beach';
    case 'Western Addition':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Western%20Addition';
    case 'West of Twin Peaks':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=West%20of%20Twin%20Peaks';
    case 'Visitacion Valley':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Visitacion%20Valley';
    case 'Twin Peaks':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Twin%20Peaks';
    case 'SoMa':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=South%20of%20Market';
    case 'Treasure Island':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Treasure%20Island';
    case 'Presidio Heights':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Presidio%20Heights';
    case 'Presidio':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Presidio';
    case 'Potrero Hill':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Potrero%20Hill';
    case 'Portola':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Portola';
    case 'Pacific Heights':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Pacific%20Heights';
    case 'Outer Richmond':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Outer%20Richmond';
    case 'Outer Mission':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Outer%20Mission';
    case 'Sunset/Parkside':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Sunset%2FParkside';
    case 'OMI':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Oceanview%2FMerced%2FIngleside';
    case 'North Beach':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=North%20Beach';
    case 'Noe Valley':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Noe%20Valley';
    case 'Lone Mountain/USF':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Lone%20Mountain%2FUSF';
    case 'Lincoln Park':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Lincoln%20Park';
    case 'Seacliff':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Seacliff';
    case 'Nob Hill':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Nob%20Hill';
    case 'Mission Bay':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Mission%20Bay';
    case 'Mission':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Mission';
    case 'Russian Hill':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Russian%20Hill';
    case 'Marina':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Marina';
    case 'Lakeshore':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Lakeshore';
    case 'Tenderloin':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Tenderloin';
    case 'McLaren Park':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=McLaren%20Park';
    case 'Japantown':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Japantown';
    case 'Inner Sunset':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Inner%20Sunset';
    case 'Hayes Valley':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Hayes%20Valley';
    case 'Haight Ashbury':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Haight%20Ashbury';
    case 'Golden Gate Park':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Golden%20Gate%20Park';
    case 'Inner Richmond':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Inner%20Richmond';
    case 'Glen Park':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Glen%20Park';
    case 'Excelsior':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Excelsior';
    case 'Chinatown':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Chinatown';
    case 'Castro':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Castro%2FUpper%20Market';
    case 'Bernal Heights':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Bernal%20Heights';
    case 'Bayview':
      return 'https://data.sfgov.org/resource/g8m3-pdis.json?neighborhoods_analysis_boundaries=Bayview%20Hunters%20Point';
    default:
      throw new Error('Invalid neighborhood');
  }
};
