export function speak(text: string) {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 0.9;

  const voices = window.speechSynthesis.getVoices();
  const preferedSpanishVoice = voices.find(
    (voice) =>
      voice.lang.includes("es") && voice.name.includes("Google español")
  );

  if (preferedSpanishVoice) {
    utterance.voice = preferedSpanishVoice;
  } else {
    const anySpanishVoice = voices.find((voice) => voice.lang.includes("es"));
    if (anySpanishVoice) {
      utterance.voice = anySpanishVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}
