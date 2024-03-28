import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

const ComSci = () => {
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const response = await axios.get('http://localhost:3000/forums/65ed796cd86faed84a62706e/threads');
                setThreads(response.data.thread); // Set threads to the entire array
                console.log(response.data.thread);
            } catch (error) {
                console.error('Error fetching threads:', error);
            }
        };

        fetchThreads();
    }, []);

    return (
        <div>
            <h2>Threads</h2>
            <ul>
                {threads.map(thread => (
                    <li key={thread._id}>
                        <h3>{thread.title}</h3>
                        <p>Creator: {thread.username}</p>
                        <p>Description: {thread.content}</p>
                        <p>Creation Time: {new Date(thread.timestamp).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ComSci
