export function formatRating(rating: number | null): string {
  return rating ? `${rating} of 5 dumplings` : "No rating"
}
