import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hobby Classes in Bengaluru - Tsala Quilting Studio",
  description: "An idealistic hub located in the heart of Bengaluru for all Quilting & Hobby enthusiasts. Join our stitching, bag making, and craft workshops.",
  keywords: ["Quilting", "Sewing", "Quilting Studio", "Bengaluru", "Tailoring", "Art & Craft Workshop"],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to Tsala Studio
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Hobby Classes in Bengaluru
          </p>
          <div className="mt-8">
            <span className="text-gray-400">[Hero Carousel Placeholder]</span>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Experience Handmade Happiness</h2>
          <div className="text-center py-10 bg-gray-100 rounded-lg">
            <p className="text-gray-500">[Experience Content Placeholder]</p>
          </div>
        </div>
      </section>

      {/* Services/Why Tsala Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Tsala?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded shadow text-center">Stitching & Tailoring</div>
            <div className="bg-white p-6 rounded shadow text-center">Bag Making</div>
            <div className="bg-white p-6 rounded shadow text-center">Knitting & Crochet</div>
            <div className="bg-white p-6 rounded shadow text-center">Arts & Crafts</div>
          </div>
        </div>
      </section>

      {/* Info/Testimonials Placeholder */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">[Information & Testimonials Placeholder]</p>
        </div>
      </section>
    </div>
  );
}
