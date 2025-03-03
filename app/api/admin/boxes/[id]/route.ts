import { auth } from "@/auth"
import dbConnect from "@/libs/mongoose"
import { DigitalBox } from "@/libs/models/box"
import { NextResponse } from "next/server"
import { BoxStatus } from "@/libs/types/user"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { status } = body

    if (!status || !Object.values(BoxStatus).includes(status)) {
      return new NextResponse("Invalid status", { status: 400 })
    }

    await dbConnect()

    const box = await DigitalBox.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!box) {
      return new NextResponse("Box not found", { status: 404 })
    }

    return NextResponse.json(box)
  } catch (error) {
    console.error('Error updating box:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = params

    await dbConnect()

    const box = await DigitalBox.findById(id)

    if (!box) {
      return new NextResponse("Box not found", { status: 404 })
    }

    return NextResponse.json(box)
  } catch (error) {
    console.error('Error fetching box:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 