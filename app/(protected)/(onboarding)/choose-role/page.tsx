'use client'
import Image from "next/image";
import { useRouter } from 'next/navigation'
import recruitor from "@/assets/recruitor.jpg";
import labour from "@/assets/labour.jpg";

const Roles = [
    {
        img : labour,
        title : "मुझे काम चाहिए/I need work"
    },
    {
        img : recruitor,
        title : "मुझे कर्मचारी चाहिए/I need workers"
    }
]

export default function ChooseRole(){
   const router = useRouter();
    return (
    <div className="min-h-screen flex items-center justify-center bg-lienar-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
            {/* Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Labour Hub</h1>
                    <p className="text-gray-500 text-sm">Choose your role to get started</p>
                </div>

                {/* Role Selection */}
                <div className="space-y-4 mb-8">
                    {Roles.map((role, idx) => (
                        <label key={idx} className="flex items-center p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition group">
                            <input type="radio" name="role" className="w-5 h-5 text-blue-500 cursor-pointer" />
                            <div className="ml-4 flex-1">
                                <Image src={role.img} width={80} height={80} alt={role.title} className="rounded-lg mb-2" />
                                <p className="text-gray-700 font-medium text-sm">{role.title}</p>
                            </div>
                        </label>
                    ))}
                </div>

                {/* Button */}
                <button onClick={() => router.push("/home")} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-2xl transition hover:shadow-lg">
                    Confirm
                </button>
            </div>

            <div id="recaptcha-container" className="mt-4"></div>
        </div>
    </div>

    );
}