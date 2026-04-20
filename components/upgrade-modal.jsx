"use client";

import { Crown, Sparkles, CheckCircle2, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePro } from "@/hooks/use-pro";
import { toast } from "sonner";
import { useState } from "react";

export default function UpgradeModal({ isOpen, onClose, trigger = "limit" }) {
  const { hasPro, upgradeToPro, downgradeFromPro } = usePro();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      await upgradeToPro();
      toast.success("🎉 You're now on Pro! Enjoy unlimited events & custom colors.");
      onClose();
    } catch (e) {
      toast.error(e.message || "Failed to upgrade");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDowngrade = async () => {
    setIsProcessing(true);
    try {
      await downgradeFromPro();
      toast.success("Switched back to Free plan.");
      onClose();
    } catch (e) {
      toast.error(e.message || "Failed to downgrade");
    } finally {
      setIsProcessing(false);
    }
  };

  const proFeatures = [
    "Unlimited event creation",
    "Custom event theme colors",
    "Priority support",
    "Advanced analytics",
    "Early access to new features",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-6 h-6 text-amber-500" />
            <DialogTitle className="text-2xl">
              {hasPro ? "You're on Pro! 🎉" : "Upgrade to Pro"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {hasPro
              ? "You have access to all Pro features."
              : trigger === "header"
              ? "Create Unlimited Events with Pro! "
              : trigger === "limit"
              ? "You've reached your free event limit. "
              : trigger === "color"
              ? "Custom theme colors are a Pro feature. "
              : ""}
            {!hasPro && "Unlock unlimited events and premium features!"}
          </DialogDescription>
        </DialogHeader>

        {/* Pro Status Banner */}
        <div
          className={`rounded-xl p-4 flex items-center gap-3 ${
            hasPro
              ? "bg-amber-500/10 border border-amber-500/30"
              : "bg-purple-500/10 border border-purple-500/30"
          }`}
        >
          {hasPro ? (
            <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
          ) : (
            <Zap className="w-5 h-5 text-purple-500 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">
            {hasPro
              ? "Active Pro subscription — all features unlocked"
              : "Free plan — 1 event limit, default theme only"}
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Pro Features
          </p>
          <ul className="space-y-2">
            {proFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <CheckCircle2
                  className={`w-4 h-4 flex-shrink-0 ${
                    hasPro ? "text-amber-500" : "text-muted-foreground/50"
                  }`}
                />
                <span className={hasPro ? "" : "text-muted-foreground"}>
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {hasPro ? (
            <>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button
                variant="outline"
                onClick={handleDowngrade}
                disabled={isProcessing}
                className="flex-1 text-muted-foreground hover:text-destructive"
              >
                {isProcessing ? "Processing..." : "Downgrade to Free"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Maybe Later
              </Button>
              <Button
                onClick={handleUpgrade}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 gap-2"
              >
                <Crown className="w-4 h-4" />
                {isProcessing ? "Activating..." : "Activate Pro (Demo)"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

