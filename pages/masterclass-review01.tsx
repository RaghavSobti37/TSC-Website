import Head from "next/head";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Quote, Star } from "lucide-react";

type Review = {
  id: number;
  name: string;
  title: string;
  content: string;
  rating: number;
  date: string;
};

type Stats = {
  average: string;
  distribution: { stars: number; count: number }[];
};

type SubmitMessage = {
  text: string;
  type: "success" | "error" | "";
};

type Option = {
  value: string;
  label: string;
};

const overallExperienceOptions: Option[] = [
  { value: "5", label: "Excellent" },
  { value: "4", label: "Very Good" },
  { value: "3", label: "Good" },
  { value: "2", label: "Fair" },
  { value: "1", label: "Needs Work" },
];

const paceOptions: Option[] = [
  { value: "just-right", label: "Just right" },
  { value: "too-fast", label: "Too fast" },
  { value: "too-slow", label: "Too slow" },
];

const completionOptions: Option[] = [
  { value: "saw-complete", label: "Saw complete" },
  { value: "left-in-between", label: "Left in between" },
];

const courseInterestOptions: Option[] = [
  { value: "yes", label: "Yes" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "No" },
];

const artistTypeOptions: Option[] = [
  { value: "singer", label: "Singer" },
  { value: "songwriter", label: "Songwriter" },
  { value: "lyricist", label: "Lyricist" },
  { value: "music-composer", label: "Music Composer" },
  { value: "music-producer", label: "Music Producer" },
];

const EXPERIENCE_WEIGHTS = {
  overallExperience: 0.3,
  clarity: 0.2,
  depth: 0.2,
  usefulness: 0.2,
  completion: 0.05,
  pace: 0.03,
  courseInterest: 0.02,
};

const mapCompletionToScore = (value: string) => {
  if (value === "saw-complete") return 5;
  if (value === "left-in-between") return 2;
  return 3;
};

const mapPaceToScore = (value: string) => {
  if (value === "just-right") return 5;
  if (value === "too-fast") return 3;
  if (value === "too-slow") return 3;
  return 3;
};

const mapCourseInterestToScore = (value: string) => {
  if (value === "yes") return 5;
  if (value === "maybe") return 3;
  if (value === "no") return 1;
  return 3;
};

function RadioCards({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option[];
  value: string;
  onChange: (nextValue: string) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-white/90">{label}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-xl border px-3.5 py-3 text-sm transition-colors whitespace-nowrap ${
                isActive
                  ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                  : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/25"
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name={label}
                value={option.value}
                checked={isActive}
                onChange={() => onChange(option.value)}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function MasterclassReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage>({ text: "", type: "" });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registeredMobile, setRegisteredMobile] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [artistTypes, setArtistTypes] = useState<string[]>(["singer"]);
  const [overallExperience, setOverallExperience] = useState("5");
  const [completion, setCompletion] = useState("saw-complete");
  const [pace, setPace] = useState("just-right");
  const [clarity, setClarity] = useState("5");
  const [depth, setDepth] = useState("5");
  const [usefulness, setUsefulness] = useState("5");
  const [courseInterest, setCourseInterest] = useState("yes");
  const [improvementSuggestion, setImprovementSuggestion] = useState("");

  const weightedRating = useMemo(() => {
    const overallScore = parseInt(overallExperience, 10) || 5;
    const clarityScore = parseInt(clarity, 10) || 5;
    const depthScore = parseInt(depth, 10) || 5;
    const usefulnessScore = parseInt(usefulness, 10) || 5;
    const completionScore = mapCompletionToScore(completion);
    const paceScore = mapPaceToScore(pace);
    const courseInterestScore = mapCourseInterestToScore(courseInterest);

    const score =
      overallScore * EXPERIENCE_WEIGHTS.overallExperience +
      clarityScore * EXPERIENCE_WEIGHTS.clarity +
      depthScore * EXPERIENCE_WEIGHTS.depth +
      usefulnessScore * EXPERIENCE_WEIGHTS.usefulness +
      completionScore * EXPERIENCE_WEIGHTS.completion +
      paceScore * EXPERIENCE_WEIGHTS.pace +
      courseInterestScore * EXPERIENCE_WEIGHTS.courseInterest;

    return Number(score.toFixed(2));
  }, [overallExperience, clarity, depth, usefulness, completion, pace, courseInterest]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews || []);
          setTotalCount(data.totalCount || 0);
          setStats(data.stats || null);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const averageRating = stats?.average || "5.0";

  const toggleArtistType = (value: string) => {
    setArtistTypes((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
  };

  const buildReviewPayload = () => {
    const experienceLabel = overallExperienceOptions.find((item) => item.value === overallExperience)?.label || "Good";
    const completionLabel = completionOptions.find((item) => item.value === completion)?.label || completion;
    const artistTypeLabel = artistTypes
      .map((type) => artistTypeOptions.find((item) => item.value === type)?.label || type)
      .join(", ");
    const courseInterestLabel = courseInterestOptions.find((item) => item.value === courseInterest)?.label || courseInterest;

    const title = `${experienceLabel} | ${completionLabel}`;
    const content = [
      `First name: ${firstName.trim() || "N/A"}`,
      `Last name: ${lastName.trim() || "N/A"}`,
      `Registered mobile: ${registeredMobile.trim() || "N/A"}`,
      `Registered email: ${registeredEmail.trim() || "N/A"}`,
      `Artist type: ${artistTypeLabel || "N/A"}`,
      `Completion status: ${completion}`,
      `Pace: ${pace}`,
      `Concept clarity (1-5): ${clarity}`,
      `Depth of content (1-5): ${depth}`,
      `Practical usefulness (1-5): ${usefulness}`,
      `Interested in full course: ${courseInterestLabel}`,
      `Weighted artist experience rating (1-5): ${weightedRating}`,
      `What should improve: ${improvementSuggestion || "No specific comment"}`,
    ].join("\n");

    return {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      registeredMobile: registeredMobile.trim(),
      registeredEmail: registeredEmail.trim(),
      artistTypes,
      completion,
      pace,
      clarity,
      depth,
      usefulness,
      courseInterest,
      weightedRating,
      improvementSuggestion: improvementSuggestion.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`.trim() || "Anonymous",
      title,
      content,
      rating: weightedRating,
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !registeredMobile.trim() || !registeredEmail.trim() || !improvementSuggestion.trim()) {
      setSubmitMessage({
        text: "Please fill first name, last name, registered mobile, registered email, and improvement feedback.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ text: "", type: "" });

    try {
      const payload = buildReviewPayload();
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!result.success) {
        setSubmitMessage({ text: result.error || "Failed to submit review.", type: "error" });
        return;
      }

      setSubmitMessage({
        text: "Thanks for sharing. Your review has been submitted for approval.",
        type: "success",
      });

      setFirstName("");
      setLastName("");
      setRegisteredMobile("");
      setRegisteredEmail("");
      setArtistTypes(["singer"]);
      setOverallExperience("5");
      setCompletion("saw-complete");
      setPace("just-right");
      setClarity("5");
      setDepth("5");
      setUsefulness("5");
      setCourseInterest("yes");
      setImprovementSuggestion("");
    } catch (error) {
      setSubmitMessage({ text: "An error occurred while submitting. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      <Head>
        <title>Masterclass Review 01 | TSC Academy</title>
      </Head>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-8%] h-[34rem] w-[34rem] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] h-[34rem] w-[34rem] rounded-full bg-sky-500/20 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8">
        <div className="mb-10 space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/70">
            <Clock3 className="h-3.5 w-3.5" />
            Average time to complete: 6-8 minutes
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Recorded Masterclass Feedback
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/65 sm:text-base">
            Help us improve your learning journey for The Roots of Hindustani Classical Music. This form mixes quick MCQs with focused written inputs so we can identify what worked, what to improve, and how we can support your next step.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="space-y-5 lg:sticky lg:top-8">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-base font-semibold text-white/90">Community Snapshot</h2>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold text-white">{averageRating}</p>
                    <div className="mt-1 flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/60">{totalCount} total responses</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-base font-semibold text-white/90">Recent Reviews</h3>
                <div className="mt-4 max-h-[26rem] space-y-3 overflow-y-auto pr-1">
                  {isLoading ? (
                    <p className="text-sm text-white/50">Loading reviews...</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-sm text-white/50">No reviews published yet.</p>
                  ) : (
                    reviews.slice(0, 8).map((review) => (
                      <article key={review.id} className="rounded-xl border border-white/10 bg-black/30 p-3.5">
                        <div className="mb-1 flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < review.rating ? "fill-emerald-400 text-emerald-400" : "fill-white/10 text-white/10"}`}
                            />
                          ))}
                        </div>
                        <h4 className="line-clamp-1 text-sm font-semibold text-white/90">{review.title}</h4>
                        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-white/65">{review.content}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-white/45">
                          <span>{review.name}</span>
                          <span>{review.date}</span>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 sm:p-8">
              <div className="mb-7 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <p className="text-sm leading-relaxed text-emerald-100/85">
                  This feedback is used to improve course quality, pacing, support systems, and post-masterclass pathways for recorded learners.
                </p>
              </div>

              {submitMessage.text ? (
                <div
                  className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                    submitMessage.type === "success"
                      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                      : "border-red-400/40 bg-red-500/10 text-red-200"
                  }`}
                >
                  {submitMessage.text}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-7">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-white/90">First name</span>
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-emerald-400/60"
                    placeholder="First name"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-white/90">Last name</span>
                  <input
                    required
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-emerald-400/60"
                    placeholder="Last name"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-white/90">Registered mobile number (used for masterclass registration)</span>
                  <input
                    required
                    type="tel"
                    value={registeredMobile}
                    onChange={(e) => setRegisteredMobile(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-emerald-400/60"
                    placeholder="Registered mobile number"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-white/90">Registered email (used for masterclass registration)</span>
                  <input
                    required
                    type="email"
                    value={registeredEmail}
                    onChange={(e) => setRegisteredEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-emerald-400/60"
                    placeholder="Registered email"
                  />
                </label>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-semibold text-white/90">Which type of musician / artist are you? (Select all that apply)</legend>
                  <div className="flex flex-wrap gap-2.5">
                    {artistTypeOptions.map((option) => {
                      const active = artistTypes.includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className={`cursor-pointer whitespace-nowrap rounded-xl border px-3.5 py-3 text-sm transition-colors ${
                            active
                              ? "border-sky-400/60 bg-sky-400/10 text-sky-200"
                              : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/25"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={active}
                            onChange={() => toggleArtistType(option.value)}
                          />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <RadioCards
                  label="Overall experience"
                  options={overallExperienceOptions}
                  value={overallExperience}
                  onChange={setOverallExperience}
                />

                <RadioCards
                  label="How much of the recorded masterclass did you complete?"
                  options={completionOptions}
                  value={completion}
                  onChange={setCompletion}
                />

                <RadioCards
                  label="How was the pacing of the sessions?"
                  options={paceOptions}
                  value={pace}
                  onChange={setPace}
                />

                <RadioCards
                  label="Concept clarity"
                  options={overallExperienceOptions}
                  value={clarity}
                  onChange={setClarity}
                />

                <RadioCards
                  label="Depth of content"
                  options={overallExperienceOptions}
                  value={depth}
                  onChange={setDepth}
                />

                <RadioCards
                  label="Practical usefulness"
                  options={overallExperienceOptions}
                  value={usefulness}
                  onChange={setUsefulness}
                />

                <RadioCards
                  label="Are you interested in taking up the course after the masterclass?"
                  options={courseInterestOptions}
                  value={courseInterest}
                  onChange={setCourseInterest}
                />

                <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3">
                  <p className="text-sm font-semibold text-emerald-100">
                    Weighted Artist Experience Rating: {weightedRating} / 5
                  </p>
                  <p className="mt-1 text-xs text-emerald-100/80">
                    This score combines overall experience, completion, pace, clarity, depth, usefulness, and course interest with weighted importance.
                  </p>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-white/90">What should we improve in this recorded masterclass?</span>
                  <textarea
                    required
                    value={improvementSuggestion}
                    onChange={(e) => setImprovementSuggestion(e.target.value)}
                    className="h-28 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-emerald-400/60"
                    placeholder="Example: more voice break-downs, slower elaboration in module 3, chapter summaries"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : "Submit Masterclass Review"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
