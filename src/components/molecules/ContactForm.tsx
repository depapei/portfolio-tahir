"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactSchemaType } from "@/lib/schemas/contact";
import { toast } from "@/hooks/use-toast";
import { WHATSAPP_NUMBER } from "@/components/organisms/HeroSection";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactSchemaType>({
    resolver: yupResolver(contactSchema) as never,
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = (data: ContactSchemaType) => {
    const lines = [
      `Hi, I'm ${data.name}.`,
      ...(data.email ? [`Email: ${data.email}`] : []),
      "",
      data.message,
    ];
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join("\n"),
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast({
      title: "Opening WhatsApp",
      description: "Your message is ready to send on WhatsApp.",
      duration: 5000,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-notion-soft">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <Input
          id="name"
          placeholder="Your name"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <Textarea
          id="message"
          placeholder="Tell me about your project..."
          rows={5}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 h-11 w-full rounded-full sm:w-auto sm:justify-start"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={16} />
            Send via WhatsApp
          </>
        )}
      </Button>
    </form>
  );
}
