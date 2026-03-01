import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {

    const { role } = await req.json();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split("Bearer ")[1];

    if (!token || !role) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // validate role
    if (role !== "worker" && role !== "employer") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // verify firebase user
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

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

    // update firestore
    await userRef.update({
      role,
      roleSelectedAt: FieldValue.serverTimestamp(),
    });

    // set firebase custom claim
    await adminAuth.setCustomUserClaims(uid, { role });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}