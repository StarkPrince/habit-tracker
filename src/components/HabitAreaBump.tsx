// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bump
import { ResponsiveAreaBump } from '@nivo/bump';
import { ResponsiveContainer } from 'recharts';
// Define the structure for individual data points
type DataPoint = {
    x: string | number;
    y: number;
};
type DataEntry = {
    id: string;
    data: DataPoint[];
};

/**
 * Converts an array of ISO timestamp strings into the desired time-based data structure.
 * 
 * @param timestamps - An array of ISO timestamp strings.
 * @returns An array of DataEntry objects structured by year and month.
 */
function convertTimestampsToTimeCategories(timestamps: string[]): DataEntry[]
{
    const monthNames = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const dataMap: Map<string, Map<string, number>> = new Map();

    if (!timestamps || timestamps.length === 0) {
        return [];
    }

    // Process each timestamp
    timestamps.forEach(ts =>
    {
        const date = new Date(ts);
        if (isNaN(date.getTime())) {
            // Invalid date, skip
            return;
        }

        const year = date.getUTCFullYear().toString();
        const month = monthNames[date.getUTCMonth()]; // getUTCMonth() returns 0-11

        // Initialize year in dataMap if not present
        if (!dataMap.has(year)) {
            dataMap.set(year, new Map());
        }

        const yearMap = dataMap.get(year)!;

        // Initialize month in yearMap if not present
        if (!yearMap.has(month)) {
            yearMap.set(month, 0);
        }

        // Increment the count for the month
        yearMap.set(month, yearMap.get(month)! + 1);
    });

    // Convert the dataMap into the desired DataEntry array
    const result: DataEntry[] = [];

    dataMap.forEach((monthMap, year) =>
    {
        const dataPoints: DataPoint[] = [];

        monthNames.forEach(month =>
        {
            const count = monthMap.get(month) || 0;
            dataPoints.push({
                x: month,
                y: count
            });
        });

        result.push({
            id: year,
            data: dataPoints
        });
    });

    return result;
}


const MyResponsiveAreaBump = ({ habit }) =>
{
    const data = convertTimestampsToTimeCategories(habit.logs);
    return (
        <ResponsiveContainer width="100%" height={400}>
            <ResponsiveAreaBump
                data={data}
                margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
                spacing={8}
                colors={{ scheme: 'nivo' }}
                blendMode="multiply"
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: '#38bcb2',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: '#eed312',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'CoffeeScript'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'TypeScript'
                        },
                        id: 'lines'
                    }
                ]}
                axisTop={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '',
                    legendPosition: 'middle',
                    legendOffset: -36,
                    truncateTickAt: 0
                }}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '',
                    legendPosition: 'middle',
                    legendOffset: 32,
                    truncateTickAt: 0
                }}
            />
        </ResponsiveContainer>
    )
}

export default MyResponsiveAreaBump;