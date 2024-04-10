import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './styles.module.css';
import { useAuth } from '@/utils/authContext';
import { useRouter } from "next/navigation";



export async function isValidCalendarId(calendarId, access) {
    try {

        const authToken = access;
        const response = await fetch('http://127.0.0.1:8000/calendars/all/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        });
        const data = await response.json();
        return data.results.some(calendar => calendar.id.toString() === calendarId);

    } catch (error) {
        console.error('Error fetching calendars:', error);
        throw error;
    }
}

export function CalendarView({ id, showPreferences = true }) {

    console.log('component id', id);
    const [calendarData, setCalendarData] = useState([]);
    const [calendarPreferences, setCalendarPreferences] = useState([]);
    const [value, onChange] = useState(new Date());
    const { accessToken } = useAuth();

    useEffect(() => {
        const fetchData = async (url, setData) => {
            try {
                const authToken = accessToken;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });
                const responseData = await response.json();
                const { results } = responseData;
                setData(results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData('http://127.0.0.1:8000/calendars/all/', setCalendarData);
        fetchData('http://127.0.0.1:8000/calendars/user-calendars/', setCalendarPreferences);
    }, []);

    console.log(calendarData);
    let id_data = ''
    let id_preference = ''

    calendarData?.map((dataItem, index) => {

        if (dataItem.id == id) {
            id_data = dataItem;
            id_preference = calendarPreferences[index];
        }

    }
    )

    console.log(id_data, id_preference);
    const combinedData = { ...id_data, ...id_preference };


    const sortPreferences = (preferences) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return preferences.sort((a, b) => priorityOrder[a.preference] - priorityOrder[b.preference]);
    };


    return (
        <div className={styles.calendarContainer}>
            {combinedData ? (
                <CalendarItem key={combinedData.id} item={combinedData} onChange={onChange} value={value} sortPreferences={sortPreferences} showPreferences = {showPreferences} />
            ) : (
                <p>No calendar data available.</p>
            )}
        </div>
    );
}

function CalendarItem({ item, onChange, value, sortPreferences, showPreferences }) {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedPreferences, setSelectedPreferences] = useState([]);

    const getPreferencesForDate = (date) => {
        const tileDate = date.toDateString();

        if (!item.non_busy_dates) {
            return [];
        }

        const shiftedNonBusyDates = item.non_busy_dates.map(nonBusyDate => ({
            ...nonBusyDate,
            date: new Date(new Date(nonBusyDate.date).getTime() + 86400000).toDateString()
        }));

        const nonBusyTimes = [];

        shiftedNonBusyDates.forEach(nonBusyDate => {
            if (nonBusyDate.date === tileDate) {
                nonBusyTimes.push(...nonBusyDate.non_busy_times);
            }
        });

        return sortPreferences(nonBusyTimes);
    };

    const handleDateClick = (value) => {
        if (showPreferences) {
            setSelectedDate(value);
            const preferences = getPreferencesForDate(value);
            setSelectedPreferences(preferences);
        }
    };

    const highestPriority = (date) => {
        const preferences = getPreferencesForDate(date);
        if (preferences.length === 0) return '';
        const sortedPreferences = sortPreferences(preferences);
        return sortedPreferences[0].preference;
    };

    useEffect(() => {
        if (showPreferences) {
            const today = new Date();
            setSelectedDate(today);
            const todayPreferences = getPreferencesForDate(today);
            setSelectedPreferences(todayPreferences);
        }
    }, [showPreferences]); 

    const preferenceClass = (preference) => {
        switch (preference.toLowerCase()) {
            case 'high': return 'bg-high';
            case 'medium': return 'bg-medium';
            case 'low': return 'bg-low';
            default: return 'bg-default';
        }
    };

    return (
        <div className="flex justify-center items-start space-x-4 p-4">
            <div className={styles.calendarItem}>
                <Calendar
                    onChange={handleDateClick}
                    value={value}
                    minDate={new Date(new Date(item.start_date).getTime() + 86400000)}
                    maxDate={new Date(new Date(item.end_date).getTime() + 86400000)}
                    tileClassName={({ date, view }) => {
                        if (view === 'month') {
                            const colorSelect = highestPriority(date);
                            return colorSelect ? styles[colorSelect] : '';
                        }
                    }}
                />
                <div style={{ cursor: 'pointer' }} onClick={() => router.push(`/calendar/calendar_information/${item.id}`)}>
                    <div className={styles.itemContainer}>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemDescription}>{item.description}</p>
                    </div>
                </div>
            </div>
            {showPreferences && (
                <div className={styles.preferencesBox}>
                    <h3 className={styles.preferencesDate}>
                        {selectedDate ? selectedDate.toDateString() : 'No date selected'}
                    </h3>
                    <ul className={styles.preferencesList}>
                        {selectedPreferences.map((pref, index) => (
                            <li
                                key={index}
                                className={`px-3 py-1 inline-flex items-center text-sm rounded-full font-medium ${styles.preferenceItem} ${styles[preferenceClass(pref.preference)]} text-white mr-2 mb-2`}
                            >
                                {`${pref.time} - ${pref.preference}`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export async function fetchAndOrganizeCalendarPreferences(calendarId, accessToken) {
    try {
        // Fetch user calendars along with their preferences
        const response = await fetch('http://127.0.0.1:8000/calendars/user-calendars/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user calendars');
        }

        const { results: userCalendars } = await response.json();
        // Find the specific calendar by ID
        const calendar = userCalendars.find(calendar => calendar.calendar.toString() === calendarId);

        if (!calendar) {
            // If no matching calendar is found, return an empty object
            return {};
        }

        // Process the non_busy_dates from the found calendar
        const organizedPreferences = calendar.non_busy_dates.reduce((acc, { date, non_busy_times }) => {
            acc[date] = non_busy_times.map(({ time, preference }) => ({ time, preference }));
            return acc;
        }, {});

        return organizedPreferences;
    } catch (error) {
        console.error('Error organizing calendar preferences:', error);
        throw error;
    }
}

export async function updateCalendarPreferences(calendarId, preferencesObj, accessToken) {
    // Convert preferences object into the expected array format
    const preferencesArray = Object.entries(preferencesObj).map(([date, timePrefs]) => {
        return {
            date,
            non_busy_times: timePrefs.map(timePref => ({
                time: timePref.time,
                preference: timePref.preference
            }))
        };
    });

    console.log('Updating preferences with array:', preferencesArray);

    try {
        const response = await fetch(`http://127.0.0.1:8000/calendars/user-calendars/${calendarId}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ non_busy_dates: preferencesArray }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error updating preferences');
        }

        const data = await response.json();
        console.log('Updated preferences:', data);
        return true;
    } catch (error) {
        console.error('Failed to update calendar preferences:', error);
        return false;
    }
}

export async function getAllCalendarData(accessToken) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/calendars/all/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error updating preferences');
        }

        const responseData = await response.json();
        const { results } = responseData;

        return results;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



export default CalendarView;


