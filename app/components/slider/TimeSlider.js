// import React, {useState, useRef} from 'react';
//
// const TimeSlider = () => {
//     const [selectedDateTime, setSelectedDateTime] = useState(0);
//     const sliderRef = useRef(null);
//
//     // Replace this with your data or API calls
//     const dateRange = [
//         '2023-10-01',
//         '2023-10-02',
//         '2023-10-03',
//         '2023-10-04',
//         '2023-10-05',
//         '2023-10-06',
//         '2023-10-07',
//         '2023-10-08',
//         '2023-10-09',
//         '2023-10-10',
//     ];
//
//     const timesPerDay = [
//         '12:00 AM',
//         '6:00 AM',
//         '12:00 PM',
//         '6:00 PM',
//     ];
//
//     const handleDateTimeChange = (e) => {
//         setSelectedDateTime(e.target.value);
//     };
//
//     const formatDate = (dateStr) => {
//         const date = new Date(dateStr);
//         const options = {month: 'short', day: 'numeric'};
//         return date.toLocaleString('en-US', options);
//     };
//
//     // const renderDateMarks = () => {
//     //     return dateRange.map((date, index) => (
//     //         <span
//     //             key={index}
//     //             className={`slider-mark ${index === selectedDateTime ? 'slider-mark-active' : ''}`}
//     //             style={{ left: `${(100 / (dateRange.length - 1)) * index}%` }}
//     //         >
//     //             <div className="slider-tooltip">{formatDate(date + ' ' + timesPerDay[selectedDateTime % timesPerDay.length])}</div>
//     //         </span>
//     //     ));
//     // };
//
//     const renderDateMarks = () => {
//         return dateRange.map((date, index) => (
//             <span
//                 key={index}
//                 className={`slider-mark ${index === selectedDateTime ? 'slider-mark-active' : ''}`}
//                 style={{left: `${(100 / (dateRange.length - 1)) * index}%`}}
//             >
//             <div className="slider-tooltip">
//                 {formatDate(date)}
//                 <br/>
//                 {timesPerDay[selectedDateTime % timesPerDay.length]}
//             </div>
//         </span>
//         ));
//     };
//
//     const renderDateRange = () => {
//         return dateRange.map((date, index) => (
//             <span
//                 key={index}
//                 className="slider-date-range"
//                 style={{left: `${(100 / (dateRange.length - 1)) * index}%`}}
//             >
//                 {formatDate(date)}
//             </span>
//         ));
//     };
//
//     // const renderSelectedDateTime = () => {
//     //     const selectedDate = dateRange[Math.floor(selectedDateTime / timesPerDay.length)];
//     //     const selectedTime = timesPerDay[selectedDateTime % timesPerDay.length];
//     //     const formattedDate = formatDate(selectedDate);
//     //     const formattedTime = selectedTime;
//     //     return (
//     //         <div className="selected-date-time">
//     //             Selected Date and Time: {formattedDate} - {formattedTime}
//     //         </div>
//     //     );
//     // };
//
//
//     const renderSelectedDateTime = () => {
//         const selectedDate = dateRange[Math.floor(selectedDateTime / timesPerDay.length)];
//         const selectedTime = timesPerDay[selectedDateTime % timesPerDay.length];
//         const formattedDate = formatDate(selectedDate);
//         const formattedTime = selectedTime;
//
//         // Calculate the left position based on the selectedDateTime
//         const leftPosition = (100 / (dateRange.length * timesPerDay.length - 1)) * selectedDateTime + '%';
//
//         return (
//             <div className="selected-date-time" style={{left: leftPosition}}>
//                 Date and Time: {formattedDate} - {formattedTime}
//             </div>
//         );
//     };
//
//
//     return (
//         <div className="p-2">
//             <div className="mb-1 relative">
//                 <label className="block text-black-700 font-bold text-sm mb-2">{renderSelectedDateTime()}</label>
//                 <input
//                     type="range"
//                     min="0"
//                     max={dateRange.length * timesPerDay.length - 1}
//                     value={selectedDateTime}
//                     onChange={handleDateTimeChange}
//                     className="slider w-full"
//                     list="tickmarks"
//                     ref={sliderRef}
//                 />
//                 {/*<div className="slider-marks">{renderDateMarks()}</div>*/}
//                 <div className="w-full flex justify-between text-xs px-2 -mt-1">
//                     <span>|</span>
//                     <span>|</span>
//                     <span>|</span>
//                     <span>|</span>
//                     <span>|</span>
//                     <span>|</span>
//                     <span>|</span>
//                     <span>|</span>
//                     <span>|</span>
//                     <span>|</span>
//                 </div>
//                 <div className="slider-date-range-container">
//                     {renderDateRange()}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default TimeSlider;
//
//
//


import React, {useState, useRef, useEffect} from 'react';
import {
    PlayCircleIcon, PlusIcon
} from "@heroicons/react/24/solid";
import {IconButton} from "@material-tailwind/react";
import {PlayIcon} from "@heroicons/react/20/solid";

const TimeSlider = () => {
    const [selectedDateTime, setSelectedDateTime] = useState(0);
    const sliderRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

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
        const options = {month: 'short', day: 'numeric'};
        return date.toLocaleString('en-US', options);
    };

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                // Update selectedDateTime to move the slider
                setSelectedDateTime((prevSelectedDateTime) => {
                    const nextValue = prevSelectedDateTime + 1;
                    if (nextValue > dateRange.length * timesPerDay.length - 1) {
                        setIsPlaying(false);
                        clearInterval(interval);
                        return prevSelectedDateTime;
                    }
                    return nextValue;
                });
            }, 500); // Adjust the interval as needed (in milliseconds)
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isPlaying]);

    const renderDateRange = () => {
        return dateRange.map((date, index) => (
            <span
                key={index}
                className="slider-date-range"
                style={{left: `${(100 / (dateRange.length - 1)) * index}%`}}
            >
                {formatDate(date)}
            </span>
        ));
    };

    const renderSelectedDateTime = () => {
        const selectedDate = dateRange[Math.floor(selectedDateTime / timesPerDay.length)];
        const selectedTime = timesPerDay[selectedDateTime % timesPerDay.length];
        const formattedDate = formatDate(selectedDate);
        const formattedTime = selectedTime;

        // Calculate the left position based on the selectedDateTime
        const leftPosition = (100 / (dateRange.length * timesPerDay.length - 1)) * selectedDateTime + '%';

        return (
            <div className="selected-date-time" style={{left: leftPosition}}>
                Date and Time: {formattedDate} - {formattedTime}
            </div>
        );
    };

    return (
        <div className="flex justify-between items-center">
            <div className="mr-3">
                <IconButton
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`rounded-full ${isPlaying ? 'playing' : ''}`}
                    size="md">
                    <PlayIcon className="h-5 w-5"/>
                </IconButton>
            </div>
            <div className="w-full">
                <div className="mb-1 relative">

                    <label className="block text-black-700 font-bold text-sm mb-2">
                        {renderSelectedDateTime()}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max={dateRange.length * timesPerDay.length - 1}
                        value={selectedDateTime}
                        onChange={handleDateTimeChange}
                        className="slider w-full"
                        ref={sliderRef}
                    />
                    <div className="w-full flex justify-between text-xs px-2 -mt-1">
                        {dateRange.map((time, index) => (
                            <span key={index}>|</span>
                        ))}
                    </div>
                    <div className="slider-date-range-container">{renderDateRange()}</div>
                </div>
            </div>
        </div>
    );
};

export default TimeSlider;

