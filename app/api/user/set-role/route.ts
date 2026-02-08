import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase/firebase-admin";

export async function POST(req: Request) {
  try {
    const { role, token } = await req.json();

    if (!token || !role) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // verify user from token
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    // prevent changing role again
    const userRef = adminDb.collection("users").doc(uid);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (docSnap.data()?.role) {
      return NextResponse.json(
        { error: "Role already set" },
        { status: 400 }
      );
    }

    const rolePayload =
      role === "worker"
        ? {
            role: "worker",
            worker: {
              skills: [],
              experience: 0,
              dailyWage: null,
              availability: true,
              rating: 0,
              totalJobs: 0,
              location: null,
              verified: false,
            },
          }
        : {
            role: "employer",
            employer: {
              companyName: "",
              businessType: "",
              rating: 0,
              totalJobsPosted: 0,
            },
          };

    // update firestore
    await userRef.update({
      ...rolePayload,
      roleSelectedAt: new Date(),
    });

    // 🔥 set custom claims (VERY IMPORTANT)
    await adminAuth.setCustomUserClaims(uid, { role });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
