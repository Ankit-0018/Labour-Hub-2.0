import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/firebase-admin";

export async function POST(req: Request) {
  try {
    const {token} = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const role = decodedToken.role;

    const body = await req.json();

    const userRef = adminDb.collection("users").doc(uid);

    if (role === "worker") {
      if (!body.skills || !Array.isArray(body.skills) ) {
        return NextResponse.json(
          { error: "Skills required" },
          { status: 400 }
        );
      }

      if (!body.dailyWage || body.dailyWage <= 0) {
        return NextResponse.json(
          { error: "Invalid wage" },
          { status: 400 }
        );
      }

      await userRef.update({
        worker: {
          skills: body.skills,
          dailyWage: body.dailyWage,
          status: "available",
          rating: 0
        },
        profileCompleted: true,
        updatedAt: new Date()
      });
    }

    if (role === "employer") {
      if (!body.companyName) {
        return NextResponse.json(
          { error: "Company name required" },
          { status: 400 }
        );
      }

      await userRef.update({
        employer: {
          companyName: body.companyName
        },
        profileCompleted: true,
        updatedAt: new Date()
      });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}