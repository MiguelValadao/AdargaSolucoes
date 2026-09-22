import { Api, waLink } from "../api";
import { useEffect, useState } from "react";

export default function WhatsAppFloat() {
  const [number, setNumber] = useState("5511999999999");

  useEffect(() => {
    Api.getSettings()
      .then((s) => setNumber(s.whatsapp))
      .catch(() => {});
  }, []);

  return (
    <a
      className="wa-float"
      href={waLink(number, "Olá, ADARGA Soluções! Gostaria de saber mais sobre os veículos disponíveis.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor">
        <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.7 6L4 29l8.2-1.7c1.2.7 2.5 1 3.8 1 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.1 0-2.2-.3-3.2-.8l-.2-.1-4.9 1 1-4.7-.2-.3c-.7-1.2-1.1-2.5-1.1-3.9 0-4.8 3.9-8.7 8.7-8.7s8.7 3.9 8.7 8.7-4 8.8-8.8 8.8zm4.8-6.5c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.6-.7 1.9-1.3.2-.7.2-1.2.1-1.3-.1-.2-.3-.2-.6-.4z" />
      </svg>
    </a>
  );
}