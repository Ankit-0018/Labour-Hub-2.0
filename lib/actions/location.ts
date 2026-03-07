"use server"
import {adminDb} from "@/lib/firebase/firebase-admin"
export const clearLocation = async (userId: string) => {
    await adminDb.collection("users").doc(userId).update({
        location: null
    })
}