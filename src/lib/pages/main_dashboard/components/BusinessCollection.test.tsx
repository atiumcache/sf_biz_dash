// BusinessCollection.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { BusinessCollection } from './getData';
import type { BusinessRecord } from './getData';

describe('BusinessCollection', () => {
  let mockData: BusinessRecord[];
  let businessCollection: BusinessCollection;

  beforeEach(() => {
    mockData = [
      {
        uniqueid: "1038156-08-151-1017634",
        ttxid: "1038156-08-151",
        certificate_number: "1017634",
        ownership_name: "Josh Andrews Photography",
        dba_name: "Josh Andrews Photography",
        full_business_address: "188 South Parks St #6",
        city: "San Francisco",
        state: "CA",
        business_zip: "94107",
        dba_start_date: "2015-08-24T00:00:00.000",
        dba_end_date: "2016-05-05T00:00:00.000",
        location_start_date: "2015-08-24T00:00:00.000",
        location_end_date: "2016-05-05T00:00:00.000",
        parking_tax: false,
        transient_occupancy_tax: false,
        supervisor_district: "6",
        neighborhoods_analysis_boundaries: "Financial District/South Beach",
        location: {
          type: "Point",
          coordinates: [-122.394944732, 37.780848202]
        },
        data_as_of: "2025-06-07T00:00:00.000",
        data_loaded_at: "2025-06-07T04:12:40.000"
      },
      {
        uniqueid: "1247900-03-201-1112531",
        ttxid: "1247900-03-201",
        certificate_number: "1112531",
        ownership_name: "Streamlined Ventures Management, LLC",
        dba_name: "Streamlined Ventures",
        full_business_address: "353 Kearny St",
        city: "San Francisco",
        state: "CA",
        business_zip: "94110",
        dba_start_date: "2018-04-03T00:00:00.000",
        dba_end_date: "2019-05-07T00:00:00.000",
        location_start_date: "2018-04-03T00:00:00.000",
        location_end_date: "2019-05-07T00:00:00.000",
        mailing_address_1: "1825 Emerson St",
        mail_city: "Palo Alto",
        mail_zipcode: "94301",
        mail_state: "CA",
        naic_code: "5210",
        naic_code_description: "Financial Services",
        naics_code_descriptions_list: "Financial Services",
        parking_tax: false,
        transient_occupancy_tax: false,
        supervisor_district: "3",
        neighborhoods_analysis_boundaries: "Financial District/South Beach",
        business_corridor: "Chinatown",
        location: {
          type: "Point",
          coordinates: [-122.404392959, 37.791500007]
        },
        data_as_of: "2025-06-07T00:00:00.000",
        data_loaded_at: "2025-06-07T04:12:40.000"
      },
      {
        uniqueid: "test-active-business",
        ttxid: "test-123",
        certificate_number: "123456",
        ownership_name: "Active Business LLC",
        dba_name: "Active Business",
        full_business_address: "123 Main St",
        city: "San Francisco",
        state: "CA",
        business_zip: "94105",
        dba_start_date: "2023-01-01T00:00:00.000",
        location_start_date: "2023-01-01T00:00:00.000",
        naic_code: "7210",
        naic_code_description: "Professional Services",
        parking_tax: true,
        transient_occupancy_tax: false,
        supervisor_district: "1",
        neighborhoods_analysis_boundaries: "SOMA",
        location: {
          type: "Point",
          coordinates: [-122.4, 37.78]
        },
        data_as_of: "2025-06-07T00:00:00.000",
        data_loaded_at: "2025-06-07T04:12:40.000"
      }
    ];
    
    businessCollection = new BusinessCollection(mockData);
  });

  describe('constructor and basic properties', () => {
    it('should initialize with correct length', () => {
      expect(businessCollection.length).toBe(3);
    });

    it('should be iterable', () => {
      const businessNames = [];
      for (const business of businessCollection) {
        businessNames.push(business.dbaName);
      }
      
      expect(businessNames).toEqual([
        "Josh Andrews Photography",
        "Streamlined Ventures", 
        "Active Business"
      ]);
    });
  });

  describe('data transformation', () => {
    it('should transform raw data correctly', () => {
      const business = businessCollection.findById("1038156-08-151-1017634");
      
      expect(business).toMatchObject({
        id: "1038156-08-151-1017634",
        certificateNumber: "1017634",
        ownershipName: "Josh Andrews Photography",
        dbaName: "Josh Andrews Photography",
        address: {
          street: "188 South Parks St #6",
          city: "San Francisco",
          state: "CA",
          zip: "94107"
        },
        taxes: {
          parking: false,
          transientOccupancy: false
        },
        supervisorDistrict: "6",
        neighborhood: "Financial District/South Beach",
        isActive: false // has end dates
      });
    });

    it('should handle optional fields correctly', () => {
      const businessWithMailing = businessCollection.findById("1247900-03-201-1112531");
      
      expect(businessWithMailing?.mailingAddress).toEqual({
        street: "1825 Emerson St",
        city: "Palo Alto",
        state: "CA",
        zip: "94301"
      });
      
      const businessWithoutMailing = businessCollection.findById("1038156-08-151-1017634");
      expect(businessWithoutMailing?.mailingAddress).toBeUndefined();
    });

    it('should parse dates correctly', () => {
      const business = businessCollection.findById("1038156-08-151-1017634");
      
      expect(business?.dates.dbaStart).toEqual(new Date("2015-08-24T00:00:00.000"));
      expect(business?.dates.dbaEnd).toEqual(new Date("2016-05-05T00:00:00.000"));
    });
  });

  describe('countUniqueNAICs', () => {
    it('should count unique 2-digit NAIC prefixes', () => {
      const count = businessCollection.countUniqueNAICs();
      expect(count).toBe(2); // "52" and "72"
    });

    it('should handle businesses without NAIC codes', () => {
      const dataWithoutNAIC = [{
        ...mockData[0],
        naic_code: undefined
      }];
      
      const collection = new BusinessCollection(dataWithoutNAIC);
      expect(collection.countUniqueNAICs()).toBe(0);
    });
  });

  describe('active business filtering', () => {
    it('should identify active businesses correctly', () => {
      const activeBusinesses = businessCollection.getActiveBusinesses();
      expect(activeBusinesses).toHaveLength(1);
      expect(activeBusinesses[0].dbaName).toBe("Active Business");
    });

    it('should return correct active count', () => {
      expect(businessCollection.activeCount).toBe(1);
    });
  });

  describe('filtering methods', () => {
    it('should filter by NAIC code prefix', () => {
      const financialServices = businessCollection.getByNAICCode("52");
      expect(financialServices).toHaveLength(1);
      expect(financialServices[0].dbaName).toBe("Streamlined Ventures");
    });

    it('should filter by supervisor district', () => {
      const district6 = businessCollection.getBySupervisorDistrict("6");
      expect(district6).toHaveLength(1);
      expect(district6[0].dbaName).toBe("Josh Andrews Photography");
    });

    it('should filter by business corridor', () => {
      const chinatown = businessCollection.getByBusinessCorridor("Chinatown");
      expect(chinatown).toHaveLength(1);
      expect(chinatown[0].dbaName).toBe("Streamlined Ventures");
    });

    it('should filter by tax type', () => {
      const parkingTax = businessCollection.getBusinessesWithTax("parking");
      expect(parkingTax).toHaveLength(1);
      expect(parkingTax[0].dbaName).toBe("Active Business");
    });
  });

  describe('geographic queries', () => {
    it('should find businesses within radius', () => {
      // Center around San Francisco
      const nearby = businessCollection.getBusinessesInRadius(37.78, -122.4, 5);
      expect(nearby.length).toBeGreaterThan(0);
    });

    it('should return empty array when radius is too small', () => {
      const nearby = businessCollection.getBusinessesInRadius(37.78, -122.4, 0.001);
      expect(nearby).toHaveLength(0);
    });
  });

  describe('statistical methods', () => {
    it('should generate industry breakdown', () => {
      const breakdown = businessCollection.getIndustryBreakdown();
      
      expect(breakdown).toEqual({
        "Financial Services": 1,
        "Professional Services": 1,
        "Unknown": 1
      });
    });

    it('should generate district breakdown', () => {
      const breakdown = businessCollection.getDistrictBreakdown();
      
      expect(breakdown).toEqual({
        "6": 1,
        "3": 1,
        "1": 1
      });
    });
  });

  describe('find methods', () => {
    it('should find business by ID', () => {
      const business = businessCollection.findById("1038156-08-151-1017634");
      expect(business).toBeDefined();
      expect(business?.dbaName).toBe("Josh Andrews Photography");
    });

    it('should return undefined for non-existent ID', () => {
      const business = businessCollection.findById("non-existent");
      expect(business).toBeUndefined();
    });

    it('should find business by certificate number', () => {
      const business = businessCollection.findByCertificate("1017634");
      expect(business).toBeDefined();
      expect(business?.dbaName).toBe("Josh Andrews Photography");
    });
  });

  describe('edge cases', () => {
    it('should handle empty data array', () => {
      const emptyCollection = new BusinessCollection([]);
      expect(emptyCollection.length).toBe(0);
      expect(emptyCollection.countUniqueNAICs()).toBe(0);
      expect(emptyCollection.getActiveBusinesses()).toHaveLength(0);
    });

    it('should handle malformed location data', () => {
      const malformedData = [{
        ...mockData[0],
        location: undefined
      }];
      
      const collection = new BusinessCollection(malformedData);
      const business = collection.all[0];
      expect(business.location).toBeUndefined();
    });
  });
});