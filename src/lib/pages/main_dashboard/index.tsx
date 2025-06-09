import { useNeighborhoodData, BusinessCollection } from './components/getData';
import LoadingSpinner from '../../../components/loading-spinner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TotalCountCard from './components/TotalCountCard';
import { ChartBarInteractive } from './components/MainChart';
import { ChartPieDonut } from './components/PieChart';
import { ThemeToggle } from '@/lib/components/theme-toggle';



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
    const { data: businessCollection, isLoading, error } = useNeighborhoodData(neighborhood);

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
    if (!businessCollection || businessCollection.length === 0) {
        return (
            <div className="space-y-4 px-6">
                <h1 className="text-2xl font-semibold">{neighborhood} Businesses</h1>
                <div className="text-center py-8">No businesses found in this neighborhood</div>
            </div>
        );
    }

    // Get businesses and unique NAIC count using BusinessCollection methods
    const openCloseChartData = businessCollection.getMonthlyBusinessActivity()

    return (
        <div className="space-y-2 space-x-2 md:space-y-4 md:space-x-4 px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
            <div className='flex justify-between w-full col-span-1 md:col-span-2 lg:col-span-3' >
                <h1 className="text-3xl font-semibold">{neighborhood} Businesses</h1>
                <div className='hidden md:block'>
                    <ThemeToggle />
                </div>
            </div>
            <div className='col-span-1 md:col-span-2 lg:col-span-3'>
                <ChartBarInteractive chartData={openCloseChartData} />
            </div>
            <TotalCountCard count={businessCollection.activeCount} />
            <ChartPieDonut chartConfig={businessCollection.getTopIndustries()} />
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