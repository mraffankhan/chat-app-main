export const translateText = async (req, res) => {
  try {
    const { text, to = "en" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const url =
      "https://google-translate113.p.rapidapi.com/api/v1/translator/text";

    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "google-translate113.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "auto",
        to,
        text,
      }),
    };

    console.log("Sending translation request for:", text);
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Translation API error:", errorData);
      return res.status(response.status).json({
        error: "Translation service error",
        details: errorData,
      });
    }

    const data = await response.json();
    console.log("Translation response:", data);

    if (!data.trans) {
      return res.status(400).json({ error: "No translation returned" });
    }

    res.status(200).json({ translatedText: data.trans });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({
      error: "Translation failed",
      details: error.message,
    });
  }
};
