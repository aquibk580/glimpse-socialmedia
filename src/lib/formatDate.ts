export default function formatDate(date: Date): string {
  const createdAtDate = new Date(date);
  const formattedDate = createdAtDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;
}
