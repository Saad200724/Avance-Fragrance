import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      await apiRequest("POST", "/api/contact-messages", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "hello@avance.com",
      subContent: "We'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      subContent: "Mon-Fri, 9AM-6PM EST"
    },
    {
      icon: MapPin,
      title: "Address",
      content: "123 Luxury Avenue",
      subContent: "New York, NY 10001"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Monday - Friday",
      subContent: "9:00 AM - 6:00 PM EST"
    }
  ];

  return (
    <>
      <Navbar />
      
      <div className="pt-16 min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-gold mb-6">
                Get In Touch
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Have questions about our fragrances? Want to learn more about custom scents? 
                We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <Card 
                  key={info.title}
                  className="bg-secondary border-border hover:border-gold transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <info.icon className="h-12 w-12 text-gold mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {info.title}
                    </h3>
                    <p className="text-gray-300 font-medium mb-1">
                      {info.content}
                    </p>
                    <p className="text-sm text-gray-400">
                      {info.subContent}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="bg-background border-border animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="text-2xl font-playfair font-bold text-gold">
                    Send us a Message
                  </CardTitle>
                  <p className="text-gray-300">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-gray-300">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          {...form.register("firstName")}
                          className="bg-secondary border-border"
                          placeholder="Your first name"
                        />
                        {form.formState.errors.firstName && (
                          <p className="text-red-400 text-sm mt-1">
                            {form.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-gray-300">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          {...form.register("lastName")}
                          className="bg-secondary border-border"
                          placeholder="Your last name"
                        />
                        {form.formState.errors.lastName && (
                          <p className="text-red-400 text-sm mt-1">
                            {form.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-gray-300">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        className="bg-secondary border-border"
                        placeholder="your@email.com"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-gray-300">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        {...form.register("message")}
                        className="bg-secondary border-border min-h-32"
                        placeholder="Tell us how we can help you..."
                      />
                      {form.formState.errors.message && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.message.message}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full bg-gold text-black hover:bg-gold/90 transform hover:scale-105 transition-all duration-200"
                    >
                      {contactMutation.isPending ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Map & Location Info */}
              <div className="animate-slide-in-right">
                <Card className="bg-background border-border h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl font-playfair font-bold text-gold">
                      Visit Our Boutique
                    </CardTitle>
                    <p className="text-gray-300">
                      Experience our fragrances in person at our flagship location.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Mock Map */}
                      <div className="h-64 bg-secondary rounded-lg flex items-center justify-center border border-border">
                        <div className="text-center">
                          <MapPin className="h-16 w-16 text-gold mx-auto mb-4" />
                          <p className="text-gray-300">Interactive Map</p>
                          <p className="text-sm text-gray-400">123 Luxury Avenue, New York</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="border-t border-border pt-4">
                          <h4 className="text-lg font-semibold text-white mb-2">Store Hours</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Monday - Friday</span>
                              <span className="text-gray-400">10:00 AM - 8:00 PM</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Saturday</span>
                              <span className="text-gray-400">10:00 AM - 6:00 PM</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Sunday</span>
                              <span className="text-gray-400">12:00 PM - 5:00 PM</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t border-border pt-4">
                          <h4 className="text-lg font-semibold text-white mb-2">What to Expect</h4>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li>• Personal fragrance consultations</li>
                            <li>• Full collection testing</li>
                            <li>• Custom scent creation services</li>
                            <li>• Expert guidance from our perfumers</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gold mb-6">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-secondary border-border animate-fade-in-up">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    How long do your fragrances last?
                  </h3>
                  <p className="text-gray-300">
                    Our fragrances are designed for exceptional longevity, typically lasting 8-12 hours 
                    depending on skin type and application method.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary border-border animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Do you offer custom fragrances?
                  </h3>
                  <p className="text-gray-300">
                    Yes! We offer bespoke fragrance creation services. Contact us to schedule 
                    a consultation with one of our master perfumers.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary border-border animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    What is your return policy?
                  </h3>
                  <p className="text-gray-300">
                    We offer a 30-day satisfaction guarantee. If you're not completely satisfied 
                    with your purchase, contact us for a full refund or exchange.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}