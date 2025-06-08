async function check() {
  const url = document.getElementById("url").value;
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      document.getElementById("result").textContent = JSON.stringify(data, null, 2);
    } catch (jsonErr) {
      document.getElementById("result").textContent = "❌ Invalid JSON Response:\n" + text;
    }
  } catch (err) {
    document.getElementById("result").textContent = "❌ Fetch Error:\n" + err.message;
  }
}
