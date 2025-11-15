// src/app/api/dimensions/[slug]/route.ts

import { NextResponse } from 'next/server';
import {prisma} from "@/lib/prisma";

export async function POST(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug;
    const data = await request.json();

    try {
        let newRecord;
        // Use switch to decide which table to create the record in
        switch (slug) {
            case 'produccion':
                newRecord = await prisma.produccion.create({ data });
                break;
            case 'finanzas':
                newRecord = await prisma.finanzas.create({ data });
                break;
            case 'recursos-humanos':
                newRecord = await prisma.recursosHumanos.create({ data });
                break;
            case 'desarrollo-digital':
                newRecord = await prisma.desarrolloDigital.create({ data });
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid dimension' },
                    { status: 400 }
                );
        }
        return NextResponse.json(newRecord, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error creating record' },
            { status: 500 }
        );
    }
}