import { Award, Users, Globe, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function About() {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for perfection in every fragrance we create, using only the finest ingredients and masterful craftsmanship."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building connections through shared appreciation of luxury fragrances and creating lasting memories."
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "Committed to environmentally responsible practices while maintaining the highest quality standards."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Our love for fragrance drives everything we do, from sourcing to creation to customer experience."
    }
  ];

  const team = [
    {
      name: "Alexandra Chen",
      role: "Master Perfumer",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
      description: "20+ years of experience in luxury fragrance creation"
    },
    {
      name: "Marcus Rodriguez",
      role: "Creative Director", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Visionary behind our brand aesthetic and storytelling"
    },
    {
      name: "Sophia Laurent",
      role: "Head of Quality",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Ensures every product meets our exacting standards"
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
                Our Story
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Founded in 2020, Avancé represents the pinnacle of luxury fragrance craftsmanship. 
                We believe that scent is the most intimate form of memory, and every bottle we create 
                tells a unique story.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gold mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  To create extraordinary fragrances that capture the essence of luxury, 
                  sophistication, and personal expression. Each scent is meticulously crafted 
                  to evoke emotions, create memories, and enhance the wearer's confidence.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  We source the finest ingredients from around the world, working with 
                  master perfumers who have decades of experience in creating signature scents 
                  that stand the test of time.
                </p>
              </div>
              <div className="animate-slide-in-right">
                <img
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=400&fit=crop"
                  alt="Luxury perfume creation process"
                  className="rounded-xl shadow-2xl w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gold mb-6">
                Our Values
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card 
                  key={value.title} 
                  className="bg-background border-border hover:border-gold transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <value.icon className="h-12 w-12 text-gold mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gold mb-6">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                The passionate experts behind every Avancé creation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card 
                  key={member.name}
                  className="bg-secondary border-border hover:border-gold transition-all duration-300 animate-fade-in-up group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-gold mb-3 font-medium">
                      {member.role}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gold mb-6">
              Experience Avancé
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover our complete collection and find your signature scent
            </p>
            <Link href="/products">
              <Button className="bg-gold text-black hover:bg-gold/90 px-8 py-3 text-lg transform hover:scale-105 transition-all duration-200">
                Shop Now
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}