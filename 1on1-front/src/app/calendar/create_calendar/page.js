'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css'
import { useAuth } from '@/utils/authContext';
function CalendarForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { isAuthenticated, accessToken } = useAuth(); // Use the useAuth hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authToken = accessToken;
        const response = await fetch('http://127.0.0.1:8000/calendars/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`, 
            },
            body: JSON.stringify({ name, description, start_date: startDate, end_date: endDate }),
        });
        const data = await response.json();
        console.log(data);

        const newCalendarId = data.id;
        router.push(`/calendar/calendar_information?id=${newCalendarId}`);
    };

    return (
        <>
        <button className={styles.updateButton}><a href="main_calendar" className={styles.subLink}>Main Calendar Menu</a></button>
            
            <form className={styles.formContainer} onSubmit={handleSubmit}>
             <h1>Create Your Calendar!</h1>
                <input className={styles.formInput} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <textarea className={styles.formTextarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                <input className={styles.formInput} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input className={styles.formInput} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button className={styles.formButton} type="submit">
                    Create Calendar
                </button>
            </form>
        </>
    );
}

export default CalendarForm;