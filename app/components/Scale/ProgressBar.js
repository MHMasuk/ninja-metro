import React from 'react';

const ProgressBar = ({ data }) => {
    return (
        <div>
            {data.map((item, index) => (
                <div key={index} className="relative h-8 rounded-full mb-4">
                    <div
                        className={`absolute top-0 left-0 h-full rounded-full w-${item.percentage} bg-${item.color}`}
                    ></div>
                    <div className="flex items-center justify-center h-full">
                        {item.percentage}%
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;
