import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export async function getAllWorkers() {
    const q = query(collection(db, "users"), where("role", "==", "worker"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            ...data.worker
        };
    });
}
