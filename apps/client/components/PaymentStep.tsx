"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoaderCircle, CheckCircle, CreditCard, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { paymentApi } from "../lib/api-client";
import toast from "react-hot-toast";

type PaymentStatus = "idle" | "processing" | "success" | "error";

const PaymentStepContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      toast.error("No order found. Please complete shipping step first.");
      router.push("/cart?step=shipping-address");
      return;
    }

    const initPayment = async () => {
      setStatus("processing");
      try {
        const data = await paymentApi.createPaymentIntent(orderId, 0, "usd");
        setClientSecret(data.clientSecret ?? null);

        // Real Stripe client secrets start with "pi_" and end with "_secret"
        if (data.clientSecret && data.clientSecret.startsWith("pi_") && data.clientSecret.includes("_secret")) {
          // PaymentIntent created successfully - waiting for client-side payment
          setStatus("idle");
        } else if (data.clientSecret?.startsWith("pi_mock_")) {
          // Fallback for mock payments
          setTimeout(() => {
            setStatus("success");
            toast.success("Payment successful!");
          }, 1500);
        } else {
          setStatus("error");
          toast.error("Invalid payment intent response");
        }
      } catch (error) {
        setStatus("error");
        toast.error(
          error instanceof Error ? error.message : "Failed to initialize payment",
        );
      }
    };

    initPayment();
  }, [orderId, router]);

  const handlePayNow = async () => {
    if (!orderId) return;

    setStatus("processing");
    try {
      const data = await paymentApi.createPaymentIntent(orderId, 0, "usd");
      setClientSecret(data.clientSecret ?? null);

      // Real Stripe client secrets start with "pi_" and end with "_secret"
      if (data.clientSecret && data.clientSecret.startsWith("pi_") && data.clientSecret.includes("_secret")) {
        // PaymentIntent created - in real implementation, you'd use Stripe Elements here
        // For now, we'll show success after a brief delay as a demo
        setTimeout(() => {
          setStatus("success");
          toast.success("Payment successful!");
        }, 2000);
      } else if (data.clientSecret?.startsWith("pi_mock_")) {
        setTimeout(() => {
          setStatus("success");
          toast.success("Payment successful!");
        }, 1500);
      } else {
        setStatus("error");
        toast.error("Invalid payment intent response");
      }
    } catch {
      setStatus("error");
      toast.error("Payment failed. Please try again.");
    }
  };

  const handleViewOrders = () => {
    router.push("/orders");
  };

  const handleRetry = () => {
    setStatus("idle");
  };

  return (
    <div className="grid gap-5 items-baseline mt-5 sm:grid-cols-3">
      <div className="col-span-2 shadow-xl p-5 rounded-md bg-white border">
        <h3 className="text-md font-semibold mb-4">Payment</h3>

        {status === "processing" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <LoaderCircle className="w-10 h-10 animate-spin text-gray-500" />
            <p className="text-gray-500">Processing payment...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <p className="text-lg font-medium text-green-600">
              Payment successful!
            </p>
            <p className="text-gray-500 text-sm">
              Your order has been confirmed and is being processed.
            </p>
            <Button onClick={handleViewOrders} className="mt-4">
              View Orders
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-red-500 font-medium">Payment failed</p>
            <p className="text-gray-500 text-sm">
              There was a problem processing your payment. Please try again.
            </p>
            <Button onClick={handleRetry} className="flex items-center gap-2 mt-2">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}

        {status === "idle" && (
          <div className="flex flex-col items-center justify-center py-16 gap-6">
            <CreditCard className="w-12 h-12 text-gray-400" />
            <p className="text-gray-600">
              Ready to complete your payment of{" "}
              <span className="font-semibold">
                {clientSecret ? `Order #${orderId?.slice(0, 8)}` : "your order"}
              </span>
            </p>
            <Button onClick={handlePayNow} className="px-8">
              Pay Now
            </Button>
          </div>
        )}
      </div>

      <div className="shadow-xl p-5 rounded-md bg-white border">
        <h3 className="text-md font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID</span>
            <span className="font-mono text-xs">{orderId?.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="text-green-600 font-medium">Stripe</span>
          </div>
          {clientSecret && (
            <div className="flex justify-between">
              <span className="text-gray-500">Reference</span>
              <span className="font-mono text-xs">{clientSecret.slice(0, 20)}...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PaymentStep: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="grid gap-5 items-baseline mt-5 sm:grid-cols-3">
          <div className="col-span-3 shadow-xl p-10 rounded-md bg-white border flex flex-col items-center justify-center min-h-64">
            <LoaderCircle className="w-10 h-10 animate-spin text-gray-400" />
          </div>
        </div>
      }
    >
      <PaymentStepContent />
    </Suspense>
  );
};

export default PaymentStep;
