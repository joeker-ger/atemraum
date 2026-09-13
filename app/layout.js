import "./globals.css";

export const metadata = {
  title: "Atemraum v0.1",
  description: "Testprototyp einer christlichen, KI-gestuetzten Meditation"
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
