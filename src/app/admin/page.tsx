"use client"
import { Authorization } from "@/authorization"


const Admin = () => {
    return (
        <div className='mt-[500px]'>
            <div>
                Hello
            </div>
            <button
                onClick={async () => {
                    const result = await Authorization()
                    console.log("Result =>", result)
                }}
            >
                Click
            </button>
        </div>
    )
}

export default Admin