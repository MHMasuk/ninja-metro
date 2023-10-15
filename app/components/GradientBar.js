import React from 'react';

const GradientBar = ({ stops }) => {
    const barStyle = {
        background: `linear-gradient(to right, ${stops
            .map(({ color, percentage }) => `${color} ${percentage}%`)
            .join(', ')})`,
        height: '30px', // Adjust the height as needed
        position: 'relative',
        borderRadius: '15px', // Half of the height to make it rounded
        padding: '10px 5px', // Adjust the padding as needed to keep text inside
    };

    return (
        <div className="w-72 relative">
            <div style={barStyle}></div>
            {stops.map(({ color, percentage }, index) => {
                const leftPercentage = `${percentage}%`;

                // Check if this is the last text element
                const isLastText = index === stops.length - 1;

                // Calculate the left position for the last text element
                const leftPosition = isLastText
                    ? `calc(${leftPercentage} - 10%)`
                    : leftPercentage;

                return (
                    <div
                        key={index}
                        className="absolute top-3 transform -translate-y-1/2 text-white text-sm"
                        style={{ left: leftPosition }}
                    >
                        {percentage}
                    </div>
                );
            })}
        </div>
    );
};

export default GradientBar;
