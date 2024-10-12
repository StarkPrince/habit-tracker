import { ResponsiveBoxPlot } from '@nivo/boxplot';


const convertTimestamps = (timestamps) =>
{
    return timestamps.map(timestamp =>
    {
        const date = new Date(timestamp);
        const hour = date.getHours();

        return {
            group: "TimeLog",
            subgroup: getDayPeriod(hour),
            year: date.getFullYear(),
            month: date.toLocaleString('default', { month: 'long' }),
            day: date.getDate(),
            weekday: date.toLocaleString('default', { weekday: 'long' }),
            hour: hour,
            minute: date.getMinutes(),
            second: date.getSeconds(),
            week: getWeekNumber(date),
            quarter: Math.floor(date.getMonth() / 3) + 1,
            isWeekend: (date.getDay() === 0 || date.getDay() === 6),
            moonPhase: getMoonPhase(date),
            value: Math.random() * 10  // Random value between 0 and 10
        };
    });
};

const getDayPeriod = (hour) =>
{
    if (hour < 6) return "Night";
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
};

const getWeekNumber = (date) =>
{
    const d: any = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart: any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const getMoonPhase = (date) =>
{
    const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
        'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    let year = date.getFullYear();
    let month = date.getMonth();
    const day = date.getDate();
    let c = 0, e = 0, jd = 0, b = 0

    if (month < 3) {
        year--;
        month += 12;
    }

    ++month;
    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + day - 694039.09;
    jd /= 29.5305882;
    b = Math.floor(jd);
    jd -= b;
    b = Math.round(jd * 8);
    if (b >= 8) b = 0;

    return phases[b];
};

// Example usage:
const timestamps = [
    "2024-10-12T08:30:00Z",
    "2024-10-12T14:45:00Z",
    "2024-10-13T23:15:00Z"
];

const data = convertTimestamps(timestamps);

const MyResponsiveBoxPlot = (habit) => (
    <div className="h-96">
        <ResponsiveBoxPlot
            data={data}
            margin={{ top: 60, right: 140, bottom: 60, left: 60 }}
            minValue={0}
            maxValue={10}
            subGroupBy="subgroup"
            padding={0.12}
            enableGridX={true}
            axisTop={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendOffset: 36,
                truncateTickAt: 0
            }}
            axisRight={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendOffset: 0,
                truncateTickAt: 0
            }}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'group',
                legendPosition: 'middle',
                legendOffset: 32,
                truncateTickAt: 0
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'value',
                legendPosition: 'middle',
                legendOffset: -40,
                truncateTickAt: 0
            }}
            colors={{ scheme: 'nivo' }}
            borderRadius={2}
            borderWidth={2}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.3
                    ]
                ]
            }}
            medianWidth={2}
            medianColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.3
                    ]
                ]
            }}
            whiskerEndSize={0.6}
            whiskerColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.3
                    ]
                ]
            }}
            motionConfig="stiff"
            legends={[
                {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemWidth: 60,
                    itemHeight: 20,
                    itemsSpacing: 3,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    symbolSize: 20,
                    symbolShape: 'square',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
            ]}
        />
    </div>
)

export default MyResponsiveBoxPlot