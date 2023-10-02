import React from 'react';

const GradientBar = ({ stops }) => {
    const barStyle = {
        background: `linear-gradient(to right, ${stops
            .map(({ color, percentage }) => `${color} ${percentage}%`)
            .join(', ')})`,
        height: '30px', // Adjust the height as needed
        position: 'relative',
    };

    return (
        <div className="w-full relative">
            <div style={barStyle}></div>
            {stops.map(({ color, percentage }, index) => (
                <div
                    key={index}
                    className="absolute top-3 transform -translate-y-1/2 text-white text-sm "
                    style={{ left: `${percentage}%` }}
                >
                    {percentage}
                </div>
            ))}
        </div>
    );
};

export default GradientBar;