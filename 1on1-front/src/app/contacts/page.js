'use client';
import { useState, useEffect } from 'react';
import styles from './styles.module.css'; 
import { useRouter } from 'next/navigation';
import Head from 'next/head';

function ContactsPage() {
    const router = useRouter();
    const [contacts, setContacts] = useState([]);
    const [contactDetails, setContactDetails] = useState({ fname: '', lname: '', email: '', id: null });
    const [isEditing, setIsEditing] = useState(false);

    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyNzA2MjkyLCJpYXQiOjE3MTIyNzQyOTIsImp0aSI6IjJiNjE1M2I4NzMxZjQ1NmM5ZmZlMGY3ZWM4NDM5NTkxIiwidXNlcl9pZCI6MX0.SiEeIR1G0_DBeb23PIbeGAunNFkmw5qTW8t_MWQm6yM';

    useEffect(() => {
        async function fetchContacts() {
            const response = await fetch('http://127.0.0.1:8000/contacts/all/', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            if (!response.ok) {
                console.error("Failed to fetch contacts");
                return;
            }
            const data = await response.json();
            setContacts(data.results);
            console.log("contacts inside useeffect", contacts);
        }

        fetchContacts();
    }, []);

    
    const handleChange = (e, field) => {
        setContactDetails({ ...contactDetails, [field]: e.target.value });
    };

    async function addContact(contactDetails, authToken) {
        console.log("add contact", contactDetails, authToken)
        try {
            const response = await fetch(`http://127.0.0.1:8000/contacts/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(contactDetails),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to save contact");
            }
    
            return await response.json();
        } catch (error) {
            console.error("Failed to add contact", error);
            throw error;
        }
    }
    
    // Helper function to update an existing contact
    async function updateContact(contactId, contactDetails, authToken) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/contacts/view/${contactId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(contactDetails),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to update contact");
            }
    
            return await response.json();
        } catch (error) {
            console.error("Failed to update contact", error);
            throw error;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let result;
            if (isEditing) {
                result = await updateContact(contactDetails.id, contactDetails, authToken);
            } else {
                result = await addContact(contactDetails, authToken);
            }
            console.log(result);
            setContacts(isEditing ? contacts.map(contact => contact.id === contactDetails.id ? result : contact) : [...contacts, result]);
            setContactDetails({ fname: '', lname: '', email: '', id: null });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to process contact", error);
        }
    };
    

    const startEdit = (contact) => {
        setContactDetails(contact);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setContactDetails({ fname: '', lname: '', email: '', id: null });
        setIsEditing(false);
    };

    return (
        <>
            <Head>
                <title>Contacts</title>
            </Head>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Contact' : 'Add New Contact'}</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
                    <input
                        className="border p-2 rounded"
                        type="text"
                        placeholder="First Name"
                        value={contactDetails.fname}
                        onChange={(e) => handleChange(e, 'fname')}
                        required
                    />
                    <input
                        className="border p-2 rounded"
                        type="text"
                        placeholder="Last Name"
                        value={contactDetails.lname}
                        onChange={(e) => handleChange(e, 'lname')}
                        required
                    />
                    <input
                        className="border p-2 rounded"
                        type="email"
                        placeholder="Email"
                        value={contactDetails.email}
                        onChange={(e) => handleChange(e, 'email')}
                        required
                    />
                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">{isEditing ? 'Update Contact' : 'Add Contact'}</button>
                        {isEditing && <button type="button" onClick={cancelEdit} className="flex-1 bg-gray-300 p-2 rounded hover:bg-gray-400">Cancel</button>}
                    </div>
                </form>
                <div className="space-y-4">
                    {contacts.map(contact => (
                        <div key={contact.id} className="bg-white shadow p-4 rounded flex justify-between items-center">
                            <div>
                                <p>{contact.fname} {contact.lname}</p>
                                <p className="text-sm text-gray-600">{contact.email}</p>
                            </div>
                            <button onClick={() => startEdit(contact)} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded">Edit</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}


export default ContactsPage;
