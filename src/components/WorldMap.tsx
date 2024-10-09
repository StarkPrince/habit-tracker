// Import Statements
import { geoCentroid } from 'd3-geo';
import { scaleSequential } from 'd3-scale';
import { interpolateOranges } from 'd3-scale-chromatic'; // Vibrant interpolator
import { useMemo, useState } from 'react';
import
{
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
} from 'react-simple-maps';

import geoUrl from "@/public/world-countries.json";
import userData from "./userData.json"; // Adjust the path based on your project structure

// Function to process user data
const processData = (data) =>
{
    return data.reduce((acc, item) =>
    {
        acc[item.country] = item.locations.reduce((sum, loc) => sum + loc.user, 0);
        return acc;
    }, {});
};

const getMaxUsers = (data) =>
{
    const counts = data.map(item => item.locations.reduce((sum, loc) => sum + loc.user, 0));
    return Math.max(...counts, 1); // Ensure at least 1 to avoid domain issues
};

export default function WorldMapUserDistribution()
{
    // Processed Data
    const processedData = useMemo(() => processData(userData), [userData]);
    const maxUsers = useMemo(() => getMaxUsers(userData), [userData]);

    // Define the color scale with dynamic domain
    const colorScale = useMemo(() =>
        scaleSequential(interpolateOranges)
            .domain([0, maxUsers]),
        [maxUsers]
    );

    // State for tooltip
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipVisible, setTooltipVisible] = useState(false);

    // State for zoom
    const [position, setPosition] = useState({ coordinates: [73, 20], zoom: 2 });

    // Handlers for mouse events on countries
    const handleCountryMouseEnter = (geo, event) =>
    {
        const countryName = geo.properties.name;
        const userCount = processedData[countryName] || 0;
        setTooltipContent(`${countryName} — Users: ${userCount}`);
        setTooltipVisible(true);
    };

    const handleCountryMouseMove = (event) =>
    {
        setTooltipPosition({ x: event.userX, y: event.userY });
    };

    const handleCountryMouseLeave = () =>
    {
        setTooltipVisible(false);
    };

    // Handlers for mouse events on cities
    const handleCityMouseEnter = (city, event) =>
    {
        const { name, user } = city;
        setTooltipContent(`${name} — Users: ${user}`);
        setTooltipVisible(true);
    };

    const handleCityMouseMove = (event) =>
    {
        setTooltipPosition({ x: event.userX, y: event.userY });
    };

    const handleCityMouseLeave = () =>
    {
        setTooltipVisible(false);
    };

    // Handler for clicking a country to zoom
    const handleCountryClick = (geo) =>
    {
        const centroid = geoCentroid(geo);
        setPosition({
            coordinates: centroid,
            zoom: 5, // Adjust zoom level as needed
        });
    };

    // Handler for clicking a city to zoom (Optional)
    const handleCityClick = (city) =>
    {
        setPosition({
            coordinates: city.coordinates,
            zoom: 6, // Higher zoom level for cities
        });
    };

    // Handler to reset zoom
    const handleResetZoom = () =>
    {
        setPosition({ coordinates: [73, 20], zoom: 2 });
    };


    return (
        <div className="w-full h-auto relative">
            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-center">Global User Distribution</h2>

            {/* Map */}
            <ComposableMap
                projection="geoMercator"
                style={{
                    width: "100%", // Maintain full width responsiveness
                    maxHeight: "66vh", // Maximum height is two-thirds of the viewport height
                    height: "auto", // Automatically adjust the height to maintain aspect ratio
                    backgroundColor: "#ADD8E6", // Light blue for ocean
                    overflow: "hidden" // Prevent any overflow issues
                }}
            >
                <ZoomableGroup
                    center={position.coordinates}
                    zoom={position.zoom}
                    onMoveEnd={(newPosition) => setPosition(newPosition)}
                >
                    {/* Countries */}
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) =>
                            {
                                const countryName = geo.properties.name;
                                const userCount = processedData[countryName] || 0;
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={userCount > 0 ? colorScale(userCount) : "#F0F0F0"} // 
                                        stroke="#333" // Darker stroke color for borders
                                        strokeWidth={0.7}
                                        onMouseEnter={(event) => handleCountryMouseEnter(geo, event)}
                                        onMouseMove={handleCountryMouseMove}
                                        onMouseLeave={handleCountryMouseLeave}
                                        onClick={() => handleCountryClick(geo)}
                                        style={{
                                            default: { outline: 'none' },
                                            hover: { fill: "#FF5722", outline: 'none' }, // Vibrant orange on hover
                                            pressed: { outline: 'none' }
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            {/* Tooltip */}
            {tooltipVisible && (
                <div
                    className="absolute pointer-events-none bg-white text-gray-800 text-sm px-2 py-1 rounded shadow-lg"
                    style={{ top: tooltipPosition.y + 10, left: tooltipPosition.x + 10 }}
                >
                    {tooltipContent}
                </div>
            )}

            {/* Reset Zoom Button */}
            {position.zoom > 1 && (
                <button
                    onClick={handleResetZoom}
                    className="absolute top-4 right-4 bg-white text-gray-800 px-3 py-1 rounded shadow"
                >
                    Reset Zoom
                </button>
            )}

            {/* Legend */}
            <div className="mt-4 flex justify-center items-center space-x-4">
                <span className="text-sm">Fewer Users</span>
                <div className="w-48 h-4 bg-gradient-to-r from-yellow-200 to-orange-600 rounded"></div>
                <span className="text-sm">More Users</span>
            </div>
        </div>
    );
}
