import React, {useState} from 'react';
import {Slider, Popover} from 'rsuite';
import {IconButton} from "@material-tailwind/react";
import {PlayIcon} from "@heroicons/react/20/solid";

const RsuiteSliderNew = () => {


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

    const dateTimeValues = dateRange.reduce((acc, date) => {
        return acc.concat(timesPerDay.map(time => `${date} ${time}`));
    }, []);

    const dateTimeToValue = (dateTime) => {
        return dateTimeValues.indexOf(dateTime);
    };

    const valueToDateTime = (value) => {
        return dateTimeValues[value];
    };


    const [value, setValue] = useState(dateTimeToValue(dateTimeValues[0]));

    const customTooltip = (
        valueToDateTime(value)
    );

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = {weekday: 'short', month: 'short', day: 'numeric'};
        return date.toLocaleString('en-US', options);
    };

    const dayDividerStyle = {
        width: `${100 / (dateRange.length - 1)}%`,
        height: '10px',  // Adjust the height as needed
        borderRight: '1px solid #000000',  // Adjust the border style and color as needed
    };

    return (
        <div className="flex justify-between items-center">
            <div className="mr-3">
                <IconButton
                    className="rounded-full"
                    size="md">
                    <PlayIcon className="h-5 w-5"/>
                </IconButton>
            </div>
            <div className="w-full">
                <Slider
                    defaultValue={dateTimeToValue(dateTimeValues[0])}
                    className="custom-slider"
                    min={0}
                    max={dateTimeValues.length - 1}
                    progress
                    // renderMark={(mark) => dateTimeValues[mark]}
                    handleStyle={{
                        borderRadius: 5,
                        color: '#fff',
                        fontSize: 12,
                        width: 130,
                    }}
                    handleTitle={customTooltip}
                    tooltip={false}
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                />
                <div className="flex justify-between">
                    {dateRange.map((date, index) => (
                        <div key={index} className="flex text-lg text-black"
                             style={{width: `${100 / (dateRange.length - 1)}%`}}>|<span
                            className="text-xs items-center py-2"> {formatDate(date)}</span></div>
                    ))}
                    {timesPerDay.map((time, index) => (
                        <div key={index} className="line"></div>
                    ))}
                </div>
                {/*<div className="w-full flex text-xs">*/}
                {/*    {dateRange.map((date, index) => (*/}
                {/*        <React.Fragment key={index}>*/}
                {/*            {index < dateRange.length && (*/}
                {/*                <p className="text-lg" style={{ width: `${100 / (dateRange.length - 1)}%` }}>| <span className="text-xs"> {formatDate(date)}</span></p>*/}
                {/*            )}*/}
                {/*            /!*{index < dateRange.length - 1 && (*!/*/}
                {/*            /!*    <div style={dayDividerStyle}></div>*!/*/}
                {/*            /!*)}*!/*/}
                {/*        </React.Fragment>*/}
                {/*    ))}*/}
                {/*</div>*/}
                {/*<div className="tooltip">*/}
                {/*    Selected Date & Time: {valueToDateTime(value)}*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default RsuiteSliderNew;