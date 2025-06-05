import { getData } from './components/getData';
import { Suspense } from 'react';
import LoadingSpinner from '../../../components/loading-spinner';

interface BusinessData {
    uniqueid: string;
    full_business_address: string;
    neighborhoods_analysis_boundaries: string;
}

const DashboardContent = ({ data, neighborhood }: { data: Promise<BusinessData[]>; neighborhood: string }) => {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">{neighborhood} Businesses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.then((resolvedData) => {
                    if (resolvedData.length === 0) {
                        return <div className="text-center py-8">No businesses found in this neighborhood</div>;
                    }
                    return resolvedData.map((business: BusinessData) => (
                        <div key={business.uniqueid} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h3 className="font-semibold">{business.full_business_address}</h3>
                        </div>
                    ));
                })}
            </div>
        </div>
    )
}

const Dashboard = ({ neighborhood }: { neighborhood: string }) => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <DashboardContent 
                data={getData(neighborhood)}
                neighborhood={neighborhood}
            />
        </Suspense>
    )
}

export default Dashboard;