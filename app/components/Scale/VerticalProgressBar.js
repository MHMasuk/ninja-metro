import React from 'react';

const VerticalProgressBar = ({ percentage }) => {
    return (
        <div className="relative h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
            <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                style={{ width: `${percentage}%` }}
            ></div>
            <div className="flex items-center justify-center h-full text-white">
                {percentage}%
            </div>
        </div>
    );
};

export default VerticalProgressBar;