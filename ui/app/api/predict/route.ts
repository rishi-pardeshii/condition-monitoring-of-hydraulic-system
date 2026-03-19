export async function POST(req: any) {
    const body = await req.json()

    const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })

    const data = await res.json()

    return Response.json(data)
}