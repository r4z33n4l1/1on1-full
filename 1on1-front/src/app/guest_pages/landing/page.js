'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import getOwnerPreferences, { postGuestPreferences, declineInvitation } from '../component.js';
import styles from '../../../components/styles.module.css';

const convertTo12HourFormat = (time24h) => {
	let [hours, minutes] = time24h.split(':');
	let modifier = 'AM';
	if (hours === '00') hours = '12';
	hours = parseInt(hours, 10)
	if (hours > 12) {
		hours -= 12;
		modifier = 'PM';
	}
	return `${hours}:${minutes} ${modifier}`;
};

function SchedulePage() {
    const searchParams = useSearchParams();
    const uuid = `${searchParams.get('uuid')}`;

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateTimes, setSelectedDateTimes] = useState([]);
    const [ownerPreferences, setOwnerPreferences] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [preferences, setPreferences] = useState({ non_busy_dates: [] });
	const [showDeclineConfirmation, setShowDeclineConfirmation] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getOwnerPreferences({ uuid });
                setOwnerPreferences(response);
            } catch (error) {
                console.error('Invalid uuid:', error);
            }
        };

        if (uuid) {
            fetchData();
        }
    }, [uuid]);

    useEffect(() => {
        const getSmallestAndLargestDates = (dates) => {
            if (dates.length === 0) {
                return [null, null];
            }
            const sortedDates = dates.sort();
            const smallestDate = sortedDates[0];
            const largestDate = sortedDates[sortedDates.length - 1];
            return [smallestDate, largestDate];
        };

        const dates = Object.keys(ownerPreferences);
        const [smallestDate, largestDate] = getSmallestAndLargestDates(dates);
        setStartDate(smallestDate);
        setEndDate(largestDate);
        setSelectedDate(new Date(smallestDate));
    }, [ownerPreferences]);

    const onChange = (date) => {
        const selectedDateString = date.toISOString().split('T')[0];
        const selectedDateTimes = ownerPreferences[selectedDateString] || [];
        const sortedTimes = selectedDateTimes.slice().sort();
		setSelectedDate((new Date(new Date(selectedDateString).getTime() + 86400000)).toISOString().split('T')[0]);
        setSelectedDateTimes(sortedTimes);
		setOpenDropdown(null);
    };

    const handleTimeClick = (time) => {
        setOpenDropdown(openDropdown === time ? null : time);
    };

	const handlePreferenceClick = (preference) => {
		const dateKey = (new Date(new Date(selectedDate).getTime() - 86400000)).toISOString().split('T')[0];
		const existingDateIndex = preferences.non_busy_dates.findIndex(item => item.date === dateKey);
		const timePreference = {
			time: openDropdown,
			preference: preference.toLowerCase()
		};
	
		if (existingDateIndex !== -1) {
			const existingDate = preferences.non_busy_dates[existingDateIndex];
			const existingTimeIndex = existingDate.non_busy_times.findIndex(item => item.time === openDropdown);
	
			if (existingTimeIndex !== -1) {
				preferences.non_busy_dates[existingDateIndex].non_busy_times[existingTimeIndex].preference = preference;
			} else {
				preferences.non_busy_dates[existingDateIndex].non_busy_times.push(timePreference);
			}
		} else {
			preferences.non_busy_dates.push({
				date: dateKey,
				non_busy_times: [timePreference]
			});
		}
	
		setPreferences({...preferences});
		console.log(preferences);
	};

    const handleNextButtonClick = async () => {
        try {
            const response = await postGuestPreferences({ uuid, preferences });
            console.log('Preferences updated:', response);
        } catch (error) {
            console.error('Error updating preferences:', error);
        }
    };

    const handleDeclineButtonClick = async () => {
        if (!showDeclineConfirmation) {
            setShowDeclineConfirmation(true);
        } else {
            try {
                const response = await declineInvitation({ uuid });
                console.log('Declined', response);
                setShowDeclineConfirmation(false);
            } catch (error) {
                console.error('Error declining:', error);
            }
        }
    };
	if (ownerPreferences === false) {
		return (<p>You have already declined this calendar invite!</p>);
	}
    return (
        <div className={styles.calendarContainer}>
            <div className={styles.calendarItem}>
                <Calendar
                    onClickDay={onChange}
                    value={selectedDate}
                    minDate={new Date(new Date(startDate).getTime() + 86400000)}
                    maxDate={new Date(new Date(endDate).getTime() + 86400000)}
                    tileDisabled={({ date }) => {
                        const tileDate = date.toDateString();
                        const dates = Object.keys(ownerPreferences);
                        const formattedDates = dates.map(dateString => new Date(new Date(dateString).getTime() + 86400000).toDateString());
                        return !formattedDates.includes(tileDate);
                    }}
                />
            </div>
            <div>
                {selectedDateTimes.map((time, index) => (
                    <div key={index} className={styles.time}>
						<button onClick={() => handleTimeClick(time)}>
							{convertTo12HourFormat(time)}
						</button>
                        {openDropdown === time && (
                            <div>
                                <button onClick={() => handlePreferenceClick('High')}>High</button><br />
                                <button onClick={() => handlePreferenceClick('Medium')}>Medium</button><br />
                                <button onClick={() => handlePreferenceClick('Low')}>Low</button><br />
                            </div>
                        )}
                    </div>
                ))}
            </div>
			<button onClick={handleNextButtonClick}>Next</button>
			<button onClick={handleDeclineButtonClick}>
                {'Decline'}
            </button>
            {showDeclineConfirmation && (
                <div>
                    <p>Are you sure you want to decline?</p>
					<button onClick={() => setShowDeclineConfirmation(false)}>Back</button>
                    <button onClick={handleDeclineButtonClick}>Decline</button>
                </div>
            )}
        </div>
    );
}

export default SchedulePage;