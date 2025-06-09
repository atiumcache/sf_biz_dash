import type { ChartConfig } from '@/components/ui/chart';
import { useQuery } from '@tanstack/react-query';

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

interface ChartData {
  date: string;
  new_biz: number;
  closed_biz: number;
}

class BusinessCollection {
  private businesses: Business[];

  constructor(rawData: BusinessRecord[]) {
    this.businesses = rawData.map(this.transformRecord);
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
      mailingAddress: record.mailing_address_1
        ? {
            street: record.mailing_address_1,
            city: record.mail_city || '',
            state: record.mail_state || '',
            zip: record.mail_zipcode || '',
          }
        : undefined,
      dates: {
        dbaStart: record.dba_start_date
          ? new Date(record.dba_start_date)
          : undefined,
        dbaEnd: record.dba_end_date ? new Date(record.dba_end_date) : undefined,
        locationStart: record.location_start_date
          ? new Date(record.location_start_date)
          : undefined,
        locationEnd: record.location_end_date
          ? new Date(record.location_end_date)
          : undefined,
      },
      naicCode: record.naic_code,
      naicDescription: record.naic_code_description,
      taxes: {
        parking: record.parking_tax,
        transientOccupancy: record.transient_occupancy_tax,
      },
      location: record.location
        ? {
            longitude: record.location.coordinates[0],
            latitude: record.location.coordinates[1],
          }
        : undefined,
      supervisorDistrict: record.supervisor_district,
      neighborhood: record.neighborhoods_analysis_boundaries,
      businessCorridor: record.business_corridor,
      isActive: !record.dba_end_date && !record.location_end_date,
    };
  }

  countUniqueNAICs(): number {
    const uniqueNAICs = new Set<string>();
    for (const business of this.businesses) {
      if (business.naicCode) {
        uniqueNAICs.add(business.naicCode.slice(0, 2));
      }
    }
    return uniqueNAICs.size;
  }

  getActiveBusinesses(): Business[] {
    return this.businesses.filter((b) => b.isActive);
  }

  getByNAICCode(naicPrefix: string): Business[] {
    return this.businesses.filter((b) => b.naicCode?.startsWith(naicPrefix));
  }

  getBySupervisorDistrict(district: string): Business[] {
    return this.businesses.filter((b) => b.supervisorDistrict === district);
  }

  getByBusinessCorridor(corridor: string): Business[] {
    return this.businesses.filter((b) => b.businessCorridor === corridor);
  }

  getBusinessesWithTax(taxType: 'parking' | 'transientOccupancy'): Business[] {
    return this.businesses.filter((b) => b.taxes[taxType]);
  }

  getBusinessesInRadius(
    centerLat: number,
    centerLng: number,
    radiusKm: number,
  ): Business[] {
    return this.businesses.filter((business) => {
      if (!business.location || radiusKm < 0.1) return false;

      const distance = this.calculateDistance(
        centerLat,
        centerLng,
        business.location.latitude,
        business.location.longitude,
      );

      return distance <= radiusKm;
    });
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // NAIC code prefix to industry name mapping
  private static NAIC_CODE_MAP: Record<string, string> = {
    '11': 'Agriculture, Forestry, Fishing, and Hunting',
    '21': 'Mining, Quarrying, and Oil and Gas Extraction',
    '22': 'Utilities',
    '23': 'Construction',
    '31': 'Manufacturing',
    '32': 'Manufacturing',
    '33': 'Manufacturing',
    '42': 'Wholesale Trade',
    '44': 'Retail Trade',
    '45': 'Retail Trade',
    '48': 'Transportation and Warehousing',
    '49': 'Transportation and Warehousing',
    '51': 'Information',
    '52': 'Finance and Insurance',
    '53': 'Real Estate and Rental and Leasing',
    '54': 'Professional, Scientific, and Technical Services',
    '55': 'Management of Companies and Enterprises',
    '56': 'Administrative and Support and Waste Management and Remediation Services',
    '61': 'Educational Services',
    '62': 'Health Care and Social Assistance',
    '71': 'Arts, Entertainment, and Recreation',
    '72': 'Accommodation and Food Services',
    '81': 'Other Services (except Public Administration)',
    '92': 'Public Administration',
    '99': 'Unclassified Establishments',
  };

  // Statistical methods
  getIndustryBreakdown(): Record<string, number> {
    const breakdown: Record<string, number> = {};

    for (const business of this.businesses) {
      const naicCode = business.naicCode;
      if (naicCode) {
        const prefix = naicCode.slice(0, 2);
        const industry = BusinessCollection.NAIC_CODE_MAP[prefix] || 'Other';
        breakdown[industry] = (breakdown[industry] || 0) + 1;
      } else {
        breakdown['Unknown'] = (breakdown['Unknown'] || 0) + 1;
      }
    }

    return breakdown;
  }

  getDistrictBreakdown(): Record<string, number> {
    const breakdown: Record<string, number> = {};

    for (const business of this.businesses) {
      const district = business.supervisorDistrict;
      breakdown[district] = (breakdown[district] || 0) + 1;
    }

    return breakdown;
  }

  // Add this method to the BusinessCollection class
  getTopIndustries(): ChartConfig {
    // Filter out businesses without NAIC codes
    const naicBusinesses = this.getActiveBusinesses().filter(
      (business) => business.naicCode,
    );

    const breakdown: Record<string, number> = {};
    for (const business of naicBusinesses) {
      const prefix = business.naicCode!.slice(0, 2);
      const industry = BusinessCollection.NAIC_CODE_MAP[prefix] || 'Other';
      breakdown[industry] = (breakdown[industry] || 0) + 1;
    }

    const top5 = Object.entries(breakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const otherCount = Object.entries(breakdown)
      .slice(5)
      .reduce((sum, [, count]) => sum + count, 0);

    const config: ChartConfig = Object.fromEntries([
      ...top5.map((entry, index) => [
        entry[0],
        {
          label: entry[0],
          color: `var(--chart-${index + 1})`,
        },
      ]),
      [
        'other',
        {
          label: 'Other',
          color: 'var(--chart-6)',
        },
      ],
    ]);

    // Add the counts to the config
    top5.forEach(([code, count]) => {
      config[code].count = count;
    });
    config['other'].count = otherCount;

    return config;
  }

  // Array-like access
  get all(): readonly Business[] {
    return this.businesses;
  }

  get length(): number {
    return this.businesses.length;
  }

  get activeCount(): number {
    return this.getActiveBusinesses().length;
  }

  // Iterator support
  *[Symbol.iterator](): Iterator<Business> {
    yield* this.businesses;
  }

  // Find methods
  findById(id: string): Business | undefined {
    return this.businesses.find((b) => b.id === id);
  }

  findByCertificate(certificateNumber: string): Business | undefined {
    return this.businesses.find(
      (b) => b.certificateNumber === certificateNumber,
    );
  }

  // Find businesses opened in a specific month and year
  countBusinessesOpenedInMonth(year: number, month: number): number {
    return this.businesses.filter((business) => {
      if (!business.dates.dbaStart) return false;
      const businessMonth = business.dates.dbaStart.getMonth() + 1; // getMonth() returns 0-11
      const businessYear = business.dates.dbaStart.getFullYear();
      return businessYear === year && businessMonth === month;
    }).length;
  }

  // Find businesses closed in a specific month and year
  countBusinessesClosedInMonth(year: number, month: number): number {
    return this.businesses.filter((business) => {
      if (!business.dates.dbaEnd) return false;
      const businessMonth = business.dates.dbaEnd.getMonth() + 1;
      const businessYear = business.dates.dbaEnd.getFullYear();
      return businessYear === year && businessMonth === month;
    }).length;
  }

  // Get chart data for the past 12 months
  getMonthlyBusinessActivity(): ChartData[] {
    const now = new Date();
    const data: ChartData[] = [];

    // Generate data for the past 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - i); // Go back i months

      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() returns 0-11

      // Format date as "YYYY-MM"
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}`;

      const newBiz = this.countBusinessesOpenedInMonth(year, month);
      const closedBiz = this.countBusinessesClosedInMonth(year, month);

      data.push({
        date: formattedDate,
        new_biz: newBiz,
        closed_biz: closedBiz,
      });
    }

    // Sort data from oldest to newest
    return data.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }
}

const getData = async (neighborhood: string): Promise<BusinessCollection> => {
  const data: any[] = [];
  let offset = 0;
  const limit = 1000;
  let hasMoreData = true;

  while (hasMoreData) {
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
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // exponential backoff
  });
};

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
    case 'Sunset':
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

export type { Business, BusinessRecord, ChartData };
export { BusinessCollection };
