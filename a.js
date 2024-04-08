import React, { useEffect } from 'react'
import { useAsync } from '../hooks/useAsync'
import { getPost } from '../services/posts/'
import { useParams } from 'react-router-dom';

const Context = React.createContext()

export function usePost() {
    return useContext(Context)
}

export function PostProvider({ children }) {
    const { id } = useParams()
    const { loading, error, value: post} = useAsync(() => getPost(id), [id])

    return (
        <Context.Provider value={{}}
            value={{
                post: { id, ...post },
            }}
        >
            {loading ? (
                <h1>Loading</h1>
            ) : error ? (
                <h1>{error}</h1>
            ) : (
                children
            )}
        </Context.Provider>
    )
    
}