import { NivoWrapper } from '@/components/ui/nivo-wrapper';
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

const HabitBoxPlot = ({ habit }) =>
{
    const data = habit.logs.map(timestamp => ({
        group: 'Time Distribution',
        value: new Date(timestamp).getHours() + (new Date(timestamp).getMinutes() / 60)
    }));

    return (
        <NivoWrapper height={400}>
            <ResponsiveBoxPlot
                data={data}
                margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
                minValue={0}
                maxValue={24}
                valueFormat={value => `${Math.floor(value)}:${Math.round((value % 1) * 60).toString().padStart(2, '0')}`}
                axisBottom={{
                    legend: 'Hour of Day',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
            />
        </NivoWrapper>
    );
};

export default HabitBoxPlot;