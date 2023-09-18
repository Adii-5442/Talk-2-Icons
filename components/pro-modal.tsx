"use client"

import { useProModal } from "@/hooks/use-pro-modal"
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { DialogHeader } from "./ui/dialog"

export const ProModal = () => {
    const proModal = useProModal()
    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-center">
                        Upgrade to Pro
                    </DialogTitle>

                </DialogHeader>
            </DialogContent>

        </Dialog>
    )
}