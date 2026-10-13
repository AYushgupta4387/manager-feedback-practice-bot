export async function requestEmployeeReply(transcript) {
  const response = await fetch("/api/rehearse/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Rohit could not generate a reply.");
  }

  return data.reply;
}
