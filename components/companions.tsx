import { Companion } from "@prisma/client"
import Image from "next/image";

interface CompanionProps{
    data: (Companion & {
    _count: {
        messages: number;
    }
    })[];
}



export const Companions = ({
    data
}: CompanionProps) => {

    if (data.length === 0) {
        return (
            <div className="pt-10 flex flex-col items-center justify-center">
                <div className="relative w-60 h-60">
                    <Image
                        fill
                        alt="Empty"
                        src={"/empty.png"}
                    />

                </div>
                <p className="text-sm text-muted-foreground">
                    No Companions Found

                </p>
            </div>
        )
    }
    return (
        <div>
            companions
        </div>
    )

}