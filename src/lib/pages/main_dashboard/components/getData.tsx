import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

// Raw API response interface
interface BusinessRecord {
  uniqueid: string;
  ttxid: string;
  certificate_number: string;
  ownership_name: string;
  dba_name: string;
  full_business_address: string;
  city: string;
  state: string;
  business_zip: string;
  dba_start_date?: string;
  dba_end_date?: string;
  location_start_date?: string;
  location_end_date?: string;
  mailing_address_1?: string;
  mail_city?: string;
  mail_zipcode?: string;
  mail_state?: string;
  naic_code?: string;
  naic_code_description?: string;
  naics_code_descriptions_list?: string;
  parking_tax: boolean;
  transient_occupancy_tax: boolean;
  supervisor_district: string;
  neighborhoods_analysis_boundaries: string;
  business_corridor?: string;
  location?: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  data_as_of: string;
  data_loaded_at: string;
}

// Clean domain model
interface Business {
  id: string;
  certificateNumber: string;
  ownershipName: string;
  dbaName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  mailingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  dates: {
    dbaStart?: Date;
    dbaEnd?: Date;
    locationStart?: Date;
    locationEnd?: Date;
  };
  naicCode?: string;
  naicDescription?: string;
  taxes: {
    parking: boolean;
    transientOccupancy: boolean;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  supervisorDistrict: string;
  neighborhood: string;
  businessCorridor?: string;
  isActive: boolean;
}

class BusinessCollection {
  private businesses: Business[];

  constructor(rawData: BusinessRecord[]) {
    this.businesses = rawData.map(this.transformRecord)
  }

  private transformRecord(record: BusinessRecord): Business {
    return {
      id: record.uniqueid,
      certificateNumber: record.certificate_number,
      ownershipName: record.ownership_name,
      dbaName: record.dba_name,
      address: {
        street: record.full_business_address,
        city: record.city,
        state: record.state,
        zip: record.business_zip,
      },
      mailingAddress: record.mailing_address_1 ? {
        street: record.mailing_address_1,
        city: record.mail_city || '',
        state: record.mail_state || '',
        zip: record.mail_zipcode || '',
      } : undefined,
      dates: {
        dbaStart: record.dba_start_date ? new Date(record.dba_start_date) : undefined,
        dbaEnd: record.dba_end_date ? new Date(record.dba_end_date) : undefined,
        locationStart: record.location_start_date ? new Date(record.location_start_date) : undefined,
        locationEnd: record.location_end_date ? new Date(record.location_end_date) : undefined,
      },
      naicCode: record.naic_code,
      naicDescription: record.naic_code_description,
      taxes: {
        parking: record.parking_tax,
        transientOccupancy: record.transient_occupancy_tax,
      },
      location: record.location ? {
        longitude: record.location.coordinates[0],
        latitude: record.location.coordinates[1],
      } : undefined,
      supervisorDistrict: record.supervisor_district,
      neighborhood: record.neighborhoods_analysis_boundaries,
      businessCorridor: record.business_corridor,
      isActive: !record.dba_end_date && !record.location_end_date,
    };
  }

  // TODO: Implement methods for Collection analysis
}

const getData = async (neighborhood: string): Promise<BusinessCollection> => {
  const data: any[] = [];
  let offset = 0;
  const limit = 1000;
  let hasMoreData = true;

  while (hasMoreData){
    let apiUrl = `${getApiUrl(neighborhood)}&$offset=${offset}&$limit=${limit}`;
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
  return new BusinessCollection(data);
};

export const useNeighborhoodData = (neighborhood: string) => {
  return useQuery({
    queryKey: ['neighborhoodData', neighborhood],
    queryFn: () => getData(neighborhood),
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, // 10 mins
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000) // exponential backoff
  })
}

export const countUniqueNAICs = (data: any[]): number => {
  // Return number of unique first 2 digit sequences for NAIC codes
  const uniqueNAICs = new Set<string>();
  
  for (const record of data) {
    if (record.naic_code) {
      uniqueNAICs.add(record.naic_code.slice(0, 2));
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

export type { Business, BusinessCollection }
