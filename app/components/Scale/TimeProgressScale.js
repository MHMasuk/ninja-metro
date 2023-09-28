import React, { useEffect, useRef, useState } from 'react';
import { scaleTime } from 'd3-scale';
import { timeFormat } from 'd3-time-format';

const TimeProgressScale = ({ startDate, endDate }) => {
    const svgRef = useRef(null);
    const [progressWidth, setProgressWidth] = useState(0);
    const [dateLabels, setDateLabels] = useState([]);

    useEffect(() => {
        // Create a time scale
        const xScale = scaleTime()
            .domain([new Date(2023, 0, 1), new Date(2023, 11, 31)]) // Set the time domain
            .range([0, 500]); // Set the output range (pixel values)

        // Calculate the progress based on the provided start and end dates
        const start = xScale(startDate);
        const end = xScale(endDate);

        // Calculate the progress width as a percentage
        const width = (end - start) / 500 * 100;
        setProgressWidth(width);

        // Generate date labels for the entire year
        const formatDate = timeFormat('%b %d'); // Format: Jan 01
        const dates = [];
        const currentDate = new Date(2023, 0, 1); // January 1, 2023
        while (currentDate <= new Date(2023, 11, 31)) {
            dates.push({
                date: formatDate(currentDate),
                day: currentDate.getDate(),
                x: xScale(currentDate),
            });
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
        setDateLabels(dates);
    }, [startDate, endDate]);

    return (
        <div className="progress-bar-container">
            <svg ref={svgRef} width={500} height={40}>
                {/* Background */}
                <rect x={0} y={0} width={500} height={20} fill="#f0f0f0" />

                {/* Progress bar */}
                <rect x={0} y={0} width={`${progressWidth}%`} height={20} fill="#007bff" />

                {/* Date and day labels */}
                {dateLabels.map((label) => (
                    <g key={label.date}>
                        <text x={label.x} y={25} textAnchor="middle" fill="#333">
                            {label.date}
                        </text>
                        <text x={label.x} y={35} textAnchor="middle" fill="#555">
                            {label.day}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default TimeProgressScale;