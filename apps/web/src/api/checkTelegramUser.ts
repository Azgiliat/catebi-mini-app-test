export async function checkTelegramUser(initData: string) {
  const response = await fetch("/api/auth/telegram", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ initData }),
  });

  if (!response.ok) {
    throw new Error("Failed to check Telegram user");
  }

  return (await response.json()) as Promise<{ token: string }>;
}
