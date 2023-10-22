

import React, { useState } from 'react';
import { Slider, Tooltip, Whisper, Button, Popover } from 'rsuite';

const RsuiteSlider = () => {
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

    const dateToValue = (date) => dateRange.indexOf(date);
    const valueToDate = (value) => dateRange[value];

    const [value, setValue] = useState(dateToValue(dateRange[0]));

    const tooltip = (
        <Popover>
            {dateRange[value]}
        </Popover>
    );

    return (
        <div className="p-8" >
            <Slider
                defaultValue={dateToValue(dateRange[0])}
                className="custom-slider"
                min={0}
                max={dateRange.length - 1}
                progress
                renderMark={(mark) => dateRange[mark]}
                handleStyle={{
                    borderRadius: 10,
                    color: '#fff',
                    fontSize: 12,
                    width: 100,
                    height: 22
                }}
                handleTitle={
                    <div>{dateRange[value]}</div>
                }
                tooltip={false}
                value={value}
                onChange={(newValue) => setValue(newValue)}
            />
            <div className="tooltip">
                Selected Date: {valueToDate(value)}
            </div>
        </div>
    );
};

export default RsuiteSlider;