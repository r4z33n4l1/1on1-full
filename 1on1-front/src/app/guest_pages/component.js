import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default async function getOwnerPreferences({ uuid }) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/notify/invited_user_landing/${uuid}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseData = await response.json();

        const preferences = {};

        if (responseData && responseData.invitation.status === "declined") return false;
        if (responseData && responseData.owner_preferences) {
            responseData.owner_preferences.forEach((item) => {
                const { date, non_busy_times } = item;
                preferences[date] = non_busy_times.map(({ time }) => time);
            });
        }

        return preferences;
    } catch (error) {
        throw new Error('Invalid link');
    }
}

export async function postGuestPreferences({ uuid, preferences }) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/notify/invited_user_landing/${uuid}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferences),
        });
        console.log(response);
        if (!response.ok) {
            throw new Error('Error updating preferences');
        }
        const data = await response.json();
        console.log(data);

        // router.push(`/calendar_information?id=${id}`);

        return preferences;
    } catch (error) {
        throw new Error('Invalid link');
    }
}

export async function decline({ uuid }) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/notify/invited_user_landing/${uuid}/decline/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
        if (!response.ok) {
            throw new Error('Error declining');
        }
        // router.push(`/calendar_information?id=${id}`);

        return preferences;
    } catch (error) {
        throw new Error('Invalid link');
    }
}