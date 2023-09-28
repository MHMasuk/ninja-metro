import React, { useState } from 'react';
import Slider from 'react-slider';
import { addDays, format } from 'date-fns';

const DateSlider = ({ startDate, endDate, onChange }) => {
    const [selectedDate, setSelectedDate] = useState(startDate);

    const handleSliderChange = (value) => {
        const daysToAdd = Math.round(value);
        const newDate = addDays(startDate, daysToAdd);
        setSelectedDate(newDate);
        onChange(newDate);
    };

    const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    const currentValue = Math.round((selectedDate - startDate) / (1000 * 60 * 60 * 24));

    return (
        <div>
            <h2>Date Slider</h2>
            <p>{format(selectedDate, 'MMMM d, yyyy')}</p>
            <Slider
                min={0}
                max={totalDays}
                value={currentValue}
                onChange={handleSliderChange}
            />
        </div>
    );
};

export default DateSlider;
