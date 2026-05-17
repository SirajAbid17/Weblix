import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ServerUrl } from '../../config/backendUrl'

export default function LiveWebsite() {
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    
    useEffect(() => {
        const HandleGetWebsite = async () => {
            try {
                const result = await axios.get(`${ServerUrl}/api/website/getwebsite/${id}`, {
                    withCredentials: true
                })
                setCode(result.data.lcode)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        
        if (id) {
            HandleGetWebsite()
        }
    }, [id])
    
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }
    
    return (
        <iframe 
            title='live Website' 
            srcDoc={code} 
            className="w-full min-h-screen border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
    )
}