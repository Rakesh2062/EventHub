"use client";

import { useState, useEffect } from "react";
import { QrCode, Loader2, KeyboardIcon, Camera } from "lucide-react";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function QRScannerModal({ isOpen, onClose }) {
  const [scannerReady, setScannerReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [activeTab, setActiveTab] = useState("camera");
  const [manualCode, setManualCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: checkInAttendee } = useConvexMutation(
    api.registrations.checkInAttendee
  );

  const handleCheckIn = async (qrCode) => {
    const code = qrCode?.trim();
    if (!code) {
      toast.error("Please enter a valid QR code");
      return;
    }
    try {
      const result = await checkInAttendee({ qrCode: code });
      if (result.success) {
        toast.success("✅ Check-in successful!");
        onClose();
      } else {
        toast.error(result.message || "Check-in failed");
      }
    } catch (error) {
      toast.error(error.message || "Invalid QR code");
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await handleCheckIn(manualCode);
    setIsSubmitting(false);
    setManualCode("");
  };

  // Initialize QR Scanner
  useEffect(() => {
    if (activeTab !== "camera" || !isOpen) return;

    let scanner = null;
    let mounted = true;

    const initScanner = async () => {
      try {
        // Check camera permissions first
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (permError) {
          setCameraError(
            "Camera permission denied. Please enable camera access or use manual entry."
          );
          return;
        }

        const { Html5QrcodeScanner } = await import("html5-qrcode");
        if (!mounted) return;

        scanner = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            videoConstraints: { facingMode: "environment" },
          },
          false
        );

        const onScanSuccess = (decodedText) => {
          if (scanner) scanner.clear().catch(console.error);
          handleCheckIn(decodedText);
        };

        const onScanError = (error) => {
          if (error && !error.includes("NotFoundException")) {
            console.debug("Scan error:", error);
          }
        };

        scanner.render(onScanSuccess, onScanError);
        setScannerReady(true);
        setCameraError(null);
      } catch (error) {
        console.error("Failed to initialize scanner:", error);
        setCameraError(`Failed to start camera: ${error.message}`);
      }
    };

    initScanner();

    return () => {
      mounted = false;
      if (scanner) scanner.clear().catch(console.error);
      setScannerReady(false);
    };
  }, [isOpen, activeTab]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setScannerReady(false);
      setCameraError(null);
      setManualCode("");
      setActiveTab("camera");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-500" />
            Check-In Attendee
          </DialogTitle>
          <DialogDescription>
            Scan the attendee&apos;s QR code or enter the ticket ID manually
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="camera" className="flex-1 gap-2">
              <Camera className="w-4 h-4" />
              Camera Scan
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex-1 gap-2">
              <KeyboardIcon className="w-4 h-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          {/* Camera Tab */}
          <TabsContent value="camera">
            {cameraError ? (
              <div className="space-y-3">
                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  {cameraError}
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveTab("manual")}
                >
                  Switch to Manual Entry
                </Button>
              </div>
            ) : (
              <>
                <div
                  id="qr-reader"
                  className="w-full rounded-lg overflow-hidden"
                  style={{ minHeight: "320px" }}
                />
                {!scannerReady && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Starting camera...
                    </span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground text-center mt-2">
                  {scannerReady
                    ? "Position the attendee's QR code within the frame"
                    : "Please allow camera access when prompted"}
                </p>
              </>
            )}
          </TabsContent>

          {/* Manual Entry Tab */}
          <TabsContent value="manual">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ticket / QR Code</label>
                <Input
                  placeholder="e.g. EVT-1234567890-ABC123XYZ"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  autoFocus
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the full QR code string shown on the attendee&apos;s
                  ticket
                </p>
              </div>
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={!manualCode.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <QrCode className="w-4 h-4" />
                )}
                Check In Attendee
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
