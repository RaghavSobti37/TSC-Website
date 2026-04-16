import Head from "next/head";
import { useState, useEffect } from "react";
import { Star, X, MessageSquare, CheckCircle, Quote } from "lucide-react";

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setTotalCount(data.totalCount || data.reviews.length);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      setSubmitMessage({ text: "Review content is required.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, title, content, rating }),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitMessage({
          text: "Review submitted successfully! It will appear once approved by the TSC team.",
          type: "success"
        });
        // Reset form
        const previousRating = rating;
        setName("");
        setTitle("");
        setContent("");
        setRating(5);
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitMessage({ text: "", type: "" });
          if (previousRating >= 3) {
            setShowRecommendation(true);
          }
        }, 1500);
      } else {
        setSubmitMessage({ text: data.error || "Failed to submit review.", type: "error" });
      }
    } catch (error) {
      setSubmitMessage({ text: "An error occurred. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-hidden no-scrollbar">
      <Head>
        <title>Reviews: The roots of Hindustani Classical Music | TSC</title>
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        `}</style>
      </Head>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pb-16 md:pb-24 overflow-y-auto h-[calc(100vh-80px)] no-scrollbar">
        {/* Header Section */}
        <div className="text-center mt-12 mb-20 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            TSC Academy
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto font-light">
            Discover what artists are saying about The roots of Hindustani Classical Music masterclass. Let their journey inspire yours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Stats and CTA */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-8">
              <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-2xl">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">The roots of Hindustani Classical Music</h2>
                  <p className="text-white/40 text-sm">Masterclass Feedback</p>
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/[0.05] mb-8">
                  <div className="text-6xl font-bold text-white mb-2">{averageRating}</div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-5 h-5 fill-purple-500 text-purple-500" />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-white/40 text-center">
                    out of {totalCount} total reviews
                  </p>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-white text-black hover:bg-gray-200 transition-colors rounded-full font-bold text-sm tracking-wide"
                >
                  <MessageSquare className="w-4 h-4" />
                  Write a Review
                </button>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-purple-500/[0.05] to-transparent rounded-2xl border border-purple-500/10">
                <CheckCircle className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-purple-300">Verified Experiences</h4>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    All reviews are from real students who have taken the masterclass and explored the depths of their artistry with TSC.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Reviews Grid */}
          <div className="lg:col-span-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                <p className="text-white/40 font-medium">Loading stories...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-3xl p-16 text-center">
                <Quote className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
                <p className="text-white/50 text-sm max-w-md mx-auto">
                  Be the first to share your experience with The roots of Hindustani Classical Music masterclass.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="group relative p-8 bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-500 rounded-3xl shadow-xl hover:shadow-purple-500/10 backdrop-blur-sm">
                    <Quote className="absolute top-8 right-8 w-16 h-16 text-white/[0.03] group-hover:text-purple-500/10 transition-colors duration-500" />

                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-purple-500 text-purple-500' : 'fill-white/10 text-white/10'}`}
                        />
                      ))}
                    </div>

                    <h3 className="text-xl font-bold mb-4 text-white/90">{review.title}</h3>
                    <p className="text-white/60 leading-relaxed font-light mb-8 relative z-10 text-[15px]">
                      "{review.content}"
                    </p>

                    <div className="flex items-center justify-between border-t border-white/[0.08] pt-6 mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center font-bold text-sm text-white/80">
                          {review.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white/80">{review.name}</h4>
                          <p className="text-xs text-white/40">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.05] rounded-full border border-white/[0.05]">
                        <CheckCircle className="w-3 h-3 text-purple-400" />
                        <span className="text-[11px] font-medium text-white/60 uppercase tracking-wider">Student</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-2">Share your experience</h2>
            <p className="text-white/50 text-sm mb-8">Your insights help other artists grow.</p>

            {submitMessage.text ? (
              <div className={`p-4 rounded-xl text-sm font-medium border mb-6 ${submitMessage.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                {submitMessage.text}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transform hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${rating >= star ? "fill-purple-500 text-purple-500" : "fill-white/10 text-white/10"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Name (Optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-4 py-3 text-white outline-none transition-colors"
                  placeholder="How should we call you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Review Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-4 py-3 text-white outline-none transition-colors"
                  placeholder="Summarize your experience"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Your Review</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 rounded-xl px-4 py-3 text-white outline-none transition-colors h-32 resize-none"
                  placeholder="What did you learn? How did the course impact your music?"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Course Recommendation Pop-up */}
      {showRecommendation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowRecommendation(false)}></div>
          <div className="relative w-full max-w-2xl bg-[#0F0F0F] border border-white/10 rounded-3xl shadow-2xl overflow-hidden shadow-purple-500/20">
            <button
              onClick={() => setShowRecommendation(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white/50 hover:text-white hover:bg-black/80 transition-colors backdrop-blur"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full aspect-video border-b border-white/10 relative">
              <img
                src="/assets/The roots of Hindustani Classical Music.png"
                alt="The roots of Hindustani Classical Music"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 inline-block px-3 py-1 rounded-full bg-purple-500/80 backdrop-blur text-white text-xs font-bold uppercase tracking-widest">
                Recommended
              </span>
            </div>
            <div className="p-8 sm:p-10 text-center space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Continue Your Journey
              </h3>
              <p className="text-white/60 font-light text-[15px] max-w-lg mx-auto leading-relaxed">
                Since you loved the masterclass, take your artistry to the next level. Explore the intricate roots of Hindustani Classical Music under expert mentorship.
              </p>
              <a
                href="https://tscacademy.in/course-classical-singing-comprehensive.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 bg-white text-black hover:bg-gray-200 transition-colors rounded-full font-bold shadow-lg shadow-white/10 mt-2"
                onClick={() => setShowRecommendation(false)}
              >
                Explore The Masterclass
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
