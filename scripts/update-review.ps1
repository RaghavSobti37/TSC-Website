$file = "pages/masterclass-review01.tsx"
$content = Get-Content $file -Raw

# Add Write Review button after description
$content = $content -replace 
  '(Help us improve your learning journey[^<]*</p>)\s*</div>',
  "`$1
          <button
            onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
            className=""mt-4 inline-flex items-center justify-center rounded-xl border border-emerald-400/50 bg-emerald-400/15 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-400/25""
          >
            Write Review
          </button>
        </div>"

# Update review card structure - completion badge with name row, artist types below content
$oldCard = @'
                      <article key={review.id} className="rounded-xl border border-white/10 bg-black/30 p-3.5">
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {review.completion && (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-200">
                              {review.completion === 'saw-complete' ? '✓ Saw complete' : '⊘ Left in between'}
                            </span>
                          )}
                          {review.artistTypes &&
                            review.artistTypes.split(',').map((type, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-200"
                              >
                                {type.trim()}
                              </span>
                            ))}
                        </div>
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="line-clamp-1 text-sm font-semibold text-white/90">{review.name}</h4>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.floor(review.rating) ? "fill-emerald-400 text-emerald-400" : "fill-white/10 text-white/10"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mb-2 line-clamp-3 text-xs leading-relaxed text-white/65">{review.content}</p>
                        <div className="text-[11px] text-white/45">
                          {formatDate(review.date)}
                        </div>
                      </article>
'@

$newCard = @'
                      <article key={review.id} className="rounded-xl border border-white/10 bg-black/30 p-3.5">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <h4 className="line-clamp-1 text-sm font-semibold text-white/90">{review.name}</h4>
                            {review.completion && (
                              <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-200 whitespace-nowrap">
                                {review.completion === 'saw-complete' ? '✓' : '⊘'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.floor(review.rating) ? "fill-emerald-400 text-emerald-400" : "fill-white/10 text-white/10"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mb-2 line-clamp-3 text-xs leading-relaxed text-white/65">{review.content}</p>
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {review.artistTypes &&
                            review.artistTypes.split(',').map((type, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-200"
                              >
                                {type.trim()}
                              </span>
                            ))}
                        </div>
                        <div className="text-[11px] text-white/45">
                          {formatDate(review.date)}
                        </div>
                      </article>
'@

$content = $content -replace [regex]::Escape($oldCard), $newCard

# Add id to section
$content = $content -replace 'section className="lg:col-span-8">', 'section id="review-form" className="lg:col-span-8">'

Set-Content $file $content
Write-Host "File updated successfully"
