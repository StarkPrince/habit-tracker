import { NivoWrapper } from '@/components/ui/nivo-wrapper';
import { calculateStreaks } from '@/utils/streakCalculation';
import { ResponsiveLine } from '@nivo/line';

const HabitStreakAnalysis = ({ habit }) =>
{
    const streakData = calculateStreaks(habit.logs);

    return (
        <NivoWrapper height={400}>
            <ResponsiveLine
                data={[
                    {
                        id: 'Streak Length',
                        data: streakData.map((streak, index) => ({
                            x: index,
                            y: streak.length
                        }))
                    }
                ]}
                margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
                yScale={{ type: 'linear', min: 0 }}
                axisBottom={{ legend: 'Streak Number' }}
                axisLeft={{ legend: 'Days' }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
            />
        </NivoWrapper>
    );
};

export default HabitStreakAnalysis;