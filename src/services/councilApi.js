export async function askCouncil(token, question) {
  const response = await fetch("http://localhost:8080/api/council/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      // 🔑 THIS LINE IS NON-NEGOTIABLE
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error("Council request failed");
  }

  return response.json();
}
