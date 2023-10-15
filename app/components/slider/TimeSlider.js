import React, { useState, useRef } from 'react';

const TimeSlider = () => {
    const [selectedDateTime, setSelectedDateTime] = useState(0);
    const sliderRef = useRef(null);

    // Replace this with your data or API calls
    const dateRange = [
        '2023-10-01',
        '2023-10-02',
        '2023-10-03',
        '2023-10-04',
        '2023-10-05',
        '2023-10-06',
        '2023-10-07',
        '2023-10-08',
        '2023-10-09',
        '2023-10-10',
    ];

    const timesPerDay = [
        '12:00 AM',
        '6:00 AM',
        '12:00 PM',
        '6:00 PM',
    ];

    const handleDateTimeChange = (e) => {
        setSelectedDateTime(e.target.value);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleString('en-US', options);
    };

    const renderDateMarks = () => {
        return dateRange.map((date, index) => (
            <span
                key={index}
                className={`slider-mark ${index === selectedDateTime ? 'slider-mark-active' : ''}`}
                style={{ left: `${(100 / (dateRange.length - 1)) * index}%` }}
            >
                <div className="slider-tooltip">{formatDate(date + ' ' + timesPerDay[selectedDateTime % timesPerDay.length])}</div>
            </span>
        ));
    };

    const renderDateRange = () => {
        return dateRange.map((date, index) => (
            <span
                key={index}
                className="slider-date-range"
                style={{ left: `${(100 / (dateRange.length - 1)) * index}%` }}
            >
                {formatDate(date)}
            </span>
        ));
    };

    return (
        <div className="p-4">
            <div className="mb-4 relative">
                <label className="block text-gray-700 font-bold text-sm mb-2">Date and Time:</label>
                <input
                    type="range"
                    min="0"
                    max={dateRange.length * timesPerDay.length - 1}
                    value={selectedDateTime}
                    onChange={handleDateTimeChange}
                    className="slider w-full"
                    ref={sliderRef}
                />
                <div className="slider-marks">{renderDateMarks()}</div>
                <div className="slider-date-range-container">
                    {renderDateRange()}
                </div>
            </div>
        </div>
    );
};

export default TimeSlider;






