
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  MessageCircle,
  Calendar,
  Star,
  Users,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const features = [
    {
      icon: <Search size={28} />,
      title: "Find Skills",
      description:
        "Search for people who can teach the skills you want to learn.",
    },
    {
      icon: <MessageCircle size={28} />,
      title: "Real-Time Chat",
      description:
        "Chat instantly with your learning partner before every session.",
    },
    {
      icon: <Calendar size={28} />,
      title: "Schedule Sessions",
      description:
        "Plan learning sessions at a time convenient for both users.",
    },
    {
      icon: <Star size={28} />,
      title: "Reviews & Ratings",
      description:
        "Build trust with genuine reviews after every completed session.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Learn New Skills
            <br />
            By Teaching Yours
          </h1>

          <p className="mt-6 text-lg text-blue-100 max-w-3xl mx-auto">
            SkillSwap connects people who want to exchange knowledge
            instead of paying money. Teach what you know and learn
            what you love.
          </p>

          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Get Started
            </Link>

            <Link
              to="/find-skills"
              className="flex items-center gap-2 border border-white px-8 py-3 rounded-xl hover:bg-white hover:text-blue-600 transition"
            >
              Explore Skills
              <ArrowRight size={20} />
            </Link>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center">
            Why Choose SkillSwap?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">

            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold mt-6">
                  {feature.title}
                </h3>

                <p className="text-gray-600 mt-3">
                  {feature.description}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

            <div>
              <Users className="mx-auto text-blue-600" size={36} />
              <h3 className="text-3xl font-bold mt-3">10K+</h3>
              <p className="text-gray-500">Users</p>
            </div>

            <div>
              <Search className="mx-auto text-blue-600" size={36} />
              <h3 className="text-3xl font-bold mt-3">500+</h3>
              <p className="text-gray-500">Skills</p>
            </div>

            <div>
              <Calendar className="mx-auto text-blue-600" size={36} />
              <h3 className="text-3xl font-bold mt-3">8K+</h3>
              <p className="text-gray-500">Sessions</p>
            </div>

            <div>
              <Star className="mx-auto text-blue-600" size={36} />
              <h3 className="text-3xl font-bold mt-3">4.9</h3>
              <p className="text-gray-500">Average Rating</p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold">
            Ready to Share Your Skills?
          </h2>

          <p className="mt-5 text-blue-100 text-lg">
            Join thousands of learners and teachers exchanging skills
            every day.
          </p>

          <Link
            to="/register"
            className="inline-block mt-8 bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Join SkillSwap Today
          </Link>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
