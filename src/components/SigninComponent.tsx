"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from 'zod'

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be atleast 6 characters').max(50, 'Password is too long')
})

type FormData = z.infer<typeof formSchema>

export function SigninComponent() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    })    

    const [errors, setErrors] = useState<Partial<FormData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = formSchema.safeParse(formData);
        if(!response.success){
            const formDataErrors: Partial<FormData> = {};
            response.error.errors.forEach((error) => {
                const name = error.path[0] as keyof FormData;
                formDataErrors[name] = error.message
            })
            setErrors(formDataErrors);
        } else {
            console.log("Submitted successfully", formData);
            setErrors({});
            router.push('/')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="h-fit w-full flex flex-col justify-center items-center flex-shrink-0 gap-5">
                <div>
                    <input
                        className="h-10 w-full outline-none focus:outline-zinc-500 rounded-md px-3 bg-zinc-800"
                        name='email'
                        value={formData.email}
                        placeholder='Email'
                        onChange={handleChange}
                    />
                    {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email}</p>}
                </div>
                <div>
                    <input 
                        className="h-10 w-full outline-none focus:outline-zinc-500 rounded-md px-3 bg-zinc-800"
                        name="password"
                        value={formData.password}
                        placeholder="Password"
                        onChange={handleChange}
                    />
                    {errors.password && <p className="text-xs text-red-600 font-medium">{errors.password}</p>}
                </div>
                <button className="bg-red-600 w-2/4 h-10 rounded-md text-lg font-bold">Sign in</button>
            </div>
        </form>
    )
}