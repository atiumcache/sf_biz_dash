import { useNeighborhoodData } from './components/getData';
import LoadingSpinner from '../../../components/loading-spinner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface BusinessData {
    uniqueid: string;
    full_business_address: string;
    neighborhoods_analysis_boundaries: string;
    naic_code?: string; // Added this since countUniqueNAICs uses it
}

// Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global defaults for all queries
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: false, // Disable refetch on window focus if desired
    },
  },
});

const DashboardContent = ({ neighborhood }: { neighborhood: string }) => {
    const { data, isLoading, error } = useNeighborhoodData(neighborhood, true);

    // Handle loading state
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Handle error state
    if (error) {
        return (
            <div className="space-y-4 px-6">
                <h1 className="text-2xl font-semibold">{neighborhood} Businesses</h1>
                <div className="text-center py-8 text-red-600">
                    Error loading data: {error.message}
                </div>
            </div>
        );
    }

    // Handle empty data
    if (!data || data.length === 0) {
        return (
            <div className="space-y-4 px-6">
                <h1 className="text-2xl font-semibold">{neighborhood} Businesses</h1>
                <div className="text-center py-8">No businesses found in this neighborhood</div>
            </div>
        );
    }

    // Count unique NAIC codes
    const uniqueNAICs = new Set<string>();
    for (const record of data) {
        if (record.naic_code) {
            uniqueNAICs.add(record.naic_code);
        }
    }

    return (
        <div className="space-y-4 px-6">
            <h1 className="text-2xl font-semibold">{neighborhood} Businesses</h1>
            <p className="text-gray-600">Total businesses: {data.length}</p>
            <p className='text-gray-600'>Unique NAIC codes: {uniqueNAICs.size}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((business: BusinessData) => (
                    <div key={business.uniqueid} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-semibold">{business.full_business_address}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Dashboard = ({ neighborhood }: { neighborhood: string }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <DashboardContent neighborhood={neighborhood} />
        </QueryClientProvider>
    );
};

export default Dashboard;